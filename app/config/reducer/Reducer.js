import { combineReducers } from 'redux';
import coreReducer from './CoreReducer';

const rootReducer = combineReducers({
  Core: coreReducer,
});

export default rootReducer;
