import { Route, Switch } from 'react-router-dom';
import CreateExamView from './CreateExamView';
import ExamListView from './ExamListView';
import ExamResultView from './ExamResultView';
import StudentExamListView from './StudentExamListView';

/**
 * Routes for "Students" view
 * url: /students/*
 */
const ExamsRoutes = () => {
  return (
    <Switch>
      <Route path="/exames/criar" component={CreateExamView} />
      <Route path="/exames/notas" component={ExamResultView} />
      <Route path="/exames/aluno" component={StudentExamListView} />
      <Route path="/exames/visualizar/" component={CreateExamView} />
      <Route exact path="/exames" component={ExamListView} />
    </Switch>
  );
};

export default ExamsRoutes;
