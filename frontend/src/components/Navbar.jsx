import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, User, LayoutDashboard, Mail, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                Sweet Delights
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="mailto:dilseeratjassal@gmail.com"
              className="flex items-center space-x-2 text-gray-700 hover:text-orange-700 font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Contact Us</span>
            </a>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-700 font-medium transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
                    <User className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-700">{user.name}</span>
                    {isAdmin && (
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-700 transition-colors font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                  
                  {!isAdmin && (
                    <Link
                      to="/cart"
                      className="relative flex items-center justify-center text-gray-700 hover:text-orange-700 transition-colors"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {getCartCount()}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-semibold hover:bg-orange-200 transition-all duration-200"
                >
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
