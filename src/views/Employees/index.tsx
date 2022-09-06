import { Route, Switch } from 'react-router-dom';
import { CreateEmployeeView } from './CreateEmployeeView';

/**
 * Routes for "Employees" view
 * url: /funcionarios/*
 */
const EmployeesRoutes = () => {
  return (
    <Switch>
      <Route path="/funcionarios/criar" component={CreateEmployeeView} />
    </Switch>
  );
};

export default EmployeesRoutes;
