import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import Modal from "../components/Modal";

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("");
  const [shopFilter, setShopFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    foodType: "",
    price: "",
    shop: "",
    image: null,
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Categories from your backend model
  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches",
    "South Indian", "North Indian", "Chinese", "Fast Food", "Others"
  ];

  const priceRanges = [
    { label: "Under ₹100", min: 0, max: 100 },
    { label: "₹100 - ₹300", min: 100, max: 300 },
    { label: "₹300 - ₹500", min: 300, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "Above ₹1000", min: 1000, max: Infinity }
  ];

  useEffect(() => {
    fetchItems();
    fetchShops();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${serverUrl}/api/admin/items`, {
        withCredentials: true,
      });
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/admin/shops`, {
        withCredentials: true,
      });
      setShops(data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Item name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.foodType) errors.foodType = "Food type is required";
    if (!formData.price || formData.price <= 0) errors.price = "Valid price is required";
    if (!formData.shop) errors.shop = "Shop selection is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      foodType: "",
      price: "",
      shop: "",
      image: null,
      status: "active"
    });
    setImagePreview("");
    setFormErrors({});
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await axios.post(
        `${serverUrl}/api/admin/items`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setItems(prev => [data, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!validateForm() || !selectedItem) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await axios.put(
        `${serverUrl}/api/admin/items/${selectedItem._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setItems(prev => prev.map(item => 
        item._id === selectedItem._id ? data : item
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to update item", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      await axios.delete(`${serverUrl}/api/admin/items/${selectedItem._id}`, {
        withCredentials: true,
      });
      
      setItems(prev => prev.filter(item => item._id !== selectedItem._id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      await Promise.all(
        selectedItems.map(itemId =>
          axios.delete(`${serverUrl}/api/admin/items/${itemId}`, {
            withCredentials: true,
          })
        )
      );
      
      setItems(prev => prev.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
      setIsBulkModalOpen(false);
    } catch (error) {
      console.error("Failed to bulk delete items", error);
    }
  };

  const handleStatusToggle = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    
    try {
      // const { data } = 
      await axios.put(
        `${serverUrl}/api/admin/items/${item._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setItems(prev => prev.map(i => 
        i._id === item._id ? { ...i, status: newStatus } : i
      ));
    } catch (error) {
      console.error("Failed to update item status", error);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      foodType: item.foodType,
      price: item.price.toString(),
      shop: item.shop?._id || "",
      image: null,
      status: item.status || "active"
    });
    setImagePreview(item.image);
    setIsEditModalOpen(true);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item._id));
    }
  };

  // Filtering logic
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesFoodType = !foodTypeFilter || item.foodType === foodTypeFilter;
    const matchesShop = !shopFilter || item.shop?._id === shopFilter;
    const matchesStatus = !statusFilter || (item.status || 'active') === statusFilter;

    let matchesPriceRange = true;
    if (priceRangeFilter) {
      const range = priceRanges.find(r => r.label === priceRangeFilter);
      if (range) {
        matchesPriceRange = item.price >= range.min && item.price <= range.max;
      }
    }

    return matchesSearch && matchesCategory && matchesFoodType && 
           matchesShop && matchesStatus && matchesPriceRange;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
  };

  const exportItems = () => {
    const csvContent = [
      ['Name', 'Shop', 'Category', 'Food Type', 'Price', 'Status'],
      ...filteredItems.map(item => [
        item.name,
        item.shop?.name || 'N/A',
        item.category,
        item.foodType,
        item.price,
        item.status || 'active'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate stats
  const stats = {
    total: items.length,
    active: items.filter(item => (item.status || 'active') === 'active').length,
    inactive: items.filter(item => item.status === 'inactive').length,
    averagePrice: items.length > 0 ? 
      items.reduce((sum, item) => sum + item.price, 0) / items.length : 0
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Item Management</h2>
            <p className="text-gray-600">Manage food items across all shops</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
            <button 
              onClick={exportItems}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            {selectedItems.length > 0 && (
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Total Items</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Active Items</h3>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Inactive Items</h3>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Average Price</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averagePrice)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input 
              type="text" 
              placeholder="Search items or shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select 
              value={foodTypeFilter}
              onChange={(e) => setFoodTypeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="veg">Vegetarian</option>
              <option value="non veg">Non-Vegetarian</option>
            </select>
            <select 
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Shops</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>{shop.name}</option>
              ))}
            </select>
            <select 
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              {priceRanges.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="bg-white rounded-lg border">
          {/* Table Header with Bulk Select */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {selectedItems.length > 0 
                  ? `${selectedItems.length} items selected`
                  : `${filteredItems.length} items total`
                }
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading items...</div>
          ) : currentItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No items found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {currentItems.map((item) => (
                <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      className="absolute top-2 left-2 z-10 rounded border-gray-300"
                    />
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-40 object-cover"
                    />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status || 'active')}`}>
                      {item.status || 'active'}
                    </span>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{item.shop?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{item.category} • {item.foodType}</p>
                    <p className="font-bold text-lg text-blue-600">{formatCurrency(item.price)}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(item)}
                        className={`flex-1 px-3 py-1 text-sm rounded transition-colors ${
                          (item.status || 'active') === 'active' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {(item.status || 'active') === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteModalOpen(true);
                        }}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === index + 1 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.name ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter item name"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.category ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Food Type *</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.foodType ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Type</option>
                <option value="veg">Vegetarian</option>
                <option value="non veg">Non-Vegetarian</option>
              </select>
              {formErrors.foodType && <p className="text-red-500 text-sm mt-1">{formErrors.foodType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.price ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shop *</label>
              <select
                name="shop"
                value={formData.shop}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.shop ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Shop</option>
                {shops.map(shop => (
                  <option key={shop._id} value={shop._id}>{shop.name}</option>
                ))}
              </select>
              {formErrors.shop && <p className="text-red-500 text-sm mt-1">{formErrors.shop}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Item Image</label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedItem(null);
        }}
        title="Edit Item"
      >
        <form onSubmit={handleEditItem} className="space-y-4">
          {/* Same form fields as Add Modal */}
          <div>
            <label className="block text-sm font-medium mb-1">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.name ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter item name"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.category ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Food Type *</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.foodType ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Type</option>
                <option value="veg">Vegetarian</option>
                <option value="non veg">Non-Vegetarian</option>
              </select>
              {formErrors.foodType && <p className="text-red-500 text-sm mt-1">{formErrors.foodType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.price ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shop *</label>
              <select
                name="shop"
                value={formData.shop}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.shop ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Shop</option>
                {shops.map(shop => (
                  <option key={shop._id} value={shop._id}>{shop.name}</option>
                ))}
              </select>
              {formErrors.shop && <p className="text-red-500 text-sm mt-1">{formErrors.shop}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Item Image</label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
                setSelectedItem(null);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedItem(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteItem}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        title="Confirm Bulk Deletion"
      >
        <p>Are you sure you want to delete <strong>{selectedItems.length}</strong> selected items? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => setIsBulkModalOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete All
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AdminItems;
