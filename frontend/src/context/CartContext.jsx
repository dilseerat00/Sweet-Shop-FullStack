import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Get user-specific cart key
  const getCartKey = () => {
    return user ? `cart_${user.email}` : 'cart_guest';
  };

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user?.email]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user?.email]);

  const addToCart = (sweet) => {
    if (sweet.quantity === 0) {
      return false;
    }
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === sweet._id);
      if (existingItem) {
        // Check if we can add more based on available stock
        if (existingItem.cartQuantity >= sweet.quantity) {
          return prevItems; // Don't add more if we've reached stock limit
        }
        return prevItems.map((item) =>
          item._id === sweet._id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...sweet, cartQuantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (sweetId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== sweetId));
  };

  const updateQuantity = (sweetId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === sweetId ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
