// // frontend/src/pages/dashboard/crm/CRMDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Users,
//   Calendar,
//   TrendingUp,
//   PhoneCall,
//   MessageSquare,
//   Mail,
//   Plus,
//   ArrowRight,
//   Clock,
//   CheckCircle
// } from 'lucide-react';
// import Card from '../../../Components/ui/Card';
// import Button from '../../../Components/ui/Button';
// import StatCard from '../../../Components/ui/StatCard';
// import customerService from '../../../services/customer';
// import { formatDate, formatPhone } from '../../../utils/helpers';
// import toast from 'react-hot-toast';

// const CRMDashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     total_customers: 0,
//     new_this_month: 0,
//     active_customers: 0,
//     total_appointments: 0,
//     upcoming_appointments: 0,
//     completed_appointments: 0,
//     total_interactions: 0,
//     avg_response_time: 0
//   });
//   const [recentCustomers, setRecentCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [statsData, customersData] = await Promise.all([
//         customerService.getStats(),
//         customerService.getAll({ page: 1, limit: 5, sort_by: 'created_at', sort_order: 'desc' })
//       ]);

//       setStats(statsData);
//       setRecentCustomers(customersData.customers || []);
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-2">
//             <Users className="h-7 w-7 text-[#f2070d]" />
//             CRM Dashboard
//           </h1>
//           <p className="text-sm text-[#666666] mt-1">
//             Overview of your customer relationships and interactions
//           </p>
//         </div>

//         <Button
//           onClick={() => navigate('/dashboard/crm/customers/new')}
//           className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#FF5555] text-white"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add Customer
//         </Button>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Customers"
//           value={stats.total_customers}
//           icon={Users}
//           trend={{ value: stats.new_this_month, isPositive: true }}
//           trendLabel="new this month"
//           gradient="from-[#f2070d] to-[#FF6B6B]"
//           onClick={() => navigate('/dashboard/crm/customers')}
//         />
//         <StatCard
//           title="Active Customers"
//           value={stats.active_customers}
//           icon={CheckCircle}
//           gradient="from-[#10B981] to-[#059669]"
//           onClick={() => navigate('/dashboard/crm/customers')}
//         />
//         <StatCard
//           title="Total Appointments"
//           value={stats.total_appointments}
//           icon={Calendar}
//           trend={{ value: stats.upcoming_appointments, isPositive: true }}
//           trendLabel="upcoming"
//           gradient="from-[#3B82F6] to-[#2563EB]"
//           onClick={() => navigate('/dashboard/crm/appointments')}
//         />
//         <StatCard
//           title="Total Interactions"
//           value={stats.total_interactions}
//           icon={MessageSquare}
//           gradient="from-[#2C2C2C] to-[#666666]"
//         />
//       </div>

//       {/* Quick Actions */}
//       <Card className="p-6 border-2 border-[#F0F0F0]">
//         <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => navigate('/dashboard/crm/customers')}
//             className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-lg hover:border-[#f2070d] hover:bg-[#FFF5F5] transition-all group"
//           >
//             <div className="p-3 bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] rounded-lg group-hover:scale-110 transition-transform">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//             <div className="text-left flex-1">
//               <div className="font-semibold text-[#2C2C2C]">View All Customers</div>
//               <div className="text-sm text-[#666666]">Manage customer records</div>
//             </div>
//             <ArrowRight className="h-5 w-5 text-[#666666] group-hover:text-[#f2070d]" />
//           </button>

//           <button
//             onClick={() => navigate('/dashboard/crm/appointments')}
//             className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-lg hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all group"
//           >
//             <div className="p-3 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg group-hover:scale-110 transition-transform">
//               <Calendar className="h-6 w-6 text-white" />
//             </div>
//             <div className="text-left flex-1">
//               <div className="font-semibold text-[#2C2C2C]">View Appointments</div>
//               <div className="text-sm text-[#666666]">Manage schedules</div>
//             </div>
//             <ArrowRight className="h-5 w-5 text-[#666666] group-hover:text-[#3B82F6]" />
//           </button>

//           <button
//             onClick={() => navigate('/dashboard/calls/history')}
//             className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-lg hover:border-[#10B981] hover:bg-[#ECFDF5] transition-all group"
//           >
//             <div className="p-3 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg group-hover:scale-110 transition-transform">
//               <PhoneCall className="h-6 w-6 text-white" />
//             </div>
//             <div className="text-left flex-1">
//               <div className="font-semibold text-[#2C2C2C]">Call History</div>
//               <div className="text-sm text-[#666666]">Review interactions</div>
//             </div>
//             <ArrowRight className="h-5 w-5 text-[#666666] group-hover:text-[#10B981]" />
//           </button>
//         </div>
//       </Card>

//       {/* Recent Customers */}
//       <Card className="p-6 border-2 border-[#F0F0F0]">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-[#2C2C2C]">Recent Customers</h2>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate('/dashboard/crm/customers')}
//             className="border-[#E0E0E0]"
//           >
//             View All
//           </Button>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2070d]"></div>
//           </div>
//         ) : recentCustomers.length > 0 ? (
//           <div className="space-y-3">
//             {recentCustomers.map((customer) => (
//               <div
//                 key={customer.id}
//                 onClick={() => navigate(`/dashboard/crm/customers/${customer.id}`)}
//                 className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg hover:border-[#f2070d] hover:bg-[#FFF5F5] transition-all cursor-pointer group"
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] flex items-center justify-center text-white font-semibold text-lg">
//                     {customer.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="font-semibold text-[#2C2C2C] truncate">
//                       {customer.name}
//                     </div>
//                     <div className="text-sm text-[#666666] flex items-center gap-4">
//                       <span className="flex items-center gap-1">
//                         <Mail className="h-3 w-3" />
//                         {customer.email}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <PhoneCall className="h-3 w-3" />
//                         {formatPhone(customer.phone)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-[#666666] flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     {formatDate(customer.created_at)}
//                   </div>
//                   <div className="text-xs text-[#999999] mt-1">
//                     {customer.total_appointments || 0} appointments
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <Users className="h-12 w-12 text-[#999999] mx-auto mb-4" />
//             <p className="text-[#999999]">No customers yet</p>
//             <Button
//               onClick={() => navigate('/dashboard/crm/customers/new')}
//               className="mt-4 bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Your First Customer
//             </Button>
//           </div>
//         )}
//       </Card>

//       {/* Activity Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-[#EFF6FF] rounded-lg">
//               <Calendar className="h-6 w-6 text-[#3B82F6]" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-[#2C2C2C]">
//                 {stats.upcoming_appointments}
//               </div>
//               <div className="text-sm text-[#666666]">Upcoming Appointments</div>
//             </div>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate('/dashboard/crm/appointments')}
//             className="w-full border-[#E0E0E0]"
//           >
//             View Schedule
//           </Button>
//         </Card>

//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-[#ECFDF5] rounded-lg">
//               <CheckCircle className="h-6 w-6 text-[#10B981]" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-[#2C2C2C]">
//                 {stats.completed_appointments}
//               </div>
//               <div className="text-sm text-[#666666]">Completed This Month</div>
//             </div>
//           </div>
//           <div className="text-xs text-[#10B981] font-medium">
//             ↑ {Math.round((stats.completed_appointments / (stats.total_appointments || 1)) * 100)}% completion rate
//           </div>
//         </Card>

//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-[#FFF7ED] rounded-lg">
//               <Clock className="h-6 w-6 text-[#F59E0B]" />
//             </div>
//             <div>
//               <div className="text-2xl font-bold text-[#2C2C2C]">
//                 {stats.avg_response_time || 0}m
//               </div>
//               <div className="text-sm text-[#666666]">Avg Response Time</div>
//             </div>
//           </div>
//           <div className="text-xs text-[#666666]">
//             Across all communication channels
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CRMDashboard;


// frontend/src/pages/dashboard/crm/CRMDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  TrendingUp,
  PhoneCall,
  MessageSquare,
  Mail,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import StatCard from '../../../Components/ui/StatCard';
import customerService from '../../../services/customer';
import { formatDate, formatPhone } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const CRMDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_customers: 0,
    new_this_month: 0,
    active_customers: 0,
    total_appointments: 0,
    upcoming_appointments: 0,
    completed_appointments: 0,
    total_interactions: 0,
    avg_response_time: 0
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, customersData] = await Promise.all([
        customerService.getStats(),
        customerService.getAll({ page: 1, limit: 5, sort_by: 'created_at', sort_order: 'desc' })
      ]);

      setStats(statsData);
      setRecentCustomers(customersData.customers || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-2">
            <Users className="h-7 w-7 text-[#f2070d]" />
            CRM Dashboard
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            Overview of your customer relationships and interactions
          </p>
        </div>

        <Button
          onClick={() => navigate('/dashboard/crm/customers/new')}
          className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#FF5555] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
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
          onClick={() => navigate('/dashboard/crm/customers')}
        />
        <StatCard
          title="Active Customers"
          value={stats.active_customers}
          icon={CheckCircle}
          gradient="from-[#10B981] to-[#059669]"
          onClick={() => navigate('/dashboard/crm/customers')}
        />
        <StatCard
          title="Total Appointments"
          value={stats.total_appointments}
          icon={Calendar}
          trend={{ value: stats.upcoming_appointments, isPositive: true }}
          trendLabel="upcoming"
          gradient="from-[#3B82F6] to-[#2563EB]"
          onClick={() => navigate('/dashboard/crm/appointments')}
        />
        <StatCard
          title="Total Interactions"
          value={stats.total_interactions}
          icon={MessageSquare}
          gradient="from-[#2C2C2C] to-[#666666]"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-2 border-[#F0F0F0]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard/crm/customers')}
            className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-lg hover:border-[#f2070d] hover:bg-[#FFF5F5] transition-all group"
          >
            <div className="p-3 bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] rounded-lg group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-[#2C2C2C]">View All Customers</div>
              <div className="text-sm text-[#666666]">Manage customer records</div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#666666] group-hover:text-[#f2070d]" />
          </button>

          <button
            onClick={() => navigate('/dashboard/calls/history')}
            className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-lg hover:border-[#10B981] hover:bg-[#ECFDF5] transition-all group"
          >
            <div className="p-3 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg group-hover:scale-110 transition-transform">
              <PhoneCall className="h-6 w-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-[#2C2C2C]">Call History</div>
              <div className="text-sm text-[#666666]">Review interactions</div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#666666] group-hover:text-[#10B981]" />
          </button>
        </div>
      </Card>

      {/* Recent Customers */}
      <Card className="p-6 border-2 border-[#F0F0F0]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2C2C2C]">Recent Customers</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/crm/customers')}
            className="border-[#E0E0E0]"
          >
            View All
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2070d]"></div>
          </div>
        ) : recentCustomers.length > 0 ? (
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => navigate(`/dashboard/crm/customers/${customer.id}`)}
                className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg hover:border-[#f2070d] hover:bg-[#FFF5F5] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] flex items-center justify-center text-white font-semibold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#2C2C2C] truncate">
                      {customer.name}
                    </div>
                    <div className="text-sm text-[#666666] flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <PhoneCall className="h-3 w-3" />
                        {formatPhone(customer.phone)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#666666] flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(customer.created_at)}
                  </div>
                  <div className="text-xs text-[#999999] mt-1">
                    {customer.total_appointments || 0} appointments
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-[#999999] mx-auto mb-4" />
            <p className="text-[#999999]">No customers yet</p>
            <Button
              onClick={() => navigate('/dashboard/crm/customers/new')}
              className="mt-4 bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Customer
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CRMDashboard;