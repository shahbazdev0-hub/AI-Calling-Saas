
// // frontend/src/Pages/dashboard/admin/AdminPanel.jsx
// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { 
//   Users, 
//   TrendingUp, 
//   DollarSign, 
//   Activity, 
//   AlertCircle, 
//   RefreshCw,
//   Shield,
//   Settings,
//   BarChart3,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ArrowUpRight,
//   ArrowDownRight,
//   AlertTriangle
// } from "lucide-react"
// import Card from "../../../Components/ui/Card"
// import Button from "../../../Components/ui/Button"
// import { useAuth } from "../../../hooks/useAuth"
// import { formatDate, formatCurrency } from "../../../utils/helpers"
// import toast from "react-hot-toast"

// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const AdminPanel = () => {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     totalRevenue: 0,
//     systemStatus: 'operational'
//   })

//   useEffect(() => {
//     fetchAdminData()
//   }, [])

//   const getAuthHeaders = () => {
//     const tokenFromCookie = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('access_token='))
//       ?.split('=')[1]
    
//     const tokenFromLocalStorage = localStorage.getItem('access_token')
//     const tokenFromSessionStorage = sessionStorage.getItem('access_token')
    
//     const token = tokenFromCookie || tokenFromLocalStorage || tokenFromSessionStorage
    
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }

//   const fetchAdminData = async () => {
//     try {
//       setLoading(true)
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/admin/users?limit=100&skip=0`, {
//         method: 'GET',
//         headers: headers
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         const users = Array.isArray(data) ? data : data.users || []
        
//         setStats({
//           totalUsers: users.length,
//           activeUsers: users.filter(u => u.is_active).length,
//           totalRevenue: users.length * 99,
//           systemStatus: 'operational'
//         })
//       }
//     } catch (error) {
//       console.error('Failed to fetch admin data:', error)
//       toast.error('Failed to load admin data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const refreshData = async () => {
//     setRefreshing(true)
//     await fetchAdminData()
//     setRefreshing(false)
//     toast.success('Data refreshed successfully')
//   }

//   const adminCards = [
//     {
//       title: 'Total Users',
//       value: stats.totalUsers,
//       icon: Users,
//       change: '+12%',
//       changeType: 'positive',
//       color: 'blue',
//       href: '/dashboard/admin/users'
//     },
//     {
//       title: 'Active Users',
//       value: stats.activeUsers,
//       icon: Activity,
//       change: '+8%',
//       changeType: 'positive',
//       color: 'green',
//       href: '/dashboard/admin/users'
//     },
//     {
//       title: 'Revenue',
//       value: formatCurrency(stats.totalRevenue),
//       icon: DollarSign,
//       change: '+23%',
//       changeType: 'positive',
//       color: 'purple',
//       href: '/dashboard/admin'
//     },
//     {
//       title: 'System Status',
//       value: stats.systemStatus === 'operational' ? 'Operational' : 'Issues',
//       icon: Shield,
//       change: stats.systemStatus === 'operational' ? 'Healthy' : 'Warning',
//       changeType: stats.systemStatus === 'operational' ? 'positive' : 'negative',
//       color: stats.systemStatus === 'operational' ? 'green' : 'red',
//       href: '/dashboard/admin/settings'
//     }
//   ]

//   const getStatusBadge = (severity) => {
//     const badges = {
//       'high': 'bg-red-100 text-red-800',
//       'medium': 'bg-yellow-100 text-yellow-800',
//       'low': 'bg-green-100 text-green-800'
//     }
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[severity] || badges.low}`}>
//         {severity.charAt(0).toUpperCase() + severity.slice(1)}
//       </span>
//     )
//   }

//   if (!user || !user.is_admin) {
//     return (
//       <div className="text-center py-12">
//         <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//         <p className="text-gray-600">You don't have permission to access the admin panel.</p>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//         <span className="ml-2 text-gray-600">Loading admin data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
//           <p className="mt-1 text-xs sm:text-sm text-gray-500">
//             System overview and administrative controls
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//           <Button 
//             variant="outline" 
//             size="medium"
//             onClick={refreshData}
//             disabled={refreshing}
//             className="w-full sm:w-auto"
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Admin Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         {adminCards.map((card, index) => (
//           <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
//             <Link to={card.href} className="block p-4 sm:p-6">
//               <div className="flex items-center">
//                 <div className="flex-1">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
//                   <div className="flex items-center mt-2">
//                     {card.changeType === 'positive' && (
//                       <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
//                     )}
//                     {card.changeType === 'negative' && (
//                       <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
//                     )}
//                     <span className={`text-xs sm:text-sm font-medium ${
//                       card.changeType === 'positive' 
//                         ? 'text-green-600' 
//                         : card.changeType === 'negative' 
//                         ? 'text-red-600' 
//                         : 'text-gray-600'
//                     }`}>
//                       {card.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div className={`p-2 sm:p-3 bg-${card.color}-100 rounded-lg ml-2 sm:ml-4`}>
//                   <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${card.color}-600`} />
//                 </div>
//               </div>
//             </Link>
//           </Card>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin/users" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Management</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
//               </div>
//             </div>
//           </Link>
//         </Card>

//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin/settings" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Settings</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure system preferences</p>
//               </div>
//             </div>
//           </Link>
//         </Card>

//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">Analytics</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">View system analytics and reports</p>
//               </div>
//             </div>
//           </Link>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         <Card className="p-4 sm:p-6">
//           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h2>
//           <div className="space-y-3 sm:space-y-4">
//             {[
//               { user: 'John Smith', action: 'Registered', time: '2 hours ago', status: 'success' },
//               { user: 'Sarah Johnson', action: 'Updated profile', time: '4 hours ago', status: 'info' },
//               { user: 'Mike Wilson', action: 'Login failed', time: '6 hours ago', status: 'warning' },
//               { user: 'Lisa Davis', action: 'Subscription upgraded', time: '8 hours ago', status: 'success' }
//             ].map((activity, index) => (
//               <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
//                 <div className="flex items-center flex-1 min-w-0">
//                   <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
//                     activity.status === 'success' ? 'bg-green-500' :
//                     activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
//                   }`}></div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.user}</p>
//                     <p className="text-xs text-gray-500">{activity.action}</p>
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         <Card className="p-4 sm:p-6">
//           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
//           <div className="space-y-3 sm:space-y-4">
//             {[
//               { message: 'Database backup completed', severity: 'low', time: '1 hour ago' },
//               { message: 'Server maintenance scheduled', severity: 'medium', time: '3 hours ago' },
//               { message: 'High API usage detected', severity: 'medium', time: '5 hours ago' },
//               { message: 'All systems operational', severity: 'low', time: '12 hours ago' }
//             ].map((alert, index) => (
//               <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 space-y-2 sm:space-y-0">
//                 <div className="flex items-start sm:items-center flex-1">
//                   <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0 ${
//                     alert.severity === 'high' ? 'text-red-500' :
//                     alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
//                   }`} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs sm:text-sm text-gray-900">{alert.message}</p>
//                     <p className="text-xs text-gray-400 mt-1 sm:hidden">{alert.time}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 sm:ml-4">
//                   {getStatusBadge(alert.severity)}
//                   <span className="hidden sm:inline text-xs text-gray-400">{alert.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* System Health */}
//       <Card className="p-4 sm:p-6">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Health</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[
//             { label: 'CPU Usage', value: '45%', status: 'good', icon: Activity },
//             { label: 'Memory', value: '62%', status: 'good', icon: BarChart3 },
//             { label: 'Disk Space', value: '78%', status: 'warning', icon: Settings },
//             { label: 'API Response', value: '120ms', status: 'good', icon: Clock }
//           ].map((metric, index) => (
//             <div key={index} className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg">
//               <div className={`p-2 rounded-lg mr-3 ${
//                 metric.status === 'good' ? 'bg-green-100' : 'bg-yellow-100'
//               }`}>
//                 <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
//                   metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'
//                 }`} />
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-600">{metric.label}</p>
//                 <p className="text-base sm:text-lg font-bold text-gray-900">{metric.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default AdminPanel




// // frontend/src/Pages/dashboard/admin/AdminPanel.jsx - FIXED VERSION for anlytics page set 

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { 
//   Users, 
//   TrendingUp, 
//   DollarSign, 
//   Activity, 
//   AlertCircle, 
//   RefreshCw,
//   Shield,
//   Settings,
//   BarChart3,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ArrowUpRight,
//   ArrowDownRight,
//   AlertTriangle
// } from "lucide-react"
// import Card from "../../../Components/ui/Card"
// import Button from "../../../Components/ui/Button"
// import { useAuth } from "../../../hooks/useAuth"
// import { formatDate, formatCurrency } from "../../../utils/helpers"
// import toast from "react-hot-toast"

// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const AdminPanel = () => {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     totalRevenue: 0,
//     systemStatus: 'operational'
//   })

//   useEffect(() => {
//     fetchAdminData()
//   }, [])

//   const getAuthHeaders = () => {
//     const tokenFromCookie = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('access_token='))
//       ?.split('=')[1]
    
//     const tokenFromLocalStorage = localStorage.getItem('access_token')
//     const tokenFromSessionStorage = sessionStorage.getItem('access_token')
    
//     const token = tokenFromCookie || tokenFromLocalStorage || tokenFromSessionStorage
    
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }

//   const fetchAdminData = async () => {
//     try {
//       setLoading(true)
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/admin/users?limit=100&skip=0`, {
//         method: 'GET',
//         headers: headers
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         const users = Array.isArray(data) ? data : data.users || []
        
//         setStats({
//           totalUsers: users.length,
//           activeUsers: users.filter(u => u.is_active).length,
//           totalRevenue: users.length * 99,
//           systemStatus: 'operational'
//         })
//       }
//     } catch (error) {
//       console.error('Failed to fetch admin data:', error)
//       toast.error('Failed to load admin data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const refreshData = async () => {
//     setRefreshing(true)
//     await fetchAdminData()
//     setRefreshing(false)
//     toast.success('Data refreshed successfully')
//   }

//   const adminCards = [
//     {
//       title: 'Total Users',
//       value: stats.totalUsers,
//       icon: Users,
//       change: '+12%',
//       changeType: 'positive',
//       color: 'blue',
//       href: '/dashboard/admin/users'
//     },
//     {
//       title: 'Active Users',
//       value: stats.activeUsers,
//       icon: Activity,
//       change: '+8%',
//       changeType: 'positive',
//       color: 'green',
//       href: '/dashboard/admin/users'
//     },
//     {
//       title: 'Revenue',
//       value: formatCurrency(stats.totalRevenue),
//       icon: DollarSign,
//       change: '+23%',
//       changeType: 'positive',
//       color: 'purple',
//       href: '/dashboard/admin'
//     },
//     {
//       title: 'System Status',
//       value: stats.systemStatus === 'operational' ? 'Operational' : 'Issues',
//       icon: Shield,
//       change: stats.systemStatus === 'operational' ? 'Healthy' : 'Warning',
//       changeType: stats.systemStatus === 'operational' ? 'positive' : 'negative',
//       color: stats.systemStatus === 'operational' ? 'green' : 'red',
//       href: '/dashboard/admin/settings'
//     }
//   ]

//   const getStatusBadge = (severity) => {
//     const badges = {
//       'high': 'bg-red-100 text-red-800',
//       'medium': 'bg-yellow-100 text-yellow-800',
//       'low': 'bg-green-100 text-green-800'
//     }
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[severity] || badges.low}`}>
//         {severity.charAt(0).toUpperCase() + severity.slice(1)}
//       </span>
//     )
//   }

//   if (!user || !user.is_admin) {
//     return (
//       <div className="text-center py-12">
//         <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//         <p className="text-gray-600">You don't have permission to access the admin panel.</p>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//         <span className="ml-2 text-gray-600">Loading admin data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
//           <p className="mt-1 text-xs sm:text-sm text-gray-500">
//             System overview and administrative controls
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//           <Button 
//             variant="outline" 
//             size="medium"
//             onClick={refreshData}
//             disabled={refreshing}
//             className="w-full sm:w-auto"
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Admin Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         {adminCards.map((card, index) => (
//           <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
//             <Link to={card.href} className="block p-4 sm:p-6">
//               <div className="flex items-center">
//                 <div className="flex-1">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
//                   <div className="flex items-center mt-2">
//                     {card.changeType === 'positive' && (
//                       <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
//                     )}
//                     {card.changeType === 'negative' && (
//                       <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
//                     )}
//                     <span className={`text-xs sm:text-sm font-medium ${
//                       card.changeType === 'positive' 
//                         ? 'text-green-600' 
//                         : card.changeType === 'negative' 
//                         ? 'text-red-600' 
//                         : 'text-gray-600'
//                     }`}>
//                       {card.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div className={`p-2 sm:p-3 bg-${card.color}-100 rounded-lg ml-2 sm:ml-4`}>
//                   <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${card.color}-600`} />
//                 </div>
//               </div>
//             </Link>
//           </Card>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin/users" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Management</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
//               </div>
//             </div>
//           </Link>
//         </Card>

//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin/settings" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Settings</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure system preferences</p>
//               </div>
//             </div>
//           </Link>
//         </Card>

//         {/* ✅✅✅ FIXED: Changed from /dashboard/admin to /dashboard/admin/analytics ✅✅✅ */}
//         <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
//           <Link to="/dashboard/admin/analytics" className="block">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">Analytics</h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">View system analytics and reports</p>
//               </div>
//             </div>
//           </Link>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         <Card className="p-4 sm:p-6">
//           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h2>
//           <div className="space-y-3 sm:space-y-4">
//             {[
//               { user: 'John Smith', action: 'Registered', time: '2 hours ago', status: 'success' },
//               { user: 'Sarah Johnson', action: 'Updated profile', time: '4 hours ago', status: 'info' },
//               { user: 'Mike Wilson', action: 'Login failed', time: '6 hours ago', status: 'warning' },
//               { user: 'Lisa Davis', action: 'Subscription upgraded', time: '8 hours ago', status: 'success' }
//             ].map((activity, index) => (
//               <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
//                 <div className="flex items-center flex-1 min-w-0">
//                   <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
//                     activity.status === 'success' ? 'bg-green-500' :
//                     activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
//                   }`}></div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.user}</p>
//                     <p className="text-xs text-gray-500">{activity.action}</p>
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         <Card className="p-4 sm:p-6">
//           <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
//           <div className="space-y-3 sm:space-y-4">
//             {[
//               { message: 'Database backup completed', severity: 'low', time: '1 hour ago' },
//               { message: 'Server maintenance scheduled', severity: 'medium', time: '3 hours ago' },
//               { message: 'High API usage detected', severity: 'medium', time: '5 hours ago' },
//               { message: 'All systems operational', severity: 'low', time: '12 hours ago' }
//             ].map((alert, index) => (
//               <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 space-y-2 sm:space-y-0">
//                 <div className="flex items-start sm:items-center flex-1">
//                   <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0 ${
//                     alert.severity === 'high' ? 'text-red-500' :
//                     alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
//                   }`} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs sm:text-sm text-gray-900">{alert.message}</p>
//                     <p className="text-xs text-gray-400 mt-1 sm:hidden">{alert.time}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 sm:ml-4">
//                   {getStatusBadge(alert.severity)}
//                   <span className="hidden sm:inline text-xs text-gray-400">{alert.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* System Health */}
//       <Card className="p-4 sm:p-6">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Health</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[
//             { label: 'CPU Usage', value: '45%', status: 'good', icon: Activity },
//             { label: 'Memory', value: '62%', status: 'good', icon: BarChart3 },
//             { label: 'Disk Space', value: '78%', status: 'warning', icon: Settings },
//             { label: 'API Response', value: '120ms', status: 'good', icon: Clock }
//           ].map((metric, index) => (
//             <div key={index} className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg">
//               <div className={`p-2 rounded-lg mr-3 ${
//                 metric.status === 'good' ? 'bg-green-100' : 'bg-yellow-100'
//               }`}>
//                 <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
//                   metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'
//                 }`} />
//               </div>
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-600">{metric.label}</p>
//                 <p className="text-base sm:text-lg font-bold text-gray-900">{metric.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default AdminPanel




// frontend/src/Pages/dashboard/admin/AdminPanel.jsx - UPDATED UI WITH NEW COLOR SCHEME

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  AlertCircle, 
  RefreshCw,
  Shield,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle
} from "lucide-react"
import Card from "../../../Components/ui/Card"
import Button from "../../../Components/ui/Button"
import { useAuth } from "../../../hooks/useAuth"
import { formatDate, formatCurrency } from "../../../utils/helpers"
import toast from "react-hot-toast"

const API_BASE_URL = 'http://localhost:8000/api/v1'

const AdminPanel = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    systemStatus: 'operational'
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const getAuthHeaders = () => {
    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1]
    
    const tokenFromLocalStorage = localStorage.getItem('access_token')
    const tokenFromSessionStorage = sessionStorage.getItem('access_token')
    
    const token = tokenFromCookie || tokenFromLocalStorage || tokenFromSessionStorage
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=100&skip=0`, {
        method: 'GET',
        headers: headers
      })
      
      if (response.ok) {
        const data = await response.json()
        const users = Array.isArray(data) ? data : data.users || []
        
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(u => u.is_active).length,
          totalRevenue: users.length * 99,
          systemStatus: 'operational'
        })
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchAdminData()
    setRefreshing(false)
    toast.success('Data refreshed successfully')
  }

  const adminCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'positive',
      gradient: 'from-[#f2070d] to-[#FF6B6B]',
      href: '/dashboard/admin/users'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      change: '+8%',
      changeType: 'positive',
      gradient: 'from-[#2C2C2C] to-[#666666]',
      href: '/dashboard/admin/users'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: '+23%',
      changeType: 'positive',
      gradient: 'from-[#FF6B6B] to-[#f2070d]',
      href: '/dashboard/admin'
    },
    {
      title: 'System Status',
      value: stats.systemStatus === 'operational' ? 'Operational' : 'Issues',
      icon: Shield,
      change: stats.systemStatus === 'operational' ? 'Healthy' : 'Warning',
      changeType: stats.systemStatus === 'operational' ? 'positive' : 'negative',
      gradient: stats.systemStatus === 'operational' ? 'from-[#2C2C2C] to-[#666666]' : 'from-[#f2070d] to-[#FF6B6B]',
      href: '/dashboard/admin/settings'
    }
  ]

  const getStatusBadge = (severity) => {
    const getBadgeStyle = (sev) => {
      if (sev === 'high') {
        return { backgroundColor: '#f2070d', color: '#ffffff' }
      } else if (sev === 'medium') {
        return { backgroundColor: '#FF6B6B', color: '#ffffff' }
      } else {
        return { backgroundColor: '#e5e5e5', color: '#2C2C2C' }
      }
    }
    
    return (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
        style={getBadgeStyle(severity)}
      >
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    )
  }

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-[#f2070d] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Access Denied</h2>
          <p className="text-[#666666]">You don't have permission to access the admin panel.</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-[#f2070d]"></div>
          <span className="ml-3 text-[#666666] font-medium">Loading admin data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C]">Admin Panel</h1>
            <p className="mt-2 text-base sm:text-lg text-[#666666]">
              System overview and administrative controls
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: '#2C2C2C',
                color: '#2C2C2C',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!refreshing) {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 inline ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {adminCards.map((card, index) => (
            <Link key={index} to={card.href}>
              <Card className={`relative overflow-hidden hover:shadow-2xl transition-all border-none bg-gradient-to-br ${card.gradient}`}>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-white/80 uppercase">{card.title}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{card.value}</p>
                      <div className="flex items-center mt-2">
                        {card.changeType === 'positive' && (
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-white mr-1" />
                        )}
                        {card.changeType === 'negative' && (
                          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-white mr-1" />
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {card.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg ml-2 sm:ml-4">
                      <card.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/dashboard/admin/users">
            <Card className="p-4 sm:p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#f2070d]">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">User Management</h3>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">Manage user accounts and permissions</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/admin/settings">
            <Card className="p-4 sm:p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#f2070d]">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#2C2C2C] to-[#666666] rounded-lg">
                  <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">System Settings</h3>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">Configure system preferences</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/admin/analytics">
            <Card className="p-4 sm:p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#f2070d]">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#FF6B6B] to-[#f2070d] rounded-lg">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">Analytics</h3>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">View system analytics and reports</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-xl font-bold text-[#2C2C2C] mb-4">Recent User Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { user: 'John Smith', action: 'Registered', time: '2 hours ago', status: 'success' },
                { user: 'Sarah Johnson', action: 'Updated profile', time: '4 hours ago', status: 'info' },
                { user: 'Mike Wilson', action: 'Login failed', time: '6 hours ago', status: 'warning' },
                { user: 'Lisa Davis', action: 'Subscription upgraded', time: '8 hours ago', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b-2 border-[#e5e5e5] last:border-0">
                  <div className="flex items-center flex-1 min-w-0">
                    <div 
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: activity.status === 'success' ? '#f2070d' :
                          activity.status === 'warning' ? '#FF6B6B' : '#2C2C2C'
                      }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#2C2C2C] truncate">{activity.user}</p>
                      <p className="text-xs text-[#666666]">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#9ca3af] ml-2 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-xl font-bold text-[#2C2C2C] mb-4">System Alerts</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { message: 'Database backup completed', severity: 'low', time: '1 hour ago' },
                { message: 'Server maintenance scheduled', severity: 'medium', time: '3 hours ago' },
                { message: 'High API usage detected', severity: 'medium', time: '5 hours ago' },
                { message: 'All systems operational', severity: 'low', time: '12 hours ago' }
              ].map((alert, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b-2 border-[#e5e5e5] last:border-0 space-y-2 sm:space-y-0">
                  <div className="flex items-start sm:items-center flex-1">
                    <AlertCircle 
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0"
                      style={{
                        color: alert.severity === 'high' ? '#f2070d' :
                          alert.severity === 'medium' ? '#FF6B6B' : '#2C2C2C'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#2C2C2C] font-medium">{alert.message}</p>
                      <p className="text-xs text-[#9ca3af] mt-1 sm:hidden">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:ml-4">
                    {getStatusBadge(alert.severity)}
                    <span className="hidden sm:inline text-xs text-[#9ca3af]">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Health */}
        <Card className="p-4 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-xl font-bold text-[#2C2C2C] mb-4">System Health</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'CPU Usage', value: '45%', status: 'good', icon: Activity },
              { label: 'Memory', value: '62%', status: 'good', icon: BarChart3 },
              { label: 'Disk Space', value: '78%', status: 'warning', icon: Settings },
              { label: 'API Response', value: '120ms', status: 'good', icon: Clock }
            ].map((metric, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 sm:p-4 border-2 rounded-xl"
                style={{
                  borderColor: metric.status === 'good' ? '#e5e5e5' : '#FF6B6B'
                }}
              >
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{
                    backgroundColor: metric.status === 'good' ? '#e5e5e5' : '#FF6B6B'
                  }}
                >
                  <metric.icon 
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{
                      color: metric.status === 'good' ? '#2C2C2C' : '#ffffff'
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium">{metric.label}</p>
                  <p className="text-base sm:text-lg font-bold text-[#2C2C2C]">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminPanel