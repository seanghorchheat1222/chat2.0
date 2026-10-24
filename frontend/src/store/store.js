import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import userSlice from './userSlice';
import tokenSlice from './tokenSlice';

const customStorage = {
  getItem:(key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem:(key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem:(key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }
}

const persisConfig = {
  key: "root",
  storage: customStorage,
  whitelist: ["user", "token"]
};

const rootReduce = combineSlices({
  user:userSlice,
  token: tokenSlice
})

const persistedReducer = persistReducer(
persisConfig, rootReduce);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PURGE, PAUSE, PERSIST, REGISTER]
      }
    })
  
})

export const persistor = persistStore(store)