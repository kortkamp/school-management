import { Route, Switch } from 'react-router-dom';
import ListRoutinesView from './ListRoutinesView';
import RoutinesView from './RoutinesView';

/**
 * Routes for "ClassGroups" view
 * url: /horarios/*
 */
const TermsRoutes = () => {
  return (
    <Switch>
      <Route path="/horarios/turma" component={RoutinesView} />
      <Route component={ListRoutinesView} />
    </Switch>
  );
};

export default TermsRoutes;
