import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// (process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const reduxDevTool =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(thunk.withExtraArgument()))
    : compose(applyMiddleware(thunk.withExtraArgument()));
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, reduxDevTool);
export const persistor = persistStore(store);

export default store;
