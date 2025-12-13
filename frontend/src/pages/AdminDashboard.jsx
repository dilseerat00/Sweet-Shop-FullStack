import { useState, useEffect } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Package, X, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Milk-based',
    price: '',
    quantity: '',
    description: '',
    image: '',
    ingredients: '',
    weight: '250g',
  });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchSweets();
  }, [isAdmin]);

  useEffect(() => {
    filterSweets();
  }, [searchTerm, selectedCategory, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await sweetsAPI.getAll();
      setSweets(response.data.data);
      setFilteredSweets(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch sweets');
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
          sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSweets(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sweetData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        ingredients: formData.ingredients.split(',').map((i) => i.trim()).filter(Boolean),
      };

      if (editingSweet) {
        await sweetsAPI.update(editingSweet._id, sweetData);
        toast.success('Sweet updated successfully');
      } else {
        await sweetsAPI.create(sweetData);
        toast.success('Sweet created successfully');
      }

      resetForm();
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description,
      image: sweet.image,
      ingredients: sweet.ingredients.join(', '),
      weight: sweet.weight,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsAPI.delete(id);
        toast.success('Sweet deleted successfully');
        fetchSweets();
      } catch (error) {
        toast.error('Failed to delete sweet');
      }
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter quantity to restock:');
    if (quantity && Number(quantity) > 0) {
      try {
        await sweetsAPI.restock(id, Number(quantity));
        toast.success('Restocked successfully');
        fetchSweets();
      } catch (error) {
        toast.error('Restock failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Milk-based',
      price: '',
      quantity: '',
      description: '',
      image: '',
      ingredients: '',
      weight: '250g',
    });
    setEditingSweet(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Sweet</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
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
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sweet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSweets.map((sweet) => (
                  <tr key={sweet._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={sweet.image} alt={sweet.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sweet.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {sweet.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{sweet.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${sweet.quantity === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {sweet.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="text-primary-600 hover:text-primary-900 relative group inline-block"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={() => handleRestock(sweet._id)}
                        className="text-green-600 hover:text-green-900 relative group inline-block"
                        title="Restock"
                      >
                        <Package className="h-5 w-5" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Restock
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(sweet._id)}
                        className="text-red-600 hover:text-red-900 relative group inline-block"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter sweet name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      >
                        <option>Milk-based</option>
                        <option>Syrup-based</option>
                        <option>Dry Fruits</option>
                        <option>Seasonal</option>
                        <option>Special</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="Enter quantity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="e.g., 250g, 500g"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                      placeholder="Describe the sweet..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      placeholder="Milk, Sugar, Ghee, etc."
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      {editingSweet ? 'Update Sweet' : 'Create Sweet'}
                    </button>
                    <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
