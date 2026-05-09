import { Document, Page, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 60,
  },
});

const OrderReceipt = ({ 
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

async function testPdf() {
  try {
    console.log("Starting PDF generation...");
    const buffer = await renderToBuffer(
      React.createElement(OrderReceipt, {
        orderId: "123",
        customerName: "Test",
        total: 1000,
      })
    );
    console.log("PDF Buffer generated, length:", buffer.length);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
}

testPdf();
