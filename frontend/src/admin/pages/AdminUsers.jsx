import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import Modal from "../components/Modal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
    confirmPassword: "",
    status: "active"
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  // Password reset states
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const roles = ["user", "owner", "deliveryBoy", "admin"];
  const statusOptions = ["active", "inactive", "blocked"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${serverUrl}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (isEdit = false) => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.role) errors.role = "Role is required";
    
    if (!isEdit) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      role: "",
      password: "",
      confirmPassword: "",
      status: "active"
    });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const { data } = await axios.post(
        `${serverUrl}/api/admin/users`,
        userData,
        { withCredentials: true }
      );

      setUsers(prev => [data, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add user", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!validateForm(true) || !selectedUser) return;
    
    setSubmitting(true);
    try {
      const { password, confirmPassword, ...userData } = formData;
      const { data } = await axios.put(
        `${serverUrl}/api/admin/users/${selectedUser._id}`,
        userData,
        { withCredentials: true }
      );

      setUsers(prev => prev.map(user => 
        user._id === selectedUser._id ? data : user
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.delete(`${serverUrl}/api/admin/users/${selectedUser._id}`, {
        withCredentials: true,
      });
      
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      await Promise.all(
        selectedUsers.map(userId =>
          axios.delete(`${serverUrl}/api/admin/users/${userId}`, {
            withCredentials: true,
          })
        )
      );
      
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      setIsBulkModalOpen(false);
    } catch (error) {
      console.error("Failed to bulk delete users", error);
    }
  };

  const handleStatusChange = async (user, newStatus) => {
    try {
      // const { data } = 
      await axios.put(
        `${serverUrl}/api/admin/users/${user._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setUsers(prev => prev.map(u => 
        u._id === user._id ? { ...u, status: newStatus } : u
      ));
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!selectedUser || !newPassword) return;
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    setPasswordResetLoading(true);
    try {
      await axios.put(
        `${serverUrl}/api/admin/users/${selectedUser._id}/reset-password`,
        { newPassword },
        { withCredentials: true }
      );
      
      setIsPasswordResetModalOpen(false);
      setSelectedUser(null);
      setNewPassword("");
      setConfirmNewPassword("");
      alert("Password reset successfully");
    } catch (error) {
      console.error("Failed to reset password", error);
      alert("Failed to reset password");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      password: "",
      confirmPassword: "",
      status: user.status || "active"
    });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Get unique cities for filter
  const uniqueCities = [...new Set(users.map(user => user.city).filter(Boolean))].sort();

  // Filtering and sorting logic
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = !searchTerm || 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || (user.status || 'active') === statusFilter;
      const matchesCity = !cityFilter || user.city === cityFilter;
      
      const matchesDate = !dateFilter || 
        new Date(user.createdAt).toDateString() === new Date(dateFilter).toDateString();

      return matchesSearch && matchesRole && matchesStatus && matchesCity && matchesDate;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-yellow-100 text-yellow-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'owner': return 'bg-yellow-100 text-yellow-700';
      case 'deliveryBoy': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Full Name', 'Email', 'Mobile', 'Role', 'Status', 'Created Date'],
      ...filteredUsers.map(user => [
        user.fullName,
        user.email,
        user.mobile,
        user.role,
        user.status || 'active',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(user => (user.status || 'active') === 'active').length,
    inactive: users.filter(user => user.status === 'inactive').length,
    blocked: users.filter(user => user.status === 'blocked').length,
    admins: users.filter(user => user.role === 'admin').length,
    owners: users.filter(user => user.role === 'owner').length,
    deliveryBoys: users.filter(user => user.role === 'deliveryBoy').length,
    regularUsers: users.filter(user => user.role === 'user').length
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-gray-600">Manage all platform users and their permissions</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add User
            </button>
            <button 
              onClick={exportUsers}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            {selectedUsers.length > 0 && (
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Total Users</h3>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Active</h3>
            <p className="text-xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Inactive</h3>
            <p className="text-xl font-bold text-yellow-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Blocked</h3>
            <p className="text-xl font-bold text-red-600">{stats.blocked}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Admins</h3>
            <p className="text-xl font-bold text-red-600">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Owners</h3>
            <p className="text-xl font-bold text-yellow-600">{stats.owners}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Delivery</h3>
            <p className="text-xl font-bold text-blue-600">{stats.deliveryBoys}</p>
          </div>
          <div className="bg-white rounded-lg border p-3">
            <h3 className="text-xs font-medium text-gray-600">Users</h3>
            <p className="text-xl font-bold text-gray-600">{stats.regularUsers}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <input 
              type="text" 
              placeholder="Search name, email, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
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
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="fullName">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="role">Sort by Role</option>
            </select>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="bg-white rounded-lg border">
          {/* Header with Bulk Select */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length} users selected`
                  : `${filteredUsers.length} users total`
                }
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : currentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {currentUsers.map((user) => (
                <div key={user._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="absolute top-2 left-2 rounded border-gray-300"
                    />
                    
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 mt-4 text-lg font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-semibold truncate cursor-pointer" onClick={() => openDetailsModal(user)}>
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.mobile}</p>
                      
                      <div className="flex gap-2 justify-center mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status || 'active')}`}>
                          {user.status || 'active'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        Joined: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t p-3 bg-gray-50">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <div className="relative">
                        <select
                          value={user.status || 'active'}
                          onChange={(e) => handleStatusChange(user, e.target.value)}
                          className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsPasswordResetModalOpen(true);
                        }}
                        className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
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
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else {
                    if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === pageNum 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
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

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          {formErrors.general && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.general}</div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter email"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.mobile ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter mobile number"
              />
              {formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.role ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.password ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
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
              {submitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          {formErrors.general && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.general}</div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter email"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.mobile ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter mobile number"
              />
              {formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formErrors.role ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
                setSelectedUser(null);
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
              {submitting ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* User Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full text-2xl font-bold">
                {selectedUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedUser.fullName}</h3>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status || 'active')}`}>
                    {selectedUser.status || 'active'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
              <p className="text-sm text-gray-600">Mobile: {selectedUser.mobile}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Account Information</h4>
              <p className="text-sm text-gray-600">User ID: {selectedUser._id}</p>
              <p className="text-sm text-gray-600">Created: {formatDate(selectedUser.createdAt)}</p>
              <p className="text-sm text-gray-600">Last Updated: {formatDate(selectedUser.updatedAt)}</p>
            </div>

            {selectedUser.location && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-gray-600">
                  Coordinates: {selectedUser.location.coordinates?.[1]}, {selectedUser.location.coordinates?.[0]}
                </p>
                <p className="text-sm text-gray-600">
                  Online Status: {selectedUser.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Password Reset Modal */}
      <Modal 
        isOpen={isPasswordResetModalOpen} 
        onClose={() => {
          setIsPasswordResetModalOpen(false);
          setSelectedUser(null);
          setNewPassword("");
          setConfirmNewPassword("");
        }}
        title="Reset Password"
      >
        <div className="space-y-4">
          <p>Reset password for <strong>{selectedUser?.fullName}</strong></p>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={() => {
                setIsPasswordResetModalOpen(false);
                setSelectedUser(null);
                setNewPassword("");
                setConfirmNewPassword("");
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handlePasswordReset}
              disabled={passwordResetLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {passwordResetLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete user <strong>{selectedUser?.fullName}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        title="Confirm Bulk Deletion"
      >
        <p>Are you sure you want to delete <strong>{selectedUsers.length}</strong> selected users? This action cannot be undone.</p>
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

export default AdminUsers;
