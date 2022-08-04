import { AppStore } from './store';
import { AppRouter, Routes } from './routes';
import { ErrorBoundary } from './components';
import { AppThemeProvider } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Root Application Component
 * @class App
 */
const App = () => {
  return (
    <ErrorBoundary name="App">
      <ToastContainer />
      <AppStore>
        <AppThemeProvider>
          <AppRouter>
            <Routes />
          </AppRouter>
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
