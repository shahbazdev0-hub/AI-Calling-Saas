// frontend/src/pages/dashboard/crm/Customers.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Tag,
  MoreVertical,
  RefreshCw,
  FileText
} from 'lucide-react';
import Card from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import Modal from '../../../Components/ui/Modal';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import StatCard from '../../../Components/ui/StatCard';
import customerService from '../../../services/customer';
import { formatDate, formatPhone } from '../../../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    total_customers: 0,
    new_this_month: 0,
    active_customers: 0,
    total_appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [currentPage, searchTerm, selectedTags, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        tags: selectedTags.join(','),
        sort_by: sortBy,
        sort_order: sortOrder
      });

      setCustomers(response.customers || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customerService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchCustomers(), fetchStats()]);
    setRefreshing(false);
    toast.success('Customer list refreshed');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/dashboard/crm/customers/${customerId}`);
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/dashboard/crm/customers/${customerId}/edit`);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      await customerService.delete(customerToDelete.id);
      toast.success('Customer deleted successfully');
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      fetchCustomers();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleExport = async () => {
    try {
      toast.loading('Preparing CSV export...');
      const blob = await customerService.exportCSV({
        search: searchTerm,
        tags: selectedTags.join(',')
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Customers exported successfully');
    } catch (error) {
      console.error('Failed to export customers:', error);
      toast.dismiss();
      toast.error('Failed to export customers');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-2">
            <Users className="h-7 w-7 text-[#f2070d]" />
            Customer Management
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            Manage and track all your customers in one place
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => navigate('/dashboard/crm/customers/new')}
            className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#FF5555] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.total_customers}
          icon={Users}
          trend={{ value: stats.new_this_month, isPositive: true }}
          trendLabel="new this month"
          gradient="from-[#f2070d] to-[#FF6B6B]"
        />
        <StatCard
          title="Active Customers"
          value={stats.active_customers}
          icon={Users}
          gradient="from-[#2C2C2C] to-[#666666]"
        />
        <StatCard
          title="Total Appointments"
          value={stats.total_appointments}
          icon={Calendar}
          gradient="from-[#10B981] to-[#059669]"
        />
        <StatCard
          title="Avg. Interactions"
          value={stats.avg_interactions || 0}
          icon={MessageSquare}
          gradient="from-[#3B82F6] to-[#2563EB]"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-2 border-[#F0F0F0]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 border-[#E0E0E0] focus:border-[#f2070d]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#f2070d]"
            >
              <option value="created_at">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="total_appointments">Sort by Appointments</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-[#E0E0E0] rounded-lg hover:bg-[#F0F0F0] transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <Filter className="h-5 w-5 text-[#666666]" />
            </button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d] mx-auto"></div>
          <p className="text-[#666666] mt-4">Loading customers...</p>
        </Card>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description={
            searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first customer'
          }
          action={
            !searchTerm && {
              label: 'Add Customer',
              onClick: () => navigate('/dashboard/crm/customers/new')
            }
          }
        />
      ) : (
        <Card className="overflow-hidden border-2 border-[#F0F0F0]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2C2C2C] to-[#666666] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tags</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Appointments</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Last Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                    onClick={() => handleViewCustomer(customer.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] flex items-center justify-center text-white font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#2C2C2C]">{customer.name}</div>
                          <div className="text-sm text-[#666666]">
                            {customer.company || 'Individual'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#2C2C2C]">
                          <Mail className="h-4 w-4 text-[#666666]" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#2C2C2C]">
                          <Phone className="h-4 w-4 text-[#666666]" />
                          {formatPhone(customer.phone)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags && customer.tags.length > 0 ? (
                          customer.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-[#F0F0F0] text-[#2C2C2C] border border-[#E0E0E0]"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-[#999999]">No tags</span>
                        )}
                        {customer.tags && customer.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-[#F0F0F0] text-[#666666]">
                            +{customer.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#666666]" />
                        <span className="font-semibold text-[#2C2C2C]">
                          {customer.total_appointments || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-[#666666]">
                        {customer.last_contact_at
                          ? formatDate(customer.last_contact_at)
                          : 'Never'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="p-2 hover:bg-[#E0E0E0] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-[#666666]" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer.id)}
                          className="p-2 hover:bg-[#E0E0E0] rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="h-4 w-4 text-[#3B82F6]" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="p-2 hover:bg-[#FFE0E0] rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="h-4 w-4 text-[#f2070d]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-between bg-[#F9F9F9]">
              <div className="text-sm text-[#666666]">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-[#E0E0E0]"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-[#E0E0E0]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCustomerToDelete(null);
        }}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-[#666666]">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-[#2C2C2C]">
              {customerToDelete?.name}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="bg-[#FFF3F3] border border-[#FFE0E0] rounded-lg p-4">
            <p className="text-sm text-[#f2070d] font-medium">
              ⚠️ Warning: This will also delete all associated appointments, call history, and
              interaction records.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setCustomerToDelete(null);
              }}
              className="border-[#E0E0E0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-[#f2070d] hover:bg-[#d10609] text-white"
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;