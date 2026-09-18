import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store';
import { formatPrice } from '../components/ui';

const STEPS = ['Contact', 'Address', 'Shipping', 'Payment', 'Confirmation'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 font-sans text-xs font-medium transition-all duration-400 ${
            i < current ? 'bg-gold text-ivory' :
            i === current ? 'bg-charcoal text-ivory' :
            'border border-charcoal/20 text-charcoal/30'
          }`}>
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 md:w-20 h-px mx-1 transition-all duration-600 ${i < current ? 'bg-gold' : 'bg-charcoal/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '', phone: '',
    name: '', address: '', city: '', state: '', pincode: '',
    shippingMethod: 'standard',
    paymentMethod: 'online',
  });
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const set = (key, val) => setFormData((f) => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (step < STEPS.length - 2) {
      setStep((s) => s + 1);
    } else {
      // Simulate order placement
      setProcessing(true);
      setTimeout(() => {
        const id = 'GKN' + Math.random().toString(36).slice(2, 8).toUpperCase();
        setOrderId(id);
        setStep(4);
        setProcessing(false);
        clearCart();
      }, 1800);
    }
  };

  const inputClass = 'input-premium mb-4';

  const stepContent = [
    // Step 0: Contact
    <div key="contact">
      <h2 className="font-serif text-2xl font-light text-charcoal mb-7">Contact</h2>
      <input placeholder="Full name" value={formData.name} onChange={e => set('name', e.target.value)} className={inputClass} />
      <input type="email" placeholder="Email address" value={formData.email} onChange={e => set('email', e.target.value)} className={inputClass} />
      <input type="tel" placeholder="Phone number" value={formData.phone} onChange={e => set('phone', e.target.value)} className={inputClass} />
    </div>,

    // Step 1: Address
    <div key="address">
      <h2 className="font-serif text-2xl font-light text-charcoal mb-7">Delivery Address</h2>
      <input placeholder="Street address" value={formData.address} onChange={e => set('address', e.target.value)} className={inputClass} />
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="City" value={formData.city} onChange={e => set('city', e.target.value)} className={inputClass} />
        <input placeholder="PIN code" value={formData.pincode} onChange={e => set('pincode', e.target.value)} className={inputClass} />
      </div>
      <input placeholder="State" value={formData.state} onChange={e => set('state', e.target.value)} className={inputClass} />
    </div>,

    // Step 2: Shipping
    <div key="shipping">
      <h2 className="font-serif text-2xl font-light text-charcoal mb-7">Shipping Method</h2>
      {[
        { value: 'standard', label: 'Standard Delivery', desc: '2–4 business days', price: shipping === 0 ? 'Free' : `₹${shipping}` },
        { value: 'express', label: 'Express Delivery', desc: '1–2 business days', price: '₹199' },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => set('shippingMethod', opt.value)}
          className={`w-full flex items-center justify-between p-4 border mb-3 text-left transition-all ${
            formData.shippingMethod === opt.value ? 'border-gold bg-champagne/10' : 'border-charcoal/15 hover:border-charcoal/30'
          }`}
        >
          <div>
            <p className="font-sans text-sm font-medium text-charcoal">{opt.label}</p>
            <p className="font-sans text-xs text-charcoal/50">{opt.desc}</p>
          </div>
          <span className="font-sans text-sm font-medium text-charcoal">{opt.price}</span>
        </button>
      ))}
    </div>,

    // Step 3: Payment
    <div key="payment">
      <h2 className="font-serif text-2xl font-light text-charcoal mb-7">Payment</h2>
      {[
        { value: 'online', label: 'Online Payment', desc: 'UPI, Credit / Debit Card, Net Banking' },
        { value: 'cod', label: 'Cash on Delivery', desc: '₹40 COD charge applicable' },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => set('paymentMethod', opt.value)}
          className={`w-full flex items-center justify-between p-4 border mb-3 text-left transition-all ${
            formData.paymentMethod === opt.value ? 'border-gold bg-champagne/10' : 'border-charcoal/15 hover:border-charcoal/30'
          }`}
        >
          <div>
            <p className="font-sans text-sm font-medium text-charcoal">{opt.label}</p>
            <p className="font-sans text-xs text-charcoal/50">{opt.desc}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${formData.paymentMethod === opt.value ? 'border-gold bg-gold' : 'border-charcoal/20'}`} />
        </button>
      ))}
      <div className="mt-6 p-4 bg-champagne/20 border border-champagne/40">
        <p className="font-sans text-xs text-charcoal/60">
          Powered by <strong>Razorpay</strong> — 100% secure payments. Your data is encrypted.
        </p>
      </div>
    </div>,

    // Step 4: Confirmation
    <div key="confirmation" className="text-center py-8">
      <motion.div
        className="w-16 h-16 bg-gold flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Check size={28} className="text-ivory" />
      </motion.div>
      <h2 className="font-serif text-3xl font-light text-charcoal mb-3">
        Thank you for choosing GŌKANA.
      </h2>
      <p className="font-sans text-sm text-charcoal/50 mb-2">Order #{orderId}</p>
      <p className="font-sans text-sm text-charcoal/50 mb-8">
        A confirmation has been sent to {formData.email || 'your email'}. Estimated delivery: 2–4 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary">Continue Shopping</Link>
        <Link to="/" className="btn-secondary">Track Order</Link>
      </div>
    </div>,
  ];

  return (
    <main className="pt-24 min-h-screen bg-ivory">
      <div className="container-gokana py-12">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl tracking-[0.15em] uppercase text-charcoal">GŌKANA</Link>
          </div>

          <StepIndicator current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepContent[step]}
                </motion.div>
              </AnimatePresence>

              {step < 4 && (
                <button
                  onClick={handleNext}
                  disabled={processing}
                  className="btn-primary mt-6 w-full justify-center"
                >
                  {processing ? 'Processing…' : step === 3 ? 'Place Order' : 'Continue'}
                  {!processing && <ChevronRight size={16} />}
                </button>
              )}
              {step > 0 && step < 4 && (
                <button onClick={() => setStep(s => s - 1)} className="w-full text-center mt-3 font-sans text-xs text-charcoal/40 hover:text-charcoal">
                  Back
                </button>
              )}
            </div>

            {/* Order summary */}
            {step < 4 && (
              <div className="lg:col-span-2">
                <div className="bg-beige p-6 sticky top-24">
                  <h3 className="font-serif text-lg font-light text-charcoal mb-5">Order Summary</h3>
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white overflow-hidden flex-shrink-0 relative">
                          <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-ivory text-[10px] font-bold flex items-center justify-center rounded-full">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-sm font-light text-charcoal leading-tight">{item.product.name}</p>
                          {item.variant && <p className="font-sans text-xs text-charcoal/40">{item.variant}</p>}
                        </div>
                        <p className="font-sans text-sm font-medium text-charcoal">{formatPrice(item.product.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-charcoal/10 pt-4 space-y-2">
                    <div className="flex justify-between font-sans text-sm text-charcoal/60">
                      <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm text-charcoal/60">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between font-serif text-lg font-light text-charcoal pt-2 border-t border-charcoal/10">
                      <span>Total</span><span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
