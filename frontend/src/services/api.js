import axios from 'axios'
import { emitNotification, getErrorMessage, getErrorTitle } from '../utils/notifications'

export const API_BASE_URL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('waacai-token', token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem('waacai-token')
  }
}

const savedToken = localStorage.getItem('waacai-token')
if (savedToken) {
  setAuthToken(savedToken)
}

if (!api.__waacaiToastInterceptorInstalled) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status
      const description = getErrorMessage(error)
      const title = getErrorTitle(error)

      if (status >= 400 && title) {
        emitNotification({
          type: status >= 500 ? 'error' : 'warning',
          title,
          description,
        })
      }

      return Promise.reject(error)
    },
  )
  api.__waacaiToastInterceptorInstalled = true
}

export default api
