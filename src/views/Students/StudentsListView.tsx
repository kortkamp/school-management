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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { classGroupsService } from '../../services/classGroups.service';
import { gradesService } from '../../services/grades.service';
import { segmentsService } from '../../services/segments.service';
import { studentsService } from '../../services/students.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

/**
 * Renders "StudentsListView" view
 * url: /alunos/*
 */
const StudentsListView = () => {
  const [students, setStudents] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [segmentId, setSegmentId] = useState<string>('');
  const [gradeId, setGradeId] = useState<string>('');
  const [classGroupId, setClassGroupId] = useState<string>('');

  const [segments, setSegments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [classGroups, setClassGroups] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();

  const loadFilterData = useCallback(async () => {
    try {
      const segmentResponse = await segmentsService.getAll();
      const gradeResponse = await gradesService.getAll();
      const classGroupResponse = await classGroupsService.getAll();
      setSegments(segmentResponse.data.segments);
      setGrades(gradeResponse.data.grades);
      setClassGroups(classGroupResponse.data.classGroups);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

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
    } catch (err: any) {
      console.log(err);
    }
  }, [segmentId, gradeId, classGroupId, page, pageSize]);

  useEffect(() => {
    loadStudentsList();
  }, [loadStudentsList, segmentId, gradeId, classGroupId, page, pageSize]);

  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  const handleSelectSegmentId = (id: string) => {
    setSegmentId(id);
    setGradeId('');
    setClassGroupId('');
  };

  const handleSelectGradeId = (id: string) => {
    setGradeId(id);
    setClassGroupId('');
  };

  const handleSelectClassGroupId = (id: string) => {
    setClassGroupId(id);
  };

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
      headerName: 'Action',
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Alunos" subheader="Lista de alunos" />

          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={4} sm={12} xs={12}>
                <TextField
                  select
                  label="Segmento"
                  name="class_id"
                  value={segmentId}
                  onChange={(e) => handleSelectSegmentId(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  {segments.map((segment) => {
                    return (
                      <MenuItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <TextField
                  disabled={segmentId ? false : true}
                  select
                  label="Ano"
                  name="class_id"
                  value={gradeId}
                  onChange={(e) => handleSelectGradeId(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  {grades
                    .filter((grade) => grade.segment_id === segmentId)
                    .map((grade) => {
                      return (
                        <MenuItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <TextField
                  disabled={gradeId ? false : true}
                  select
                  label="Turma"
                  name="class_id"
                  value={classGroupId}
                  onChange={(e) => handleSelectClassGroupId(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  {classGroups
                    .filter((classGroup) => classGroup.grade_id === gradeId)
                    .map((classGroup) => {
                      return (
                        <MenuItem key={classGroup.id} value={classGroup.id}>
                          {classGroup.name}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>

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
                  autoHeight
                  initialState={{
                    pagination: {
                      page: 1,
                    },
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

export default StudentsListView;
