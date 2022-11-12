import { Route, Switch } from 'react-router-dom';
import TeachersListView from './TeachersListView';
import TeacherSubjectView from './TeacherSubjectView';

/**
 * Routes for "Teachers" view
 * url: /professores/*
 */
const TeachersRoutes = () => {
  return (
    <Switch>
      <Route path="/professores/disciplinas/:id" component={TeacherSubjectView} />
      <Route path="/professores/disciplinas" component={TeacherSubjectView} />
      <Route exact path="/professores" component={TeachersListView} />
    </Switch>
  );
};

export default TeachersRoutes;
