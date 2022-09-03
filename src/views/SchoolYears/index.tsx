import { Route, Switch } from 'react-router-dom';
import { routeNames } from '../../routes';

import CreateSchoolYear from './CreateSchoolYear';

/**
 * Routes for "SchoolYear" view
 * url: /ano-letivo/*
 */
const ExamsRoutes = () => {
  return (
    <Switch>
      <Route exact path={routeNames.schoolYear.create.path} component={CreateSchoolYear} />
    </Switch>
  );
};

export default ExamsRoutes;
