import axios from 'axios';
// replace with "/api" when deploying because of proxy in vite.config.ts
 
const axiosFetch = axios.create({
    baseURL: '/api',
    
    validateStatus: (status) => {
        if (status === 401) {
            return false
        }
        return true
    }
});

axiosFetch.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token')
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    config.headers.RefreshToken = localStorage.getItem('refresh_token')

    // Refresh-Token: <refresh_token>
    return config
}, (error) => {
    return Promise.reject(error)
})

axiosFetch.interceptors.response.use(async (response) => {
    return response
}, async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const newTokens = await axiosFetch.post('/auth/refreshtoken', {
            RefreshToken: localStorage.getItem('refresh_token')   
        })

        localStorage.setItem('access_token', newTokens.data.access_token)
        localStorage.setItem('refresh_token', newTokens.data.refresh_token)

        axiosFetch.defaults.headers.common['Authorization'] = `Bearer ${newTokens.data.access_token}`

        return axiosFetch(originalRequest)
    }

    return Promise.reject(error)
})

export default axiosFetch