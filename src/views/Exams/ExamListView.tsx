/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, Box, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColumns, GridOverlay, GridPagination } from '@mui/x-data-grid';
import { useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton } from '../../components';
import { examsService } from '../../services/exams.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

import { useApi } from '../../api/useApi';
import StudentAllocation, { IStudentAllocation } from '../Students/StudentAllocation';
import CustomPagination from '../../components/AppCustomPagination/CustomPagination';
import AppView, { AppViewData, AppViewParams } from '../../components/AppView';
import { classGroupsService } from '../../services/classGroups.service';

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [classGroups, , loadingClassGroups] = useApi(classGroupsService.getAll, { defaultValue: [] });

  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('');
  const [classGroupFilter, setClassGroupFilter] = useState('');

  const [examsData, , loading] = useApi(examsService.getAll, {
    args: { page, per_page: pageSize, status: statusFilter, type: typeFilter, class_group_id: classGroupFilter },
  });

  const history = useHistory();

  const columns: GridColumns<IExam> = [
    { field: 'type', headerName: 'Tipo', width: 100 },

    {
      field: 'subject',
      headerName: 'Matéria',
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
      headerName: 'Situação',
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
      headerName: 'Ações',
      sortable: false,
      width: 330,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderCell: (params: any) => {
        return (
          <>
            {/* <AppButton color="default" onClick={() => history.push(`/exames/${params.row.id}`)}> */}
            <AppButton color="default" onClick={() => {}}>
              Notas
            </AppButton>
            {/* <AppButton color="info" onClick={() => history.push(`/exames/editar/${params.row.id}`)}> */}
            <AppButton color="info" onClick={() => {}}>
              Editar
            </AppButton>
            <AppButton
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                // onConfirmDeleteExamOpen(params.row);
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
            Criar Avaliação
          </AppButton>
        </div>
        <CustomPagination />
      </Box>
    );
  }

  return (
    <AppView title="Avaliações">
      <AppViewParams>
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            select
            label="Situação"
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value={''}>Todas</MenuItem>
            <MenuItem value={'open'}>Em Aberto</MenuItem>
            <MenuItem value={'closed'}>Encerradas</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
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
            <MenuItem value={'exercício'}>Exercício</MenuItem>
            <MenuItem value={'comportamento'}>Comportamento</MenuItem>
            <MenuItem value={'outros'}>Outros</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            select
            label="Turma"
            name="classGroup"
            value={classGroupFilter}
            onChange={(e) => setClassGroupFilter(e.target.value)}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value={''}>Todas</MenuItem>
            {classGroups.map((classGroup) => (
              <MenuItem key={classGroup.id} value={classGroup.id}>
                {classGroup.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </AppViewParams>

      <AppViewData>
        <DataGrid
          rows={examsData?.result || []}
          columns={!loading ? columns : []}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPageChange={(newPage) => setPage(newPage + 1)}
          pagination
          pageSize={pageSize}
          page={page - 1}
          rowCount={examsData?.total_filtered || 0}
          paginationMode="server"
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          autoHeight
          disableSelectionOnClick
          initialState={{
            pagination: {
              page: 1,
            },
          }}
          components={{
            Footer: CustomFooterButtonsComponent,
            Pagination: CustomPagination,
            NoRowsOverlay: () => (
              <GridOverlay>
                <div>Nenhuma avaliação encontrada</div>
              </GridOverlay>
            ),
          }}
        />
      </AppViewData>
    </AppView>
  );
}

export default ExamListView;
