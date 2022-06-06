import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button, Input } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { AppButton, AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';
import { studentsService } from '../../services/students.service';
import Moment from 'moment';
import { ErrorAPI } from '../Errors';

/**
 * Renders "ExamView" view
 * url: /exams/:id*
 */
interface IExamResult {
  id: string;
  student_id: string;
  name: string;
  value: number | undefined;
}
const ExamView = () => {
  const { id } = useParams<{ id: string }>();

  const [exam, setExams] = useState<any>();
  const [results, setResults] = useState<IExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const [Error, setError] = useState<ReactNode | null>(null);

  const loadClassGroupsList = useCallback(async () => {
    try {
      const response = await examsService.getById(id);

      const examData = response.data.exam;

      setExams(examData);

      if (examData.results) {
        const resultData = examData.results.map((examResult: any) => {
          return {
            id: examResult.id,
            name: examResult.student.name,
            value: examResult.value,
          };
        });

        setResults(resultData);
      } else {
        const studentsResponse = await studentsService.getAll(1000, 1, 'class_group_id', examData.class_id, 'eq');

        const studentsData = studentsResponse.data.result as any[];

        const resultData = studentsData.map((student) => {
          return {
            id: '',
            student_id: student.id,
            name: student.name,
            value: undefined,
          };
        });

        setResults(resultData);
      }

      setLoading(false);
    } catch (err: any) {
      setError(ErrorAPI(err.response?.status));
    }
  }, [id]);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    {
      field: 'value',
      headerName: 'Nota',
      width: 150,
      renderCell: (params: any) => {
        return <Input type="number" value={params.row.value} />;
      },
    },
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     const onClick = (e: any) => {
    //       e.stopPropagation(); // don't select this row after clicking
    //       history.push('/turmas/' + params.row.id);
    //     };

    //     return <Button onClick={onClick}>Mostrar</Button>;
    //   },
    // },
  ];

  if (Error) return Error as JSX.Element;
  if (loading) return <AppLoading />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title={exam.type.toUpperCase()} />
          <CardContent>Turma:{exam.class_group.name}</CardContent>
          <CardContent>Matéria:{exam.subject.name}</CardContent>
          <CardContent>Data:{Moment(exam.date).format('DD-MM-YYYY')}</CardContent>
          <CardContent>Valor:{exam.value}</CardContent>

          <DataGrid rows={results} columns={columns} pageSize={5} rowsPerPageOptions={[5]} autoHeight />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ExamView;
