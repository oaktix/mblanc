import { generateOrderReceiptBuffer } from "../src/lib/pdf-server";

async function testPDF() {
  try {
    const dummyOrder = {
      id: "cm1234567890abcdef",
      customerName: "Test User",
      items: [
        { name: "Test Suit", quantity: 1, price: 1000, size: "L", color: "Navy" }
      ],
      total: 1000,
      paymentMethod: "Paystack",
      shippingAddress: "123 Test St, Lagos"
    };

    console.log("Generating PDF...");
    const buffer = await generateOrderReceiptBuffer(dummyOrder);
    console.log("PDF generated successfully, size:", buffer.length);
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
}

testPDF();
