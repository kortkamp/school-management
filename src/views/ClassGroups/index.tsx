import { Route, Switch } from 'react-router-dom';
import ClassGroupsView from './ClassGroups';
import ClassView from './ClassView';

/**
 * Routes for "ClassGroups" view
 * url: /professores/*
 */
const ClassGroupsRoutes = () => {
  return (
    <Switch>
      <Route path="/turmas/:id" component={ClassView} />
      <Route component={ClassGroupsView} />
    </Switch>
  );
};

export default ClassGroupsRoutes;
