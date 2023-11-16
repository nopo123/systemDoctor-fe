import { createContext, useEffect, useReducer } from 'react';
import UserService from '../services/UserService';
import AppService from '../services/AppService';
import { parseErrorMessage } from '../utils/errorMessage';
import { useSnackbar } from 'notistack';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initialize = async () => {
      const accessToken = AppService.getToken();

      if (accessToken) {
        try {
          const user = await UserService.me();
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } catch (e) {
          enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
        }
        const user = await UserService.me();
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (values) => {
    try {
      const res = await UserService.login(values);
  
      if (res.access_token) {
        AppService.setToken(res.access_token);
  
        dispatch({
          type: 'LOGIN',
          payload: {
            user: res.user,
          },
        });
      } else {
        enqueueSnackbar('Login failed', { variant: 'error' })
      }
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
  };

  const logout = async () => {
    AppService.clearKey();
    AppService.clearToken();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
     {children} 
    </AuthContext.Provider>
  );
};

export default AuthContext;
