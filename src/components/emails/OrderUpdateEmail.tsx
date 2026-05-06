import * as React from "react";

interface OrderUpdateEmailProps {
  orderId: string;
  customerName: string;
  status: string;
}

export const OrderUpdateEmail: React.FC<Readonly<OrderUpdateEmailProps>> = ({
  orderId,
  customerName,
  status,
}) => (
  <div style={{ fontFamily: "serif", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #D4AF37" }}>
    <h1 style={{ color: "#722F37", textAlign: "center", textTransform: "uppercase", letterSpacing: "2px" }}>MBlanc Bespoke</h1>
    <div style={{ borderTop: "2px solid #D4AF37", borderBottom: "2px solid #D4AF37", padding: "20px 0", margin: "20px 0" }}>
      <p>Dear <strong>{customerName}</strong>,</p>
      <p>Your bespoke order <strong>#{orderId.slice(-6).toUpperCase()}</strong> has moved to a new stage in our atelier.</p>
      <div style={{ background: "#f9f9f9", padding: "15px", textAlign: "center", margin: "20px 0" }}>
        <p style={{ margin: 0, textTransform: "uppercase", fontSize: "12px", color: "#888" }}>Current Status</p>
        <p style={{ margin: "5px 0 0 0", fontSize: "20px", color: "#D4AF37", fontWeight: "bold" }}>{status}</p>
      </div>
      <p>Our master tailors are working diligently to ensure your garment meets the highest standards of sartorial excellence.</p>
    </div>
    <p style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>
      460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja, Nigeria<br />
      Where Tradition Meets Tailored Excellence
    </p>
  </div>
);
