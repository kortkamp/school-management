import { Card, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton, AppLoading } from '../../components';
import { examsService } from '../../services/exams.service';
import { CommonDialog } from '../../components/dialogs';
import { ErrorAPI } from '../Errors';

/**
 * Renders "ExamsListView" view
 * url: /exames/*
 */
function ExamListView() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ReactNode | null>(null);

  const [Error, setError] = useState<ReactNode | null>(null);

  const history = useHistory();

  const onDialogClose = useCallback(() => {
    setModal(null);
  }, []);

  const onConfirmDeleteExamOpen = (exam: any) => {
    setModal(
      <CommonDialog
        open
        data={exam}
        title="Deseja realmente excluir?"
        body={
          <>
            <div>Tipo: {exam.type}</div>
            <br />
            <div>Matéria: {exam.subject.name}</div>
            <br />
            <div>Turma: {exam.class_group.name}</div>
            <br />
            <div>Data: {Moment(exam.date).format('DD-MM-YYYY')}</div>
            <h2>Todas a notas serão apagadas</h2>
          </>
        }
        confirmButtonText="Confirmar a exclusão"
        confirmButtonColor="warning"
        onClose={onDialogClose}
        onConfirm={onConfirmDialogConfirm}
      />
    );
  };

  const onConfirmDialogConfirm = useCallback((data) => {
    handleDeleteExam(data.id);
    setModal(null);
  }, []);

  const handleDeleteExam = useCallback(
    async (id: string) => {
      const apiResult = await examsService.remove(id);

      if (!apiResult) {
        setError('Não foi possível excluir o exame');
        return;
      }

      // setExams(exams.filter((exam) => exam.id !== id));
      loadClassGroupsList();
    },
    [history]
  );

  const loadClassGroupsList = useCallback(async () => {
    try {
      const response = await examsService.getAll();
      setExams(response.data.exams.result);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setError(ErrorAPI(404));
    }
  }, []);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

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
      valueGetter: (params: any) => params && Moment(params.row.date).utcOffset('+0300').format('DD-MM-YYYY'),
    },

    { field: 'status', headerName: 'Situação', width: 50, flex: 1 },

    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 230,
      flex: 3,
      renderCell: (params: any) => {
        return (
          <>
            <AppButton color="default" onClick={() => history.push(`/exames/${params.row.id}`)}>
              Notas
            </AppButton>
            <AppButton color="info" onClick={() => history.push(`/exames/editar/${params.row.id}`)}>
              Editar
            </AppButton>
            <AppButton
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                onConfirmDeleteExamOpen(params.row);
              }}
            >
              CANCELAR
            </AppButton>
          </>
        );
      },
    },
  ];

  if (Error) return Error as JSX.Element;
  if (loading) return <AppLoading />;

  return (
    <>
      {modal}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader
              style={{ textAlign: 'center' }}
              title="Provas e Trabalhos"
              subheader="Lista de provas e trabalhos"
            />
            <CardContent>
              <DataGrid
                rows={exams}
                columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                // checkboxSelection
                autoHeight
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ExamListView;
