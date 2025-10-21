// // calls/CallAnalytics.jsx this is real data only change this col,or scheme according to mock data
// import React, { useState, useEffect } from "react";
// import { TrendingUp, Phone, Clock, Target, Calendar } from "lucide-react";
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import Card from "../../../Components/ui/Card";
// import { callService } from "../../../services/call";
// import { format, subDays } from "date-fns";

// const CallAnalytics = () => {
//   const [stats, setStats] = useState(null);
//   const [callTrends, setCallTrends] = useState([]);
//   const [outcomeData, setOutcomeData] = useState([]);
//   const [sentimentData, setSentimentData] = useState([]);
//   const [dateRange, setDateRange] = useState('7days');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadAnalytics();
//   }, [dateRange]);

//   const loadAnalytics = async () => {
//     setIsLoading(true);
//     try {
//       // Get call statistics
//       const statsData = await callService.getCallStats();
//       setStats(statsData);

//       // Get date range
//       const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
//       const fromDate = subDays(new Date(), days).toISOString();

//       // Get calls for the period
//       const calls = await callService.getCalls({
//         from_date: fromDate,
//         limit: 1000
//       });

//       // Process call trends
//       const trendsMap = {};
//       calls.forEach(call => {
//         const date = format(new Date(call.created_at), 'MMM dd');
//         trendsMap[date] = (trendsMap[date] || 0) + 1;
//       });

//       const trends = Object.entries(trendsMap).map(([date, count]) => ({
//         date,
//         calls: count
//       }));
//       setCallTrends(trends);

//       // Get call logs for outcome and sentiment analysis
//       const logsPromises = calls
//         .filter(call => call.status === 'completed')
//         .slice(0, 100) // Limit to 100 for performance
//         .map(async (call) => {
//           try {
//             return await callService.getCallLog(call._id);
//           } catch (error) {
//             return null;
//           }
//         });

//       const logs = (await Promise.all(logsPromises)).filter(log => log !== null);

//       // Process outcome data
//       const outcomeMap = {};
//       logs.forEach(log => {
//         const outcome = log.outcome || 'unknown';
//         outcomeMap[outcome] = (outcomeMap[outcome] || 0) + 1;
//       });

//       const outcomes = Object.entries(outcomeMap).map(([name, value]) => ({
//         name: name.replace('_', ' '),
//         value
//       }));
//       setOutcomeData(outcomes);

//       // Process sentiment data
//       const sentimentMap = {};
//       logs.forEach(log => {
//         if (log.sentiment) {
//           sentimentMap[log.sentiment] = (sentimentMap[log.sentiment] || 0) + 1;
//         }
//       });

//       const sentiments = Object.entries(sentimentMap).map(([name, value]) => ({
//         name,
//         value
//       }));
//       setSentimentData(sentiments);

//     } catch (error) {
//       console.error('Failed to load analytics:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const COLORS = {
//     successful: '#10B981',
//     needs_followup: '#F59E0B',
//     no_answer: '#6B7280',
//     unsuccessful: '#EF4444',
//     positive: '#10B981',
//     neutral: '#3B82F6',
//     negative: '#EF4444'
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Call Analytics</h1>
//           <p className="text-gray-600 mt-1">
//             Track and analyze your call performance
//           </p>
//         </div>

//         {/* Date Range Selector */}
//         <select
//           value={dateRange}
//           onChange={(e) => setDateRange(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="7days">Last 7 Days</option>
//           <option value="30days">Last 30 Days</option>
//           <option value="90days">Last 90 Days</option>
//         </select>
//       </div>

//       {/* Key Metrics */}
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.total_calls}</p>
//               </div>
//               <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
//                 <Phone size={24} />
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Completed</p>
//                 <p className="text-3xl font-bold text-green-600">{stats.completed_calls}</p>
//               </div>
//               <div className="p-3 bg-green-100 text-green-600 rounded-lg">
//                 <Target size={24} />
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Avg Duration</p>
//                 <p className="text-3xl font-bold text-purple-600">
//                   {Math.floor(stats.average_duration / 60)}:{(Math.floor(stats.average_duration % 60)).toString().padStart(2, '0')}
//                 </p>
//               </div>
//               <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
//                 <Clock size={24} />
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Success Rate</p>
//                 <p className="text-3xl font-bold text-blue-600">
//                   {stats.total_calls > 0 
//                     ? Math.round((stats.completed_calls / stats.total_calls) * 100)
//                     : 0}%
//                 </p>
//               </div>
//               <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
//                 <TrendingUp size={24} />
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Call Trends Chart */}
//       <Card className="p-6">
//         <h2 className="text-xl font-bold mb-4 flex items-center">
//           <Calendar size={20} className="mr-2" />
//           Call Volume Trend
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={callTrends}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="calls" 
//               stroke="#3B82F6" 
//               strokeWidth={2}
//               name="Number of Calls"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Outcome Distribution */}
//         <Card className="p-6">
//           <h2 className="text-xl font-bold mb-4">Call Outcomes</h2>
//           {outcomeData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={outcomeData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {outcomeData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={COLORS[entry.name.toLowerCase().replace(' ', '_')] || '#6B7280'} 
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No outcome data available
//             </div>
//           )}
//         </Card>

//         {/* Sentiment Distribution */}
//         <Card className="p-6">
//           <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
//           {sentimentData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={sentimentData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" name="Count">
//                   {sentimentData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={COLORS[entry.name.toLowerCase()] || '#6B7280'} 
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No sentiment data available
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CallAnalytics;

// CallAnalytics.jsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Phone,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Mock data for development
const mockCallTrends = [
  { date: "Oct 01", calls: 45 },
  { date: "Oct 02", calls: 52 },
  { date: "Oct 03", calls: 48 },
  { date: "Oct 04", calls: 65 },
  { date: "Oct 05", calls: 58 },
  { date: "Oct 06", calls: 72 },
  { date: "Oct 07", calls: 68 },
];

const mockOutcomeData = [
  { name: "Successful", value: 156 },
  { name: "Needs Followup", value: 89 },
  { name: "No Answer", value: 45 },
  { name: "Unsuccessful", value: 23 },
];

const mockSentimentData = [
  { name: "Positive", value: 145 },
  { name: "Neutral", value: 98 },
  { name: "Negative", value: 32 },
];

const mockStats = {
  total_calls: 313,
  completed_calls: 268,
  average_duration: 245,
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl ${className}`}>{children}</div>
);

const CallAnalytics = () => {
  const [stats, setStats] = useState(mockStats);
  const [callTrends, setCallTrends] = useState(mockCallTrends);
  const [outcomeData, setOutcomeData] = useState(mockOutcomeData);
  const [sentimentData, setSentimentData] = useState(mockSentimentData);
  const [dateRange, setDateRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(false);

  const COLORS = {
    successful: "#f2070d",
    needs_followup: "#FF6B6B",
    no_answer: "#2C2C2C",
    unsuccessful: "#f2070d",
    positive: "#f2070d",
    neutral: "#FF6B6B",
    negative: "#f2070d",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Call Analytics</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Track and analyze your call performance
            </p>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Calls */}
            <Card className="p-6 bg-gradient-to-br from-[#f2070d] to-[#FF6B6B] shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-2">Total Calls</p>
                  <p className="text-4xl font-bold text-white">{stats.total_calls}</p>
                </div>
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Phone size={28} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Completed */}
            <Card className="p-6 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-2">Completed</p>
                  <p className="text-4xl font-bold text-white">
                    {stats.completed_calls}
                  </p>
                </div>
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Target size={28} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Avg Duration */}
            <Card className="p-6 bg-gradient-to-br from-[#f2070d] to-[#f2070d] shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-2">Avg Duration</p>
                  <p className="text-4xl font-bold text-white">
                    {Math.floor(stats.average_duration / 60)}:
                    {Math.floor(stats.average_duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </p>
                </div>
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Clock size={28} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Success Rate */}
            <Card className="p-6 bg-gradient-to-br from-[#FF6B6B] to-[#f2070d] shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-2">Success Rate</p>
                  <p className="text-4xl font-bold text-white">
                    {stats.total_calls > 0
                      ? Math.round(
                          (stats.completed_calls / stats.total_calls) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp size={28} className="text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Call Volume Trend - UPDATED FOR BLACK CONTOUR LINE */}
        <Card className="p-8 bg-white shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
            <Calendar size={24} className="mr-3 text-[#f2070d]" />
            Call Volume Trend
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={callTrends}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f2070d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f2070d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '14px' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                  color: "#333"
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#f2070d"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCalls)"
              />
              {/* Added Line component for the black contour line */}
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#2C2C2C" // Black color from COLORS object
                strokeWidth={1}   // Thinner line for contour
                dot={false}       // Hide data points on this line
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Outcomes */}
          <Card className="p-8 bg-white shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Call Outcomes</h2>
            {outcomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            entry.name.toLowerCase().replace(" ", "_")
                          ] || "#6B7280"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e5e5",
                      borderRadius: "8px",
                      color: "#333"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No outcome data available
              </div>
            )}
          </Card>

          {/* Sentiment Analysis */}
          <Card className="p-8 bg-white shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Sentiment Analysis</h2>
            {sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    stroke="#666"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e5e5",
                      borderRadius: "8px",
                      color: "#333"
                    }}
                  />
                  <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name.toLowerCase()] || "#118AB2"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No sentiment data available
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallAnalytics;


