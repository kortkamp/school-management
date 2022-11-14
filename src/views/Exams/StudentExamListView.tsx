/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Box, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Moment from 'moment';
import { AppButton } from '../../components';
import { examsService } from '../../services/exams.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

import { useApi, useRequestApi } from '../../api/useApi';
import CustomPagination from '../../components/AppCustomPagination/CustomPagination';
import AppView, { AppViewData, AppViewParams } from '../../components/AppView';
import { classGroupsService } from '../../services/classGroups.service';
import { useAppStore } from '../../store';
import { RoleTypes } from '../../services/models/IRole';
import { toast } from 'react-toastify';
import { studentsService } from '../../services/students.service';

/**
 * Renders "ExamsListView" view
 * url: /exames/aluno
 */
function StudentExamListView() {
  const history = useHistory();
  const [state, dispatch] = useAppStore();

  const isTeacher = state?.currentSchool?.role === RoleTypes.TEACHER;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('');
  const [classGroupFilter, setClassGroupFilter] = useState('');

  const [studentData, studentError, loadingStudent] = useApi(studentsService.getByAuthUser);

  const [examsData, errorOnExams, loadingExams, , setExamsData] = useApi(examsService.getAll, {
    args: {
      page,
      per_page: pageSize,
      status: statusFilter,
      type: typeFilter,
      class_group_id: studentData?.student?.class_group_id,
    },
  });

  const columns = [
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
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderCell: (params: any) => {
        return (
          <>
            {/* <AppButton color="default" onClick={() => history.push(`/exames/${params.row.id}`)}> */}
            <AppButton color="default" onClick={() => {}}>
              Notas
            </AppButton>
          </>
        );
      },
    },
  ];

  function CustomFooterButtonsComponent() {
    return (
      <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <CustomPagination />
      </Box>
    );
  }

  const loading = loadingStudent;

  const error = errorOnExams || studentError;

  return (
    <AppView title="Avaliações" loading={loading} error={error}>
      <AppViewParams>
        <Grid item xs={12} sm={12} md={6}>
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
        <Grid item xs={12} sm={12} md={6}>
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
      </AppViewParams>

      <AppViewData>
        <DataGrid
          rows={examsData?.result || []}
          columns={!loadingExams ? columns : []}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPageChange={(newPage) => setPage(newPage + 1)}
          pagination
          pageSize={pageSize}
          page={page - 1}
          rowCount={examsData?.total_filtered || 0}
          paginationMode="server"
          rowsPerPageOptions={[10, 20, 50]}
          loading={loadingExams}
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

export default StudentExamListView;
