// frontend/src/Pages/dashboard/Overview.jsx - FIXED IMPORT
import { useState, useEffect } from "react"
import { Phone, TrendingUp, DollarSign, Clock, RefreshCw } from "lucide-react"
import Card from "../../Components/ui/Card"
import { callService } from "../../services/call"
import { formatDuration, formatCurrency } from "../../utils/helpers" // ✅ FIXED: Changed from formatters to helpers
import toast from "react-hot-toast"

const Overview = () => {
  const [stats, setStats] = useState({
    total_calls: 0,
    completed_calls: 0,
    failed_calls: 0,
    success_rate: 0,
    inbound_calls: 0,
    outbound_calls: 0
  })
  const [recentCalls, setRecentCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // ✅ Load REAL statistics from backend
      const statsData = await callService.getCallStats()
      console.log('📊 Real Stats:', statsData)
      setStats(statsData)
      
      // ✅ Load REAL recent calls from backend
      const callsData = await callService.getCalls({ limit: 10 })
      console.log('📞 Real Recent Calls:', callsData)
      setRecentCalls(callsData)
      
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast.success('Dashboard refreshed!')
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
      case 'busy':
      case 'no-answer':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
      case 'ringing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your call center today</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calls Today */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calls Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_calls}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Success Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.success_rate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {stats.completed_calls} completed / {stats.total_calls} total
          </div>
        </Card>

        {/* Revenue Today */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                $0
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Revenue tracking coming soon
          </div>
        </Card>

        {/* Avg Duration */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                0m 0s
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Duration tracking coming soon
          </div>
        </Card>
      </div>

      {/* Recent Calls Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Calls</h2>
          <span className="text-sm text-gray-600">
            Total: {stats.total_calls} call{stats.total_calls !== 1 ? 's' : ''}
          </span>
        </div>

        {recentCalls.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Calls Yet</h3>
            <p className="text-gray-600">
              Start making calls to see them appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCalls.map((call) => (
                  <tr key={call._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {call.phone_number || call.to_number || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatTime(call.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {call.duration ? formatDuration(call.duration) : '0:00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {call.direction || 'Outbound'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Overview