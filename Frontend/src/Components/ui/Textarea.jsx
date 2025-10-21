// // src/Components/ui/Textarea.jsx
// import React from "react";

// const Textarea = ({ error, className = '', ...props }) => {
//   return (
//     <div>
//       <textarea
//         {...props}
//         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
//       />
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };

// export default Textarea;



// frontend/src/Components/ui/Textarea.jsx
import React from "react"

const Textarea = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  placeholder = '',
  rows = 4,
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = `
    w-full px-4 py-3 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    placeholder-gray-400 text-gray-900 text-base
    resize-y min-h-[100px]
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
  `
  
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea