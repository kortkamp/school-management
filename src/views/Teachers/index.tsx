import { Route, Switch } from 'react-router-dom';
import { TeachersListView } from '../Users/UsersListView';

/**
 * Routes for "Teachers" view
 * url: /professores/*
 */
const TeachersRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/professores/criar" component={TeachersListView} /> */}
      {/* <Route path="/professores/:id" component={StudentView} /> */}
      <Route component={TeachersListView} />
    </Switch>
  );
};

export default TeachersRoutes;
