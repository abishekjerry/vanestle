
// store.jsx
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import rootReducer from "../middleware";

const storage = {
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (err) {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve();
    }
  }
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

export const persistor = persistStore(store);

export default store;