
// // frontend/src/Pages/dashboard/admin/UserManagement.jsx
// import { useState, useEffect } from "react"
// import { 
//   Users, 
//   Search, 
//   Filter, 
//   MoreVertical, 
//   Edit, 
//   Trash2, 
//   UserPlus,
//   Mail,
//   Phone,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   RefreshCw,
//   Eye,
//   EyeOff
// } from "lucide-react"
// import Card from "../../../Components/ui/Card"
// import Button from "../../../Components/ui/Button"
// import Input from "../../../Components/ui/Input"
// import Modal from "../../../Components/ui/Modal"
// import { useAuth } from "../../../hooks/useAuth"
// import { formatDate, formatRelativeTime, generateAvatarUrl } from "../../../utils/helpers"
// import toast from "react-hot-toast"

// // API Base URL - adjust this to match your backend
// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const UserManagement = () => {
//   const { user: currentUser } = useAuth()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [showPasswordFields, setShowPasswordFields] = useState(false)
//   const [updatingUser, setUpdatingUser] = useState(null)
//   const [newUser, setNewUser] = useState({
//     full_name: '',
//     email: '',
//     phone: '',
//     company: '',
//     subscription_plan: 'free',
//     is_admin: false,
//     password: ''
//   })
//   const itemsPerPage = 10

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const getAuthHeaders = () => {
//     // Try multiple ways to get the token
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

//   const fetchUsers = async () => {
//     try {
//       setLoading(true)
      
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/admin/users?limit=100&skip=0`, {
//         method: 'GET',
//         headers: headers
//       })
      
//       if (response.ok) {
//         const contentType = response.headers.get('content-type')
//         if (contentType && contentType.includes('application/json')) {
//           const data = await response.json()
//           setUsers(Array.isArray(data) ? data : [])
//         } else {
//           console.error('Response is not JSON:', await response.text())
//           setUsers([])
//         }
//       } else {
//         console.error('Failed to fetch users:', response.status)
//         if (response.status === 401) {
//           toast.error('Session expired. Please login again.')
//         } else {
//           toast.error('Failed to load users')
//         }
//         setUsers([])
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error)
//       toast.error('Network error while loading users')
//       setUsers([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const refreshData = async () => {
//     setRefreshing(true)
//     await fetchUsers()
//     setRefreshing(false)
//     toast.success('User list refreshed')
//   }

//   const updateUserStatus = async (userId, isActive) => {
//     try {
//       setUpdatingUser(userId)
      
//       const headers = getAuthHeaders()
      
//       console.log(`Updating user ${userId} status to ${isActive}`)
      
//       const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify({
//           is_active: isActive
//         })
//       })
      
//       if (response.ok) {
//         // Update the user in the local state
//         setUsers(users =>
//           users.map(user =>
//             user.id === userId
//               ? { ...user, is_active: isActive }
//               : user
//           )
//         )
//         toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
//       } else {
//         // Better error handling
//         const errorText = await response.text()
//         let errorData
//         try {
//           errorData = JSON.parse(errorText)
//         } catch {
//           errorData = { detail: errorText || `HTTP ${response.status}` }
//         }
        
//         console.error('Update status error:', errorData)
//         toast.error(`Failed to update user status: ${errorData.detail || 'Unknown error'}`)
//       }
//     } catch (error) {
//       console.error('Failed to update user status:', error)
//       toast.error('Network error. Please try again.')
//     } finally {
//       setUpdatingUser(null)
//     }
//   }

//   const getStatusBadge = (isActive) => {
//     const status = isActive ? 'active' : 'inactive'
//     const badgeClasses = {
//       'active': 'bg-green-100 text-green-800',
//       'inactive': 'bg-gray-100 text-gray-800'
//     }

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     )
//   }

//   const getSubscriptionBadge = (subscription) => {
//     const badgeClasses = {
//       'free': 'bg-gray-100 text-gray-800',
//       'professional': 'bg-purple-100 text-purple-800',
//       'enterprise': 'bg-yellow-100 text-yellow-800'
//     }

//     const subscriptionPrices = {
//       'free': '$0',
//       'professional': '$149',
//       'enterprise': '$299'
//     }

//     return (
//       <div className="space-y-1">
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[subscription] || 'bg-gray-100 text-gray-800'}`}>
//           {subscription?.charAt(0).toUpperCase() + subscription?.slice(1) || 'Free'}
//         </span>
//         <div className="text-xs text-gray-500">
//           {subscriptionPrices[subscription] || '$0'}/month
//         </div>
//       </div>
//     )
//   }

//   const getRoleBadge = (isAdmin) => {
//     const role = isAdmin ? 'admin' : 'user'
//     const badgeClasses = {
//       'admin': 'bg-red-100 text-red-800',
//       'user': 'bg-gray-100 text-gray-800'
//     }

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[role]}`}>
//         {role.charAt(0).toUpperCase() + role.slice(1)}
//       </span>
//     )
//   }

//   // Filter users based on search and status
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = searchTerm === '' || 
//       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesStatus = filterStatus === 'all' || 
//       (filterStatus === 'active' && user.is_active) ||
//       (filterStatus === 'inactive' && !user.is_active)
    
//     return matchesSearch && matchesStatus
//   })

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
//   const startIndex = (currentPage - 1) * itemsPerPage
//   const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

//   const stats = {
//     total: users.length,
//     active: users.filter(u => u.is_active).length,
//     inactive: users.filter(u => !u.is_active).length,
//     verified: users.filter(u => u.is_verified).length
//   }

//   // Check admin permissions
//   if (!currentUser?.is_admin) {
//     return (
//       <div className="text-center py-12">
//         <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//         <p className="text-gray-600">You don't have permission to access user management.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
//           <p className="mt-1 text-xs sm:text-sm text-gray-500">
//             Manage user accounts, subscriptions, and permissions
//           </p>
//         </div>
//         <div className="flex">
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

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
//         <Card>
//           <div className="p-4 sm:p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
//               </div>
//               <div className="ml-3 sm:ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Users</dt>
//                   <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.total}</dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="p-4 sm:p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
//               </div>
//               <div className="ml-3 sm:ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Users</dt>
//                   <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.active}</dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="p-4 sm:p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
//               </div>
//               <div className="ml-3 sm:ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Inactive Users</dt>
//                   <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.inactive}</dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="p-4 sm:p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
//               </div>
//               <div className="ml-3 sm:ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Verified Users</dt>
//                   <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.verified}</dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card>
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
//             <div className="flex-1 min-w-0">
//               <div className="relative">
//                 <Search className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 text-sm sm:text-base"
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Users Table - Desktop */}
//       <Card className="hidden md:block">
//         <div className="overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subscription
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="relative px-6 py-3">
//                     <span className="sr-only">Actions</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-500">Loading users...</p>
//                     </td>
//                   </tr>
//                 ) : paginatedUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <Users className="h-12 w-12 mx-auto text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-500">
//                         {searchTerm || filterStatus !== 'all' ? 'No users match your filters' : 'No users found'}
//                       </p>
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img
//                               className="h-10 w-10 rounded-full"
//                               src={generateAvatarUrl(user.full_name)}
//                               alt={user.full_name}
//                             />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {user.full_name}
//                             </div>
//                             <div className="text-sm text-gray-500 flex items-center">
//                               <Mail className="h-3 w-3 mr-1" />
//                               {user.email}
//                             </div>
//                             {user.phone && (
//                               <div className="text-sm text-gray-500 flex items-center mt-1">
//                                 <Phone className="h-3 w-3 mr-1" />
//                                 {user.phone}
//                               </div>
//                             )}
//                             {user.company && (
//                               <div className="text-xs text-gray-400 mt-1">
//                                 {user.company}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getRoleBadge(user.is_admin)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="space-y-1">
//                           {getStatusBadge(user.is_active)}
//                           {user.is_verified ? (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//                               <CheckCircle className="h-3 w-3 mr-1" />
//                               Verified
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//                               <AlertTriangle className="h-3 w-3 mr-1" />
//                               Unverified
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getSubscriptionBadge(user.subscription_plan)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           <div>
//                             <div>{formatDate(user.created_at)}</div>
//                             <div className="text-xs text-gray-400">
//                               {formatRelativeTime(user.created_at)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           <Button
//                             variant="outline"
//                             size="small"
//                             onClick={() => updateUserStatus(user.id, !user.is_active)}
//                             disabled={updatingUser === user.id}
//                           >
//                             {updatingUser === user.id ? (
//                               <RefreshCw className="h-4 w-4 animate-spin" />
//                             ) : (
//                               user.is_active ? 'Deactivate' : 'Activate'
//                             )}
//                           </Button>
//                           <Button variant="ghost" size="small">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination - Desktop */}
//           {totalPages > 1 && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{' '}
//                     <span className="font-medium">{startIndex + 1}</span>
//                     {' '}to{' '}
//                     <span className="font-medium">
//                       {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
//                     </span>
//                     {' '}of{' '}
//                     <span className="font-medium">{filteredUsers.length}</span>
//                     {' '}results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <Button
//                       variant="outline"
//                       onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                       className="rounded-r-none"
//                     >
//                       Previous
//                     </Button>
//                     {[...Array(Math.min(5, totalPages))].map((_, i) => (
//                       <button
//                         key={i + 1}
//                         onClick={() => setCurrentPage(i + 1)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === i + 1
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {i + 1}
//                       </button>
//                     ))}
//                     <Button
//                       variant="outline"
//                       onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                       disabled={currentPage === totalPages}
//                       className="rounded-l-none"
//                     >
//                       Next
//                     </Button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Users List - Mobile */}
//       <div className="md:hidden space-y-4">
//         {loading ? (
//           <Card className="p-6">
//             <div className="flex flex-col items-center justify-center py-8">
//               <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
//               <p className="mt-2 text-sm text-gray-500">Loading users...</p>
//             </div>
//           </Card>
//         ) : paginatedUsers.length === 0 ? (
//           <Card className="p-6">
//             <div className="flex flex-col items-center justify-center py-8">
//               <Users className="h-12 w-12 text-gray-400" />
//               <p className="mt-2 text-sm text-gray-500 text-center">
//                 {searchTerm || filterStatus !== 'all' ? 'No users match your filters' : 'No users found'}
//               </p>
//             </div>
//           </Card>
//         ) : (
//           paginatedUsers.map((user) => (
//             <Card key={user.id} className="p-4">
//               <div className="space-y-4">
//                 {/* User Header */}
//                 <div className="flex items-start space-x-3">
//                   <img
//                     className="h-12 w-12 rounded-full flex-shrink-0"
//                     src={generateAvatarUrl(user.full_name)}
//                     alt={user.full_name}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-sm font-medium text-gray-900 truncate">{user.full_name}</h3>
//                     <p className="text-xs text-gray-500 truncate flex items-center mt-1">
//                       <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
//                       {user.email}
//                     </p>
//                     {user.phone && (
//                       <p className="text-xs text-gray-500 truncate flex items-center mt-1">
//                         <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
//                         {user.phone}
//                       </p>
//                     )}
//                     {user.company && (
//                       <p className="text-xs text-gray-400 mt-1">{user.company}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* User Details */}
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div>
//                     <span className="text-gray-500 block mb-1">Role</span>
//                     {getRoleBadge(user.is_admin)}
//                   </div>
//                   <div>
//                     <span className="text-gray-500 block mb-1">Status</span>
//                     {getStatusBadge(user.is_active)}
//                   </div>
//                   <div>
//                     <span className="text-gray-500 block mb-1">Subscription</span>
//                     {getSubscriptionBadge(user.subscription_plan)}
//                   </div>
//                   <div>
//                     <span className="text-gray-500 block mb-1">Verification</span>
//                     {user.is_verified ? (
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//                         <CheckCircle className="h-3 w-3 mr-1" />
//                         Verified
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//                         <AlertTriangle className="h-3 w-3 mr-1" />
//                         Unverified
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Created Date */}
//                 <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
//                   <Calendar className="h-3 w-3 mr-1" />
//                   <span>Created: {formatDate(user.created_at)}</span>
//                   <span className="mx-2">•</span>
//                   <span>{formatRelativeTime(user.created_at)}</span>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex space-x-2 pt-2">
//                   <Button
//                     variant="outline"
//                     size="small"
//                     onClick={() => updateUserStatus(user.id, !user.is_active)}
//                     disabled={updatingUser === user.id}
//                     className="flex-1"
//                   >
//                     {updatingUser === user.id ? (
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                     ) : (
//                       user.is_active ? 'Deactivate' : 'Activate'
//                     )}
//                   </Button>
//                   <Button variant="ghost" size="small">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))
//         )}

//         {/* Pagination - Mobile */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3">
//             <Button
//               variant="outline"
//               size="small"
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <span className="text-sm text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="small"
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Create User Modal - Functionality Preserved */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => {
//           setShowCreateModal(false)
//           setNewUser({
//             full_name: '',
//             email: '',
//             phone: '',
//             company: '',
//             subscription_plan: 'free',
//             is_admin: false,
//             password: ''
//           })
//           setShowPasswordFields(false)
//         }}
//         title="Create New User"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <Input
//               type="text"
//               value={newUser.full_name}
//               onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
//               placeholder="Enter full name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <Input
//               type="email"
//               value={newUser.email}
//               onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//               placeholder="Enter email address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
//             <Input
//               type="tel"
//               value={newUser.phone}
//               onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
//             <Input
//               type="text"
//               value={newUser.company}
//               onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
//               placeholder="Enter company name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
//             <select
//               value={newUser.subscription_plan}
//               onChange={(e) => setNewUser({ ...newUser, subscription_plan: e.target.value })}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="free">Free</option>
//               <option value="professional">Professional</option>
//               <option value="enterprise">Enterprise</option>
//             </select>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="is_admin"
//               checked={newUser.is_admin}
//               onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
//               Admin User
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="show_password"
//               checked={showPasswordFields}
//               onChange={(e) => setShowPasswordFields(e.target.checked)}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="show_password" className="ml-2 block text-sm text-gray-900">
//               Set password manually
//             </label>
//           </div>

//           {showPasswordFields && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <Input
//                 type="password"
//                 value={newUser.password}
//                 onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//                 placeholder="Enter password"
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 If not set, a random password will be generated and sent via email
//               </p>
//             </div>
//           )}

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowCreateModal(false)
//                 setNewUser({
//                   full_name: '',
//                   email: '',
//                   phone: '',
//                   company: '',
//                   subscription_plan: 'free',
//                   is_admin: false,
//                   password: ''
//                 })
//                 setShowPasswordFields(false)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 // TODO: Implement create user functionality
//                 toast.info('Create user functionality will be implemented in the next phase')
//                 setShowCreateModal(false)
//               }}
//             >
//               Create User
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default UserManagement







// frontend/src/Pages/dashboard/admin/UserManagement.jsx - UPDATED UI WITH NEW COLOR SCHEME

import { useState, useEffect } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"
import Card from "../../../Components/ui/Card"
import Button from "../../../Components/ui/Button"
import Input from "../../../Components/ui/Input"
import Modal from "../../../Components/ui/Modal"
import { useAuth } from "../../../hooks/useAuth"
import { formatDate, formatRelativeTime, generateAvatarUrl } from "../../../utils/helpers"
import toast from "react-hot-toast"

// API Base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:8000/api/v1'

const UserManagement = () => {
  const { user: currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    subscription_plan: 'free',
    is_admin: false,
    password: ''
  })
  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const getAuthHeaders = () => {
    // Try multiple ways to get the token
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

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=100&skip=0`, {
        method: 'GET',
        headers: headers
      })
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          setUsers(Array.isArray(data) ? data : [])
        } else {
          console.error('Response is not JSON:', await response.text())
          setUsers([])
        }
      } else {
        console.error('Failed to fetch users:', response.status)
        if (response.status === 401) {
          toast.error('Session expired. Please login again.')
        } else {
          toast.error('Failed to load users')
        }
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Network error while loading users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
    toast.success('User list refreshed')
  }

  const updateUserStatus = async (userId, isActive) => {
    try {
      setUpdatingUser(userId)
      
      const headers = getAuthHeaders()
      
      console.log(`Updating user ${userId} status to ${isActive}`)
      
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          is_active: isActive
        })
      })
      
      if (response.ok) {
        // Update the user in the local state
        setUsers(users =>
          users.map(user =>
            user.id === userId
              ? { ...user, is_active: isActive }
              : user
          )
        )
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        // Better error handling
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { detail: errorText || `HTTP ${response.status}` }
        }
        
        console.error('Update status error:', errorData)
        toast.error(`Failed to update user status: ${errorData.detail || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setUpdatingUser(null)
    }
  }

  const getStatusBadge = (isActive) => {
    const status = isActive ? 'active' : 'inactive'
    
    return (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: isActive ? '#f2070d' : '#2C2C2C',
          color: '#ffffff'
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getSubscriptionBadge = (subscription) => {
    const badgeClasses = {
      'free': 'bg-[#e5e5e5] text-[#2C2C2C]',
      'professional': 'bg-gradient-to-r from-[#FF6B6B] to-[#f2070d] text-white',
      'enterprise': 'bg-gradient-to-r from-[#2C2C2C] to-[#666666] text-white'
    }

    const subscriptionPrices = {
      'free': '$0',
      'professional': '$149',
      'enterprise': '$299'
    }

    return (
      <div className="space-y-1">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[subscription] || 'bg-[#e5e5e5] text-[#2C2C2C]'}`}>
          {subscription?.charAt(0).toUpperCase() + subscription?.slice(1) || 'Free'}
        </span>
        <div className="text-xs font-medium text-[#666666]">
          {subscriptionPrices[subscription] || '$0'}/month
        </div>
      </div>
    )
  }

  const getRoleBadge = (isAdmin) => {
    const role = isAdmin ? 'admin' : 'user'
    const badgeClasses = {
      'admin': 'bg-[#f2070d] text-white',
      'user': 'bg-[#e5e5e5] text-[#2C2C2C]'
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    verified: users.filter(u => u.is_verified).length
  }

  // Check admin permissions
  if (!currentUser?.is_admin) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-[#f2070d] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Access Denied</h2>
          <p className="text-[#666666]">You don't have permission to access user management.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C]">User Management</h1>
            <p className="mt-2 text-base sm:text-lg text-[#666666]">
              Manage user accounts, subscriptions, and permissions
            </p>
          </div>
          <div className="flex">
            <Button 
              variant="outline" 
              size="medium"
              onClick={refreshData}
              disabled={refreshing}
              className="w-full sm:w-auto border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#f8f8f8]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <Card className="bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] border-none hover:shadow-2xl transition-all">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-white/80 truncate uppercase">Total Users</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#2C2C2C] to-[#666666] border-none hover:shadow-2xl transition-all">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-white/80 truncate uppercase">Active Users</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#FF6B6B] to-[#f2070d] border-none hover:shadow-2xl transition-all">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-white/80 truncate uppercase">Inactive Users</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.inactive}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#666666] to-[#2C2C2C] border-none hover:shadow-2xl transition-all">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-white/80 truncate uppercase">Verified Users</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.verified}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-xl">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm sm:text-base border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d] text-[#2C2C2C]"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-sm sm:text-base border-2 border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d] rounded-lg text-[#2C2C2C] bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Users Table - Desktop */}
        <Card className="hidden md:block shadow-xl">
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-[#e5e5e5]">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e5e5e5]">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#f2070d]" />
                        <p className="mt-2 text-sm text-[#666666]">Loading users...</p>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-[#666666]" />
                        <p className="mt-2 text-sm text-[#666666]">
                          {searchTerm || filterStatus !== 'all' ? 'No users match your filters' : 'No users found'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#f8f8f8] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full ring-2 ring-[#e5e5e5]"
                                src={generateAvatarUrl(user.full_name)}
                                alt={user.full_name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-[#2C2C2C]">
                                {user.full_name}
                              </div>
                              <div className="text-sm text-[#666666] flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-[#666666] flex items-center mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                              {user.company && (
                                <div className="text-xs text-[#9ca3af] mt-1">
                                  {user.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.is_admin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {getStatusBadge(user.is_active)}
                            {user.is_verified ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f2070d]/10 text-[#f2070d] font-semibold">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] font-semibold">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getSubscriptionBadge(user.subscription_plan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-[#f2070d]" />
                            <div>
                              <div className="font-medium text-[#2C2C2C]">{formatDate(user.created_at)}</div>
                              <div className="text-xs text-[#9ca3af]">
                                {formatRelativeTime(user.created_at)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => updateUserStatus(user.id, !user.is_active)}
                              disabled={updatingUser === user.id}
                              className="border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#f8f8f8]"
                            >
                              {updatingUser === user.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                user.is_active ? 'Deactivate' : 'Activate'
                              )}
                            </Button>
                            <Button variant="ghost" size="small" className="text-[#666666] hover:text-[#2C2C2C]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - Desktop */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t-2 border-[#e5e5e5] sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#666666]">
                      Showing{' '}
                      <span className="font-semibold text-[#2C2C2C]">{startIndex + 1}</span>
                      {' '}to{' '}
                      <span className="font-semibold text-[#2C2C2C]">
                        {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-semibold text-[#2C2C2C]">{filteredUsers.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-r-none border-2 border-[#2C2C2C] text-[#2C2C2C]"
                      >
                        Previous
                      </Button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-semibold transition-colors ${
                            currentPage === i + 1
                              ? 'z-10 bg-[#f2070d] border-[#f2070d] text-white'
                              : 'bg-white border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#f8f8f8]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-l-none border-2 border-[#2C2C2C] text-[#2C2C2C]"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Users List - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <Card className="p-6 shadow-xl">
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-[#f2070d]" />
                <p className="mt-2 text-sm text-[#666666]">Loading users...</p>
              </div>
            </Card>
          ) : paginatedUsers.length === 0 ? (
            <Card className="p-6 shadow-xl">
              <div className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-[#666666]" />
                <p className="mt-2 text-sm text-[#666666] text-center">
                  {searchTerm || filterStatus !== 'all' ? 'No users match your filters' : 'No users found'}
                </p>
              </div>
            </Card>
          ) : (
            paginatedUsers.map((user) => (
              <Card key={user.id} className="p-4 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#f2070d]">
                <div className="space-y-4">
                  {/* User Header */}
                  <div className="flex items-start space-x-3">
                    <img
                      className="h-12 w-12 rounded-full flex-shrink-0 ring-2 ring-[#e5e5e5]"
                      src={generateAvatarUrl(user.full_name)}
                      alt={user.full_name}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#2C2C2C] truncate">{user.full_name}</h3>
                      <p className="text-xs text-[#666666] truncate flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-[#666666] truncate flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          {user.phone}
                        </p>
                      )}
                      {user.company && (
                        <p className="text-xs text-[#9ca3af] mt-1">{user.company}</p>
                      )}
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#666666] block mb-1 font-medium">Role</span>
                      {getRoleBadge(user.is_admin)}
                    </div>
                    <div>
                      <span className="text-[#666666] block mb-1 font-medium">Status</span>
                      {getStatusBadge(user.is_active)}
                    </div>
                    <div>
                      <span className="text-[#666666] block mb-1 font-medium">Subscription</span>
                      {getSubscriptionBadge(user.subscription_plan)}
                    </div>
                    <div>
                      <span className="text-[#666666] block mb-1 font-medium">Verification</span>
                      {user.is_verified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f2070d]/10 text-[#f2070d] font-semibold">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] font-semibold">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center text-xs text-[#666666] pt-2 border-t-2 border-[#e5e5e5]">
                    <Calendar className="h-3 w-3 mr-1 text-[#f2070d]" />
                    <span className="font-medium text-[#2C2C2C]">Created: {formatDate(user.created_at)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatRelativeTime(user.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => updateUserStatus(user.id, !user.is_active)}
                      disabled={updatingUser === user.id}
                      className="flex-1 border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#f8f8f8]"
                    >
                      {updatingUser === user.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        user.is_active ? 'Deactivate' : 'Activate'
                      )}
                    </Button>
                    <Button variant="ghost" size="small" className="text-[#666666] hover:text-[#2C2C2C]">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}

          {/* Pagination - Mobile */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3">
              <Button
                variant="outline"
                size="small"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-2 border-[#2C2C2C] text-[#2C2C2C]"
              >
                Previous
              </Button>
              <span className="text-sm font-semibold text-[#2C2C2C]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="small"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-2 border-[#2C2C2C] text-[#2C2C2C]"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Create User Modal - Functionality Preserved */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setNewUser({
              full_name: '',
              email: '',
              phone: '',
              company: '',
              subscription_plan: 'free',
              is_admin: false,
              password: ''
            })
            setShowPasswordFields(false)
          }}
          title="Create New User"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Full Name</label>
              <Input
                type="text"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="Enter full name"
                className="border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
                className="border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Phone (Optional)</label>
              <Input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Enter phone number"
                className="border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Company (Optional)</label>
              <Input
                type="text"
                value={newUser.company}
                onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                placeholder="Enter company name"
                className="border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Subscription Plan</label>
              <select
                value={newUser.subscription_plan}
                onChange={(e) => setNewUser({ ...newUser, subscription_plan: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d] sm:text-sm rounded-lg text-[#2C2C2C]"
              >
                <option value="free">Free</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_admin"
                checked={newUser.is_admin}
                onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                className="h-4 w-4 text-[#f2070d] focus:ring-[#f2070d] border-[#e5e5e5] rounded"
              />
              <label htmlFor="is_admin" className="ml-2 block text-sm font-medium text-[#2C2C2C]">
                Admin User
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_password"
                checked={showPasswordFields}
                onChange={(e) => setShowPasswordFields(e.target.checked)}
                className="h-4 w-4 text-[#f2070d] focus:ring-[#f2070d] border-[#e5e5e5] rounded"
              />
              <label htmlFor="show_password" className="ml-2 block text-sm font-medium text-[#2C2C2C]">
                Set password manually
              </label>
            </div>

            {showPasswordFields && (
              <div>
                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                  className="border-2 border-[#e5e5e5] focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
                />
                <p className="mt-1 text-xs text-[#666666]">
                  If not set, a random password will be generated and sent via email
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t-2 border-[#e5e5e5]">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewUser({
                    full_name: '',
                    email: '',
                    phone: '',
                    company: '',
                    subscription_plan: 'free',
                    is_admin: false,
                    password: ''
                  })
                  setShowPasswordFields(false)
                }}
                className="border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#f8f8f8]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: Implement create user functionality
                  toast.info('Create user functionality will be implemented in the next phase')
                  setShowCreateModal(false)
                }}
                className="bg-[#f2070d] text-white hover:bg-[#d10609]"
              >
                Create User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default UserManagement