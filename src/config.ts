const backendHost = import.meta.env.VITE_BACKEND_HOST || 'localhost'
const backendPort = import.meta.env.VITE_BACKEND_PORT || '8080'

export const baseURL = `http://${backendHost}:${backendPort}/api/v1`