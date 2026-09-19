import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ShieldCheck, Truck, ArrowLeft, ArrowRight, PackageCheck } from 'lucide-react';
import { useCartStore } from '../store';
import { formatPrice } from '../components/ui';

const STEPS = ['Contact', 'Delivery Address', 'Shipping', 'Payment', 'Confirmation'];
const STORAGE_KEY = 'gokana_checkout_form';

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    shippingMethod: 'standard',
    paymentMethod: 'upi',
  });

  // Restore form data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  // Save form data on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (_) {}
  }, [formData]);

  const FREE_SHIPPING_THRESHOLD = 999;
  const shippingCost = formData.shippingMethod === 'express' ? 199 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99);
  const grandTotal = subtotal + shippingCost;

  const setField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validateCurrentStep = () => {
    const errs = {};
    if (step === 0) {
      if (!formData.name.trim()) errs.name = 'Please enter your full name';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Please provide a valid email';
      if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Please provide a 10-digit phone number';
    } else if (step === 1) {
      if (!formData.address.trim()) errs.address = 'Street address is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit PIN code required';
      if (!formData.state.trim()) errs.state = 'State is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (step < STEPS.length - 2) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      // Process order
      setProcessing(true);
      setTimeout(() => {
        const id = 'GKN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setOrderId(id);
        setStep(4);
        setProcessing(false);
        clearCart();
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (items.length === 0 && step !== 4) {
    return (
      <main id="main-content" className="pt-32 min-h-screen bg-[#F7F3EC] flex items-center justify-center text-center p-6">
        <div className="card-premium max-w-md p-8">
          <h1 className="font-serif text-3xl font-light text-[#0B1F3A] mb-3">Your Cart is Empty</h1>
          <p className="font-sans text-sm text-[#6B6B6B] mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link to="/shop" className="btn-accent">Explore Curated Gifts</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="pt-28 min-h-screen bg-[#F7F3EC] pb-20">
      <div className="container-gokana max-w-5xl py-8">
        {/* Multi-Step Progress Tracker (Section 9 Requirement) */}
        <div className="mb-10" aria-label="Checkout Progress">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((s, idx) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all ${
                      idx < step
                        ? 'bg-[#D4AF37] text-[#121212]'
                        : idx === step
                        ? 'bg-[#0B1F3A] text-white ring-4 ring-[#E8DFD3]'
                        : 'bg-[#E8DFD3] text-[#6B6B6B]'
                    }`}
                  >
                    {idx < step ? <Check size={16} /> : idx + 1}
                  </div>
                  <span className="font-sans text-[11px] font-semibold text-[#0B1F3A] mt-2 hidden sm:block">
                    {s}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      idx < step ? 'bg-[#D4AF37]' : 'bg-[#E8DFD3]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Screen */}
        {step === 4 ? (
          <div className="card-premium max-w-xl mx-auto text-center p-8 md:p-12">
            <div className="w-16 h-16 rounded-full bg-[#F5E9C8] text-[#B08D57] flex items-center justify-center mx-auto mb-6">
              <PackageCheck size={32} />
            </div>
            <span className="label-text text-[#D4AF37] mb-2 block">Order Placed Successfully</span>
            <h1 className="heading-lg text-[#0B1F3A] mb-3">Thank You for Your Order!</h1>
            <p className="font-sans text-sm text-[#6B6B6B] mb-6 leading-relaxed">
              We have received your gift order <b className="text-[#0B1F3A]">#{orderId}</b>. A confirmation email and SMS with live tracking details has been sent to <b>{formData.email}</b>.
            </p>

            <div className="p-4 rounded-xl bg-[#FBF8F2] border border-[#E8DFD3] text-left mb-8 text-xs text-[#0B1F3A] space-y-2">
              <p><b>Recipient:</b> {formData.name}</p>
              <p><b>Address:</b> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
              <p><b>Estimated Delivery:</b> 2–4 Business Days</p>
            </div>

            <Link to="/" className="btn-accent w-full justify-center">
              Return to Homepage
            </Link>
          </div>
        ) : (
          /* Two-Column Checkout Layout: Form (Left) + Order Summary (Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Steps (7 cols) */}
            <div className="lg:col-span-7">
              <div className="card-premium p-6 md:p-8">
                {/* Step 0: Contact Info */}
                {step === 0 && (
                  <div>
                    <h2 className="heading-md text-[#0B1F3A] mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div className="form-group">
                        <label htmlFor="checkout-name" className="form-label">Full Name</label>
                        <input
                          id="checkout-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. Radhika Sharma"
                          value={formData.name}
                          onChange={(e) => setField('name', e.target.value)}
                          className={`input-field ${errors.name ? 'error' : ''}`}
                          aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && <span className="helper-text error" role="alert">{errors.name}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-email" className="form-label">Email Address</label>
                        <input
                          id="checkout-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="radhika@example.com"
                          value={formData.email}
                          onChange={(e) => setField('email', e.target.value)}
                          className={`input-field ${errors.email ? 'error' : ''}`}
                          aria-invalid={errors.email ? 'true' : 'false'}
                        />
                        {errors.email && <span className="helper-text error" role="alert">{errors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-phone" className="form-label">Phone Number (for delivery updates)</label>
                        <input
                          id="checkout-phone"
                          name="tel"
                          type="tel"
                          autoComplete="tel"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => setField('phone', e.target.value)}
                          className={`input-field ${errors.phone ? 'error' : ''}`}
                          aria-invalid={errors.phone ? 'true' : 'false'}
                        />
                        {errors.phone && <span className="helper-text error" role="alert">{errors.phone}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Delivery Address */}
                {step === 1 && (
                  <div>
                    <h2 className="heading-md text-[#0B1F3A] mb-6">Delivery Address</h2>
                    <div className="space-y-4">
                      <div className="form-group">
                        <label htmlFor="checkout-address" className="form-label">Street Address & Landmark</label>
                        <input
                          id="checkout-address"
                          name="street-address"
                          type="text"
                          autoComplete="street-address"
                          placeholder="Flat 402, Lotus Enclave, 14th Main"
                          value={formData.address}
                          onChange={(e) => setField('address', e.target.value)}
                          className={`input-field ${errors.address ? 'error' : ''}`}
                        />
                        {errors.address && <span className="helper-text error" role="alert">{errors.address}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label htmlFor="checkout-city" className="form-label">City</label>
                          <input
                            id="checkout-city"
                            name="address-level2"
                            type="text"
                            autoComplete="address-level2"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={(e) => setField('city', e.target.value)}
                            className={`input-field ${errors.city ? 'error' : ''}`}
                          />
                          {errors.city && <span className="helper-text error" role="alert">{errors.city}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="checkout-pincode" className="form-label">PIN Code</label>
                          <input
                            id="checkout-pincode"
                            name="postal-code"
                            type="text"
                            autoComplete="postal-code"
                            placeholder="400001"
                            value={formData.pincode}
                            onChange={(e) => setField('pincode', e.target.value)}
                            className={`input-field ${errors.pincode ? 'error' : ''}`}
                          />
                          {errors.pincode && <span className="helper-text error" role="alert">{errors.pincode}</span>}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-state" className="form-label">State</label>
                        <input
                          id="checkout-state"
                          name="address-level1"
                          type="text"
                          autoComplete="address-level1"
                          placeholder="Maharashtra"
                          value={formData.state}
                          onChange={(e) => setField('state', e.target.value)}
                          className={`input-field ${errors.state ? 'error' : ''}`}
                        />
                        {errors.state && <span className="helper-text error" role="alert">{errors.state}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Option */}
                {step === 2 && (
                  <div>
                    <h2 className="heading-md text-[#0B1F3A] mb-6">Choose Shipping Speed</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', title: 'Standard Express Shipping', time: '2–4 Business Days', cost: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99 },
                        { id: 'express', title: 'Priority Next-Day Dispatch', time: '1–2 Business Days', cost: 199 },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            formData.shippingMethod === opt.id
                              ? 'border-[#0B1F3A] bg-[#F5E9C8]/30 shadow-xs'
                              : 'border-[#E8DFD3] bg-[#FBF8F2] hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={formData.shippingMethod === opt.id}
                              onChange={() => setField('shippingMethod', opt.id)}
                              className="accent-[#D4AF37] w-4 h-4"
                            />
                            <div>
                              <p className="font-sans text-sm font-semibold text-[#0B1F3A]">{opt.title}</p>
                              <p className="font-sans text-xs text-[#6B6B6B]">{opt.time}</p>
                            </div>
                          </div>
                          <span className="font-sans text-sm font-bold text-[#0B1F3A]">
                            {opt.cost === 0 ? <span className="text-[#2E7D32]">FREE</span> : formatPrice(opt.cost)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <div>
                    <h2 className="heading-md text-[#0B1F3A] mb-6">Payment Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'upi', label: 'Instant UPI (Google Pay, PhonePe, Paytm)', desc: 'Fastest & zero transaction fees' },
                        { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay & Amex' },
                        { id: 'netbanking', label: 'NetBanking', desc: 'All major Indian banks supported' },
                        { id: 'cod', label: 'Cash on Delivery', desc: 'Available for orders under ₹5,000' },
                      ].map((m) => (
                        <label
                          key={m.id}
                          className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                            formData.paymentMethod === m.id
                              ? 'border-[#0B1F3A] bg-[#F5E9C8]/30 shadow-xs'
                              : 'border-[#E8DFD3] bg-[#FBF8F2] hover:border-[#D4AF37]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === m.id}
                            onChange={() => setField('paymentMethod', m.id)}
                            className="accent-[#D4AF37] w-4 h-4 mt-0.5"
                          />
                          <div>
                            <p className="font-sans text-sm font-semibold text-[#0B1F3A]">{m.label}</p>
                            <p className="font-sans text-xs text-[#6B6B6B]">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-[#E8DFD3]">
                  {step > 0 ? (
                    <button
                      onClick={handleBack}
                      className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-1.5"
                    >
                      <ArrowLeft size={15} />
                      Previous Step
                    </button>
                  ) : <div />}

                  <button
                    onClick={handleNext}
                    disabled={processing}
                    className="btn-accent py-3 px-7 text-xs flex items-center gap-2"
                  >
                    {processing ? (
                      'Securing Order...'
                    ) : step === 3 ? (
                      `Confirm & Pay ${formatPrice(grandTotal)}`
                    ) : (
                      <>
                        Continue to {STEPS[step + 1]}
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5">
              <div className="card-premium p-6 sticky top-28 space-y-4">
                <h3 className="heading-sm text-[#0B1F3A] pb-3 border-b border-[#E8DFD3]">
                  Order Summary ({items.reduce((a, i) => a + i.qty, 0)} Items)
                </h3>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map(({ product, variant, qty }) => (
                    <div key={`${product.id}-${variant || 'std'}`} className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-14 rounded-lg object-cover bg-[#FBF8F2] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-light text-[#0B1F3A] truncate">{product.name}</p>
                        <p className="font-sans text-xs text-[#6B6B6B]">Qty: {qty} {variant ? `• ${variant}` : ''}</p>
                      </div>
                      <span className="font-sans text-xs font-semibold text-[#0B1F3A]">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-[#E8DFD3] space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Packaging & Luxury Box</span>
                    <span className="text-[#2E7D32] font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Shipping Speed</span>
                    <span>{shippingCost === 0 ? <span className="text-[#2E7D32]">FREE</span> : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#0B1F3A] pt-3 border-t border-[#E8DFD3]">
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-center gap-2 text-xs text-[#2E7D32]">
                  <ShieldCheck size={16} />
                  <span>256-Bit Bank Level Encryption Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
