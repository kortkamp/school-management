import { Route, Switch } from 'react-router-dom';
import ClassGroupsView from './ClassGroups';

/**
 * Routes for "ClassGroups" view
 * url: /professores/*
 */
const ClassGroupsRoutes = () => {
  return (
    <Switch>
      <Route component={ClassGroupsView} />
    </Switch>
  );
};

export default ClassGroupsRoutes;
