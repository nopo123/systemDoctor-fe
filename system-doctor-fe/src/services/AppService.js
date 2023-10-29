class AppService {
	static getToken = () => window.localStorage.getItem('accessToken');

	static setToken = (token) => window.localStorage.setItem('accessToken', token);

	static clearToken = () => window.localStorage.removeItem('accessToken');

	static setTimeoutUser = (timeout) => window.localStorage.setItem('timeout', timeout);

	static getTimeoutUser = () => window.localStorage.getItem('timeout');
}

export default AppService;
