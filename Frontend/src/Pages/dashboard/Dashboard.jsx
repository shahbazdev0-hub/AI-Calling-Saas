// // pages/dashboard/Dashboard.jsx - UPDATED WITH REAL API DATA (Using Existing Backend Endpoints) milestone 2
// import { useState, useEffect } from "react"
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
// import { 
//   Menu, X, BarChart3, User, Settings, Shield, Users, LogOut, Bell, Search,
//   Phone, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, Activity,
//   PhoneCall, History, FileText, Bot, PieChart, Mic, RefreshCw
// } from "lucide-react"
// import { useAuth } from "../../contexts/AuthContext"
// import toast from "react-hot-toast"

// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const { user, logout, isAdmin } = useAuth()
//   const location = useLocation()
//   const navigate = useNavigate()

//   // State for real dashboard data
//   const [dashboardStats, setDashboardStats] = useState({
//     callsToday: 0,
//     successRate: 0,
//     revenue: 0,
//     totalCalls: 0,
//     activeAgents: 0,
//     avgCallDuration: '0m 0s',
//     conversionRate: 0
//   })
//   const [recentCalls, setRecentCalls] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   const showOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/'

//   useEffect(() => {
//     if (showOverview && !isAdmin) {
//       fetchDashboardData()
//     }
//   }, [location.pathname, isAdmin])

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

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const headers = getAuthHeaders()

//       // ✅ Using existing backend endpoint: GET /api/v1/calls/ (not /calls/history)
//       // This endpoint returns all calls with filters
//       const callsResponse = await fetch(`${API_BASE_URL}/calls/?skip=0&limit=100`, {
//         method: 'GET',
//         headers: headers
//       })

//       if (callsResponse.ok) {
//         const callsData = await callsResponse.json()
//         const calls = Array.isArray(callsData) ? callsData : []

//         console.log(`✅ Fetched ${calls.length} calls from backend`)

//         // Calculate statistics from real data
//         const now = new Date()
//         const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
//         // Calls today - filter by created_at date
//         const callsToday = calls.filter(call => {
//           const callDate = new Date(call.created_at)
//           return callDate >= startOfToday
//         }).length

//         // Total calls
//         const totalCalls = calls.length

//         // Success rate (completed calls / total calls)
//         const completedCalls = calls.filter(call => call.status === 'completed').length
//         const successRate = totalCalls > 0 ? ((completedCalls / totalCalls) * 100).toFixed(1) : 0

//         // Average call duration (in seconds)
//         const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0)
//         const avgDurationSec = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0
//         const avgMinutes = Math.floor(avgDurationSec / 60)
//         const avgSeconds = avgDurationSec % 60
//         const avgCallDuration = `${avgMinutes}m ${avgSeconds}s`

//         // Revenue calculation (example: $2.5 per call today)
//         const revenue = callsToday * 2.5

//         // Active agents (you can fetch this from voice_agents endpoint if needed)
//         const activeAgents = 5 // Placeholder - replace with real data if you have an agents endpoint

//         // Conversion rate (example calculation based on success rate)
//         const conversionRate = (parseFloat(successRate) * 0.25).toFixed(1)

//         setDashboardStats({
//           callsToday,
//           successRate: parseFloat(successRate),
//           revenue,
//           totalCalls,
//           activeAgents,
//           avgCallDuration,
//           conversionRate: parseFloat(conversionRate)
//         })

//         // Get recent calls (last 10, sorted by created_at)
//         const recent = calls
//           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//           .slice(0, 10)
//           .map(call => ({
//             id: call._id || call.id,
//             customer: call.to_number || call.from_number || call.phone_number || 'Unknown',
//             time: formatTime(call.created_at),
//             duration: formatDuration(call.duration || 0),
//             status: call.status || 'unknown',
//             type: determineCallType(call),
//             direction: call.direction || 'outbound'
//           }))

//         setRecentCalls(recent)
//         console.log(`✅ Dashboard stats calculated:`, dashboardStats)

//       } else {
//         console.error('❌ Failed to fetch calls:', callsResponse.status)
//         const errorText = await callsResponse.text()
//         console.error('Error details:', errorText)
//         toast.error('Failed to load dashboard data')
//       }
//     } catch (error) {
//       console.error('❌ Error fetching dashboard data:', error)
//       toast.error('Network error while loading dashboard')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const refreshDashboard = async () => {
//     setRefreshing(true)
//     await fetchDashboardData()
//     setRefreshing(false)
//     toast.success('Dashboard data refreshed')
//   }

//   // Helper function to determine call type
//   const determineCallType = (call) => {
//     // You can customize this logic based on your data
//     if (call.outcome) {
//       return call.outcome
//     }
//     if (call.direction === 'inbound') {
//       return 'support'
//     }
//     return 'sales'
//   }

//   const formatTime = (dateString) => {
//     if (!dateString) return 'N/A'
//     try {
//       const date = new Date(dateString)
//       const hours = date.getHours()
//       const minutes = date.getMinutes()
//       const ampm = hours >= 12 ? 'PM' : 'AM'
//       const displayHours = hours % 12 || 12
//       return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
//     } catch (e) {
//       return 'N/A'
//     }
//   }

//   const formatDuration = (seconds) => {
//     if (!seconds || seconds === 0) return '0:00'
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, '0')}`
//   }

//   const isActive = (href) => {
//     if (location.pathname === href || location.pathname === href + '/') {
//       return true
//     }
    
//     if (href === '/dashboard/admin') {
//       return location.pathname === '/dashboard/admin' || location.pathname === '/dashboard/admin/'
//     }
    
//     return false
//   }

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   const adminNavigation = [
//     { name: 'Admin Panel', href: '/dashboard/admin', icon: Shield },
//     { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
//     { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
//     { name: 'Account Settings', href: '/dashboard/admin/settings', icon: Settings },
//     { name: 'Profile', href: '/dashboard/profile', icon: User },
//   ]

//   const userNavigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
//     { name: 'Profile', href: '/dashboard/profile', icon: User },
//     { name: 'Settings', href: '/dashboard/settings', icon: Settings },
//   ]

//   const callNavigation = [
//     { name: 'Call Center', href: '/dashboard/calls/center', icon: PhoneCall },
//     { name: 'Call History', href: '/dashboard/calls/history', icon: History },
//     { name: 'Call Logs', href: '/dashboard/calls/logs', icon: FileText },
//     { name: 'Voice Agents', href: '/dashboard/calls/agents', icon: Bot },
//     { name: 'Analytics', href: '/dashboard/calls/analytics', icon: PieChart },
//     { name: 'Recordings', href: '/dashboard/calls/recordings', icon: Mic },
//   ]

//   const navigation = isAdmin ? adminNavigation : userNavigation

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
//           onClick={() => setSidebarOpen(false)} 
//         />
//       )}

//       <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//         <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200">
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xs sm:text-sm">CP</span>
//             </div>
//             <span className="text-base sm:text-xl font-bold text-gray-900 truncate">CallCenter Pro</span>
//           </Link>
//           <button 
//             onClick={() => setSidebarOpen(false)} 
//             className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
//           >
//             <X className="h-5 w-5 sm:h-6 sm:w-6" />
//           </button>
//         </div>

//         <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
//           <div className="flex items-center">
//             <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
//             </div>
//             <div className="ml-3 min-w-0 flex-1">
//               <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
//                 {user?.full_name || 'User Name'}
//               </p>
//               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//               {isAdmin && (
//                 <span className="inline-flex px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mt-1">
//                   Admin
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navigation.map((item) => {
//             const Icon = item.icon
//             return (
//               <Link 
//                 key={item.name} 
//                 to={item.href} 
//                 className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg relative overflow-hidden
//                   transition-all duration-300 ease-in-out
//                   ${isActive(item.href)
//                     ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary-700 border-r-2 border-primary-600 shadow-sm'
//                     : 'text-gray-700 hover:text-primary hover:shadow-sm hover:scale-[1.02]'
//                   }
//                   active:scale-[0.97]
//                 `}
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span
//                   className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
//                 ></span>

//                 <span
//                   className={`absolute left-0 top-0 h-full w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300
//                     ${isActive(item.href) ? 'scale-y-100' : ''}
//                   `}
//                 ></span>

//                 <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1" />
//                 <span className="truncate z-10">{item.name}</span>
//               </Link>
//             )
//           })}

//           {!isAdmin && (
//             <>
//               <div className="pt-4 pb-2 px-3">
//                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//                   Call Center
//                 </p>
//               </div>

//               {callNavigation.map((item) => {
//                 const Icon = item.icon
//                 return (
//                   <Link 
//                     key={item.name} 
//                     to={item.href} 
//                     className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg relative overflow-hidden
//                       transition-all duration-300 ease-in-out
//                       ${isActive(item.href)
//                         ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary-700 border-r-2 border-primary-600 shadow-sm'
//                         : 'text-gray-700 hover:text-primary hover:shadow-sm hover:scale-[1.02]'
//                       }
//                       active:scale-[0.97]
//                     `}
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <span
//                       className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
//                     ></span>

//                     <span
//                       className={`absolute left-0 top-0 h-full w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300
//                         ${isActive(item.href) ? 'scale-y-100' : ''}
//                       `}
//                     ></span>

//                     <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1" />
//                     <span className="truncate z-10">{item.name}</span>
//                   </Link>
//                 )
//               })}
//             </>
//           )}
//         </nav>

//         <div className="p-3 sm:p-4 border-t border-gray-200">
//           <button 
//             onClick={handleLogout} 
//             className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
//           >
//             <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
//             <span>Sign Out</span>
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
//           <div className="px-3 sm:px-4 lg:px-8">
//             <div className="flex items-center justify-between h-14 sm:h-16">
//               <button 
//                 onClick={() => setSidebarOpen(true)} 
//                 className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -ml-2"
//               >
//                 <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
//               </button>

//               <div className="flex-1 max-w-lg mx-2 sm:mx-4 hidden sm:block">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//                   </div>
//                   <input 
//                     type="text" 
//                     className="block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
//                     placeholder="Search..." 
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2 sm:space-x-4">
//                 <button className="text-gray-500 hover:text-gray-700 relative p-2">
//                   <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
//                   <span className="absolute top-1 right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
//                 </button>

//                 <div className="relative">
//                   <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
//                     <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto">
//           <div className="p-3 sm:p-4 lg:p-6">
//             {showOverview && !isAdmin ? (
//               <div className="space-y-4 sm:space-y-6">
//                 <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 sm:p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Welcome back, {user?.full_name || 'User'}!</h1>
//                       <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base opacity-90">
//                         {loading ? 'Loading your dashboard...' : "Here's what's happening with your call center today."}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={refreshDashboard}
//                       disabled={refreshing || loading}
//                       className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
//                       title="Refresh dashboard data"
//                     >
//                       <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
//                     </button>
//                   </div>
//                 </div>

//                 {loading ? (
//                   <div className="flex justify-center items-center py-12">
//                     <div className="relative">
//                       <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600"></div>
//                       <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600" />
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//                       <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
//                         <div className="flex flex-col sm:flex-row sm:items-center">
//                           <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mb-2 sm:mb-0 w-fit">
//                             <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
//                           </div>
//                           <div className="sm:ml-3 lg:ml-4">
//                             <p className="text-xs sm:text-sm font-medium text-gray-600">Calls Today</p>
//                             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.callsToday}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
//                         <div className="flex flex-col sm:flex-row sm:items-center">
//                           <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mb-2 sm:mb-0 w-fit">
//                             <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
//                           </div>
//                           <div className="sm:ml-3 lg:ml-4">
//                             <p className="text-xs sm:text-sm font-medium text-gray-600">Success Rate</p>
//                             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.successRate}%</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
//                         <div className="flex flex-col sm:flex-row sm:items-center">
//                           <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mb-2 sm:mb-0 w-fit">
//                             <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
//                           </div>
//                           <div className="sm:ml-3 lg:ml-4">
//                             <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue Today</p>
//                             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${dashboardStats.revenue.toLocaleString()}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
//                         <div className="flex flex-col sm:flex-row sm:items-center">
//                           <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mb-2 sm:mb-0 w-fit">
//                             <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
//                           </div>
//                           <div className="sm:ml-3 lg:ml-4">
//                             <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Duration</p>
//                             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.avgCallDuration}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white rounded-lg shadow-sm border hidden md:block">
//                       <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
//                         <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Calls</h3>
//                         <span className="text-xs sm:text-sm text-gray-500">
//                           Total: {dashboardStats.totalCalls} calls
//                         </span>
//                       </div>
//                       <div className="overflow-x-auto">
//                         {recentCalls.length === 0 ? (
//                           <div className="p-12 text-center">
//                             <Phone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//                             <p className="text-gray-500">No calls yet. Start making calls to see them here.</p>
//                           </div>
//                         ) : (
//                           <table className="w-full">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                               {recentCalls.map((call) => (
//                                 <tr key={call.id} className="hover:bg-gray-50">
//                                   <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{call.customer}</td>
//                                   <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{call.time}</td>
//                                   <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{call.duration}</td>
//                                   <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 capitalize">{call.type}</td>
//                                   <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                                       call.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                                       call.status === 'failed' ? 'bg-red-100 text-red-800' : 
//                                       'bg-yellow-100 text-yellow-800'
//                                     }`}>
//                                       {call.status}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         )}
//                       </div>
//                     </div>

//                     <div className="md:hidden space-y-3">
//                       <div className="bg-white rounded-lg shadow-sm border p-4">
//                         <div className="flex items-center justify-between mb-3">
//                           <h3 className="text-base font-semibold text-gray-900">Recent Calls</h3>
//                           <span className="text-xs text-gray-500">
//                             Total: {dashboardStats.totalCalls}
//                           </span>
//                         </div>
//                         {recentCalls.length === 0 ? (
//                           <div className="py-8 text-center">
//                             <Phone className="h-12 w-12 mx-auto text-gray-300 mb-2" />
//                             <p className="text-sm text-gray-500">No calls yet</p>
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             {recentCalls.map((call) => (
//                               <div key={call.id} className="border border-gray-200 rounded-lg p-3">
//                                 <div className="flex items-start justify-between mb-2">
//                                   <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-medium text-gray-900 truncate">{call.customer}</p>
//                                     <p className="text-xs text-gray-500 mt-0.5 capitalize">{call.type}</p>
//                                   </div>
//                                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
//                                     call.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                                     call.status === 'failed' ? 'bg-red-100 text-red-800' : 
//                                     'bg-yellow-100 text-yellow-800'
//                                   }`}>
//                                     {call.status}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-xs text-gray-500">
//                                   <span className="flex items-center">
//                                     <Clock className="h-3 w-3 mr-1" />
//                                     {call.time}
//                                   </span>
//                                   <span>{call.duration}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ) : showOverview && isAdmin ? (
//               <div className="text-center py-8 sm:py-12 px-4">
//                 <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-3 sm:mb-4" />
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
//                 <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">Welcome to the admin panel. Manage users, subscriptions, and system performance.</p>
//                 <Link to="/dashboard/admin" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm sm:text-base">
//                   Go to Admin Panel
//                 </Link>
//               </div>
//             ) : (
//               <Outlet />
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default Dashboard





// pages/dashboard/Dashboard.jsx - UPDATED WITH REAL API DATA + AUTOMATION SECTION (Milestone 3)
import { useState, useEffect } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { 
  Menu, X, BarChart3, User, Settings, Shield, Users, LogOut, Bell, Search,
  Phone, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, Activity,
  PhoneCall, History, FileText, Bot, PieChart, Mic, RefreshCw
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"

const API_BASE_URL = 'http://localhost:8000/api/v1'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // State for real dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    callsToday: 0,
    successRate: 0,
    revenue: 0,
    totalCalls: 0,
    activeAgents: 0,
    avgCallDuration: '0m 0s',
    conversionRate: 0
  })
  const [recentCalls, setRecentCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const showOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/'

  useEffect(() => {
    if (showOverview && !isAdmin) {
      fetchDashboardData()
    }
  }, [location.pathname, isAdmin])

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const headers = getAuthHeaders()

      // ✅ Using existing backend endpoint: GET /api/v1/calls/ (not /calls/history)
      // This endpoint returns all calls with filters
      const callsResponse = await fetch(`${API_BASE_URL}/calls/?skip=0&limit=100`, {
        method: 'GET',
        headers: headers
      })

      if (callsResponse.ok) {
        const callsData = await callsResponse.json()
        const calls = Array.isArray(callsData) ? callsData : []

        console.log(`✅ Fetched ${calls.length} calls from backend`)

        // Calculate statistics from real data
        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        // Calls today - filter by created_at date
        const callsToday = calls.filter(call => {
          const callDate = new Date(call.created_at)
          return callDate >= startOfToday
        }).length

        // Total calls
        const totalCalls = calls.length

        // Success rate (completed calls / total calls)
        const completedCalls = calls.filter(call => call.status === 'completed').length
        const successRate = totalCalls > 0 ? ((completedCalls / totalCalls) * 100).toFixed(1) : 0

        // Average call duration (in seconds)
        const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0)
        const avgDurationSec = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0
        const avgMinutes = Math.floor(avgDurationSec / 60)
        const avgSeconds = avgDurationSec % 60
        const avgCallDuration = `${avgMinutes}m ${avgSeconds}s`

        // Revenue calculation (example: $2.5 per call today)
        const revenue = callsToday * 2.5

        // Active agents (you can fetch this from voice_agents endpoint if needed)
        const activeAgents = 5 // Placeholder - replace with real data if you have an agents endpoint

        // Conversion rate (example calculation based on success rate)
        const conversionRate = (parseFloat(successRate) * 0.25).toFixed(1)

        setDashboardStats({
          callsToday,
          successRate: parseFloat(successRate),
          revenue,
          totalCalls,
          activeAgents,
          avgCallDuration,
          conversionRate: parseFloat(conversionRate)
        })

        // Get recent calls (last 10, sorted by created_at)
        const recent = calls
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
          .map(call => ({
            id: call._id || call.id,
            customer: call.to_number || call.from_number || call.phone_number || 'Unknown',
            time: formatTime(call.created_at),
            duration: formatDuration(call.duration || 0),
            status: call.status || 'unknown',
            type: determineCallType(call),
            direction: call.direction || 'outbound'
          }))

        setRecentCalls(recent)
        console.log(`✅ Dashboard stats calculated:`, dashboardStats)

      } else {
        console.error('❌ Failed to fetch calls:', callsResponse.status)
        const errorText = await callsResponse.text()
        console.error('Error details:', errorText)
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
      toast.error('Network error while loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  const refreshDashboard = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
    toast.success('Dashboard data refreshed')
  }

  // Helper function to determine call type
  const determineCallType = (call) => {
    // You can customize this logic based on your data
    if (call.outcome) {
      return call.outcome
    }
    if (call.direction === 'inbound') {
      return 'support'
    }
    return 'sales'
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
    } catch (e) {
      return 'N/A'
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isActive = (href) => {
    if (location.pathname === href || location.pathname === href + '/') {
      return true
    }
    
    if (href === '/dashboard/admin') {
      return location.pathname === '/dashboard/admin' || location.pathname === '/dashboard/admin/'
    }
    
    return false
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const adminNavigation = [
    { name: 'Admin Panel', href: '/dashboard/admin', icon: Shield },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Account Settings', href: '/dashboard/admin/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ]

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const callNavigation = [
    { name: 'Call Center', href: '/dashboard/calls/center', icon: PhoneCall },
    { name: 'Call History', href: '/dashboard/calls/history', icon: History },
    { name: 'Call Logs', href: '/dashboard/calls/logs', icon: FileText },
    { name: 'Voice Agents', href: '/dashboard/calls/agents', icon: Bot },
    { name: 'Analytics', href: '/dashboard/calls/analytics', icon: PieChart },
    { name: 'Recordings', href: '/dashboard/calls/recordings', icon: Mic },
  ]

  // ✅ MILESTONE 3 - AUTOMATION SECTION
  const automationNavigation = [
    { 
      name: 'Automations', 
      href: '/dashboard/automations', 
      icon: (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: 'Workflows', 
      href: '/dashboard/workflows', 
      icon: (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      name: 'AI Campaign Builder', 
      href: '/dashboard/campaigns', 
      icon: (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'SMS Messages', 
      href: '/dashboard/sms', 
      icon: (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ]

  const navigation = isAdmin ? adminNavigation : userNavigation

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">CP</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 truncate">CallCenter Pro</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                {user?.full_name || 'User Name'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              {isAdmin && (
                <span className="inline-flex px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link 
                key={item.name} 
                to={item.href} 
                className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg relative overflow-hidden
                  transition-all duration-300 ease-in-out
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary-700 border-r-2 border-primary-600 shadow-sm'
                    : 'text-gray-700 hover:text-primary hover:shadow-sm hover:scale-[1.02]'
                  }
                  active:scale-[0.97]
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <span
                  className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></span>

                <span
                  className={`absolute left-0 top-0 h-full w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300
                    ${isActive(item.href) ? 'scale-y-100' : ''}
                  `}
                ></span>

                <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="truncate z-10">{item.name}</span>
              </Link>
            )
          })}

          {!isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Call Center
                </p>
              </div>

              {callNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg relative overflow-hidden
                      transition-all duration-300 ease-in-out
                      ${isActive(item.href)
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary-700 border-r-2 border-primary-600 shadow-sm'
                        : 'text-gray-700 hover:text-primary hover:shadow-sm hover:scale-[1.02]'
                      }
                      active:scale-[0.97]
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span
                      className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></span>

                    <span
                      className={`absolute left-0 top-0 h-full w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300
                        ${isActive(item.href) ? 'scale-y-100' : ''}
                      `}
                    ></span>

                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="truncate z-10">{item.name}</span>
                  </Link>
                )
              })}

              {/* ✅ MILESTONE 3 - AUTOMATION SECTION */}
              <div className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Automation
                </p>
              </div>

              {automationNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg relative overflow-hidden
                      transition-all duration-300 ease-in-out
                      ${isActive(item.href)
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary-700 border-r-2 border-primary-600 shadow-sm'
                        : 'text-gray-700 hover:text-primary hover:shadow-sm hover:scale-[1.02]'
                      }
                      active:scale-[0.97]
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span
                      className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></span>

                    <span
                      className={`absolute left-0 top-0 h-full w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300
                        ${isActive(item.href) ? 'scale-y-100' : ''}
                      `}
                    ></span>

                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="truncate z-10">{item.name}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -ml-2"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="flex-1 max-w-lg mx-2 sm:mx-4 hidden sm:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Search..." 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="text-gray-500 hover:text-gray-700 relative p-2">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute top-1 right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                </button>

                <div className="relative">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            {showOverview && !isAdmin ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Welcome back, {user?.full_name || 'User'}!</h1>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base opacity-90">
                        {loading ? 'Loading your dashboard...' : "Here's what's happening with your call center today."}
                      </p>
                    </div>
                    <button 
                      onClick={refreshDashboard}
                      disabled={refreshing || loading}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                      title="Refresh dashboard data"
                    >
                      <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600"></div>
                      <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mb-2 sm:mb-0 w-fit">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                          </div>
                          <div className="sm:ml-3 lg:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Calls Today</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.callsToday}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mb-2 sm:mb-0 w-fit">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                          </div>
                          <div className="sm:ml-3 lg:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.successRate}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mb-2 sm:mb-0 w-fit">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                          </div>
                          <div className="sm:ml-3 lg:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue Today</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${dashboardStats.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mb-2 sm:mb-0 w-fit">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
                          </div>
                          <div className="sm:ml-3 lg:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Duration</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.avgCallDuration}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border hidden md:block">
                      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Calls</h3>
                        <span className="text-xs sm:text-sm text-gray-500">
                          Total: {dashboardStats.totalCalls} calls
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        {recentCalls.length === 0 ? (
                          <div className="p-12 text-center">
                            <Phone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No calls yet. Start making calls to see them here.</p>
                          </div>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {recentCalls.map((call) => (
                                <tr key={call.id} className="hover:bg-gray-50">
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{call.customer}</td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{call.time}</td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{call.duration}</td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 capitalize">{call.type}</td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      call.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      call.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {call.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    <div className="md:hidden space-y-3">
                      <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-semibold text-gray-900">Recent Calls</h3>
                          <span className="text-xs text-gray-500">
                            Total: {dashboardStats.totalCalls}
                          </span>
                        </div>
                        {recentCalls.length === 0 ? (
                          <div className="py-8 text-center">
                            <Phone className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No calls yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {recentCalls.map((call) => (
                              <div key={call.id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{call.customer}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{call.type}</p>
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                                    call.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    call.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {call.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {call.time}
                                  </span>
                                  <span>{call.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : showOverview && isAdmin ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">Welcome to the admin panel. Manage users, subscriptions, and system performance.</p>
                <Link to="/dashboard/admin" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm sm:text-base">
                  Go to Admin Panel
                </Link>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard