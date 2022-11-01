/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, CircularProgress, TextField, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { AppButton } from '../../components';
import { teachersService } from '../../services/teachers.service';
import { subjectsService } from '../../services/subjects.service';
import { SHARED_CONTROL_PROPS, useAppForm } from '../../utils/form';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { segmentsService } from '../../services/segments.service';
import { useParams } from 'react-router-dom';
import { classGroupsService } from '../../services/classGroups.service';
import { gradesService } from '../../services/grades.service';
import { teacherClassGroupsService } from '../../services/teacherClassGroups.service';
import { useApi } from '../../api/useApi';

interface ISegment {
  id: string;
  name: string;
}

interface ISubject {
  id: string;
  name: string;
  segment: ISegment;
}

interface ISegment {
  id: string;
  name: string;
}

interface IGrade {
  id: string;
  name: string;
  segment_id: string;
  segment: ISegment;
}

interface ITeacherClassGroup {
  teacher_id: string;
  class_group_id: string;
  classGroup: IClassGroup;
  subject_id: string;
  subject: ISubject;
}

interface IClassGroup {
  id: string;
  name: string;
  grade_id: string;
  grade: IGrade;
}

interface FormStateValues {
  teacher_id: string;
  segment_id: string;
  grade_id: string;
}
const teacherClassGroupSchema = {};
/**
 * Renders "TeacherClassGroupView" view
 * url: /professores/turmas/*
 */
const TeacherClassGroupView = () => {
  const [teachers, setTeachers] = useState<any[]>([]);

  const [classGroups, , loadingClassGroups] = useApi(classGroupsService.getAll, { defaultValue: [] });

  const { id: teacherIdPAram } = useParams<{ id: string }>();

  const [grades, setGrades] = useState<IGrade[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<ISubject[]>([]);
  const [filteredClassGroups, setFilteredClassGroups] = useState<IClassGroup[]>([]);
  const [teacherClassGroups, setTeacherClassGroups] = useState<ITeacherClassGroup[]>([]);
  const [segments, setSegments] = useState<ISegment[]>([]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const [formState, setFormState, onFieldChange] = useAppForm({
    validationSchema: teacherClassGroupSchema, // the state value, so could be changed in time
    initialValues: {
      teacher_id: teacherIdPAram || '',
      segment_id: '',
      grade_id: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const loadTeacherList = useCallback(async () => {
    try {
      const response = await teachersService.getAll({ token: '', schoolId: '', args: {} });
      setTeachers(response.result);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadTeacherSubjectsList = useCallback(async () => {
    try {
      if (values.teacher_id) {
        // setLoadingTeacher(true);
        // const response = await subjectsService.getByUser(values.teacher_id);
        // setTeacherSubjects(response.data.user_subjects.map((user_subject: any) => user_subject.subject));
        // setLoadingTeacher(false);
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [values.teacher_id, teacherIdPAram]);

  useEffect(() => {
    loadTeacherSubjectsList();
  }, [values.teacher_id, loadTeacherSubjectsList]);

  const loadSegmentsList = useCallback(async () => {
    try {
      // const response = await segmentsService.getAll();

      // setSegments(response.data.segments);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadGradesList = useCallback(async () => {
    try {
      const response = await gradesService.getAll();

      setGrades(response.data.grades);
      // setLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  const loadTeacherClassGroupsList = useCallback(async () => {
    try {
      if (values.teacher_id) {
        setLoadingTeacher(true);
        const response = await teacherClassGroupsService.getAll(
          undefined,
          undefined,
          'teacher_id',
          values.teacher_id,
          'eq'
        );
        setTeacherClassGroups(response.data.teacherClasses.result);
        setLoadingTeacher(false);
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [values.teacher_id, teacherIdPAram]);

  useEffect(() => {
    setFormState((state) => ({
      ...state,
      values: {
        ...state.values,
        grade_id: '',
      },
    }));
  }, [values.segment_id]);

  useEffect(() => {
    loadTeacherClassGroupsList();
  }, [values.teacher_id, loadTeacherClassGroupsList]);

  useEffect(() => {
    loadTeacherList();
    loadSegmentsList();
    loadGradesList();
  }, [loadTeacherList, loadSegmentsList, loadGradesList]);

  const handleRemoveTeacherClassGroup = async ({ teacher_id, subject_id, class_group_id }: ITeacherClassGroup) => {
    try {
      await teacherClassGroupsService.remove({ teacher_id, subject_id, class_group_id });

      setTeacherClassGroups(
        teacherClassGroups.filter(
          (classGroup) => !(classGroup.class_group_id === class_group_id && classGroup.subject_id === subject_id)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTeacherClassGroup = async (classGroup: IClassGroup) => {
    const teacherClassExists = (class_group_id: string, subject_id: string) => {
      return teacherClassGroups.find(
        (teacherClass) => teacherClass.subject_id === subject_id && teacherClass.class_group_id === class_group_id
      );
    };

    const subjectsIDs = selectedSubjects.filter((subject_id) => !teacherClassExists(classGroup.id, subject_id));

    if (!subjectsIDs.length) {
      return;
    }

    const teacherClassGroup = {
      subject_ids: subjectsIDs,
      class_group_id: classGroup.id,
      teacher_id: values.teacher_id,
    };

    try {
      const response = await teacherClassGroupsService.create(teacherClassGroup);

      const createdTeacherClassGroup: ITeacherClassGroup[] = response.data.teacherClass.map(
        ({ subject_id, class_group_id, teacher_id }: ITeacherClassGroup) => ({
          subject_id,
          class_group_id,
          teacher_id,
          subject: teacherSubjects.find((subject) => subject.id === subject_id),
          classGroup: classGroups.find((c) => c.id === class_group_id),
        })
      );

      // const response = await teachersService.addTeacherClassGroups({ teacher_id, subjects_ids: [classGroup.id] });
      // console.log(response);
      setTeacherClassGroups([...teacherClassGroups, ...createdTeacherClassGroup]);
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

  const classGroupColumns = [
    { field: 'name', headerName: 'Turma', width: 100, flex: 1 },

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
              handleAddTeacherClassGroup(params.row);
            }}
            disabled={!values.teacher_id || !selectedSubjects.length}
          >
            Adicionar
          </AppButton>
        );
      },
    },
  ];

  const teacherColumns = [
    // { field: 'name', headerName: 'Turma', width: 100, flex: 1 },
    {
      field: 'classGroup',
      headerName: 'Turma',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params.row.classGroup.name,
    },
    {
      field: 'subject',
      headerName: 'Matéria',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params.row.subject.name,
    },
    // {
    //   field: 'segment',
    //   headerName: 'Segmento',
    //   width: 100,
    //   flex: 1,
    //   valueGetter: (params: any) => params.row.grade.segment.name,
    // },
    // {
    //   field: 'subject',
    //   headerName: 'Matéria',
    //   width: 100,
    //   flex: 1,
    //   valueGetter: (params: any) => params.row.grade.segment.name,
    // },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <AppButton color="error" onClick={() => handleRemoveTeacherClassGroup(params.row)}>
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
          <CardHeader style={{ textAlign: 'center' }} title="Professores" subheader="Associar Professor a Turma" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={7} sm={12} xs={12}>
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
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <DataGrid
                      rows={teacherClassGroups}
                      columns={loadingTeacher ? [] : teacherColumns}
                      loading={loadingTeacher}
                      disableSelectionOnClick
                      getRowId={(row) => row.class_group_id + row.subject_id}
                      autoHeight
                      hideFooter
                      components={{
                        NoRowsOverlay: () => (
                          <GridOverlay>
                            <div>{values.teacher_id ? 'Sem Turmas' : 'Selecione um(a) Professor(a)'}</div>
                          </GridOverlay>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={5} sm={12} xs={12}>
                <Grid container spacing={1}>
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
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      required
                      // disabled={isEditing}
                      select
                      label="Ano"
                      name="grade_id"
                      value={values.grade_id}
                      onChange={onFieldChange}
                      {...SHARED_CONTROL_PROPS}
                    >
                      {grades.map((grade) => {
                        if (grade.segment_id === values.segment_id) {
                          return (
                            <MenuItem key={grade.id} value={grade.id}>
                              {grade.name}
                            </MenuItem>
                          );
                        }
                      })}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DataGrid
                      rows={filteredClassGroups}
                      columns={classGroupColumns}
                      loading={loading}
                      hideFooter
                      disableSelectionOnClick
                      autoHeight
                      components={{
                        NoRowsOverlay: () => (
                          <GridOverlay>
                            <div>
                              {values.segment_id && values.grade_id ? 'Sem Turmas' : 'Selecione Segmento e Ano'}
                            </div>
                          </GridOverlay>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DataGrid
                      rows={teacherSubjects.filter((subject) => subject.segment.id === values.segment_id)}
                      columns={loadingTeacher ? [] : [{ field: 'name', headerName: 'Matéria', width: 100, flex: 1 }]}
                      loading={loadingTeacher}
                      autoHeight
                      hideFooter
                      checkboxSelection
                      onSelectionModelChange={(ids) => {
                        setSelectedSubjects(ids.map((item: any) => item));
                      }}
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeacherClassGroupView;
