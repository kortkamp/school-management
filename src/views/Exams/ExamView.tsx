import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Input,
  ListItem,
  ListItemProps,
  List,
  ListItemText,
  Divider,
  Typography,
  Theme,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { AppButton, AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';
import { studentsService } from '../../services/students.service';
import Moment from 'moment';
import { ErrorAPI } from '../Errors';
import { createStyles, makeStyles } from '@mui/styles';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    studentResultRow: {
      '&:hover': {
        background: theme.palette.background.paper,
      },
      transition: theme.transitions.create(['background'], { duration: theme.transitions.duration.short }),
    },
    title: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  })
);

/**
 * Renders "ExamView" view
 * url: /exams/:id*
 */

interface IResultProps extends ListItemProps {
  result: IExamResult;
  onChange: (e: any) => void;
}

const ResultRow: React.FC<IResultProps> = ({ result, onChange, ...props }) => (
  <ListItem {...props}>
    <ListItemText primary={result.name} />
    <Input type="number" value={result.value} onChange={onChange}></Input>
  </ListItem>
);

interface IExamResult {
  student_id: string;
  name: string;
  value: number | undefined | '';
}

enum ExamResultActionKind {
  CREATE = 'CREATE',
  SET = 'SET',
  DROP = 'DROP',
}

// An interface for our actions
interface CountAction {
  type: ExamResultActionKind;
  payload: IExamResult[];
}

// Our reducer function that uses a switch statement to handle our actions
function resultReducer(state: IExamResult[], action: CountAction) {
  const { type, payload } = action;
  switch (type) {
    case ExamResultActionKind.CREATE:
      return payload;
    case ExamResultActionKind.SET:
      return state.map((stateItem) => {
        const stateItemIsInPayload = payload.findIndex(
          (payloadItem) => payloadItem.student_id === stateItem.student_id
        );
        if (stateItemIsInPayload >= 0) return payload[stateItemIsInPayload];
        return stateItem;
      });
    case ExamResultActionKind.DROP:
      return state;
    default:
      return state;
  }
}

const ExamView = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();

  const [results, resultsDispatch] = useReducer(resultReducer, []);

  const [exam, setExams] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [Error, setError] = useState<ReactNode | null>(null);

  const loadClassGroupsList = useCallback(async () => {
    try {
      const response = await examsService.getById(id);

      const examData = response.data.exam;

      setExams(examData);

      if (examData.results.length) {
        const resultData = examData.results.map((examResult: any) => {
          return {
            student_id: examResult.student.id,
            name: examResult.student.name,
            value: examResult.value,
          };
        });
        resultsDispatch({ type: ExamResultActionKind.CREATE, payload: resultData });

        // setResults(resultData);
      }

      setLoading(false);
    } catch (err: any) {
      setError(ErrorAPI(err.response?.status));
    }
  }, [id]);

  const loadStudentsFromClass = useCallback(async () => {
    try {
      const studentsResponse = await studentsService.getAll(1000, 1, 'class_group_id', exam.class_id, 'eq');

      const studentsData = studentsResponse.data.result as any[];

      const resultData = studentsData.map((student) => {
        return {
          student_id: student.id,
          name: student.name,
          value: '' as '',
        };
      });

      resultsDispatch({ type: ExamResultActionKind.CREATE, payload: resultData });
    } catch (err: any) {
      setError(ErrorAPI(err.response?.status));
    }
  }, [exam]);

  const handleSaveResults = useCallback(async () => {
    try {
      const data = {
        exam_id: exam.id,
        results: results.map(({ student_id, value }) => {
          return { student_id, value };
        }),
      };
      const response = await examsService.saveResults(data);
      console.log(response);
    } catch (err: any) {
      setError(ErrorAPI(err.response?.status));
    }
  }, [exam, results]);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  const resultsAreValid = results.every(({ value }) => (value || value === 0) && value >= 0 && value <= exam.value);

  if (Error) return Error as JSX.Element;
  if (loading) return <AppLoading />;

  return (
    <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid item xs={12} md={9} sm={12}>
        <Card sx={{ marginTop: '50px' }}>
          <CardHeader style={{ textAlign: 'center' }} title={exam.type.toUpperCase()} />
          <CardContent>
            <b>Turma: </b>
            {exam.class_group.name}
          </CardContent>
          <CardContent>
            <b>Matéria: </b>
            {exam.subject.name}
          </CardContent>
          <CardContent>
            <b>Data: </b>
            {Moment(exam.date).format('DD-MM-YYYY')}
          </CardContent>
          <CardContent>
            <b>Valor: </b>
            {exam.value}
            <b> Peso: </b>
            {exam.weight}
          </CardContent>
          <Divider />
          {results.length ? (
            <>
              <CardContent style={{ textAlign: 'center' }}>
                <b>Notas</b>
              </CardContent>
              <List>
                {results.map((result, index) => {
                  return (
                    <ResultRow
                      className={classes.studentResultRow}
                      result={result}
                      key={result.student_id}
                      onChange={(e) => {
                        if (e.target.value >= 0 && e.target.value <= exam.value)
                          resultsDispatch({
                            type: ExamResultActionKind.SET,
                            payload: [{ ...result, value: Number(e.target.value) }],
                          });
                      }}
                    />
                  );
                })}
                <Divider />
                <Grid container direction="column" alignItems="center">
                  <AppButton
                    color="info"
                    disabled={!resultsAreValid}
                    size="medium"
                    label="Gravar Notas"
                    onClick={() => handleSaveResults()}
                  />
                </Grid>
              </List>
            </>
          ) : (
            <Grid container direction="column" alignItems="center">
              <AppButton size="small" label="Informar Notas" onClick={() => loadStudentsFromClass()} />
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ExamView;
