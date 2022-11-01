import { Route, Switch } from 'react-router-dom';
import StudentView from './StudentView';
import { CreateStudentView } from '../Users/CreateUserView';
import { routePaths } from '../../routes/RoutePaths';
import ListStudentsView from './ListStudentsView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const StudentsRoutes = () => {
  return (
    <Switch>
      <Route exact path={routePaths.students.path} component={ListStudentsView} />
      <Route path={routePaths.students.create.path} component={CreateStudentView} />
      <Route path="/alunos/:id" component={StudentView} />
    </Switch>
  );
};

export default StudentsRoutes;
