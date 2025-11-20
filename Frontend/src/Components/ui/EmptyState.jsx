// // frontend/src/components/ui/EmptyState.jsx

// import Button from './Button';

// const EmptyState = ({ 
//   icon, 
//   title, 
//   description, 
//   actionLabel, 
//   onAction 
// }) => {
//   return (
//     <div className="text-center py-12">
//       {icon && (
//         <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
//           {icon}
//         </div>
//       )}
//       <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
//       {description && (
//         <p className="mt-1 text-sm text-gray-500">{description}</p>
//       )}
//       {actionLabel && onAction && (
//         <div className="mt-6">
//           <Button onClick={onAction}>{actionLabel}</Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmptyState;

// frontend/src/components/ui/EmptyState.jsx

import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon,
  title, 
  description, 
  actionLabel, 
  onAction,
  action
}) => {
  // Handle action prop (for compatibility with different usage patterns)
  const buttonLabel = actionLabel || (action && action.label);
  const buttonOnClick = onAction || (action && action.onClick);

  // Safely render icon
  const renderIcon = () => {
    if (!Icon) return null;
    
    try {
      if (typeof Icon === 'function') {
        return <Icon className="h-12 w-12" />;
      }
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
    <div className="text-center py-12">
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center">
          {renderIcon()}
        </div>
      )}
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {buttonLabel && buttonOnClick && (
        <div className="mt-6">
          <Button onClick={buttonOnClick}>{buttonLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;