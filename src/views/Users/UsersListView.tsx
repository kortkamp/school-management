/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, CircularProgress, Button, Box } from '@mui/material';
import { DataGrid, GridOverlay, GridPagination } from '@mui/x-data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
// import { studentsService } from '../../services/students.service';
import { teachersService } from '../../services/teachers.service';
import { useAppStore } from '../../store';

export function CustomFooterButtonsComponent() {
  return (
    <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <AppButton color="primary">Mudar Turma</AppButton>
      </div>
      <GridPagination />
    </Box>
  );
}

/**
 * Renders "ListView" view
 * url: /alunos/*
 */
const ListView = ({ role }: { role: 'student' | 'teacher' }) => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [appState] = useAppStore();

  const mounted = useRef(false);

  const [allocation, setAllocation] = useState<IAllocation>({
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  const { segmentId, gradeId, classGroupId } = allocation;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();

  const dataGridStudentsColumns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    { field: 'enroll_id', headerName: 'Matrícula', width: 150 },

    {
      field: 'segment',
      headerName: 'Segmento',
      width: 150,
      // flex: 1,
      valueGetter: (params: any) => {
        return params.row.segment?.name || '';
      },
    },
    {
      field: 'classGroup',
      headerName: 'Turma',
      width: 150,
      // flex: 1,
      valueGetter: (params: any) => {
        return params.row.classGroup?.name || '';
      },
    },
    {
      field: 'grade',
      headerName: 'Ano',
      width: 150,
      // flex: 1,
      valueGetter: (params: any) => {
        return params.row.grade?.name;
      },
    },
    {
      field: 'action',
      headerName: 'Ações',
      width: 250,

      sortable: false,
      // flex: 1,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push('/turmas/' + params.row.id);
        };

        return <Button onClick={onClick}>Mostrar</Button>;
      },
    },
  ];

  const dataGridTeachersColumns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    { field: 'enroll_id', headerName: 'Matrícula', width: 150 },

    {
      field: 'action',
      headerName: 'Ações',
      width: 350,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <AppButton onClick={() => history.push(`/professores/disciplinas/${params.row.id}`)}>Matérias</AppButton>
            <AppButton onClick={() => history.push(`/professores/turmas/${params.row.id}`)}>Turmas</AppButton>
          </>
        );
      },
    },
  ];

  const roleData = {
    student: {
      service: teachersService,
      title: 'Alunos',
      subheader: 'Lista de alunos',
      dataGridColumns: dataGridStudentsColumns,
    },
    teacher: {
      service: teachersService,
      title: 'Professores',
      subheader: 'Lista de professores',
      dataGridColumns: dataGridTeachersColumns,
    },
  };

  const loadStudentsList = useCallback(async () => {
    let filterType = '',
      filterBy = '',
      filterValue = '';
    try {
      if (segmentId) {
        filterBy += 'segment_id';
        filterType += 'eq';
        filterValue += segmentId;
      }
      if (gradeId) {
        filterBy = 'grade_id';
        filterType = 'eq';
        filterValue = `${gradeId}`;
      }
      if (classGroupId) {
        filterBy = 'class_group_id';
        filterType = 'eq';
        filterValue = `${classGroupId}`;
      }
      // const response = await roleData[role].service.getAll(
      //   appState?.currentSchool?.id as string,
      //   pageSize,
      //   page,
      //   filterBy,
      //   filterValue,
      //   filterType
      // );

      if (mounted.current) {
        setUsers('response.data');
        setLoading(false);
        setIsDataLoading(false);
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [allocation, page, pageSize]);

  useEffect(() => {
    mounted.current = true;
    setIsDataLoading(true);
    loadStudentsList();
    return () => {
      mounted.current = false;
    };
  }, [loadStudentsList, allocation, page, pageSize]);

  if (loading)
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', minWidth: '100%' }}
      >
        <Grid item xs={3}>
          <CircularProgress />
        </Grid>
      </Grid>
    );

  const handleSelectAllocation = (newAllocation: IAllocation) => {
    setAllocation(newAllocation);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader
            style={{ textAlign: 'center' }}
            title={roleData[role].title}
            subheader={roleData[role].subheader}
          />

          <CardContent>
            <Grid container spacing={1}>
              <AppAllocationSelect onChange={handleSelectAllocation} />
              <Grid item md={12} sm={12} xs={12}>
                <DataGrid
                  rows={users.result}
                  columns={roleData[role].dataGridColumns}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  onPageChange={(newPage) => setPage(newPage + 1)}
                  pagination
                  pageSize={pageSize}
                  page={page - 1}
                  rowCount={users.total_filtered}
                  paginationMode="server"
                  rowsPerPageOptions={[10, 20, 50]}
                  checkboxSelection
                  loading={isDataLoading}
                  autoHeight
                  initialState={{
                    pagination: {
                      page: 1,
                    },
                  }}
                  // components={{ Footer: CustomFooterButtonsComponent }}
                  components={{
                    NoRowsOverlay: () => (
                      <GridOverlay>
                        <div>Sem {roleData[role].title}</div>
                      </GridOverlay>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

/**
 * Renders "TeachersListView" view
 * url: /professores/
 */
const TeachersListView = () => <ListView role="teacher" />;

/**
 * Renders "StudentsListView" view
 * url: /alunos/
 */
const StudentsListView = () => <ListView role="student" />;

export { TeachersListView, StudentsListView };
