import { Route, Switch } from 'react-router-dom';
import StudentsListView from './StudentsListView';
import StudentView from './StudentView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const StudentsRoutes = () => {
  return (
    <Switch>
      <Route path="/alunos/:id" component={StudentView} />
      <Route component={StudentsListView} />
    </Switch>
  );
};

export default StudentsRoutes;
