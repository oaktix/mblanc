import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 60,
  },
});

export const OrderReceipt = ({ 
  orderId, 
  customerName, 
  total,
  items = [],
  shippingAddress = ""
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Order Receipt</Text>
      <Text style={{ fontSize: 14, marginBottom: 10 }}>Order ID: {String(orderId)}</Text>
      <Text style={{ fontSize: 14, marginBottom: 10 }}>Customer: {String(customerName)}</Text>
      <Text style={{ fontSize: 14, marginBottom: 10 }}>Total: ₦{Number(total).toLocaleString()}</Text>
      <Text style={{ fontSize: 14, marginTop: 20 }}>Shipping Address:</Text>
      <Text style={{ fontSize: 12 }}>{String(shippingAddress)}</Text>
    </Page>
  </Document>
);
