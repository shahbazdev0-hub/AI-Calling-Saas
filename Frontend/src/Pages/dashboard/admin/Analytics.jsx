// // frontend/src/Pages/dashboard/admin/Analytics.jsx - COMPLETE CORRECTED FILE

// import { useState, useEffect } from "react"
// import { 
//   BarChart3, TrendingUp, Users, Phone, Clock, CheckCircle, 
//   XCircle, Activity, DollarSign, AlertCircle, Download, Calendar,
//   PhoneCall, MessageSquare, ThumbsUp, ThumbsDown, Minus
// } from "lucide-react"
// import Card from "../../../Components/ui/Card"
// import Button from "../../../Components/ui/Button"
// import { 
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   AreaChart, Area
// } from "recharts"
// import api from "../../../services/api"
// import { toast } from "react-hot-toast"

// const Analytics = () => {
//   const [loading, setLoading] = useState(true)
//   const [analyticsData, setAnalyticsData] = useState(null)
//   const [dateRange, setDateRange] = useState('7days')
//   const [selectedView, setSelectedView] = useState('overview')
//   const [callDetailsPage, setCallDetailsPage] = useState(1)
//   const [callDetails, setCallDetails] = useState({ calls: [], total: 0, pages: 0 })

//   useEffect(() => {
//     fetchAnalytics()
//   }, [dateRange])

//   useEffect(() => {
//     if (selectedView === 'calls') {
//       fetchCallDetails()
//     }
//   }, [selectedView, callDetailsPage])

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       const toDate = new Date()
//       const fromDate = new Date()
      
//       switch(dateRange) {
//         case '7days':
//           fromDate.setDate(fromDate.getDate() - 7)
//           break
//         case '30days':
//           fromDate.setDate(fromDate.getDate() - 30)
//           break
//         case '90days':
//           fromDate.setDate(fromDate.getDate() - 90)
//           break
//         case 'all':
//           fromDate.setFullYear(2020)
//           break
//         default:
//           fromDate.setDate(fromDate.getDate() - 7)
//       }

//       const response = await api.get('/analytics/admin/overview', {
//         params: {
//           from_date: fromDate.toISOString(),
//           to_date: toDate.toISOString()
//         }
//       })

//       setAnalyticsData(response.data)
//     } catch (error) {
//       console.error('Failed to fetch analytics:', error)
//       toast.error('Failed to load analytics data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCallDetails = async () => {
//     try {
//       const response = await api.get('/analytics/admin/call-details', {
//         params: {
//           skip: (callDetailsPage - 1) * 50,
//           limit: 50
//         }
//       })

//       setCallDetails(response.data)
//     } catch (error) {
//       console.error('Failed to fetch call details:', error)
//       toast.error('Failed to load call details')
//     }
//   }

//   const exportData = () => {
//     if (!analyticsData) return
    
//     const dataStr = JSON.stringify(analyticsData, null, 2)
//     const dataBlob = new Blob([dataStr], { type: 'application/json' })
//     const url = URL.createObjectURL(dataBlob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
//     link.click()
    
//     toast.success('Analytics data exported successfully')
//   }

//   const formatDuration = (seconds) => {
//     const hrs = Math.floor(seconds / 3600)
//     const mins = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
    
//     if (hrs > 0) {
//       return `${hrs}h ${mins}m ${secs}s`
//     } else if (mins > 0) {
//       return `${mins}m ${secs}s`
//     } else {
//       return `${secs}s`
//     }
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString()
//   }

//   const COLORS = {
//     primary: '#3B82F6',
//     success: '#10B981',
//     warning: '#F59E0B',
//     danger: '#EF4444',
//     info: '#6366F1',
//     purple: '#8B5CF6',
//     pink: '#EC4899'
//   }

//   const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     )
//   }

//   if (!analyticsData) {
//     return (
//       <div className="p-6">
//         <Card className="p-8 text-center">
//           <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
//           <p className="text-gray-600">No analytics data available for the selected period.</p>
//         </Card>
//       </div>
//     )
//   }

//   const { overview, call_trends, outcome_distribution, sentiment_distribution, top_users, hourly_distribution } = analyticsData

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
//           <p className="text-gray-600 mt-1">Comprehensive insights across all users</p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <select
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//           >
//             <option value="7days">Last 7 Days</option>
//             <option value="30days">Last 30 Days</option>
//             <option value="90days">Last 90 Days</option>
//             <option value="all">All Time</option>
//           </select>
          
//           <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Export Data
//           </Button>
//         </div>
//       </div>

//       {/* View Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="flex gap-8">
//           <button
//             onClick={() => setSelectedView('overview')}
//             className={`pb-4 px-1 border-b-2 font-medium text-sm ${
//               selectedView === 'overview'
//                 ? 'border-primary-600 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setSelectedView('calls')}
//             className={`pb-4 px-1 border-b-2 font-medium text-sm ${
//               selectedView === 'calls'
//                 ? 'border-primary-600 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Call Details
//           </button>
//           <button
//             onClick={() => setSelectedView('users')}
//             className={`pb-4 px-1 border-b-2 font-medium text-sm ${
//               selectedView === 'users'
//                 ? 'border-primary-600 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Top Users
//           </button>
//         </nav>
//       </div>

//       {/* Overview Tab */}
//       {selectedView === 'overview' && (
//         <>
//           {/* Key Metrics */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-blue-600">Total Calls</p>
//                   <p className="text-3xl font-bold text-blue-900 mt-2">{overview.total_calls}</p>
//                   <p className="text-xs text-blue-600 mt-1">
//                     {overview.completed_calls} completed
//                   </p>
//                 </div>
//                 <div className="p-3 bg-blue-200 rounded-lg">
//                   <Phone className="h-8 w-8 text-blue-600" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-green-600">Success Rate</p>
//                   <p className="text-3xl font-bold text-green-900 mt-2">{overview.success_rate}%</p>
//                   <p className="text-xs text-green-600 mt-1">
//                     {overview.conversion_rate}% conversion
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-200 rounded-lg">
//                   <CheckCircle className="h-8 w-8 text-green-600" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-purple-600">Active Users</p>
//                   <p className="text-3xl font-bold text-purple-900 mt-2">{overview.active_users}</p>
//                   <p className="text-xs text-purple-600 mt-1">
//                     of {overview.total_users} total users
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-200 rounded-lg">
//                   <Users className="h-8 w-8 text-purple-600" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-orange-600">Avg Duration</p>
//                   <p className="text-3xl font-bold text-orange-900 mt-2">
//                     {Math.floor(overview.avg_duration_seconds / 60)}m
//                   </p>
//                   <p className="text-xs text-orange-600 mt-1">
//                     {formatDuration(overview.total_duration_seconds)} total
//                   </p>
//                 </div>
//                 <div className="p-3 bg-orange-200 rounded-lg">
//                   <Clock className="h-8 w-8 text-orange-600" />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Charts Row 1 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Trends</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={call_trends}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area type="monotone" dataKey="calls" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Card>

//             <Card className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Outcomes</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={outcome_distribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {outcome_distribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Card>
//           </div>

//           {/* Charts Row 2 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={sentiment_distribution}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill={COLORS.info} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>

//             <Card className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Call Distribution</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={hourly_distribution}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="hour" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="calls" stroke={COLORS.purple} strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Card>
//           </div>
//         </>
//       )}

//       {/* Call Details Tab */}
//       {selectedView === 'calls' && (
//         <Card className="overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     To Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Duration
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Outcome
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Sentiment
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Summary
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Time
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {callDetails.calls.map((call) => (
//                   <tr key={call._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex flex-col">
//                         <div className="text-sm font-medium text-gray-900">
//                           {call.user?.name || 'Unknown'}
//                         </div>
//                         <div className="text-xs text-gray-500">{call.user?.email}</div>
//                         {call.user?.company && (
//                           <div className="text-xs text-gray-400">{call.user.company}</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{call.to_number}</div>
//                       <div className="text-xs text-gray-500">{call.call_sid?.substring(0, 20)}...</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         call.status === 'completed' ? 'bg-green-100 text-green-800' :
//                         call.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                         call.status === 'failed' ? 'bg-red-100 text-red-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {call.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDuration(call.duration)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {call.log?.outcome ? (
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           call.log.outcome === 'successful' || call.log.outcome === 'converted' 
//                             ? 'bg-green-100 text-green-800' :
//                           call.log.outcome === 'failed' || call.log.outcome === 'no_answer'
//                             ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {call.log.outcome.replace('_', ' ')}
//                         </span>
//                       ) : (
//                         <span className="text-gray-400 text-xs">N/A</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {call.log?.sentiment ? (
//                         <div className="flex items-center">
//                           {call.log.sentiment === 'positive' && (
//                             <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
//                           )}
//                           {call.log.sentiment === 'negative' && (
//                             <ThumbsDown className="h-4 w-4 text-red-500 mr-1" />
//                           )}
//                           {call.log.sentiment === 'neutral' && (
//                             <Minus className="h-4 w-4 text-gray-500 mr-1" />
//                           )}
//                           <span className="text-sm text-gray-700 capitalize">
//                             {call.log.sentiment}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400 text-xs">N/A</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 max-w-xs truncate">
//                         {call.log?.summary || 'No summary available'}
//                       </div>
//                       {call.log?.keywords && call.log.keywords.length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {call.log.keywords.slice(0, 3).map((keyword, idx) => (
//                             <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
//                               {keyword}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(call.created_at)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {callDetails.pages > 1 && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <Button
//                   onClick={() => setCallDetailsPage(prev => Math.max(1, prev - 1))}
//                   disabled={callDetailsPage === 1}
//                   variant="outline"
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={() => setCallDetailsPage(prev => Math.min(callDetails.pages, prev + 1))}
//                   disabled={callDetailsPage === callDetails.pages}
//                   variant="outline"
//                 >
//                   Next
//                 </Button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{((callDetailsPage - 1) * 50) + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(callDetailsPage * 50, callDetails.total)}
//                     </span> of{' '}
//                     <span className="font-medium">{callDetails.total}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <Button
//                       onClick={() => setCallDetailsPage(prev => Math.max(1, prev - 1))}
//                       disabled={callDetailsPage === 1}
//                       variant="outline"
//                       className="rounded-l-md"
//                     >
//                       Previous
//                     </Button>
//                     <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {callDetailsPage} of {callDetails.pages}
//                     </span>
//                     <Button
//                       onClick={() => setCallDetailsPage(prev => Math.min(callDetails.pages, prev + 1))}
//                       disabled={callDetailsPage === callDetails.pages}
//                       variant="outline"
//                       className="rounded-r-md"
//                     >
//                       Next
//                     </Button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Card>
//       )}

//       {/* Top Users Tab */}
//       {selectedView === 'users' && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Users by Calls</h3>
//             <div className="space-y-4">
//               {top_users.map((user, index) => (
//                 <div key={user.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                       index === 0 ? 'bg-yellow-100 text-yellow-600' :
//                       index === 1 ? 'bg-gray-100 text-gray-600' :
//                       index === 2 ? 'bg-orange-100 text-orange-600' :
//                       'bg-blue-100 text-blue-600'
//                     } font-bold`}>
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">{user.name}</div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                       {user.company && (
//                         <div className="text-xs text-gray-400">{user.company}</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900">{user.call_count}</div>
//                     <div className="text-xs text-gray-500">calls</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           <Card className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Distribution</h3>
//             <ResponsiveContainer width="100%" height={500}>
//               <BarChart data={top_users} layout="horizontal">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={150} />
//                 <Tooltip />
//                 <Bar dataKey="call_count" fill={COLORS.primary} />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Analytics


// frontend/src/Pages/dashboard/admin/Analytics.jsx - COMPLETE CORRECTED FILE WITH NEW COLOR SCHEME

import { useState, useEffect } from "react"
import { 
  BarChart3, TrendingUp, Users, Phone, Clock, CheckCircle, 
  XCircle, Activity, DollarSign, AlertCircle, Download, Calendar,
  PhoneCall, MessageSquare, ThumbsUp, ThumbsDown, Minus, Target
} from "lucide-react"
import Card from "../../../Components/ui/Card"
import Button from "../../../Components/ui/Button"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts"
import api from "../../../services/api"
import { toast } from "react-hot-toast"

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [dateRange, setDateRange] = useState('7days')
  const [selectedView, setSelectedView] = useState('overview')
  const [callDetailsPage, setCallDetailsPage] = useState(1)
  const [callDetails, setCallDetails] = useState({ calls: [], total: 0, pages: 0 })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  useEffect(() => {
    if (selectedView === 'calls') {
      fetchCallDetails()
    }
  }, [selectedView, callDetailsPage])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const toDate = new Date()
      const fromDate = new Date()
      
      switch(dateRange) {
        case '7days':
          fromDate.setDate(fromDate.getDate() - 7)
          break
        case '30days':
          fromDate.setDate(fromDate.getDate() - 30)
          break
        case '90days':
          fromDate.setDate(fromDate.getDate() - 90)
          break
        case 'all':
          fromDate.setFullYear(2020)
          break
        default:
          fromDate.setDate(fromDate.getDate() - 7)
      }

      const response = await api.get('/analytics/admin/overview', {
        params: {
          from_date: fromDate.toISOString(),
          to_date: toDate.toISOString()
        }
      })

      setAnalyticsData(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCallDetails = async () => {
    try {
      const response = await api.get('/analytics/admin/call-details', {
        params: {
          skip: (callDetailsPage - 1) * 50,
          limit: 50
        }
      })

      setCallDetails(response.data)
    } catch (error) {
      console.error('Failed to fetch call details:', error)
      toast.error('Failed to load call details')
    }
  }

  const exportData = () => {
    if (!analyticsData) return
    
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    toast.success('Analytics data exported successfully')
  }

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`
    } else if (mins > 0) {
      return `${mins}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const COLORS = {
    primary: '#f2070d',
    secondary: '#FF6B6B',
    dark: '#2C2C2C',
    success: '#f2070d',
    neutral: '#FF6B6B',
    warning: '#2C2C2C'
  }

  const PIE_COLORS = ['#f2070d', '#FF6B6B', '#2C2C2C', '#666666']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#f2070d]"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6 bg-[#f8f8f8] min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-[#666666] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">No Analytics Data</h3>
          <p className="text-[#666666]">No analytics data available for the selected period.</p>
        </Card>
      </div>
    )
  }

  const { overview, call_trends, outcome_distribution, sentiment_distribution, top_users, hourly_distribution } = analyticsData

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#2C2C2C]">Analytics Dashboard</h1>
            <p className="text-lg text-[#666666] mt-2">Comprehensive insights across all users</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border-2 border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d] outline-none bg-white text-[#2C2C2C]"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="border-b-2 border-[#e5e5e5]">
          <nav className="flex gap-8">
            <button
              onClick={() => setSelectedView('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === 'overview'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C] hover:border-[#e5e5e5]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('calls')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === 'calls'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C] hover:border-[#e5e5e5]'
              }`}
            >
              Call Details
            </button>
            <button
              onClick={() => setSelectedView('users')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === 'users'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C] hover:border-[#e5e5e5]'
              }`}
            >
              Top Users
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] border-none hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 uppercase">Total Calls</p>
                    <p className="text-4xl font-bold text-white mt-2">{overview.total_calls}</p>
                    <p className="text-sm text-white/90 mt-1">
                      {overview.completed_calls} completed
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#2C2C2C] to-[#666666] border-none hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 uppercase">Success Rate</p>
                    <p className="text-4xl font-bold text-white mt-2">{overview.success_rate}%</p>
                    <p className="text-sm text-white/90 mt-1">
                      {overview.conversion_rate}% conversion
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#FF6B6B] to-[#f2070d] border-none hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 uppercase">Active Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{overview.active_users}</p>
                    <p className="text-sm text-white/90 mt-1">
                      of {overview.total_users} total users
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#666666] to-[#2C2C2C] border-none hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 uppercase">Avg Duration</p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {Math.floor(overview.avg_duration_seconds / 60)}m
                    </p>
                    <p className="text-sm text-white/90 mt-1">
                      {formatDuration(overview.total_duration_seconds)} total
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-[#f2070d]" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Call Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={call_trends}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f2070d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f2070d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="date" stroke="#666666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666666" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        color: '#333333'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#2C2C2C" 
                      strokeWidth={2}
                      fill="url(#colorCalls)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-[#f2070d]" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Call Outcomes</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={outcome_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {outcome_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        color: '#333333'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-[#f2070d]" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Sentiment Analysis</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentiment_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="name" stroke="#666666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666666" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        color: '#333333'
                      }} 
                    />
                    <Bar dataKey="value" fill="#f2070d" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-[#f2070d]" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Hourly Call Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourly_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="hour" stroke="#666666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666666" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        color: '#333333'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#f2070d" 
                      strokeWidth={2} 
                      dot={{ fill: '#2C2C2C', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {/* Call Details Tab */}
        {selectedView === 'calls' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e5e5]">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      To Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Outcome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Sentiment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Summary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e5e5e5]">
                  {callDetails.calls.map((call) => (
                    <tr key={call._id} className="hover:bg-[#f8f8f8] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-[#2C2C2C]">
                            {call.user?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-[#666666]">{call.user?.email}</div>
                          {call.user?.company && (
                            <div className="text-xs text-[#9ca3af]">{call.user.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#2C2C2C]">{call.to_number}</div>
                        <div className="text-xs text-[#666666]">{call.call_sid?.substring(0, 20)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'completed' ? 'bg-[#f2070d] text-white' :
                          call.status === 'in-progress' ? 'bg-[#FF6B6B] text-white' :
                          call.status === 'failed' ? 'bg-[#2C2C2C] text-white' :
                          'bg-[#e5e5e5] text-[#666666]'
                        }`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C] font-medium">
                        {formatDuration(call.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.log?.outcome ? (
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            call.log.outcome === 'successful' || call.log.outcome === 'converted' 
                              ? 'bg-[#f2070d] text-white' :
                            call.log.outcome === 'failed' || call.log.outcome === 'no_answer'
                              ? 'bg-[#2C2C2C] text-white' :
                            'bg-[#FF6B6B] text-white'
                          }`}>
                            {call.log.outcome.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-[#9ca3af] text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.log?.sentiment ? (
                          <div className="flex items-center">
                            {call.log.sentiment === 'positive' && (
                              <ThumbsUp className="h-4 w-4 text-[#f2070d] mr-1" />
                            )}
                            {call.log.sentiment === 'negative' && (
                              <ThumbsDown className="h-4 w-4 text-[#2C2C2C] mr-1" />
                            )}
                            {call.log.sentiment === 'neutral' && (
                              <Minus className="h-4 w-4 text-[#666666] mr-1" />
                            )}
                            <span className="text-sm text-[#2C2C2C] capitalize font-medium">
                              {call.log.sentiment}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#9ca3af] text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#2C2C2C] max-w-xs truncate">
                          {call.log?.summary || 'No summary available'}
                        </div>
                        {call.log?.keywords && call.log.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {call.log.keywords.slice(0, 3).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-[#f2070d]/10 text-[#f2070d] text-xs rounded font-medium">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                        {formatDate(call.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {callDetails.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t-2 border-[#e5e5e5] sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    onClick={() => setCallDetailsPage(prev => Math.max(1, prev - 1))}
                    disabled={callDetailsPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCallDetailsPage(prev => Math.min(callDetails.pages, prev + 1))}
                    disabled={callDetailsPage === callDetails.pages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#666666]">
                      Showing <span className="font-semibold text-[#2C2C2C]">{((callDetailsPage - 1) * 50) + 1}</span> to{' '}
                      <span className="font-semibold text-[#2C2C2C]">
                        {Math.min(callDetailsPage * 50, callDetails.total)}
                      </span> of{' '}
                      <span className="font-semibold text-[#2C2C2C]">{callDetails.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                      <Button
                        onClick={() => setCallDetailsPage(prev => Math.max(1, prev - 1))}
                        disabled={callDetailsPage === 1}
                        variant="outline"
                        className="rounded-l-lg"
                      >
                        Previous
                      </Button>
                      <span className="relative inline-flex items-center px-4 py-2 border-2 border-[#2C2C2C] bg-white text-sm font-semibold text-[#2C2C2C]">
                        Page {callDetailsPage} of {callDetails.pages}
                      </span>
                      <Button
                        onClick={() => setCallDetailsPage(prev => Math.min(callDetails.pages, prev + 1))}
                        disabled={callDetailsPage === callDetails.pages}
                        variant="outline"
                        className="rounded-r-lg"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Top Users Tab */}
        {selectedView === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-[#f2070d]" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">Top 10 Users by Calls</h3>
              </div>
              <div className="space-y-4">
                {top_users.map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#f2070d]">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        index === 0 ? 'bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] text-white' :
                        index === 1 ? 'bg-gradient-to-br from-[#FF6B6B] to-[#f2070d] text-white' :
                        index === 2 ? 'bg-gradient-to-br from-[#2C2C2C] to-[#666666] text-white' :
                        'bg-[#e5e5e5] text-[#666666]'
                      } font-bold text-lg`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-[#2C2C2C]">{user.name}</div>
                        <div className="text-sm text-[#666666]">{user.email}</div>
                        {user.company && (
                          <div className="text-xs text-[#9ca3af]">{user.company}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#f2070d]">{user.call_count}</div>
                      <div className="text-xs text-[#666666] uppercase font-medium">calls</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-[#f2070d]" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">User Activity Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={top_users} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis type="number" stroke="#666666" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="name" type="category" width={150} stroke="#666666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      color: '#333333'
                    }} 
                  />
                  <Bar dataKey="call_count" fill="#f2070d" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics