import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.URL || "http://localhost:3000"
});


axiosInstance.interceptors.response.use(
	async (res) => res?.data,
);

export default axiosInstance;