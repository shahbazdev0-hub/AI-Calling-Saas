// // frontend/src/contexts/AuthContext.jsx - COMPLETE FIX
// import { createContext, useContext, useState, useEffect } from "react"
// import toast from "react-hot-toast"
// import { useNavigate } from "react-router-dom"

// const AuthContext = createContext({})

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   // API base URL
//   const API_BASE_URL = 'http://127.0.0.1:8000'

//   // âœ… FIXED: Better token management
//   const getStoredToken = () => {
//     const token = localStorage.getItem('access_token')
//     console.log('ðŸ” Getting stored token:', token ? 'Found' : 'Not found')
//     return token
//   }

//   const storeToken = (token) => {
//     console.log('ðŸ’¾ Storing token:', token ? 'Yes' : 'No')
//     if (token) {
//       localStorage.setItem('access_token', token)
//       sessionStorage.setItem('access_token', token)
//       console.log('âœ… Token stored successfully')
//     }
//   }

//   const clearToken = () => {
//     console.log('ðŸ—‘ï¸ Clearing tokens')
//     localStorage.removeItem('access_token')
//     sessionStorage.removeItem('access_token')
//   }

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     console.log('ðŸ” Checking authentication...')
//     try {
//       const token = getStoredToken()
      
//       if (!token || token === 'undefined' || token === 'null') {
//         console.log('âŒ No valid token found')
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       console.log('ðŸ“ž Fetching user data with token...')
//       const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       console.log('ðŸ“¨ Auth check response status:', response.status)
      
//       if (response.ok) {
//         const userData = await response.json()
//         setUser(userData)
//         console.log('âœ… Auth check successful:', userData)
//       } else {
//         console.log('âŒ Auth check failed, clearing tokens')
//         clearToken()
//         setUser(null)
//       }
//     } catch (error) {
//       console.error('âŒ Auth check error:', error)
//       clearToken()
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // âœ… FIXED: Simplified login function
//   const login = async (credentials) => {
//     console.log('ðŸ” Login attempt for:', credentials.email)
    
//     try {
//       setLoading(true)
      
//       const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(credentials),
//       })
      
//       console.log('ðŸ“¨ Login response status:', response.status)
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.detail || 'Login failed')
//       }
      
//       const result = await response.json()
//       console.log('âœ… Login response:', result)
      
//       if (!result.access_token) {
//         throw new Error('No access token received')
//       }
      
//       // Store token
//       storeToken(result.access_token)
      
//       // Set user
//       if (result.user) {
//         setUser(result.user)
//         console.log('ðŸ‘¤ User set:', result.user)
//       } else {
//         // If user not in response, fetch it
//         await checkAuth()
//       }
      
//       toast.success('Welcome back!')
//       return result
      
//     } catch (error) {
//       console.error('âŒ Login error:', error)
//       clearToken()
//       setUser(null)
      
//       // Handle specific errors
//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         toast.error('Cannot connect to server. Is the backend running?')
//       } else if (error.message.includes('Invalid credentials')) {
//         toast.error('Invalid email or password')
//       } else {
//         toast.error(error.message || 'Login failed')
//       }
      
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const register = async (userData) => {
//     console.log('ðŸ“ Registration attempt for:', userData.email)
    
//     try {
//       setLoading(true)
      
//       const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.detail || 'Registration failed')
//       }
      
//       const result = await response.json()
//       console.log('âœ… Registration successful:', result)
      
//       // Auto-login after registration
//       if (result.access_token) {
//         storeToken(result.access_token)
//         setUser(result.user)
//         toast.success('Account created successfully!')
//         return { ...result, autoLogin: true }
//       }
      
//       toast.success('Registration successful! Please log in.')
//       return result
      
//     } catch (error) {
//       console.error('âŒ Registration error:', error)
//       toast.error(error.message || 'Registration failed')
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const logout = async () => {
//     console.log('ðŸ‘‹ Logging out...')
//     try {
//       const token = getStoredToken()
//       if (token) {
//         await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         })
//       }
//     } catch (error) {
//       console.error('âŒ Logout error:', error)
//     } finally {
//       clearToken()
//       setUser(null)
//       toast.success('Logged out successfully')
//     }
//   }

//   const updateProfile = async (profileData) => {
//     try {
//       const token = getStoredToken()
//       const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(profileData)
//       })
      
//       if (response.ok) {
//         const updatedUser = await response.json()
//         setUser(updatedUser)
//         toast.success('Profile updated successfully!')
//         return updatedUser
//       } else {
//         throw new Error('Failed to update profile')
//       }
//     } catch (error) {
//       console.error('âŒ Profile update failed:', error)
//       toast.error('Failed to update profile')
//       throw error
//     }
//   }

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     isAdmin: user?.is_admin === true,
//     login,
//     register,
//     logout,
//     updateProfile,
//     checkAuth,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// frontend/src/contexts/AuthContext.jsx - COMPLETE FIX
import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = 'http://127.0.0.1:8000'

  // âœ… UNIFIED TOKEN MANAGEMENT - Use localStorage ONLY
  const getStoredToken = () => {
    const token = localStorage.getItem('access_token')
    console.log('ðŸ” Token check:', token ? 'Found âœ…' : 'Not found âŒ')
    return token
  }

  const storeToken = (token) => {
    console.log('ðŸ’¾ Storing token')
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('access_token', token)
      sessionStorage.setItem('access_token', token) // Backup
      console.log('âœ… Token stored successfully')
    } else {
      console.error('âŒ Invalid token, not storing:', token)
    }
  }

  const clearToken = () => {
    console.log('ðŸ—‘ï¸ Clearing all tokens')
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('ðŸ” Checking authentication...')
    try {
      const token = getStoredToken()
      
      if (!token || token === 'undefined' || token === 'null') {
        console.log('âŒ No valid token found')
        setUser(null)
        setLoading(false)
        return
      }

      // Validate token format (JWT should have 3 parts)
      if (token.split('.').length !== 3) {
        console.error('âŒ Invalid token format')
        clearToken()
        setUser(null)
        setLoading(false)
        return
      }

      console.log('ðŸ“ž Fetching user data...')
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('ðŸ“¨ Auth check response:', response.status)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        console.log('âœ… Authentication successful:', userData.email)
      } else {
        console.warn('âš ï¸ Auth check failed, clearing tokens')
        clearToken()
        setUser(null)
      }
    } catch (error) {
      console.error('âŒ Auth check error:', error)
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    console.log('ðŸ” Login attempt:', credentials.email)
    
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      })
      
      console.log('ðŸ“¨ Login response:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || 'Login failed'
        console.error('âŒ Login failed:', errorMessage)
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      console.log('âœ… Login successful')
      
      if (!result.access_token) {
        throw new Error('No access token received from server')
      }
      
      // Store token FIRST
      storeToken(result.access_token)
      
      // Then set user
      if (result.user) {
        setUser(result.user)
        console.log('ðŸ‘¤ User set:', result.user.email)
      } else {
        // Fetch user data if not in login response
        await checkAuth()
      }
      
      toast.success('Welcome back!')
      return result
      
    } catch (error) {
      console.error('âŒ Login error:', error)
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    console.log('ðŸ“ Registration attempt:', userData.email)
    
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      })
      
      console.log('ðŸ“¨ Register response:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Registration failed')
      }
      
      const result = await response.json()
      console.log('âœ… Registration successful')
      
      // If registration returns token (auto-login), store it
      if (result.access_token) {
        storeToken(result.access_token)
        if (result.user) {
          setUser(result.user)
        } else {
          await checkAuth()
        }
        toast.success('Welcome! Registration successful!')
        return { ...result, autoLogin: true }
      }
      
      toast.success('Registration successful! Please log in.')
      return result
      
    } catch (error) {
      console.error('âŒ Registration error:', error)
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log('ðŸ‘‹ Logging out...')
    try {
      const token = getStoredToken()
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => console.warn('Logout API call failed:', err))
      }
    } finally {
      clearToken()
      setUser(null)
      toast.success('Logged out successfully')
      console.log('âœ… Logout complete')
    }
  }

  const updateProfile = async (profileData) => {
    console.log('ðŸ“ Updating profile...')
    try {
      const token = getStoredToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(profileData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      const updatedUser = await response.json()
      setUser(updatedUser)
      toast.success('Profile updated successfully!')
      console.log('âœ… Profile updated')
      return updatedUser
      
    } catch (error) {
      console.error('âŒ Profile update failed:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin === true,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}