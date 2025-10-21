// common/loadingSpinner.jx
import { Loader2 } from "lucide-react"
import clsx from "clsx"

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '', 
  text = '',
  centered = false 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  }

  const spinnerContent = (
    <>
      <Loader2 
        className={clsx(
          'animate-spin text-primary-600',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <span className={clsx(
          'ml-2 text-gray-600',
          textSizeClasses[size]
        )}>
          {text}
        </span>
      )}
    </>
  )

  if (centered) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {spinnerContent}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {spinnerContent}
    </div>
  )
}

export default LoadingSpinner