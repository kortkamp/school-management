import { Route, Switch } from 'react-router-dom';
import CreateEmployeeRole from './CreateEmployeeRole';
import { CreateEmployeeView } from './CreateEmployeeView';
import ListEmployeesView from './ListEmployeesView';

/**
 * Routes for "Employees" view
 * url: /funcionarios/*
 */
const EmployeesRoutes = () => {
  return (
    <Switch>
      <Route path="/funcionarios/nova-funcao" component={CreateEmployeeRole} />
      <Route path="/funcionarios/criar/:roleNameParam" component={CreateEmployeeView} />
      <Route path="/funcionarios/criar" component={CreateEmployeeView} />
      <Route path="/funcionarios/" component={ListEmployeesView} />
    </Switch>
  );
};

export default EmployeesRoutes;
