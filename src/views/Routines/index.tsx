import { Route, Switch } from 'react-router-dom';
import ClassGroupRoutinesView from './ClassGroupRoutinesView';
import ListRoutinesView from './ListRoutinesView';
// import RoutinesView from './RoutinesView';

/**
 * Routes for "ClassGroups" view
 * url: /horarios/*
 */
const RoutinesRoutes = () => {
  return (
    <Switch>
      <Route path="/turnos/turma" component={ClassGroupRoutinesView} />
      {/* <Route path="/turnos/turma" component={RoutinesView} /> */}
      <Route component={ListRoutinesView} />
    </Switch>
  );
};

export default RoutinesRoutes;
