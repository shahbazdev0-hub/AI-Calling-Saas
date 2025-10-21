// src/Components/ui/Input.jsx
// ===========================================
import { forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  type = 'text',
  fullWidth = true,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  onPasswordToggle,
  ...props 
}, ref) => {
  const hasError = !!error
  
  const inputClasses = `
    block px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-1 sm:text-sm transition-colors
    ${hasError 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
    }
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input ref={ref} type={type} className={inputClasses} {...props} />
        
        {rightIcon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{rightIcon}</span>
          </div>
        )}
        
        {showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none" onClick={onPasswordToggle}>
              {type === 'password' ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input