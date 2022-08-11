import { Route, Switch } from 'react-router-dom';
import { RegisterSchool, Welcome, NotFound } from '../views';
import { PrivateLayout } from './Layout';

/**
 * List of routes available only for anonymous users
 * Also renders the "Public Layout" composition
 */
const RegisterRoutes = () => {
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/registro" component={RegisterSchool} />,
        <Route path="/bem-vindo" component={Welcome} />
        <Route path="/" component={Welcome} />
        <Route component={NotFound} />
      </Switch>
    </PrivateLayout>
  );
};

export default RegisterRoutes;
