import { localStorageSet, localStorageDelete } from '../utils/localStorage';
import { IAppState } from './AppStore';

/**
 * Reducer for global AppStore using "Redux styled" actions
 * @param {object} state - current/default state
 * @param {string} action.type - unique name of the action
 * @param {*} [action.payload] - optional data object or the function to get data object
 */
const AppReducer: React.Reducer<IAppState, any> = (state, action) => {
  console.log('AppReducer() - action:', action);
  switch (action.type || action.action) {
    case 'CURRENT_USER':
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    case 'SIGN_UP':
    case 'LOG_IN':
      localStorageSet('user', action.payload);

      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };
    case 'SELECT_SCHOOL':
      localStorageSet('school', action.payload);
      return {
        ...state,
        currentSchool: action.payload,
      };
    case 'LOG_OUT':
      localStorageDelete('user');
      localStorageDelete('school');
      return {
        ...state,
        isAuthenticated: false,
        currentUser: undefined,
        currentSchool: undefined,
      };
    case 'DARK_MODE': {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    default:
      return state;
  }
};

export default AppReducer;
