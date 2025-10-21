// call/callhistory.jsx
import React, { useState, useEffect } from "react";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Calendar } from "lucide-react";
import { useCall } from "../../hooks/useCall";
import { format } from "date-fns";
import Card from "../../Components/ui/Card"
import Button from "../ui/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const CallHistory = ({ onCallSelect }) => {
  const { getCallHistory, isLoading } = useCall();
  const [calls, setCalls] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    direction: '',
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    loadCalls();
  }, [filters]);

  const loadCalls = async () => {
    try {
      const data = await getCallHistory(filters);
      setCalls(data);
    } catch (error) {
      console.error('Failed to load calls:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      'no-answer': 'bg-yellow-100 text-yellow-800',
      busy: 'bg-orange-100 text-orange-800'
    };

    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading && calls.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.direction}
            onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Directions</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="no-answer">No Answer</option>
            <option value="busy">Busy</option>
          </select>

          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="To Date"
          />
        </div>
      </Card>

      {/* Call List */}
      <div className="space-y-3">
        {calls.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No calls found
          </Card>
        ) : (
          calls.map((call) => (
            <Card
              key={call._id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onCallSelect && onCallSelect(call)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Direction Icon */}
                  <div className={`p-3 rounded-full ${
                    call.direction === 'inbound' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {call.direction === 'inbound' ? (
                      <PhoneIncoming size={20} />
                    ) : (
                      <PhoneOutgoing size={20} />
                    )}
                  </div>

                  {/* Call Details */}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {call.direction === 'inbound' ? call.from_number : call.to_number}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {format(new Date(call.created_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {format(new Date(call.created_at), 'hh:mm a')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Duration */}
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(call.status)}`}>
                    {call.status}
                  </span>
                  {call.duration > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                      {formatDuration(call.duration)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CallHistory;
