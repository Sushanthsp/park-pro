import { combineReducers } from "redux";
import UserReducer from "./user/reducers";

const rootReducers = combineReducers({
  user: UserReducer,
});

export default rootReducers;
