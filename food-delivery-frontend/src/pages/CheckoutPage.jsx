import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { getUserAddresses } from '../store/slices/addressSlice';
import PaymentForm from '../components/payment/PaymentForm';
import api from '../services/api';

// Load Stripe — publishable key is safe to expose in frontend
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE');

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.addresses);
  const { loading, error } = useSelector((state) => state.orders);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment flow state
  const [paymentStep, setPaymentStep] = useState('order'); // 'order' | 'payment' | 'success'
  const [clientSecret, setClientSecret] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (user?.id) dispatch(getUserAddresses(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (items.length === 0 && paymentStep === 'order') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/restaurants')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Browse Restaurants
        </button>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      const restaurantId = items[0]?.menuItem?.restaurantId || items[0]?.restaurantId;

      // Step 1: Create the order
      const orderResult = await dispatch(placeOrder({
        restaurantId,
        deliveryAddressId: selectedAddressId,
        items: items.map(item => ({
          menuItemId: item.menuItem?.id || item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || '',
        })),
        specialInstructions,
      })).unwrap();

      const orderId = orderResult?.id || orderResult?.data?.id;
      setPlacedOrderId(orderId);

      // Step 2: Create Stripe PaymentIntent
      const response = await api.post('/payments/create-intent', {
        orderId,
        amount: finalTotal,
      });

      const secret = response.data?.data?.stripeClientSecret
        || response.data?.stripeClientSecret;

      if (!secret) throw new Error('Failed to initialize payment');

      setClientSecret(secret);
      setPaymentStep('payment');

    } catch (err) {
      setPaymentError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    setPaymentStep('success');
    setTimeout(() => navigate(`/orders/${placedOrderId}`), 2000);
  };

  const handlePaymentError = (msg) => {
    setPaymentError(msg);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Delivery Address — only show before payment step */}
          {paymentStep === 'order' && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                {addresses.length === 0 ? (
                  <div>
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <button onClick={() => navigate('/addresses')}
                      className="text-orange-500 hover:underline">Add Address</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label key={address.id}
                        className={`block p-4 border rounded-lg cursor-pointer ${
                          selectedAddressId === address.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300'
                        }`}>
                        <input type="radio" name="address" value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mr-3" />
                        <span className="font-medium">{address.label || address.addressLine}</span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                        )}
                        <p className="text-gray-600 ml-6 text-sm mt-1">
                          {address.street || address.addressLine}, {address.city}, {address.state} {address.zipCode}
                        </p>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.menuItem?.name || item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        ${((item.menuItem?.price || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
                <textarea value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                  rows="3" />
              </div>
            </>
          )}

          {/* Payment Step */}
          {paymentStep === 'payment' && clientSecret && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">💳 Payment Details</h2>
              <p className="text-sm text-gray-500 mb-4">
                Order #{placedOrderId?.substring(0, 8)} placed. Complete payment to confirm.
              </p>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <PaymentForm
                  orderId={placedOrderId}
                  amount={finalTotal}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          )}

          {/* Success Step */}
          {paymentStep === 'success' && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">Redirecting to order tracking...</p>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {(error || paymentError) && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error || paymentError}
              </div>
            )}

            {paymentStep === 'order' && (
              <button
                onClick={handlePlaceOrder}
                disabled={loading || paymentLoading || !selectedAddressId}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold
                           hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-colors"
              >
                {paymentLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Setting up payment...
                  </span>
                ) : 'Place Order & Pay'}
              </button>
            )}

            {paymentStep === 'payment' && (
              <div className="text-center text-sm text-gray-500 py-2">
                Complete payment in the form on the left
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
