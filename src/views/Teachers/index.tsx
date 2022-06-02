import { Route, Switch } from 'react-router-dom';
import TeachersView from './Teachers';

/**
 * Routes for "Teachers" view
 * url: /professores/*
 */
const TeachersRoutes = () => {
  return (
    <Switch>
      <Route component={TeachersView} />
    </Switch>
  );
};

export default TeachersRoutes;
