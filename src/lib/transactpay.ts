import crypto from "crypto";

const VERIFY_URL = "https://payment-api-service.transactpay.ai/payment/order/verify";

/** Build an RSA public key (Node KeyObject) from TransactPay's base64 XML encryption key. */
function buildPublicKey(base64Xml: string) {
  const decoded = Buffer.from(base64Xml, "base64").toString("utf-8");
  // Strip the leading size prefix, e.g. "4096!<RSAKeyValue>..."
  const xml = decoded.includes("!") ? decoded.slice(decoded.indexOf("!") + 1) : decoded;
  const modulus = xml.match(/<Modulus>([\s\S]*?)<\/Modulus>/)?.[1]?.trim();
  const exponent = xml.match(/<Exponent>([\s\S]*?)<\/Exponent>/)?.[1]?.trim();
  if (!modulus || !exponent) throw new Error("TransactPay encryption key missing Modulus/Exponent");
  const n = Buffer.from(modulus, "base64").toString("base64url");
  const e = Buffer.from(exponent, "base64").toString("base64url");
  return crypto.createPublicKey({ key: { kty: "RSA", n, e }, format: "jwk" });
}

/** RSA PKCS1 v1.5 encrypt a string, return base64. */
export function encryptTransactPay(plaintext: string, base64Xml: string): string {
  const key = buildPublicKey(base64Xml);
  const encrypted = crypto.publicEncrypt(
    { key, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(plaintext, "utf-8")
  );
  return encrypted.toString("base64");
}

export interface TransactPayVerifyResult {
  ok: boolean;        // true if the HTTP call succeeded and returned parseable JSON
  successful: boolean; // true if TransactPay reports the payment as successful
  raw: any;
}

/** Call TransactPay Verify Order to authoritatively confirm a payment. */
export async function verifyTransactPayOrder(reference: string): Promise<TransactPayVerifyResult> {
  const apiKey = process.env.NEXT_PUBLIC_TRANSACTPAY_API_KEY;
  const encKey = process.env.NEXT_PUBLIC_TRANSACTPAY_ENCRYPTION_KEY;
  if (!apiKey || !encKey) {
    console.warn(">>> [TRANSACTPAY] Missing API/encryption key env vars; cannot verify.");
    return { ok: false, successful: false, raw: null };
  }
  try {
    const data = encryptTransactPay(JSON.stringify({ reference }), encKey);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": apiKey },
      body: JSON.stringify({ data }),
    });
    const raw = await res.json().catch(() => null);
    const successful = isTransactPaySuccess(raw);
    return { ok: res.ok && raw != null, successful, raw };
  } catch (err) {
    console.error(">>> [TRANSACTPAY] Verify call failed:", err instanceof Error ? err.message : err);
    return { ok: false, successful: false, raw: null };
  }
}

/** Deeply inspect a TransactPay response/webhook payload for a success signal. */
export function isTransactPaySuccess(payload: any): boolean {
  if (!payload || typeof payload !== "object") return false;
  const candidates: string[] = [];
  const collect = (obj: any, depth: number) => {
    if (!obj || typeof obj !== "object" || depth > 4) return;
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase();
      if (typeof v === "string" || typeof v === "number") {
        if (key === "status" || key === "statusid" || key === "statuscode" ||
            key === "responsecode" || key === "paymentresponsecode") {
          candidates.push(String(v).toLowerCase());
        }
      } else if (typeof v === "object") {
        collect(v, depth + 1);
      }
    }
  };
  collect(payload, 0);
  return candidates.some((c) =>
    c === "successful" || c === "success" || c === "5" || c === "00"
  );
}
