import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { sweetsAPI } from '../services/api';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Process each item in cart
      for (const item of cartItems) {
        await sweetsAPI.purchase(item._id, item.cartQuantity);
      }
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">Add some delicious sweets to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Sweets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{item.price} <span className="text-sm text-gray-500">/ {item.weight}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.cartQuantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.cartQuantity >= item.quantity}
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{(item.price * item.cartQuantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)})</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {getCartTotal() < 300 ? (
                    <span className="text-orange-600 font-semibold">₹50.00</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Free</span>
                  )}
                </div>
                {getCartTotal() < 300 && (
                  <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded">
                    Add ₹{(300 - getCartTotal()).toFixed(2)} more for free delivery
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ₹{(getCartTotal() + (getCartTotal() < 300 ? 50 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full btn-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
