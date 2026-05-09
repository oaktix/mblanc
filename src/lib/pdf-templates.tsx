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
  total 
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>Order Receipt</Text>
      <Text>Order ID: {orderId}</Text>
      <Text>Customer: {customerName}</Text>
      <Text>Total: {total}</Text>
    </Page>
  </Document>
);
