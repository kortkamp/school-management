import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { DataGrid, GridPagination } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { classGroupsService } from '../../services/classGroups.service';
import { gradesService } from '../../services/grades.service';
import { segmentsService } from '../../services/segments.service';
import { studentsService } from '../../services/students.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

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
 * Renders "StudentsListView" view
 * url: /alunos/*
 */
const StudentsListView = () => {
  const [students, setStudents] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [selected, setSelected] = useState<any[]>([]);

  const [allocation, setAllocation] = useState<IAllocation>({
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  const { segmentId, gradeId, classGroupId } = allocation;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();

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
      const response = await studentsService.getAll(pageSize, page, filterBy, filterValue, filterType);
      setStudents(response.data);
      setLoading(false);
      setIsDataLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }, [allocation, page, pageSize]);

  useEffect(() => {
    setIsDataLoading(true);
    loadStudentsList();
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

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150, flex: 1 },
    { field: 'enroll_id', headerName: 'Matrícula', width: 150, flex: 1 },

    {
      field: 'segment',
      headerName: 'Segmento',
      width: 150,
      flex: 1,
      valueGetter: (params: any) => {
        return params.row.segment?.name || '';
      },
    },
    {
      field: 'classGroup',
      headerName: 'Turma',
      width: 150,
      flex: 1,
      valueGetter: (params: any) => {
        return params.row.classGroup?.name || '';
      },
    },
    {
      field: 'grade',
      headerName: 'Ano',
      width: 150,
      flex: 1,
      valueGetter: (params: any) => {
        return params.row.grade?.name;
      },
    },
    {
      field: 'action',
      headerName: 'Ações',
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push('/turmas/' + params.row.id);
        };

        return <Button onClick={onClick}>Mostrar</Button>;
      },
    },
  ];

  const handleSelectAllocation = (allocation: IAllocation) => {
    setAllocation(allocation);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Alunos" subheader="Lista de alunos" />

          <CardContent>
            <Grid container spacing={1}>
              <AppAllocationSelect onChange={handleSelectAllocation} />
              <Grid item md={12} sm={12} xs={12}>
                <DataGrid
                  rows={students.result}
                  columns={columns}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  onPageChange={(newPage) => setPage(newPage + 1)}
                  pagination
                  pageSize={pageSize}
                  page={page - 1}
                  rowCount={students.total_filtered}
                  paginationMode="server"
                  rowsPerPageOptions={[10, 20, 50]}
                  checkboxSelection
                  loading={isDataLoading}
                  autoHeight
                  onSelectionModelChange={(ids) => {
                    setSelected(ids.map((item: any) => item.id));
                  }}
                  initialState={{
                    pagination: {
                      page: 1,
                    },
                  }}
                  components={{ Footer: CustomFooterButtonsComponent }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentsListView;
