import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const ORDER_ID = "cmoyke9u40001vwismqk50r33";

const payload = {
  event: "charge.success",
  data: {
    id: 123456,
    domain: "test",
    status: "success",
    reference: ORDER_ID,
    amount: 18000000, // 180,000 in kobo
    message: null,
    gateway_response: "Successful",
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    channel: "card",
    currency: "NGN",
    ip_address: "127.0.0.1",
    customer: {
      id: 123456,
      first_name: "Gahdej",
      last_name: "The Prince",
      email: "gahdejjtheprince@gmail.com",
      customer_code: "CUS_123456",
      phone: "08012345678",
      metadata: null,
      risk_action: "default",
    },
  },
};

const body = JSON.stringify(payload);
const signature = crypto
  .createHmac("sha512", PAYSTACK_SECRET_KEY)
  .update(body)
  .digest("hex");

async function testWebhook() {
  console.log(">>> Sending Mock Webhook to localhost:3000...");
  try {
    const res = await fetch("http://localhost:3000/api/webhooks/paystack", {
      method: "POST",
      headers: {
        "x-paystack-signature": signature,
        "Content-Type": "application/json",
      },
      body: body,
    });
    
    const data = await res.json();
    console.log(">>> Status:", res.status);
    console.log(">>> Response:", data);
  } catch (err: any) {
    console.error(">>> Error:", err.message);
  }
}

testWebhook();
