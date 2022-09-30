/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, CircularProgress, TextField, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { AppButton, AppLoading } from '../../components';
import { teachersService } from '../../services/teachers.service';
import { ISubject, subjectsService } from '../../services/subjects.service';
import { SHARED_CONTROL_PROPS, useAppForm } from '../../utils/form';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { segmentsService } from '../../services/segments.service';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../store';
import { useApi, useRequestApi } from '../../api/useApi';

interface FormStateValues {
  teacher_id: string;
  segment_id: string;
  subjects_ids: string[];
}

interface ITeacherSubject extends ISubject {
  segment: { name: string };
}

const teacherSubjectSchema = {};

/**
 * Renders "TeacherSubjectView" view
 * url: /professores/disciplina
 */
const TeacherSubjectView = () => {
  const { id: teacherIdPAram } = useParams<{ id: string }>();
  const [appState] = useAppStore();

  const [teachersData, , loadingTeachers] = useApi(teachersService.getAll);
  const [subjects, , loadingSubjects] = useApi(subjectsService.getAll, { defaultValue: [] });
  const [segments, , loadingSegments] = useApi(segmentsService.getAll, { defaultValue: [] });

  const [getUserSubjects, loadingUserSubjects] = useRequestApi(subjectsService.getByUser);
  const [addTeacherSubject, addingTeacherSubject] = useRequestApi(teachersService.addTeacherSubjects);
  const [removeTeacherSubject, removingTeacherSubject] = useRequestApi(teachersService.removeTeacherSubject);

  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<ITeacherSubject[]>([]);

  const [formState, , onFieldChange] = useAppForm({
    validationSchema: teacherSubjectSchema, // the state value, so could be changed in time
    initialValues: {
      teacher_id: teacherIdPAram || '',
      segment_id: '',
      subjects_ids: [],
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const loadTeacherSubjectsList = useCallback(async () => {
    if (!values.teacher_id) {
      return;
    }

    const userSubjects = await getUserSubjects({ id: values.teacher_id });

    if (userSubjects) {
      setTeacherSubjects(userSubjects.map((user_subject: any) => user_subject.subject));
    }
  }, [values.teacher_id, teacherIdPAram]);

  useEffect(() => {
    setFilteredSubjects(
      subjects.filter((subject) => {
        return (
          subject.segment_id === values.segment_id &&
          !teacherSubjects.find((teacherSubject) => teacherSubject.id === subject.id)
        );
      })
    );
  }, [teacherSubjects, values.segment_id]);

  useEffect(() => {
    loadTeacherSubjectsList();
  }, [values.teacher_id, loadTeacherSubjectsList]);

  const handleRemoveTeacherSubject = async (teacher_id: string, subject_id: string) => {
    const response = await removeTeacherSubject({
      user_id: teacher_id,
      subject_id,
    });

    if (response?.success) {
      setTeacherSubjects(teacherSubjects.filter((subject) => subject.id !== subject_id));
    }
  };

  const handleAddTeacherSubject = async (teacher_id: string, subject: ISubject) => {
    const response = await addTeacherSubject({
      user_id: teacher_id,
      subject_id: subject.id,
    });
    if (response?.success) {
      const segmentName = segments.find((s) => s.id === subject.segment_id)?.name;
      setTeacherSubjects([...teacherSubjects, { ...subject, segment: { name: segmentName || '' } }]);
    }
  };

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
            loading={addingTeacherSubject}
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

  const isLoading = loadingTeachers || loadingSegments || loadingSubjects;

  if (isLoading) return <AppLoading />;

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
                  {teachersData?.result.map((teacher) => {
                    return (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <DataGrid
                  rows={teacherSubjects}
                  columns={loadingUserSubjects ? [] : teacherColumns}
                  loading={loadingUserSubjects}
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
                  loading={loadingSubjects}
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
