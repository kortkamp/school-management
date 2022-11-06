import { Route, Switch } from 'react-router-dom';
import { routePaths } from '../../routes/RoutePaths';
import { PersonDataView } from './PersonDataView';

/**
 * Routes for "Persons" view
 * url: /pessoa/*
 */
const ClassGroupsRoutes = () => {
  return (
    <Switch>
      <Route path={routePaths.person.view.path} component={PersonDataView} />
    </Switch>
  );
};

export default ClassGroupsRoutes;
