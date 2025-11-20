// // frontend/src/components/ui/StatCard.jsx

// const StatCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
//   const colorClasses = {
//     blue: 'bg-blue-50 text-blue-600',
//     green: 'bg-green-50 text-green-600',
//     yellow: 'bg-yellow-50 text-yellow-600',
//     red: 'bg-red-50 text-red-600',
//     purple: 'bg-purple-50 text-purple-600'
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           {trend && (
//             <div className="flex items-center mt-2">
//               <span className={`text-sm font-medium ${
//                 trend === 'up' ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {trend === 'up' ? '↑' : '↓'} {trendValue}
//               </span>
//               <span className="text-sm text-gray-500 ml-2">vs last period</span>
//             </div>
//           )}
//         </div>
//         {icon && (
//           <div className={`p-3 rounded-full ${colorClasses[color]}`}>
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StatCard;

// frontend/src/components/ui/StatCard.jsx

import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  trendLabel,
  color = 'blue',
  gradient,
  onClick 
}) => {
  // Color classes for icon background
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  // Determine trend direction and value
  let trendDirection = null;
  let displayTrendValue = trendValue;

  // Handle trend as object or string
  if (trend && typeof trend === 'object') {
    trendDirection = trend.isPositive ? 'up' : 'down';
    displayTrendValue = trend.value;
  } else if (trend === 'up' || trend === 'down') {
    trendDirection = trend;
  }

  // Safely render icon
  const renderIcon = () => {
    if (!Icon) return null;
    
    try {
      // Check if Icon is a valid React component
      if (typeof Icon === 'function') {
        return <Icon className="h-6 w-6" />;
      }
      // If it's already a React element
      if (React.isValidElement(Icon)) {
        return Icon;
      }
      return null;
    } catch (error) {
      console.error('Error rendering icon:', error);
      return null;
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value ?? 0}</p>
          {(trendDirection || displayTrendValue !== undefined) && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trendDirection === 'up' ? 'text-green-600' : 
                trendDirection === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trendDirection === 'up' && '↑ '}
                {trendDirection === 'down' && '↓ '}
                {displayTrendValue}
              </span>
              {trendLabel && (
                <span className="text-sm text-gray-500 ml-2">{trendLabel}</span>
              )}
              {!trendLabel && trendDirection && (
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${gradient ? `bg-gradient-to-r ${gradient} text-white` : colorClasses[color] || colorClasses.blue}`}>
            {renderIcon()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;