// // common/ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom"
// import { useAuth } from "../../hooks/useAuth"
// // import LoadingSpinner from "../common/LoadingSpinner"
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { isAuthenticated, user, loading, isAdmin } = useAuth()
//   const location = useLocation()
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="large" text="Loading..." />
//       </div>
//     )
//   }
//   if (!isAuthenticated) {
//     // Redirect to login page with return url
//     return <Navigate to="/login" state={{ from: location }} replace />
//   }
//   // Check if user has required role
//   if (requiredRole === "admin" && !isAdmin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
//           <button
//             onClick={() => window.history.back()}
//             className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     )
//   }
//   return children
// }
// export default ProtectedRoute


// common/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
 import LoadingSpinner from "../common/LoadingSpinner"
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth()
  const location = useLocation()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    )
  }
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // Check if user has required role
  if (requiredRole === "admin" && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  return children
}
export default ProtectedRoute