import { useState, useEffect } from 'react';
import { sweetsAPI } from '../services/api';
import SweetCard from '../components/SweetCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Search, Filter, Sparkles, ArrowUpDown } from 'lucide-react';

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const heroImages = [
    'https://sangamsweets.in/cdn/shop/files/Motichur_Laddu_Sweets.png?v=1747030843',
    'https://static.toiimg.com/photo/53376135.cms',
    'https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/11/Best-Food-In-Vrindavan-Cover-Image-840x425.jpg',
    'https://tiimg.tistatic.com/fp/1/008/254/fresh-delicious-milk-cake-sweets-941.jpg'
  ];

  const categories = ['All', 'Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'];

  useEffect(() => {
    fetchSweets();
    
    // Refresh sweets when user returns to page (after checkout)
    const handleFocus = () => fetchSweets();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    // Auto-slide effect
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  useEffect(() => {
    filterSweets();
  }, [searchTerm, selectedCategory, sweets, sortOrder]);

  const fetchSweets = async () => {
    try {
      const response = await sweetsAPI.getAll();
      setSweets(response.data.data);
      setFilteredSweets(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = sweets;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((sweet) => sweet.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sweet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortOrder === 'low-to-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweet) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }

    if (sweet.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    const success = addToCart(sweet);
    if (success) {
      toast.success(`${sweet.name} added to cart!`);
    } else {
      toast.error('Unable to add more items - stock limit reached');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)' }}>
      {/* Hero Section with Image Slider */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255, 247, 237, 0.5), rgba(254, 215, 170, 0.45), rgba(253, 186, 116, 0.4), rgba(251, 146, 60, 0.35))' }}></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 animate-pulse drop-shadow-lg text-amber-900" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl text-amber-950" style={{ fontFamily: 'Playfair Display, serif' }}>
                Taste the Sweetness of Tradition
              </h1>
              <p className="text-xl md:text-2xl text-amber-900 drop-shadow-xl mb-8 font-semibold">
                Handcrafted Indian sweets made with love and authentic recipes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <ArrowUpDown className="h-5 w-5 text-gray-700" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium bg-white text-gray-700 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all cursor-pointer"
              >
                <option value="none">Sort by Price</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-gray-700 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 border-2 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg border-orange-600'
                    : 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sweets Grid */}
        {filteredSweets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No sweets found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet._id} sweet={sweet} onPurchase={handlePurchase} />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer Section */}
      <div className="bg-orange-50 border-t border-orange-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Disclaimer</h3>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">Images are for illustrative purposes only. Actual sweets may vary slightly in color, size, and presentation. We strive to maintain freshness and quality in all our products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
