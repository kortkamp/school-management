import { Route, Switch } from 'react-router-dom';
import MessagesListView from './MessagesListView';

/**
 * Routes for "Messages" view
 * url: /mensagens/*
 */
const StudentsRoutes = () => {
  return (
    <Switch>
      <Route component={MessagesListView} />
    </Switch>
  );
};

export default StudentsRoutes;
