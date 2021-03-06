import React, { createContext, useReducer, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppReducer from './AppReducer';
import { localStorageGet } from '../utils/localStorage';
import { IAuthSchool, IAuthUserResult } from '../services/auth.service';

/**
 * AppState structure and initial values
 */
export interface IAppState {
  darkMode: boolean;
  isAuthenticated: boolean;
  currentUser?: IAuthUserResult | undefined;
  schools: IAuthSchool[];
  currentSchool?: IAuthSchool | undefined;
}
const initialAppState: IAppState = {
  darkMode: false, // Overridden by useMediaQuery('(prefers-color-scheme: dark)') in AppStore
  isAuthenticated: false, // Overridden in AppStore by checking auth token
  currentUser: undefined,
  schools: [],
  currentSchool: undefined,
};

/**
 * Instance of React Context for global AppStore
 */
type IAppContext = [IAppState, React.Dispatch<any>];
const AppContext = createContext<IAppContext>([initialAppState, () => null]);

/**
 * Main global Store as HOC with React Context API
 *
 * import {AppStore} from './store'
 * ...
 * <AppStore>
 *  <App/>
 * </AppStore>
 */
const AppStore: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const previousDarkMode = Boolean(localStorageGet('darkMode'));
  const previousUser = localStorageGet('user') as IAuthUserResult;
  const previousSchool = localStorageGet('school') as IAuthSchool;
  const tokenExists = Boolean(previousUser);

  const initialState: IAppState = {
    ...initialAppState,
    darkMode: previousDarkMode || prefersDarkMode,
    isAuthenticated: tokenExists,
    currentUser: previousUser,
    currentSchool: previousSchool,
  };
  const value: IAppContext = useReducer(AppReducer, initialState);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to use the AppStore in functional components
 *
 * import {useAppStore} from './store'
 * ...
 * const [state, dispatch] = useAppStore();
 */
const useAppStore = (): IAppContext => useContext(AppContext);

/**
 * HOC to inject the ApStore to class component, also works for functional components
 *
 * import {withAppStore} from './store'
 * ...
 * class MyComponent
 * ...
 * export default withAppStore(MyComponent)
 */
interface WithAppStoreProps {
  store: object;
}
const withAppStore =
  (Component: React.ComponentType<WithAppStoreProps>): React.FC =>
  (props) => {
    return <Component {...props} store={useAppStore()} />;
  };

export { AppStore, AppContext, useAppStore, withAppStore };
