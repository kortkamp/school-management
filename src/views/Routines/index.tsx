import { Route, Switch } from 'react-router-dom';
import RoutinesView from './RoutinesView';

/**
 * Routes for "ClassGroups" view
 * url: /horarios/*
 */
const TermsRoutes = () => {
  return (
    <Switch>
      <Route path="/horarios/turma" component={RoutinesView} />
    </Switch>
  );
};

export default TermsRoutes;
