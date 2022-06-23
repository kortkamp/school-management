import { Card, CardContent, CardHeader, Grid, Box, TextField, MenuItem, Theme } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridOverlay, GridPagination } from '@mui/x-data-grid';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton } from '../../components';
import { CommonDialog } from '../../components/dialogs';
import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { examsService } from '../../services/exams.service';
import makeStyles from '@mui/styles/makeStyles';

interface IResult {
  value: number;
  student: {
    id: string;
    name: string;
  };
}
interface IExamResult {
  id: string;
  type: string;
  status: string;
  value: number;
  weight: number;
  date: Date;
  subject: {
    id: string;
    name: string;
  };
  class_group: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  results: IResult[];
}

interface IDisplayResults {}
interface IDisplayColumnResults {
  exam_id: string;
  title: string;
  date: Date;
  value: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiDataGrid-columnHeaderTitleContainerContent': {
      overflow: 'visible',
      lineHeight: '1rem',
      whiteSpace: 'normal',
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

/**
 * Renders "ExamResultView" view
 * url: /exames/notas
 */
function ExamResultView() {
  const [isSeaching, SetIsSearching] = useState(false);

  const [displayColumns, setDisplayColumns] = useState<IDisplayColumnResults[]>([]);
  const [displayRows, setDisplayRows] = useState<any[]>([]);

  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('');

  const [examResults, setExamResults] = useState<IExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loadExamResultsList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await examsService.getResultsByClassSubject(
        'bb17930a-ae06-48ec-8102-80b602497ca1',
        '52fe02ec-c902-4c89-922e-ec7a5c92b758'
      );
      const exams = response.data.exams as IExamResult[];
      console.log(exams);
      setExamResults(exams);

      const columns: IDisplayColumnResults[] = exams.map((exam) => ({
        exam_id: exam.id,
        title: exam.type,
        date: exam.date,
        value: exam.value,
      }));

      const rows = [] as any[];

      exams.forEach((exam) => {
        exam.results.forEach((result) => {
          const rowIndex = rows.findIndex((row) => row.id === result.student.id);
          if (rowIndex < 0) {
            rows.push({ id: result.student.id, student: result.student.name, [exam.id]: result.value });
          } else {
            rows[rowIndex][exam.id] = result.value;
          }
        });
      });

      setDisplayRows(rows);

      setDisplayColumns(columns);
    } catch (err: any) {
      console.log(err);
      // setError(ErrorAPI(404));
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadExamResultsList();
  }, [loadExamResultsList, statusFilter]);

  // useEffect(() => {
  //   setFilteredExams(exams.filter((exam) => (typeFilter !== '' ? exam.type === typeFilter : true)));
  // }, [typeFilter, exams]);

  const columns: GridColDef[] = [
    {
      field: 'student',
      headerName: 'Aluno',
      headerAlign: 'center',
      align: 'center',

      width: 150,
    },
    ...displayColumns.map(
      (exam) =>
        ({
          field: exam.exam_id,
          width: 150,
          headerAlign: 'center',
          align: 'center',

          renderHeader: (params: GridColumnHeaderParams) => (
            <>
              <span>
                <b>{exam.title}</b>
              </span>
              <span>{Moment(exam.date).utcOffset('+0300').format('DD-MM-YYYY')}</span>
              <span>Valor:{exam.value}</span>
            </>
          ),
        } as GridColDef)
    ),
  ];

  const classes = useStyles();

  // if (Error) return Error as JSX.Element;
  // if (loading) return <AppLoading />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Notas" subheader="Lista de notas" />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  select
                  label="Turma"
                  name="class_id"
                  // value={statusFilter}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  <MenuItem value={'bb17930a-ae06-48ec-8102-80b602497ca1'}>teste</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  select
                  label="Matéria"
                  name="subject_id"
                  // value={typeFilter}
                  // onChange={(e) => setTypeFilter(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  <MenuItem value={'52fe02ec-c902-4c89-922e-ec7a5c92b758'}>teste</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <DataGrid
              className={classes.root}
              rows={displayRows}
              columns={!loading ? columns : []}
              loading={loading}
              autoHeight
              components={{
                NoRowsOverlay: () => (
                  <GridOverlay>
                    <div>Nenhuma avaliação encontrada</div>
                  </GridOverlay>
                ),
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ExamResultView;
