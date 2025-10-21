// 5. src/hooks/useApi.js
// ===========================================
import { useState, useCallback } from "react"
import api from "../services/api"
import toast from "react-hot-toast"

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (config) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api(config)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((url, config = {}) => {
    return request({ ...config, method: 'GET', url })
  }, [request])

  const post = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'POST', url, data })
  }, [request])

  const put = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PUT', url, data })
  }, [request])

  const patch = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PATCH', url, data })
  }, [request])

  const del = useCallback((url, config = {}) => {
    return request({ ...config, method: 'DELETE', url })
  }, [request])

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}

export const useApiForm = () => {
  const { request } = useApi()
  const [loading, setLoading] = useState(false)

  const submitForm = useCallback(async (apiCall, successMessage = 'Success!') => {
    try {
      setLoading(true)
      const result = await apiCall()
      toast.success(successMessage)
      return result
    } catch (error) {
      toast.error(error.detail || error.message || 'An error occurred')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    submitForm,
  }
}

export default useApi



// // frontend/src/hooks/useApi.js  updated fro callcenter
// import { useState, useCallback } from "react"
// import api from "../services/api"

// const useApi = () => {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // ✅ Helper to get token from localStorage
//   const getToken = () => {
//     return localStorage.getItem('access_token')
//   }

//   // ✅ Helper to create headers with auth token
//   const getAuthHeaders = () => {
//     const token = getToken()
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     }
//   }

//   const request = useCallback(async (method, url, data = null, options = {}) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const config = {
//         method,
//         url,
//         ...options
//       }

//       // Add data for POST, PUT, PATCH requests
//       if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
//         config.data = data
//       }

//       const response = await api(config)
//       return response.data
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || err.message || 'An error occurred'
//       setError(errorMessage)
//       throw err
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const get = useCallback((url, options = {}) => {
//     return request('GET', url, null, options)
//   }, [request])

//   const post = useCallback((url, data, options = {}) => {
//     return request('POST', url, data, options)
//   }, [request])

//   const put = useCallback((url, data, options = {}) => {
//     return request('PUT', url, data, options)
//   }, [request])

//   const patch = useCallback((url, data, options = {}) => {
//     return request('PATCH', url, data, options)
//   }, [request])

//   const del = useCallback((url, options = {}) => {
//     return request('DELETE', url, null, options)
//   }, [request])

//   // ✅ Raw fetch method with proper auth headers (for special cases)
//   const fetchWithAuth = useCallback(async (url, options = {}) => {
//     const token = getToken()
    
//     if (!token) {
//       throw new Error('No authentication token found')
//     }

//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       ...options.headers
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.detail || `Request failed with status ${response.status}`)
//     }

//     return response.json()
//   }, [])

//   return {
//     loading,
//     error,
//     get,
//     post,
//     put,
//     patch,
//     delete: del,
//     fetchWithAuth,
//     getAuthHeaders
//   }
// }

// export default useApi