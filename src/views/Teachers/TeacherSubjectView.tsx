import { Card, CardContent, CardHeader, Grid, CircularProgress, TextField, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { AppButton } from '../../components';
import { teachersService } from '../../services/teachers.service';
import { subjectsService } from '../../services/subjects.service';
import { SHARED_CONTROL_PROPS, useAppForm } from '../../utils/form';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { segmentsService } from '../../services/segments.service';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../store';

interface ISegment {
  id: string;
  name: string;
}

interface ISubject {
  id: string;
  name: string;
  segment: ISegment;
}

interface FormStateValues {
  teacher_id: string;
  segment_id: string;
  subjects_ids: string[];
}

const teacherSubjectSchema = {};

/**
 * Renders "TeacherSubjectView" view
 * url: /professores/disciplina
 */
const TeacherSubjectView = () => {
  const [appState] = useAppStore();
  const [teachers, setTeachers] = useState<any[]>([]);

  const { id: teacherIdPAram } = useParams<{ id: string }>();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<ISubject[]>([]);
  const [segments, setSegments] = useState<ISegment[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const [formState, , onFieldChange] = useAppForm({
    validationSchema: teacherSubjectSchema, // the state value, so could be changed in time
    initialValues: {
      teacher_id: teacherIdPAram || '',
      segment_id: '',
      subjects_ids: [],
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const loadTeacherList = useCallback(async () => {
    try {
      const response = await teachersService.getAll({ schoolId: '', token: '' });
      setTeachers(response.result);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadSubjectsList = useCallback(async () => {
    try {
      const response = await subjectsService.getAll();
      setSubjects(response.data.subjects);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadSegmentsList = useCallback(async () => {
    try {
      const response = await segmentsService.getAll();

      setSegments(response.data.segments);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadTeacherSubjectsList = useCallback(async () => {
    try {
      if (values.teacher_id) {
        setLoadingTeacher(true);
        const response = await subjectsService.getByUser(values.teacher_id);
        setTeacherSubjects(response.data.user_subjects.map((user_subject: any) => user_subject.subject));
        setLoadingTeacher(false);
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [values.teacher_id, teacherIdPAram]);

  useEffect(() => {
    setFilteredSubjects(
      subjects.filter((subject) => {
        return (
          subject.segment.id === values.segment_id &&
          !teacherSubjects.find((teacherSubject) => teacherSubject.id === subject.id)
        );
      })
    );
  }, [teacherSubjects, values.segment_id]);

  useEffect(() => {
    loadTeacherSubjectsList();
  }, [values.teacher_id, loadTeacherSubjectsList]);

  useEffect(() => {
    loadTeacherList();
    loadSubjectsList();
    loadSegmentsList();
    // if(teacherIdPAram){

    // }
  }, [loadTeacherList, loadSubjectsList, loadSegmentsList]);

  const handleRemoveTeacherSubject = async (teacher_id: string, subject_id: string) => {
    try {
      const response = await teachersService.removeTeacherSubject(appState?.currentSchool?.id as string, {
        teacher_id,
        subject_id,
      });
      console.log(response);
      setTeacherSubjects(teacherSubjects.filter((subject) => subject.id !== subject_id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTeacherSubject = async (teacher_id: string, subject: ISubject) => {
    try {
      const response = await teachersService.addTeacherSubjects(appState?.currentSchool?.id as string, {
        teacher_id,
        subjects_ids: [subject.id],
      });
      console.log(response);
      setTeacherSubjects([...teacherSubjects, subject]);
    } catch (err) {
      console.log(err);
    }
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

  const subjectsColumns = [
    { field: 'name', headerName: 'Matérias', width: 100, flex: 1 },

    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <AppButton
            color="default"
            onClick={() => {
              handleAddTeacherSubject(values.teacher_id, params.row);
            }}
            disabled={!values.teacher_id}
          >
            Adicionar
          </AppButton>
        );
      },
    },
  ];

  const teacherColumns = [
    { field: 'name', headerName: 'Matérias do professor', width: 100, flex: 1 },
    {
      field: 'segment',
      headerName: 'Segmento',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params.row.segment.name,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <AppButton color="error" onClick={() => handleRemoveTeacherSubject(values.teacher_id, params.row.id)}>
            Remover
          </AppButton>
        );
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Professores" subheader="Associar Professor a Disciplina" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  required
                  // disabled={isEditing}
                  select
                  label="Professor(a)"
                  name="teacher_id"
                  value={values.teacher_id}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                >
                  {teachers.map((teacher) => {
                    return (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <DataGrid
                  rows={teacherSubjects}
                  columns={loadingTeacher ? [] : teacherColumns}
                  loading={loadingTeacher}
                  // pageSize={5}
                  // rowsPerPageOptions={[5]}
                  // checkboxSelection
                  disableSelectionOnClick
                  autoHeight
                  hideFooter
                  components={{
                    NoRowsOverlay: () => (
                      <GridOverlay>
                        <div>Sem Matérias</div>
                      </GridOverlay>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  required
                  // disabled={isEditing}
                  select
                  label="Segmento"
                  name="segment_id"
                  value={values.segment_id}
                  onChange={onFieldChange}
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
                <DataGrid
                  rows={filteredSubjects}
                  columns={subjectsColumns}
                  loading={loading}
                  hideFooter
                  disableSelectionOnClick
                  // pageSize={5}
                  // rowsPerPageOptions={[5]}
                  // checkboxSelection
                  autoHeight
                  components={{
                    NoRowsOverlay: () => (
                      <GridOverlay>
                        <div>Sem Matérias</div>
                      </GridOverlay>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>

          {/* <CardActions> */}

          {/* </CardActions> */}
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeacherSubjectView;
