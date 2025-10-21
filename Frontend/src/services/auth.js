// src/services/auth.js

import api from "./api"
import Cookies from "js-cookie"
import config from "./config"

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { access_token, refresh_token, user } = response.data
      
      Cookies.set(config.ACCESS_TOKEN_KEY, access_token, { 
        expires: config.TOKEN_EXPIRY_DAYS,
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      })
      
      if (refresh_token) {
        Cookies.set(config.REFRESH_TOKEN_KEY, refresh_token, { 
          expires: config.TOKEN_EXPIRY_DAYS * 2,
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        })
      }
      
      return { user, token: access_token }
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove(config.ACCESS_TOKEN_KEY)
      Cookies.remove(config.REFRESH_TOKEN_KEY)
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async refreshToken() {
    try {
      const refreshToken = Cookies.get(config.REFRESH_TOKEN_KEY)
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      })
      
      const { access_token } = response.data
      
      Cookies.set(config.ACCESS_TOKEN_KEY, access_token, { 
        expires: config.TOKEN_EXPIRY_DAYS,
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      })
      
      return access_token
    } catch (error) {
      Cookies.remove(config.ACCESS_TOKEN_KEY)
      Cookies.remove(config.REFRESH_TOKEN_KEY)
      throw error.response?.data || error
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        new_password: newPassword
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  isAuthenticated() {
    return !!Cookies.get(config.ACCESS_TOKEN_KEY)
  },

  getAccessToken() {
    return Cookies.get(config.ACCESS_TOKEN_KEY)
  },
}

export default authService