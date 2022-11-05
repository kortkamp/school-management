/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridOverlay,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppButton, AppIconButton } from '../../components';
import Pagination from '@mui/material/Pagination';

import { AppAddButton } from '../../components/AppCustomButton';
import { routePaths } from '../../routes/RoutePaths';
import { studentsService } from '../../services/students.service';
import AppView from '../../components/AppView';
import StudentAllocation, { IStudentAllocation } from './StudentAllocation';

interface Props {
  onSuccess?: () => void;
}

const defaultAllocation = { course_id: '', grade_id: '', class_group_id: '' };

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

/**
 * Renders "ListEmployeesView" view
 * url: /funcionarios/
 */
const ListStudentsView = ({ onSuccess }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [allocation, setAllocation] = useState<IStudentAllocation>(defaultAllocation);

  const [data, , loading, , setData] = useApi(studentsService.getAll, {
    args: { page, per_page: pageSize, ...allocation },
  });

  const history = useHistory();

  const dataGridTeachersColumns = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 250,
      valueGetter: (params: any) => {
        return params.row.person?.name;
      },
    },
    {
      field: 'course',
      headerName: 'Curso',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.course?.name;
      },
    },
    {
      field: 'grade',
      headerName: 'Fase',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.grade?.name;
      },
    },
    {
      field: 'classGroup',
      headerName: 'Turma',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.classGroup?.name;
      },
    },

    {
      field: 'action',
      headerName: 'Ações',
      width: 350,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <AppIconButton
              title="Alterar Turma"
              icon="edit"
              onClick={(event) => {
                event.stopPropagation();
                const { id, person, course, grade, classGroup } = params.row;

                history.push(routePaths.students.designate.path, {
                  student: {
                    id,
                    name: person.name,
                    course_id: course?.id,
                    grade_id: grade?.id,
                    class_group_id: classGroup?.id,
                  },
                });
              }}
            />

            <Box position={'relative'}>
              <AppIconButton
                title="Remover"
                icon="delete"
                onClick={(event) => {
                  event.stopPropagation();
                  // handleRemoveEmployee(params);
                }}
              />
            </Box>
          </>
        );
      },
    },
  ];

  function CustomFooterButtonsComponent() {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <AppAddButton onClick={() => history.push(routePaths.students.create.path)} />
          {onSuccess && (
            <AppButton color="info" onClick={() => onSuccess()}>
              Finalizar
            </AppButton>
          )}
        </Box>
        <CustomPagination />
      </Box>
    );
  }

  return (
    <AppView title="Alunos" loading={false}>
      <StudentAllocation onChange={(allocData) => setAllocation(allocData)} values={defaultAllocation} />
      <DataGrid
        rows={(data?.result || []) as any[]}
        getRowId={(row) => row.id + row.role_id}
        columns={loading ? [] : dataGridTeachersColumns}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onPageChange={(newPage) => setPage(newPage + 1)}
        pagination
        pageSize={pageSize}
        page={page - 1}
        rowCount={data?.total_filtered || 0}
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
        // components={{ Footer: CustomFooterButtonsComponent }}
        components={{
          Footer: CustomFooterButtonsComponent,
          Pagination: CustomPagination,
          NoRowsOverlay: () => (
            <GridOverlay>
              <div>Nenhum aluno encontrado</div>
            </GridOverlay>
          ),
        }}
      />
    </AppView>
  );
};

export default ListStudentsView;
