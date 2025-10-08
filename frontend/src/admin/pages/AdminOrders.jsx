import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import Modal from "../components/Modal";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [selectedShopOrder, setSelectedShopOrder] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // You'll need to create this endpoint in your backend
      const { data } = await axios.get(`${serverUrl}/api/admin/orders`, {
        withCredentials: true,
      });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusUpdate = (order, shopOrder) => {
    setSelectedOrder(order);
    setSelectedShopOrder(shopOrder);
    setNewStatus(shopOrder.status);
    setIsUpdateStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrder || !selectedShopOrder) return;
    try {
      await axios.post(
        `${serverUrl}/api/order/update-status/${selectedOrder._id}/${selectedShopOrder.shop._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order._id === selectedOrder._id) {
          const updatedShopOrders = order.shopOrders.map(so => 
            so._id === selectedShopOrder._id ? { ...so, status: newStatus } : so
          );
          return { ...order, shopOrders: updatedShopOrders };
        }
        return order;
      });
      setOrders(updatedOrders);
      
      setIsUpdateStatusModalOpen(false);
      setSelectedOrder(null);
      setSelectedShopOrder(null);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  // Filtering and searching logic
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = !searchTerm || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment = !paymentFilter || order.paymentMethod === paymentFilter;
      
      const matchesDate = !dateFilter || 
        new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString();

      const matchesStatus = !statusFilter || 
        order.shopOrders.some(so => so.status === statusFilter);

      return matchesSearch && matchesPayment && matchesDate && matchesStatus;
    });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'out of delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order Management</h2>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
            <p className="text-2xl font-bold text-green-600">
              {filteredOrders.filter(order => 
                order.shopOrders.every(so => so.status === 'delivered')
              ).length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredOrders.filter(order => 
                order.shopOrders.some(so => so.status === 'pending')
              ).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out of delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Payments</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Total Amount</th>
                <th className="px-4 py-3 font-semibold">Payment Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading orders...</td></tr>
              ) : currentOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No orders found</td></tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{order.user?.fullName}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentMethod === 'online' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {order.shopOrders.map((shopOrder, idx) => (
                          <span 
                            key={idx}
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shopOrder.status)}`}
                          >
                            {shopOrder.status}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
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

      {/* Order Details Modal */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Order Info */}
              <div className="border-b pb-4">
                <h4 className="font-semibold">Order #{selectedOrder._id.slice(-8)}</h4>
                <p className="text-sm text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
                <p className="text-sm text-gray-600">Customer: {selectedOrder.user?.fullName}</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
              </div>

              {/* Delivery Address */}
              <div className="border-b pb-4">
                <h5 className="font-semibold mb-2">Delivery Address</h5>
                <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress?.text}</p>
              </div>

              {/* Shop Orders */}
              <div>
                <h5 className="font-semibold mb-2">Items</h5>
                {selectedOrder.shopOrders?.map((shopOrder, idx) => (
                  <div key={idx} className="border rounded-md p-3 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-medium">{shopOrder.shop?.name}</h6>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shopOrder.status)}`}>
                          {shopOrder.status}
                        </span>
                        <button 
                          onClick={() => handleStatusUpdate(selectedOrder, shopOrder)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {shopOrder.shopOrderItems?.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>{formatCurrency(shopOrder.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal 
        isOpen={isUpdateStatusModalOpen} 
        onClose={() => setIsUpdateStatusModalOpen(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <p>Update status for shop: <strong>{selectedShopOrder?.shop?.name}</strong></p>
          <select 
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out of delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsUpdateStatusModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminOrders;
