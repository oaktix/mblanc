import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface POSReceiptEmailProps {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  discount?: number;
  paymentMethod: string;
}

export const POSReceiptEmail = ({
  orderId,
  customerName,
  items,
  total,
  discount = 0,
  paymentMethod,
}: POSReceiptEmailProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>Your receipt from MBlanc Bespoke</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>MBLANC BESPOKE</Heading>
            <Text style={subheading}>Luxury Atelier & Bespoke Tailoring</Text>
          </Section>
          
          <Hr style={hr} />
          
          <Section>
            <Text style={text}>Dear {customerName},</Text>
            <Text style={text}>
              Thank you for your patronage. Here is the digital receipt for your recent in-store purchase.
            </Text>
          </Section>

          <Section style={orderInfo}>
            <Text style={orderIdText}>Order #{orderId.slice(-6).toUpperCase()}</Text>
            <Text style={dateText}>{new Date().toLocaleDateString()} • {paymentMethod}</Text>
          </Section>

          <Section>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{ width: "70%" }}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemDetail}>Qty: {item.quantity} @ ₦{item.price.toLocaleString()}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={totalsSection}>
            <Row>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={totalValue}>₦{subtotal.toLocaleString()}</Text>
              </Column>
            </Row>
            {discount > 0 && (
              <Row>
                <Column>
                  <Text style={discountLabel}>Discount</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={discountValue}>- ₦{discount.toLocaleString()}</Text>
                </Column>
              </Row>
            )}
            <Row style={{ marginTop: "10px" }}>
              <Column>
                <Text style={finalTotalLabel}>TOTAL</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={finalTotalValue}>₦{total.toLocaleString()}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              460 Yusuf Abubakar Yusuf Street, Beside Purple Heart, Abuja, Nigeria
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} MBlanc Bespoke. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily: "'Playfair Display', serif, -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  backgroundColor: "#ffffff",
  border: "1px solid #eeeeee",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "4px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const subheading = {
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  color: "#c5a059",
  margin: "5px 0 0 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const text = {
  fontSize: "14px",
  color: "#484848",
  lineHeight: "24px",
};

const orderInfo = {
  backgroundColor: "#fcfaf6",
  padding: "15px",
  borderRadius: "8px",
  margin: "20px 0",
};

const orderIdText = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
  color: "#1a1a1a",
};

const dateText = {
  fontSize: "11px",
  color: "#888888",
  margin: "4px 0 0 0",
};

const itemRow = {
  padding: "10px 0",
};

const itemName = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const itemDetail = {
  fontSize: "12px",
  color: "#888888",
  margin: "2px 0 0 0",
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const totalsSection = {
  padding: "10px 0",
};

const totalLabel = {
  fontSize: "13px",
  color: "#888888",
  margin: "0",
};

const totalValue = {
  fontSize: "13px",
  fontWeight: "500",
  margin: "0",
};

const discountLabel = {
  fontSize: "13px",
  color: "#4caf50",
  fontWeight: "bold",
  margin: "0",
};

const discountValue = {
  fontSize: "13px",
  color: "#4caf50",
  fontWeight: "bold",
  margin: "0",
};

const finalTotalLabel = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};

const finalTotalValue = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#7e1d1d",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "40px",
};

const footerText = {
  fontSize: "11px",
  color: "#aaaaaa",
  margin: "5px 0",
};
