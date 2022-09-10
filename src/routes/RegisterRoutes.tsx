import { Route, Switch } from 'react-router-dom';
import { RegisterSchool, Welcome, NotFound } from '../views';
import CreateEmployeeRole from '../views/Employees/CreateEmployeeRole';
import { CreateEmployeeView } from '../views/Employees/CreateEmployeeView';
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
        <Route path="/funcionarios/criar" component={CreateEmployeeView} />,
        <Route path="/funcionarios/criar" component={CreateEmployeeView} />,
        <Route path="/funcionarios/nova-funcao" component={CreateEmployeeRole} />
        <Route exact path="/" component={RegisterSchool} />
        <Route component={NotFound} />
      </Switch>
    </PrivateLayout>
  );
};

export default RegisterRoutes;
