import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import React from "react";
import path from "path";

// Register Luxury Fonts
Font.register({
  family: "Playfair Display",
  src: "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: "#FDFCF8", // Cream background for premium feel
    fontFamily: "Helvetica",
    color: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#D4AF37",
    paddingBottom: 20,
  },
  brandInfo: {
    flexDirection: "column",
  },
  title: {
    fontSize: 28,
    fontFamily: "Playfair Display",
    color: "#800020", // Burgundy
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 8,
    color: "#D4AF37", // Gold
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  receiptLabel: {
    fontSize: 20,
    fontFamily: "Playfair Display",
    color: "#D4AF37",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#D4AF37",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D4AF37",
    paddingBottom: 5,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 10,
  },
  label: {
    color: "#888",
    textTransform: "uppercase",
    fontSize: 8,
  },
  value: {
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 8,
    marginBottom: 15,
    fontSize: 9,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
    marginBottom: 10,
    fontSize: 10,
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  
  summaryContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#D4AF37",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#800020",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#800020",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#D4AF37",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: "#999",
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    top: 300,
    left: 100,
    fontSize: 80,
    fontFamily: "Playfair Display",
    color: "#F0F0F0",
    transform: "rotate(-45deg)",
    zIndex: -1,
  }
});

interface OrderReceiptProps {
  orderId: string;
  customerName: string;
  items: any[];
  total: number;
  paymentMethod: string;
  date: string;
  shippingAddress: string;
}

export const OrderReceipt = ({ 
  orderId, 
  customerName, 
  items, 
  total, 
  paymentMethod,
  date,
  shippingAddress 
}: OrderReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>MBLANC</Text>

      <View style={styles.header}>
        <View style={styles.brandInfo}>
          {/* Attempt to load logo, fallback to text */}
          <Image 
            src={path.join(process.cwd(), "public", "header-logo.png")} 
            style={{ width: 120, marginBottom: 10 }} 
          />
          <Text style={styles.tagline}>Where Tradition Meets Tailored Excellence</Text>
        </View>
        <Text style={styles.receiptLabel}>Receipt</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client & Order Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Order Number</Text>
          <Text style={styles.value}>#{orderId.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date of Issue</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Client Name</Text>
          <Text style={styles.value}>{customerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Payment Status</Text>
          <Text style={[styles.value, { color: "#2E7D32" }]}>SUCCESSFUL</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Shipping Address</Text>
          <Text style={[styles.value, { maxWidth: 200, textAlign: 'right' }]}>{shippingAddress}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sartorial Selection</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit Price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              {item.size && <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>Size: {item.size}</Text>}
              {item.color && <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>Color: {item.color}</Text>}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>₦{item.price.toLocaleString()}</Text>
            <Text style={styles.colTotal}>₦{(item.price * item.quantity).toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
        </View>
        <Text style={{ fontSize: 8, color: "#888", marginTop: 10, fontStyle: "italic" }}>
          Paid via {paymentMethod}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontWeight: "bold", marginBottom: 5 }]}>
          MBLANC BESPOKE ATELIER
        </Text>
        <Text style={styles.footerText}>
          460 Yusuf Abubakar Yusuf Street, Beside Purple Heart, Abuja, Nigeria
        </Text>
        <Text style={styles.footerText}>
          +234 904 757 6899 | hello@mblancfits.com | www.mblancfits.com
        </Text>
        <Text style={[styles.footerText, { marginTop: 15, fontStyle: "italic" }]}>
          "Your elegance is our masterpiece. Thank you for your patronage."
        </Text>
      </View>
    </Page>
  </Document>
);
