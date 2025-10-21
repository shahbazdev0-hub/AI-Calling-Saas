// frontend/src/components/ui/StatCard.jsx

const StatCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;