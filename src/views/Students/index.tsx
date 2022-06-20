import { Route, Switch } from 'react-router-dom';
import StudentView from './StudentView';
import { StudentsListView } from '../Users/UsersListView';
import { CreateStudentView } from '../Users/CreateUserView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const StudentsRoutes = () => {
  return (
    <Switch>
      <Route path="/alunos/criar" component={CreateStudentView} />
      <Route path="/alunos/:id" component={StudentView} />
      <Route component={StudentsListView} />
    </Switch>
  );
};

export default StudentsRoutes;
