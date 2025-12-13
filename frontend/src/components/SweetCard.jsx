import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

const SweetCard = ({ sweet, onPurchase, isAdmin }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="card group flex flex-col h-full">
      <div className="relative overflow-hidden h-56">
        <img
          src={sweet.image}
          alt={sweet.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-secondary-400 text-gray-800 px-3 py-1 rounded-full font-semibold text-sm">
          {sweet.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            {sweet.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">4.8</span>
          </div>
        </div>
        
        <div className="text-gray-600 text-sm mb-4">
          <p className={showFullDescription ? '' : 'line-clamp-2'}>
            {sweet.description}
          </p>
          {sweet.description && sweet.description.length > 80 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-600 hover:text-orange-700 font-semibold text-xs mt-1 underline"
            >
              {showFullDescription ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ₹{sweet.price}
            </span>
            <span className="text-gray-500 text-sm ml-2">/{sweet.weight}</span>
          </div>
          <div className="text-sm">
            <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {sweet.quantity} in stock
            </span>
          </div>
        </div>
        
        {sweet.ingredients && sweet.ingredients.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {sweet.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <button
            onClick={() => onPurchase(sweet)}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
