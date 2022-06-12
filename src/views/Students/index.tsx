import { Route, Switch } from 'react-router-dom';
import CreateUserView from './CreateUserView';
import StudentView from './StudentView';
import { StudentsListView } from '../Users/UsersListView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const StudentsRoutes = () => {
  return (
    <Switch>
      <Route path="/alunos/criar" component={CreateUserView} />
      <Route path="/alunos/:id" component={StudentView} />
      <Route component={StudentsListView} />
    </Switch>
  );
};

export default StudentsRoutes;
