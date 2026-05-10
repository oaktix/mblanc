"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Registered fonts for luxury look
Font.register({
  family: "Playfair Display",
  src: "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D4AF37",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Playfair Display",
    color: "#722F37",
    textTransform: "uppercase",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#D4AF37",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#AAA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D4AF37",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#722F37",
  },
});

interface ReceiptProps {
  orderId: string;
  customerName: string;
  items: any[];
  total: number;
  discount?: number;
  paymentMethod: string;
}

export const POSReceipt = ({ orderId, customerName, items, total, discount = 0, paymentMethod }: ReceiptProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MBlanc Bespoke</Text>
        <Text style={styles.subtitle}>Where Tradition Meets Tailored Excellence</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.row}>
          <Text>Order ID:</Text>
          <Text style={styles.bold}>#{orderId.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text>Date:</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text>Customer:</Text>
          <Text>{customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text>Payment Method:</Text>
          <Text style={styles.bold}>{paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {items.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text>{item.name} x {item.quantity}</Text>
            <Text>₦{(item.price * item.quantity).toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F0F0F0" }}>
        <View style={styles.row}>
          <Text>Subtotal:</Text>
          <Text>₦{subtotal.toLocaleString()}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.row}>
            <Text style={{ color: "#4caf50", fontWeight: "bold" }}>Discount:</Text>
            <Text style={{ color: "#4caf50", fontWeight: "bold" }}>- ₦{discount.toLocaleString()}</Text>
          </View>
        )}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>GRAND TOTAL</Text>
        <Text style={styles.totalText}>₦{total.toLocaleString()}</Text>
      </View>

      <View style={styles.footer}>
        <Text>460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja, Nigeria</Text>
        <Text>Thank you for choosing MBlanc Bespoke. Your elegance is our masterpiece.</Text>
      </View>
    </Page>
  </Document>
  );
};
