import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import Modal from "../components/Modal";

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [itemsRangeFilter, setItemsRangeFilter] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedShops, setSelectedShops] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    owner: "",
    image: null,
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 8;

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];

  const itemsRanges = [
    { label: "0 items", min: 0, max: 0 },
    { label: "1-5 items", min: 1, max: 5 },
    { label: "6-15 items", min: 6, max: 15 },
    { label: "16-30 items", min: 16, max: 30 },
    { label: "30+ items", min: 31, max: Infinity }
  ];

  useEffect(() => {
    fetchShops();
    fetchOwners();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${serverUrl}/api/admin/shops`, {
        withCredentials: true,
      });
      setShops(data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/admin/users?role=owner`, {
        withCredentials: true,
      });
      setOwners(data);
    } catch (error) {
      console.error("Failed to fetch owners", error);
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
    
    if (!formData.name.trim()) errors.name = "Shop name is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.owner) errors.owner = "Owner selection is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      state: "",
      address: "",
      owner: "",
      image: null,
      status: "active"
    });
    setImagePreview("");
    setFormErrors({});
  };

  const handleAddShop = async (e) => {
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
        `${serverUrl}/api/admin/shops`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setShops(prev => [data, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add shop", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditShop = async (e) => {
    e.preventDefault();
    if (!validateForm() || !selectedShop) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await axios.put(
        `${serverUrl}/api/admin/shops/${selectedShop._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setShops(prev => prev.map(shop => 
        shop._id === selectedShop._id ? data : shop
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedShop(null);
    } catch (error) {
      console.error("Failed to update shop", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!selectedShop) return;
    
    try {
      await axios.delete(`${serverUrl}/api/admin/shops/${selectedShop._id}`, {
        withCredentials: true,
      });
      
      setShops(prev => prev.filter(shop => shop._id !== selectedShop._id));
      setIsDeleteModalOpen(false);
      setSelectedShop(null);
    } catch (error) {
      console.error("Failed to delete shop", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedShops.length === 0) return;
    
    try {
      await Promise.all(
        selectedShops.map(shopId =>
          axios.delete(`${serverUrl}/api/admin/shops/${shopId}`, {
            withCredentials: true,
          })
        )
      );
      
      setShops(prev => prev.filter(shop => !selectedShops.includes(shop._id)));
      setSelectedShops([]);
      setIsBulkModalOpen(false);
    } catch (error) {
      console.error("Failed to bulk delete shops", error);
    }
  };

  const handleStatusToggle = async (shop) => {
    const newStatus = shop.status === 'active' ? 'inactive' : 'active';
    
    try {
      // const { data } = 
      await axios.put(
        `${serverUrl}/api/admin/shops/${shop._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setShops(prev => prev.map(s => 
        s._id === shop._id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error("Failed to update shop status", error);
    }
  };

  const openEditModal = (shop) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name,
      city: shop.city,
      state: shop.state,
      address: shop.address,
      owner: shop.owner?._id || "",
      image: null,
      status: shop.status || "active"
    });
    setImagePreview(shop.image);
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (shop) => {
    setSelectedShop(shop);
    setIsDetailsModalOpen(true);
  };

  const handleSelectShop = (shopId) => {
    setSelectedShops(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId)
        : [...prev, shopId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShops.length === filteredShops.length) {
      setSelectedShops([]);
    } else {
      setSelectedShops(filteredShops.map(shop => shop._id));
    }
  };

  // Get unique cities and states for filters
  const uniqueCities = [...new Set(shops.map(shop => shop.city))].sort();
  const uniqueStates = [...new Set(shops.map(shop => shop.state))].sort();

  // Filtering logic
  const filteredShops = shops.filter(shop => {
    const matchesSearch = !searchTerm || 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !cityFilter || shop.city === cityFilter;
    const matchesState = !stateFilter || shop.state === stateFilter;
    const matchesStatus = !statusFilter || (shop.status || 'active') === statusFilter;
    const matchesOwner = !ownerFilter || shop.owner?._id === ownerFilter;

    let matchesItemsRange = true;
    if (itemsRangeFilter) {
      const range = itemsRanges.find(r => r.label === itemsRangeFilter);
      if (range) {
        const itemCount = shop.items?.length || 0;
        matchesItemsRange = itemCount >= range.min && itemCount <= range.max;
      }
    }

    return matchesSearch && matchesCity && matchesState && 
           matchesStatus && matchesOwner && matchesItemsRange;
  });

  // Pagination
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
  };

  const exportShops = () => {
    const csvContent = [
      ['Name', 'Owner', 'City', 'State', 'Address', 'Items Count', 'Status'],
      ...filteredShops.map(shop => [
        shop.name,
        shop.owner?.fullName || 'N/A',
        shop.city,
        shop.state,
        shop.address,
        shop.items?.length || 0,
        shop.status || 'active'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shops_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate stats
  const stats = {
    total: shops.length,
    active: shops.filter(shop => (shop.status || 'active') === 'active').length,
    inactive: shops.filter(shop => shop.status === 'inactive').length,
    totalItems: shops.reduce((sum, shop) => sum + (shop.items?.length || 0), 0)
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Shop Management</h2>
            <p className="text-gray-600">Manage restaurants and food outlets</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Shop
            </button>
            <button 
              onClick={exportShops}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            {selectedShops.length > 0 && (
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedShops.length})
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Total Shops</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Active Shops</h3>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Inactive Shops</h3>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-600">Total Menu Items</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalItems}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input 
              type="text" 
              placeholder="Search shops, owners, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select 
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select 
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select 
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Owners</option>
              {owners.map(owner => (
                <option key={owner._id} value={owner._id}>{owner.fullName}</option>
              ))}
            </select>
            <select 
              value={itemsRangeFilter}
              onChange={(e) => setItemsRangeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Items Count</option>
              {itemsRanges.map(range => (
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

        {/* Shops Grid */}
        <div className="bg-white rounded-lg border">
          {/* Header with Bulk Select */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedShops.length === filteredShops.length && filteredShops.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {selectedShops.length > 0 
                  ? `${selectedShops.length} shops selected`
                  : `${filteredShops.length} shops total`
                }
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading shops...</div>
          ) : currentShops.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No shops found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {currentShops.map((shop) => (
                <div key={shop._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedShops.includes(shop._id)}
                      onChange={() => handleSelectShop(shop._id)}
                      className="absolute top-2 left-2 z-10 rounded border-gray-300"
                    />
                    <img 
                      src={shop.image} 
                      alt={shop.name} 
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => openDetailsModal(shop)}
                    />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shop.status || 'active')}`}>
                      {shop.status || 'active'}
                    </span>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {shop.items?.length || 0} items
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold truncate cursor-pointer" onClick={() => openDetailsModal(shop)}>
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{shop.owner?.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-500 truncate">{shop.city}, {shop.state}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{shop.address}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => openEditModal(shop)}
                        className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(shop)}
                        className={`flex-1 px-3 py-1 text-sm rounded transition-colors ${
                          (shop.status || 'active') === 'active' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {(shop.status || 'active') === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedShop(shop);
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
                Showing {indexOfFirstShop + 1} to {Math.min(indexOfLastShop, filteredShops.length)} of {filteredShops.length} shops
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

      {/* Add Shop Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Shop"
      >
        <form onSubmit={handleAddShop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.name ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter shop name"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.city ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter city"
              />
              {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.state ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.address ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter complete address"
            />
            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Owner *</label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.owner ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select Owner</option>
              {owners.map(owner => (
                <option key={owner._id} value={owner._id}>
                  {owner.fullName} ({owner.email})
                </option>
              ))}
            </select>
            {formErrors.owner && <p className="text-red-500 text-sm mt-1">{formErrors.owner}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shop Image</label>
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
              {submitting ? "Adding..." : "Add Shop"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Shop Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedShop(null);
        }}
        title="Edit Shop"
      >
        <form onSubmit={handleEditShop} className="space-y-4">
          {/* Same form fields as Add Modal */}
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.name ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter shop name"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.city ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter city"
              />
              {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.state ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.address ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter complete address"
            />
            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Owner *</label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.owner ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select Owner</option>
              {owners.map(owner => (
                <option key={owner._id} value={owner._id}>
                  {owner.fullName} ({owner.email})
                </option>
              ))}
            </select>
            {formErrors.owner && <p className="text-red-500 text-sm mt-1">{formErrors.owner}</p>}
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
            <label className="block text-sm font-medium mb-1">Shop Image</label>
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
                setSelectedShop(null);
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
              {submitting ? "Updating..." : "Update Shop"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Shop Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedShop(null);
        }}
        title="Shop Details"
      >
        {selectedShop && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img 
                src={selectedShop.image} 
                alt={selectedShop.name} 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedShop.name}</h3>
                <p className="text-gray-600">Owner: {selectedShop.owner?.fullName}</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedShop.status || 'active')}`}>
                  {selectedShop.status || 'active'}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-sm text-gray-600">Email: {selectedShop.owner?.email || 'N/A'}</p>
              <p className="text-sm text-gray-600">Phone: {selectedShop.owner?.mobile || 'N/A'}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-sm text-gray-600">{selectedShop.address}</p>
              <p className="text-sm text-gray-600">{selectedShop.city}, {selectedShop.state}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Menu Items</p>
                  <p className="text-xl font-bold">{selectedShop.items?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedShop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedShop(null);
        }}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete <strong>{selectedShop?.name}</strong>? This will also delete all items associated with this shop. This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedShop(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteShop}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Shop
          </button>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        title="Confirm Bulk Deletion"
      >
        <p>Are you sure you want to delete <strong>{selectedShops.length}</strong> selected shops? This will also delete all items associated with these shops. This action cannot be undone.</p>
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

export default AdminShops;
