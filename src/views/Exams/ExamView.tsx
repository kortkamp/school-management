import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  ListItem,
  ListItemProps,
  List,
  ListItemText,
  Divider,
  Theme,
  Input,
} from '@mui/material';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { AppAlert, AppButton, AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';
import { studentsService } from '../../services/students.service';
import Moment from 'moment';
import { createStyles, makeStyles } from '@mui/styles';
import { useAppMessage } from '../../utils/message';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    studentResultRow: {
      '&:hover': {
        background: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
      },
      transition: theme.transitions.create(['background'], { duration: theme.transitions.duration.shortest }),
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
interface ResultsAction {
  type: ExamResultActionKind;
  payload: IExamResult[];
}

// Our reducer function that uses a switch statement to handle our actions
function resultReducer(state: IExamResult[], action: ResultsAction) {
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

  const [AppMessage, setMessage] = useAppMessage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { id } = useParams<{ id: string }>();

  const [results, resultsDispatch] = useReducer(resultReducer, []);

  const [exam, setExams] = useState<any>();

  const loadClassGroupsList = useCallback(async () => {
    try {
      const examData = await examsService.getById(id);

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
      }

      setLoading(false);
    } catch (err: any) {
      console.log(err);
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
      setMessage({ type: 'error', text: err.response });
    }
  }, [exam]);

  const handleSaveResults = useCallback(async () => {
    setSaving(true);
    try {
      const data = {
        exam_id: exam.id,
        results: results
          .map(({ student_id, value }) => {
            return { student_id, value };
          })
          .filter((result) => result.value !== ''),
      };
      const response = await examsService.saveResults(data);
      console.log(response);
      setMessage({ type: 'success', text: 'As notas foram salvas com sucesso' });
    } catch (err: any) {
      console.log(err);
      setMessage({ type: 'error', text: err.response.data.message });
    }
    setSaving(false);
  }, [exam, results]);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  const resultsAreValid = results.every(({ value }) => (value || value === 0) && value >= 0 && value <= exam.value);

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
                <Grid item md={12} sm={12} xs={12}>
                  <AppMessage />
                </Grid>
                <Grid container direction="column" alignItems="center">
                  <AppButton
                    color="info"
                    // disabled={!resultsAreValid || saving}
                    disabled={saving}
                    loading={saving}
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
