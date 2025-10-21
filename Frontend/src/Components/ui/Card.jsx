// // 1. src/Components/ui/Card.jsx
// // ===========================================
// const Card = ({ 
//   children, 
//   className = '', 
//   padding = 'medium',
//   shadow = 'medium',
//   border = true,
//   hover = false,
//   ...props 
// }) => {
//   const paddingClasses = {
//     none: '',
//     small: 'p-4',
//     medium: 'p-6',
//     large: 'p-8'
//   }

//   const shadowClasses = {
//     none: '',
//     small: 'shadow-sm',
//     medium: 'shadow',
//     large: 'shadow-lg',
//     xl: 'shadow-xl'
//   }

//   const cardClasses = `bg-white rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${border ? 'border border-gray-200' : ''} ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`

//   return <div className={cardClasses} {...props}>{children}</div>
// }

// // Card sub-components
// const CardHeader = ({ children, className = '' }) => (
//   <div className={`mb-4 ${className}`}>{children}</div>
// )

// const CardTitle = ({ children, className = '' }) => (
//   <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
// )

// const CardDescription = ({ children, className = '' }) => (
//   <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
// )

// const CardContent = ({ children, className = '' }) => (
//   <div className={className}>{children}</div>
// )

// const CardFooter = ({ children, className = '' }) => (
//   <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>
// )

// Card.Header = CardHeader
// Card.Title = CardTitle
// Card.Description = CardDescription
// Card.Content = CardContent
// Card.Footer = CardFooter

// export default Card




// frontend/src/Components/ui/Card.jsx
import React from "react";

const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  shadow = 'medium',
  border = true,
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow',
    large: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const cardClasses = `bg-white rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${
    border ? 'border border-gray-200' : ''
  } ${
    hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
  } ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card sub-components
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
