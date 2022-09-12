import { Route, Switch } from 'react-router-dom';

import CoursesListView from './CoursesListView';

/**
 * Routes for "CoursesListView" view
 * url: /cursos/*
 */
const CoursesRoutes = () => {
  return (
    <Switch>
      <Route component={CoursesListView} />
    </Switch>
  );
};

export default CoursesRoutes;
