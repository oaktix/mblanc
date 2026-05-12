import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { OrderReceipt } from "./pdf-templates";

export async function generateOrderReceiptBuffer(orderData: any) {
  try {
    console.log(">>> [PDF SERVER] Generating buffer for:", orderData.id);
    console.log(">>> [PDF SERVER] Data types:", {
      id: typeof orderData.id,
      customerName: typeof orderData.customerName,
      total: typeof orderData.total,
      items: Array.isArray(orderData.items) ? `Array(${orderData.items.length})` : typeof orderData.items
    });

    const buffer = await renderToBuffer(
      <OrderReceipt
        orderId={String(orderData.id)}
        customerName={String(orderData.customerName)}
        items={orderData.items}
        total={Number(orderData.total)}
        paymentMethod={String(orderData.paymentMethod || "Paystack")}
        date={new Date().toLocaleDateString("en-NG", { 
          day: "numeric", 
          month: "long", 
          year: "numeric" 
        })}
        shippingAddress={String(orderData.shippingAddress)}
      />
    );
    return buffer;
  } catch (error) {
    console.error("Error generating PDF buffer:", error);
    throw error;
  }
}
