import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { OrderReceipt } from "./pdf-templates";

export async function generateOrderReceiptBuffer(orderData: any) {
  try {
    const buffer = await renderToBuffer(
      React.createElement(OrderReceipt, {
        orderId: orderData.id,
        customerName: orderData.customerName,
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod || "Paystack",
        date: new Date().toLocaleDateString("en-NG", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      }),
      shippingAddress: orderData.shippingAddress
    }) as React.ReactElement<any>
  );
    return buffer;
  } catch (error) {
    console.error("Error generating PDF buffer:", error);
    throw error;
  }
}
