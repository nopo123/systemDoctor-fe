import axios, { AxiosRequestConfig } from 'axios';
import AppService from '../services/AppService';

const axiosInstance = axios.create({
	baseURL: process.env.URL || 'http://localhost:3000'
});

axiosInstance.interceptors.request.use(async config => {
	const accessToken = AppService.getToken();
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	async (res) => res?.data,
	(err) => {
		if (err.response?.status === 401) {
			AppService.clearToken();
		}
		return Promise.reject(err);
	}
);

export default axiosInstance;
