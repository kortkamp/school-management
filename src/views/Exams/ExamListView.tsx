import { Card, CardContent, CardHeader, Grid, Box, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColumns, GridOverlay, GridPagination } from '@mui/x-data-grid';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton } from '../../components';
import { examsService } from '../../services/exams.service';
import { CommonDialog } from '../../components/dialogs';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

import ExamView from './ExamView';
import CreateExamView from './CreateExamView';

interface IExam {
  id: string;
  type: string;
  status: string;
  value: number;
  weight: number;
  teacher_id: string;
  subject_id: string;
  class_id: string;
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
}
/**
 * Renders "ExamsListView" view
 * url: /exames/*
 */
function ExamListView() {
  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('');

  const [exams, setExams] = useState<IExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ReactNode | null>(null);

  const history = useHistory();

  const onDialogClose = useCallback(() => {
    setModal(null);
  }, []);

  const loadExamList = useCallback(async () => {
    setLoading(true);

    let filter = {
      by: '',
      value: '',
      type: '',
    };

    if (statusFilter !== 'all') {
      filter = {
        by: 'status',
        value: statusFilter,
        type: 'eq',
      };
    }

    try {
      const examsData = await examsService.getAll(1000, 1, filter.by, filter.value, filter.type);
      setExams(examsData.result);
    } catch (err: any) {
      console.log(err);
      // setError(ErrorAPI(404));
    }
    setLoading(false);
  }, [statusFilter]);

  const handleDeleteExam = useCallback(
    async (id: string) => {
      const apiResult = await examsService.remove(id);

      if (!apiResult) {
        // setError('N??o foi poss??vel excluir o exame');
        return;
      }

      // setExams(exams.filter((exam) => exam.id !== id));
      loadExamList();
    },
    [history]
  );

  const onConfirmDialogConfirm = useCallback((data) => {
    handleDeleteExam(data.id);
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
            <div>Mat??ria: {exam.subject.name}</div>
            <br />
            <div>Turma: {exam.class_group.name}</div>
            <br />
            <div>Data: {Moment(exam.date).format('DD-MM-YYYY')}</div>
            <h2>Todas a notas ser??o apagadas</h2>
          </>
        }
        confirmButtonText="Confirmar a exclus??o"
        confirmButtonColor="warning"
        onClose={onDialogClose}
        onConfirm={onConfirmDialogConfirm}
      />
    );
  };

  useEffect(() => {
    loadExamList();
  }, [loadExamList, statusFilter]);

  useEffect(() => {
    setFilteredExams(exams.filter((exam) => (typeFilter !== '' ? exam.type === typeFilter : true)));
  }, [typeFilter, exams]);

  const handleConfirmExamResults = () => {
    onDialogClose();
  };

  const handleShowExamResults = (examId: string) => {
    setModal(
      <CommonDialog
        open
        hideCancelButton
        title=""
        body={<ExamView examId={examId} />}
        fullWidth
        confirmButtonText="Fechar"
        // confirmButtonColor="warning"
        onClose={onDialogClose}
        onConfirm={handleConfirmExamResults}
      />
    );
  };

  const handleEditExam = (examId: string) => {
    setModal(
      <CommonDialog
        open
        hideCancelButton
        title=""
        body={
          <CreateExamView
            examId={examId}
            getExamData={(examData) => {
              setExams((prevExams) => {
                return prevExams.map((exam) => {
                  if (exam.id === examId) {
                    return {
                      ...exam,
                      value: examData.value as number,
                      date: examData.date as Date,
                      type: examData.type,
                      sub_type: examData.sub_type,
                    };
                  }
                  return exam;
                });
              });
              console.log(examData);
            }}
          />
        }
        fullWidth
        confirmButtonText="Fechar"
        // confirmButtonColor="warning"
        onClose={onDialogClose}
        onConfirm={handleConfirmExamResults}
      />
    );
  };

  const columns: GridColumns<IExam> = [
    { field: 'type', headerName: 'Tipo', width: 100 },

    { field: 'sub_type', headerName: 'SubTipo', width: 120 },

    {
      field: 'subject',
      headerName: 'Mat??ria',
      width: 150,
      cellClassName: 'xxxxxxxx',

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
    {
      field: 'term',
      headerName: 'Bimestre',
      width: 150,

      valueGetter: (params: any) => {
        return params.row.term.name;
      },
    },
    { field: 'value', headerName: 'Valor', width: 100 },
    {
      field: 'date',
      headerName: 'Data',
      width: 100,

      valueGetter: (params: any) => params && Moment(params.row.date).utcOffset('+0300').format('DD-MM-YYYY'),
    },

    {
      field: 'status',
      headerName: 'Situa????o',
      width: 100,

      valueGetter: (params: any) => {
        switch (params.row.status) {
          case 'open':
            return 'Aberta';
          case 'closed':
            return 'Fechada';
          default:
            return '';
        }
      },
    },

    {
      field: 'actions',
      headerName: 'A????es',
      sortable: false,
      width: 330,

      renderCell: (params: any) => {
        return (
          <>
            {/* <AppButton color="default" onClick={() => history.push(`/exames/${params.row.id}`)}> */}
            <AppButton color="default" onClick={() => handleShowExamResults(params.row.id)}>
              Notas
            </AppButton>
            {/* <AppButton color="info" onClick={() => history.push(`/exames/editar/${params.row.id}`)}> */}
            <AppButton color="info" onClick={() => handleEditExam(params.row.id)}>
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

  function CustomFooterButtonsComponent() {
    return (
      <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <AppButton color="primary" onClick={() => history.push('/exames/criar')}>
            Criar Avalia????o
          </AppButton>
        </div>
        <GridPagination />
      </Box>
    );
  }

  return (
    <>
      {modal}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader
              style={{ textAlign: 'center' }}
              title="Provas e Trabalhos Pendentes"
              subheader="Lista de provas e trabalhos em aberto"
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    select
                    label="Situa????o"
                    name="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    {...SHARED_CONTROL_PROPS}
                  >
                    <MenuItem value={'all'}>Todas</MenuItem>
                    <MenuItem value={'open'}>Em Aberto</MenuItem>
                    <MenuItem value={'closed'}>Encerradas</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <TextField
                    select
                    label="Tipo"
                    name="type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    {...SHARED_CONTROL_PROPS}
                  >
                    <MenuItem value={''}>Todas</MenuItem>
                    <MenuItem value={'prova'}>Prova</MenuItem>
                    <MenuItem value={'trabalho'}>Trabalho</MenuItem>
                    <MenuItem value={'trabalho em grupo'}>Trabalho em grupo</MenuItem>
                    <MenuItem value={'exercise'}>Exerc??cio</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <DataGrid
                rows={filteredExams}
                columns={!loading ? columns : []}
                loading={loading}
                autoHeight
                components={{
                  Footer: CustomFooterButtonsComponent,
                  NoRowsOverlay: () => (
                    <GridOverlay>
                      <div>Nenhuma avalia????o encontrada</div>
                    </GridOverlay>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ExamListView;
