import { Route, Switch } from 'react-router-dom';
import CreateExamView from './CreateExamView';
import ExamListView from './ExamListView';
import ExamView from './ExamView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const ExamsRoutes = () => {
  return (
    <Switch>
      <Route path="/exames/criar" component={CreateExamView} />
      <Route path="/exames/:id" component={ExamView} />
      <Route exact path="/exames" component={ExamListView} />
    </Switch>
  );
};

export default ExamsRoutes;
