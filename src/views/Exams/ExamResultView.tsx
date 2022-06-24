import { Card, CardContent, CardHeader, Grid, Box, TextField, MenuItem, Theme } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import Moment from 'moment';

import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { examsService } from '../../services/exams.service';
import makeStyles from '@mui/styles/makeStyles';
import AppSubjectClassSelector from '../../components/AppSubjectClassSelector';

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
  const [subjectId, setSubjectId] = useState('');
  const [classGroupId, setClassGroupId] = useState('');

  const [displayColumns, setDisplayColumns] = useState<IDisplayColumnResults[]>([]);
  const [displayRows, setDisplayRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const loadExamResultsList = useCallback(() => {
    let componentMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await examsService.getResultsByClassSubject(classGroupId, subjectId);
        const exams = response.data.exams as IExamResult[];

        const columns: IDisplayColumnResults[] = exams.map((exam) => ({
          exam_id: exam.id,
          title: exam.type,
          date: exam.date,
          value: exam.value,
        }));

        const rows = [] as any[];

        if (!componentMounted) {
          return;
        }

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

        // setExamResults(exams);

        setDisplayRows(rows);

        setDisplayColumns(columns);
      } catch (err: any) {
        console.log(err);
      }
      setLoading(false);
    }

    fetchData();

    return () => {
      componentMounted = false;
    };
  }, [classGroupId, subjectId]);

  useEffect(() => {
    if (classGroupId && subjectId) {
      loadExamResultsList();
    } else {
      setDisplayRows([]);
    }
  }, [loadExamResultsList, classGroupId, subjectId]);

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Notas" subheader="Lista de notas" />
          <CardContent>
            <Grid container spacing={1}>
              <AppSubjectClassSelector
                onChange={(data) => {
                  setSubjectId(data.subjectId), setClassGroupId(data.classGroupId);
                }}
              />
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
                    {subjectId && classGroupId ? (
                      <div>Nenhuma avaliação encontrada</div>
                    ) : (
                      <div>Selecione Turma e Matéria</div>
                    )}
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
