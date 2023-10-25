class AppService {
	static getToken = () => window.localStorage.getItem('accessToken');

	static setToken = (token) => window.localStorage.setItem('accessToken', token);

	static clearToken = () => window.localStorage.removeItem('accessToken');
}

export default AppService;
