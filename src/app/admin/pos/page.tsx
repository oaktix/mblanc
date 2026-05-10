"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Phone, CreditCard, Banknote, Trash2, Download, CheckCircle2, Printer, Mail, Loader2 } from "lucide-react";
import POSPrintReceipt from "@/components/admin/POSPrintReceipt";
import AdminShell from "@/components/admin/AdminShell";

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [discount, setDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const handleCheckout = async () => {
    if (cart.length === 0 || !customerName) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total,
          discount: Number(discount) || 0,
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error("Failed to record sale");
      }

      const orderData = await response.json();
      
      setCompletedOrder({
        orderId: orderData.id,
        customerName,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.basePrice })),
        total,
        discount: Number(discount) || 0,
        paymentMethod
      });
      
      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDiscount(0);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    const email = prompt("Enter customer email address:");
    if (!email || !completedOrder) return;
    
    setSendingEmail(true);
    try {
      const res = await fetch("/api/admin/pos/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...completedOrder
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Digital receipt sent successfully to " + email);
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  if (completedOrder) {
    return (
      <AdminShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-charcoal p-12 rounded-2xl shadow-xl border border-gold/20">
          <div className="relative mb-8">
            <CheckCircle2 size={100} className="text-green-500" />
            <div className="absolute -inset-4 border border-green-500/20 rounded-full animate-ping pointer-events-none"></div>
          </div>
          <h2 className="text-3xl font-serif mb-2 text-charcoal dark:text-ivory">Sale Successful</h2>
          <p className="text-gray-500 mb-10 font-light">Transaction #{completedOrder.orderId.slice(-6).toUpperCase()} has been finalized.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
             <button 
               onClick={() => window.print()}
               className="w-full px-8 py-4 bg-burgundy text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
             >
               <Printer size={20} /> Print Receipt
             </button>

             <button 
               onClick={handleSendEmail}
               disabled={sendingEmail}
               className="w-full px-8 py-4 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
             >
               {sendingEmail ? (
                 <><Loader2 className="animate-spin" size={20} /> Sending...</>
               ) : (
                 <><Mail size={20} className="text-gold" /> Send via Mail</>
               )}
             </button>
             
             <button 
               onClick={() => setCompletedOrder(null)}
               className="w-full md:col-span-2 px-8 py-4 border border-gold text-gold font-bold rounded-xl hover:bg-gold hover:text-black transition-all mt-4"
             >
               New Transaction
             </button>
          </div>

          {/* Hidden Printable Receipt */}
          <POSPrintReceipt {...completedOrder} />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)]">
      
      {/* Product Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search catalog by name or SKU..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm focus:outline-none focus:border-gold transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white dark:bg-charcoal p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gold hover:shadow-md transition-all text-left flex flex-col group"
            >
              <div className="aspect-[3/4] bg-cream dark:bg-black rounded-lg mb-4 flex items-center justify-center font-serif text-gold/30">
                 Image
              </div>
              <h3 className="text-sm font-bold truncate group-hover:text-gold transition-colors">{product.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{product.category}</p>
              <p className="text-sm font-bold text-burgundy">₦{product.basePrice.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-900 bg-gray-50 dark:bg-black/20 flex items-center gap-3">
          <ShoppingCart size={20} className="text-gold" />
          <h2 className="text-lg font-serif">Current Sale</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
               Cart is empty
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex-1">
                   <h4 className="text-sm font-bold">{item.name}</h4>
                   <p className="text-xs text-gray-500">₦{item.basePrice.toLocaleString()} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-sm font-bold">₦{(item.basePrice * item.quantity).toLocaleString()}</span>
                   <button 
                     onClick={() => removeFromCart(item.id)}
                     className="p-1 text-gray-300 hover:text-burgundy opacity-0 group-hover:opacity-100 transition-all"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-50 dark:border-gray-900 bg-gray-50 dark:bg-black/20 space-y-6">
          <div className="space-y-4">
             <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Customer Name</label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                     type="text" 
                     placeholder="John Doe"
                     className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold"
                     value={customerName}
                     onChange={(e) => setCustomerName(e.target.value)}
                   />
                </div>
             </div>

             <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Email Address (Optional)</label>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                     type="email" 
                     placeholder="client@mblanc.com"
                     className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold"
                     value={customerEmail}
                     onChange={(e) => setCustomerEmail(e.target.value)}
                   />
                </div>
             </div>

             <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Phone Number (Optional)</label>
                <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                     type="tel" 
                     placeholder="+234..."
                     className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold"
                     value={customerPhone}
                     onChange={(e) => setCustomerPhone(e.target.value)}
                   />
                </div>
             </div>

             <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Manual Discount (NGN)</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₦</span>
                   <input 
                     type="number" 
                     placeholder="0.00"
                     className="w-full pl-8 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold"
                     value={discount || ""}
                     onChange={(e) => setDiscount(Number(e.target.value))}
                   />
                </div>
             </div>

             <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Payment Method</label>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setPaymentMethod("CASH")}
                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-all ${
                       paymentMethod === "CASH" ? "bg-gold border-gold text-black" : "border-gray-200 dark:border-gray-800 text-gray-400"
                     }`}
                   >
                     <Banknote size={14} />
                     CASH
                   </button>
                   <button 
                     onClick={() => setPaymentMethod("POS")}
                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-all ${
                       paymentMethod === "POS" ? "bg-gold border-gold text-black" : "border-gray-200 dark:border-gray-800 text-gray-400"
                     }`}
                   >
                     <CreditCard size={14} />
                     POS
                   </button>
                </div>
             </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
             <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
             </div>
             {discount > 0 && (
               <div className="flex justify-between items-center text-green-600 text-xs font-bold">
                  <span>Discount</span>
                  <span>- ₦{discount.toLocaleString()}</span>
               </div>
             )}
             <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-serif text-burgundy">₦{total.toLocaleString()}</span>
             </div>
          </div>

          <button 
            disabled={cart.length === 0 || !customerName || isProcessing}
            onClick={handleCheckout}
            className="w-full py-4 bg-burgundy text-white font-bold uppercase tracking-[0.2em] text-sm rounded-xl hover:bg-black transition-all disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>

    </div>
    </AdminShell>
  );
}
