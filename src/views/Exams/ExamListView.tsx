import { Card, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton, AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';

/**
 * Renders "ExamsListView" view
 * url: /exames/*
 */
function ExamListView() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const handleDeleteExam = useCallback(
    async (id: string) => {
      const apiResult = await examsService.remove(id);

      if (!apiResult) {
        // setError('Não foi possível excluir o exame');
        return;
      }

      // setExams(exams.filter((exam) => exam.id !== id));
      loadClassGroupsList();
    },
    [history]
  );

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await examsService.getAll();
    setExams(response.data.exams.result);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
  }, []);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  if (loading) return <AppLoading />;

  const columns = [
    { field: 'type', headerName: 'Tipo', width: 100, flex: 1 },

    {
      field: 'subject',
      headerName: 'Matéria',
      width: 150,
      flex: 1,
      valueGetter: (params: any) => {
        return params.row.subject.name;
      },
    },
    {
      field: 'class_group',
      headerName: 'Turma',
      width: 150,
      flex: 1,
      valueGetter: (params: any) => {
        return params.row.class_group.name;
      },
    },
    { field: 'value', headerName: 'Valor', width: 50, flex: 1 },
    { field: 'weight', headerName: 'Peso', width: 50, flex: 1 },
    {
      field: 'date',
      headerName: 'Data',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params && Moment(params.row.date).format('DD-MM-YYYY'),
    },

    {
      field: 'cancelar',
      headerName: 'cancelar',
      sortable: false,
      width: 130,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <AppButton
            color="error"
            onClick={() => {
              handleDeleteExam(params.row.id);
            }}
          >
            CANCELAR
          </AppButton>
        );
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader
            style={{ textAlign: 'center' }}
            title="Provas e Trabalhos"
            subheader="Lista de provas e trabalhos"
          />
          <CardContent>Detailed description of the application here...</CardContent>

          <DataGrid
            onRowClick={(params) => history.push(`/exames/${params.row.id}`)}
            rows={exams}
            columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            // checkboxSelection
            autoHeight
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ExamListView;
