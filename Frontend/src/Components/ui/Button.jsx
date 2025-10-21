// // Button.jsx
// import { forwardRef } from "react"
// import clsx from "clsx"
// import { Loader2 } from "lucide-react"

// const Button = forwardRef(({ 
//   children, 
//   variant = 'primary', 
//   size = 'medium',
//   loading = false,
//   disabled = false,
//   fullWidth = false,
//   leftIcon = null,
//   rightIcon = null,
//   className = '',
//   ...props 
// }, ref) => {
//   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
//   const variants = {
//   primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
//   secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
//   outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
//   ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
//   danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//   success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
// }
  
//   const sizes = {
//     small: 'px-3 py-2 text-sm',
//     medium: 'px-4 py-2 text-sm',
//     large: 'px-6 py-3 text-base',
//   }
  
//   const isDisabled = disabled || loading

//   return (
//     <button
//       ref={ref}
//       className={clsx(
//         baseClasses,
//         variants[variant],
//         sizes[size],
//         fullWidth && 'w-full',
//         className
//       )}
//       disabled={isDisabled}
//       {...props}
//     >
//       {loading ? (
//         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//       ) : (
//         leftIcon && <span className="mr-2">{leftIcon}</span>
//       )}
//       {children}
//       {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
//     </button>
//   )
// })

// Button.displayName = 'Button'

// export default Button

import { forwardRef } from "react"
import clsx from "clsx"
import { Loader2 } from "lucide-react"

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  ...props 
}, ref) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    // ✅ Changed from blue → teal (DemoBooking button style)
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600 shadow-lg shadow-primary-600/30',

    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-600',

    outline:
      'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-600',

    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',

    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',

    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  }

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
