import * as React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  total: number;
  items: any[];
  shippingAddress: string;
  shippingCity: string;
}

export const OrderConfirmationEmail: React.FC<Readonly<OrderConfirmationEmailProps>> = ({
  orderId,
  customerName,
  total,
  items,
  shippingAddress,
  shippingCity,
}) => {
  const burgundy = "#800020";
  const gold = "#D4AF37";
  const cream = "#FDFCF8";

  return (
    <div style={{ 
      fontFamily: "'Playfair Display', serif", 
      backgroundColor: cream, 
      color: "#1a1a1a", 
      padding: "40px 20px",
      maxWidth: "600px",
      margin: "0 auto",
      border: `1px solid ${gold}`
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ 
          color: burgundy, 
          fontSize: "32px", 
          margin: 0, 
          letterSpacing: "4px", 
          textTransform: "uppercase" 
        }}>
          MBlanc Bespoke
        </h1>
        <p style={{ 
          color: gold, 
          fontSize: "12px", 
          margin: "10px 0 0 0", 
          letterSpacing: "2px", 
          textTransform: "uppercase" 
        }}>
          Where Tradition Meets Tailored Excellence
        </p>
      </div>

      <div style={{ borderTop: `1px solid ${gold}`, borderBottom: `1px solid ${gold}`, padding: "30px 0", marginBottom: "30px" }}>
        <h2 style={{ 
          color: burgundy, 
          fontSize: "20px", 
          textAlign: "center", 
          marginBottom: "20px",
          textTransform: "uppercase" 
        }}>
          Order Confirmation
        </h2>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Dear <strong>{customerName}</strong>,
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Your journey to sartorial excellence has begun. We are pleased to confirm that your order <strong>#{orderId.slice(-6).toUpperCase()}</strong> has been received and is now being meticulously prepared in our atelier.
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "14px", color: gold, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Order Summary</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${gold}33` }}>
              <th style={{ textAlign: "left", padding: "10px 0", fontSize: "12px", textTransform: "uppercase" }}>Garment</th>
              <th style={{ textAlign: "center", padding: "10px 0", fontSize: "12px", textTransform: "uppercase" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "10px 0", fontSize: "12px", textTransform: "uppercase" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${gold}11` }}>
                <td style={{ padding: "15px 0", fontSize: "14px" }}>
                  <strong>{item.name}</strong>
                  {item.size && <div style={{ fontSize: "11px", color: "#666" }}>Size: {item.size}</div>}
                  {item.color && <div style={{ fontSize: "11px", color: "#666" }}>Color: {item.color}</div>}
                </td>
                <td style={{ textAlign: "center", padding: "15px 0", fontSize: "14px" }}>{item.quantity}</td>
                <td style={{ textAlign: "right", padding: "15px 0", fontSize: "14px" }}>₦{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ padding: "20px 0 10px 0", textAlign: "right", fontSize: "12px", textTransform: "uppercase", color: gold }}>Total Amount</td>
              <td style={{ padding: "20px 0 10px 0", textAlign: "right", fontSize: "18px", fontWeight: "bold", color: burgundy }}>₦{total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ background: "#f5f2eb", padding: "20px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "12px", color: gold, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>Shipping To</h3>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
          {customerName}<br />
          {shippingAddress}<br />
          {shippingCity}, Nigeria
        </p>
      </div>

      <div style={{ textAlign: "center", borderTop: `1px solid ${gold}`, paddingTop: "30px" }}>
        <p style={{ fontSize: "14px", fontStyle: "italic", marginBottom: "20px" }}>
          "Your elegance is our masterpiece."
        </p>
        <p style={{ fontSize: "11px", color: "#999", lineHeight: "1.6" }}>
          460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja, Nigeria<br />
          +234 904 757 6899 | hello@mblancfits.com
        </p>
      </div>
    </div>
  );
};
