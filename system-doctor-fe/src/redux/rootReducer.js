import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import settingSlice from './slices/settings';
import storage from 'redux-persist/lib/storage';

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const settingPersistConfig = {
  key: 'setting',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const reducers = {
  setting: persistReducer(settingPersistConfig, settingSlice),
};

const rootReducer = combineReducers(reducers);

export default rootReducer;