import axios from 'axios';
import { getData } from '../conf/AsyncStore';
import { base_url } from '../conf/Constant';

// Create an Axios instance
const api = axios.create({
    baseURL: `${base_url}/api`,  // Replace with your API base URL
});

// Intercept each request to add the Authorization header
api.interceptors.request.use(
    async (config) => {
        // Try to get the stored token from Keychain (or use Redux if token is saved there)
        const credentials = await getData("token")
        console.log("credentials");


        if (credentials) {
            // Add token to Authorization header if available
            config.headers.Authorization = `Bearer ${JSON.parse(credentials)}`; // credentials.password is the stored token
        }
        // console.log(credentials.password);


        // Return the modified config
        return config;
    },
    (error) => {
        console.log(error);

        return Promise.reject(error); // Handle any errors
    }
);

export default api;
