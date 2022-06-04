import { Card, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';

/**
 * Renders "ExamsListView" view
 * url: /exames/*
 */
function ExamListView() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await examsService.getAll();
    console.log(response.data);
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
    { field: 'type', headerName: 'Tipo', width: 100 },

    {
      field: 'subject',
      headerName: 'Matéria',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.subject.name;
      },
    },
    {
      field: 'class_group',
      headerName: 'Turma',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.class_group.name;
      },
    },
    { field: 'value', headerName: 'Valor', width: 80 },
    { field: 'weight', headerName: 'Peso', width: 80 },
    {
      field: 'date',
      headerName: 'Data',
      width: 100,
      valueGetter: (params: any) => params && Moment(params.row.date).format('DD-MM-YYYY'),
    },

    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push(`/turmas/${params.row.id}`);
        };

        return <Button onClick={onClick}>Mostrar</Button>;
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

          <DataGrid rows={exams} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection autoHeight />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ExamListView;
