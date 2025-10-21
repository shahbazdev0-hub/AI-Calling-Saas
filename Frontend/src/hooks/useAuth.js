// src/hooks/useAuth.js
// Re-export the useAuth hook from AuthContext
export { useAuth } from "../contexts/AuthContext"

// Also provide a default export for flexibility
import { useAuth } from "../contexts/AuthContext"
export default useAuth