import axios from 'axios';
// replace with "/api" when deploying because of proxy in vite.config.ts
 
const axiosFetch = axios.create({
    baseURL: 'http://localhost:5000', 
});

axiosFetch.interceptors.request.use((config) => {
    // send the access and refresh token in the headers of
    // Authorization: Bearer <access_token>
    // Refresh-Token: <refresh_token>
    return config
})

export default axiosFetch