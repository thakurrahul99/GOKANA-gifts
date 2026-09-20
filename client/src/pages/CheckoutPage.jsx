import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ShieldCheck, Truck, ArrowLeft, ArrowRight, PackageCheck, AlertCircle } from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import { formatPrice } from '../components/ui';
import { api } from '../lib/api';

const STEPS = ['Contact', 'Delivery Address', 'Shipping', 'Payment', 'Confirmation'];
const STORAGE_KEY = 'gokana_checkout_form';

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitError, setSubmitError] = useState('');

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

  // Restore form data from localStorage, then let the logged-in user's
  // own details win over anything stale that was cached.
  useEffect(() => {
    let restored = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) restored = JSON.parse(saved);
    } catch (_) {}

    setFormData((prev) => ({
      ...prev,
      ...(restored || {}),
      ...(user
        ? {
            name: user.name || restored?.name || prev.name,
            email: user.email || restored?.email || prev.email,
            phone: user.phone || restored?.phone || prev.phone,
          }
        : {}),
    }));
  }, [user]);

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

  // Maps the checkout's payment radio options onto what the backend
  // understands: everything that isn't COD goes through Razorpay ('online').
  const backendPaymentMethod =
    formData.paymentMethod === 'cod' ? 'cod' : 'online';

  // Loads the Razorpay checkout script on demand (only when an online
  // payment is actually being made, so it never blocks first paint).
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const finishOrder = (order) => {
    setPlacedOrder(order);
    setOrderId(order?.orderId || order?._id || '');
    setStep(4);
    clearCart();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const placeOrder = async () => {
    setSubmitError('');
    setProcessing(true);

    try {
      // Only identifiers and quantities are sent. Prices, discounts,
      // shipping and the grand total are all recalculated server-side from
      // the database — nothing here can change what the customer is charged.
      const payload = {
        items: items.map(({ product, variant, qty, personalisation }) => ({
          slug: product.slug,
          productId: product._id,
          qty,
          variant,
          personalisation,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        billing: {
          guestEmail: user ? undefined : formData.email,
          guestPhone: user ? undefined : formData.phone,
        },
        payment: { method: backendPaymentMethod },
      };

      const data = await api.post('/orders', payload, { auth: Boolean(token) });
      const order = data.order;

      // COD is confirmed server-side straight away — nothing more to do.
      if (backendPaymentMethod === 'cod' || !data.razorpayOrder) {
        finishOrder(order);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          'Could not load the payment gateway. Your order has been saved as pending — please retry payment from your account, or choose Cash on Delivery.'
        );
      }

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: 'GŌKANA',
          description: `Order ${order.orderId}`,
          order_id: data.razorpayOrder.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#0B1F3A' },
          handler: async (response) => {
            try {
              // The server re-verifies the signature AND checks that this
              // razorpayOrderId belongs to this order before marking it paid.
              const verified = await api.post('/orders/verify-payment', {
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              finishOrder(verified.order || order);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () =>
              reject(new Error('Payment was cancelled. Your order is saved as pending — you can retry payment.')),
          },
        });
        rzp.on('payment.failed', (resp) =>
          reject(new Error(resp?.error?.description || 'Payment failed. Please try again.'))
        );
        rzp.open();
      });
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setProcessing(false);
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (step < STEPS.length - 2) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      placeOrder();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (items.length === 0 && step !== 4) {
    return (
      <main id="main-content" className="pt-32 min-h-screen bg-bg flex items-center justify-center text-center p-6">
        <div className="card-premium max-w-md p-8">
          <h1 className="font-serif text-3xl font-light text-primary mb-3">Your Cart is Empty</h1>
          <p className="font-sans text-sm text-muted mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link to="/shop" className="btn-accent">Explore Curated Gifts</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="pt-28 min-h-screen bg-bg pb-20">
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
                        ? 'bg-accent text-text'
                        : idx === step
                        ? 'bg-primary text-white ring-4 ring-border'
                        : 'bg-border text-muted'
                    }`}
                  >
                    {idx < step ? <Check size={16} /> : idx + 1}
                  </div>
                  <span className="font-sans text-[11px] font-semibold text-primary mt-2 hidden sm:block">
                    {s}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      idx < step ? 'bg-accent' : 'bg-border'
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
            <div className="w-16 h-16 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center mx-auto mb-6">
              <PackageCheck size={32} />
            </div>
            <span className="label-text text-accent mb-2 block">Order Placed Successfully</span>
            <h1 className="heading-lg text-primary mb-3">Thank You for Your Order!</h1>
            <p className="font-sans text-sm text-muted mb-6 leading-relaxed">
              We have received your gift order <b className="text-primary">#{orderId}</b>. A confirmation email and SMS with live tracking details has been sent to <b>{formData.email}</b>.
            </p>

            <div className="p-4 rounded-xl bg-surface-alt border border-border text-left mb-8 text-xs text-primary space-y-2">
              <p><b>Recipient:</b> {formData.name}</p>
              <p><b>Address:</b> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
              {placedOrder?.billing?.total != null && (
                <p><b>Amount:</b> {formatPrice(placedOrder.billing.total)} ({placedOrder.payment?.method === 'cod' ? 'Cash on Delivery' : 'Paid online'})</p>
              )}
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
                    <h2 className="heading-md text-primary mb-6">Contact Information</h2>
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
                    <h2 className="heading-md text-primary mb-6">Delivery Address</h2>
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
                    <h2 className="heading-md text-primary mb-6">Choose Shipping Speed</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', title: 'Standard Express Shipping', time: '2–4 Business Days', cost: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99 },
                        { id: 'express', title: 'Priority Next-Day Dispatch', time: '1–2 Business Days', cost: 199 },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            formData.shippingMethod === opt.id
                              ? 'border-primary bg-accent-soft/30 shadow-xs'
                              : 'border-border bg-surface-alt hover:border-accent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={formData.shippingMethod === opt.id}
                              onChange={() => setField('shippingMethod', opt.id)}
                              className="accent-accent w-4 h-4"
                            />
                            <div>
                              <p className="font-sans text-sm font-semibold text-primary">{opt.title}</p>
                              <p className="font-sans text-xs text-muted">{opt.time}</p>
                            </div>
                          </div>
                          <span className="font-sans text-sm font-bold text-primary">
                            {opt.cost === 0 ? <span className="text-success">FREE</span> : formatPrice(opt.cost)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <div>
                    <h2 className="heading-md text-primary mb-6">Payment Method</h2>
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
                              ? 'border-primary bg-accent-soft/30 shadow-xs'
                              : 'border-border bg-surface-alt hover:border-accent'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === m.id}
                            onChange={() => setField('paymentMethod', m.id)}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <div>
                            <p className="font-sans text-sm font-semibold text-primary">{m.label}</p>
                            <p className="font-sans text-xs text-muted">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit error (real server message, not a fake success) */}
                {submitError && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/5 px-4 py-3"
                  >
                    <AlertCircle size={15} className="text-error flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-xs text-error leading-relaxed">{submitError}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-border">
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
                <h3 className="heading-sm text-primary pb-3 border-b border-border">
                  Order Summary ({items.reduce((a, i) => a + i.qty, 0)} Items)
                </h3>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map(({ product, variant, qty }) => (
                    <div key={`${product.id}-${variant || 'std'}`} className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-14 rounded-lg object-cover bg-surface-alt flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-light text-primary truncate">{product.name}</p>
                        <p className="font-sans text-xs text-muted">Qty: {qty} {variant ? `• ${variant}` : ''}</p>
                      </div>
                      <span className="font-sans text-xs font-semibold text-primary">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Packaging & Luxury Box</span>
                    <span className="text-success font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping Speed</span>
                    <span>{shippingCost === 0 ? <span className="text-success">FREE</span> : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-border">
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-center gap-2 text-xs text-success">
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
