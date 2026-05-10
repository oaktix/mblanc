"use client";

interface Props {
  orderId: string;
  customerName: string;
  items: any[];
  total: number;
  discount?: number;
  paymentMethod: string;
}

export default function POSPrintReceipt({ orderId, customerName, items, total, discount = 0, paymentMethod }: Props) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div id="pos-receipt-print" className="hidden print:block p-8 bg-white text-black font-serif text-sm">
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">MBlanc Bespoke</h1>
        <p className="text-[10px] uppercase tracking-wider">Where Tradition Meets Tailored Excellence</p>
      </div>

      <div className="mb-6 space-y-1">
        <div className="flex justify-between">
          <span>Order ID:</span>
          <span className="font-bold">#{orderId.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment:</span>
          <span className="font-bold">{paymentMethod}</span>
        </div>
      </div>

      <div className="border-y border-black py-4 mb-6">
        <div className="flex justify-between font-bold mb-2 text-[10px] uppercase tracking-widest">
          <span>Item</span>
          <span>Price</span>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-[12px]">
          <span>Subtotal:</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[12px] font-bold">
            <span>Discount:</span>
            <span>- ₦{discount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xl font-bold border-b-2 border-black pb-4 mb-6">
        <span>TOTAL</span>
        <span>₦{total.toLocaleString()}</span>
      </div>

      <div className="text-center text-[10px] space-y-1">
        <p>460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja</p>
        <p>Thank you for choosing MBlanc Bespoke.</p>
        <p>Your elegance is our masterpiece.</p>
      </div>
    </div>
  );
}
