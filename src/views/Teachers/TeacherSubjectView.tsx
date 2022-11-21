/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, TextField, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { AppButton, AppLoading } from '../../components';
import { ITeacherClassSubject, teachersService } from '../../services/teachers.service';
import { ISubject, subjectsService } from '../../services/subjects.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { useApi, useRequestApi } from '../../api/useApi';
import { classGroupsService } from '../../services/classGroups.service';
import { coursesService } from '../../services/courses.service';

/**
 * Renders "TeacherSubjectView" view
 * url: /professores/disciplinas
 */
const TeacherSubjectView = () => {
  const { id: teacherIdPAram } = useParams<{ id: string }>();

  const [teachersData, , loadingTeachers] = useApi(teachersService.getAll, { args: { per_page: 1000 } });
  const [classGroups, , loadingClassGroups] = useApi(classGroupsService.getAll, { defaultValue: [] });
  const [coursesList, , loadingCourses] = useApi(coursesService.getAll, { defaultValue: [] });
  const [subjects, , loadingSubjects] = useApi(subjectsService.getAll, { defaultValue: [] });

  const [getTeacherClasses, loadingTeacherClasses] = useRequestApi(teachersService.getTeacherClasses);
  const [addTeacherSubject, addingTeacherSubject] = useRequestApi(teachersService.addTeacherSubjects);
  const [removeTeacherSubject, removingTeacherSubject] = useRequestApi(teachersService.removeTeacherSubject);

  const [selectedClassGroupId, setSelectedClassGroupId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teacherIdPAram || '');
  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<Omit<ITeacherClassSubject, 'routines'>[]>([]);

  const loadTeacherSubjectsList = useCallback(async () => {
    if (!selectedTeacherId) {
      return;
    }
    const result = await getTeacherClasses({ teacher_id: selectedTeacherId });
    if (result) {
      setTeacherSubjects(result);
    }
  }, [selectedTeacherId, teacherIdPAram]);

  useEffect(() => {
    loadTeacherSubjectsList();
  }, [selectedTeacherId, loadTeacherSubjectsList]);

  useEffect(() => {
    if (!selectedClassGroupId) {
      return;
    }
    const classGroupCourse = coursesList.find((course) =>
      course.grades.find((grade) => grade.class_groups.find((classGroup) => classGroup.id === selectedClassGroupId))
    );

    if (classGroupCourse) {
      const segmentId = classGroupCourse?.segment_id;

      const selectedClassSubjects = subjects.filter((subject) => subject.segment_id === segmentId);

      const newFilteredSubjects = selectedClassSubjects.filter((classSubject) => {
        const isClassSubjectInTeacherClassSubject = teacherSubjects.find(
          (teacherSubject) =>
            teacherSubject.classGroup.id === selectedClassGroupId && teacherSubject.subject.id === classSubject.id
        );
        return !isClassSubjectInTeacherClassSubject;
      });

      setFilteredSubjects(newFilteredSubjects);
    }
  }, [selectedClassGroupId, teacherSubjects]);

  const handleRemoveTeacherSubject = async (teacherClassGroupSubject: ITeacherClassSubject) => {
    const response = await removeTeacherSubject({
      teacher_id: selectedTeacherId,
      class_group_id: teacherClassGroupSubject.classGroup.id,
      subject_id: teacherClassGroupSubject.subject.id,
    });

    if (!response?.success) {
      return;
    }

    setTeacherSubjects((prev) =>
      prev.filter(
        (items) =>
          items.subject.id !== teacherClassGroupSubject.subject.id ||
          items.classGroup.id !== teacherClassGroupSubject.classGroup.id
      )
    );
  };

  const handleAddTeacherSubject = async (subject: ISubject) => {
    const response = await addTeacherSubject({
      teacher_id: selectedTeacherId,
      class_group_id: selectedClassGroupId,
      subject_id: subject.id,
    });

    if (!response?.success) {
      return;
    }

    const classGroup = classGroups.find((item) => item.id === selectedClassGroupId);

    const teacherClassSubject = {
      subject,
      classGroup: {
        id: selectedClassGroupId,
        name: classGroup?.name as string,
      },
      teacher: {
        id: selectedTeacherId,
        person: {
          id: '',
          name: '',
        },
      },
    };

    setTeacherSubjects((prev) => prev.concat(teacherClassSubject));
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
              handleAddTeacherSubject(params.row);
            }}
            disabled={!selectedTeacherId}
            loading={addingTeacherSubject}
          >
            Adicionar
          </AppButton>
        );
      },
    },
  ];

  const teacherColumns = [
    {
      field: 'name',
      headerName: 'Matérias do professor',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params.row.subject.name,
    },
    {
      field: 'classGroup',
      headerName: 'Turma',
      width: 100,
      flex: 1,
      valueGetter: (params: any) => params.row.classGroup.name,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <AppButton color="error" onClick={() => handleRemoveTeacherSubject(params.row)}>
            Remover
          </AppButton>
        );
      },
    },
  ];

  const isLoading = loadingTeachers || loadingSubjects || loadingClassGroups || loadingCourses;

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
                  value={selectedTeacherId}
                  onChange={(event) => setSelectedTeacherId(event.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  {teachersData?.result.map((teacher) => {
                    return (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.person.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <DataGrid
                  getRowId={(row) => row.classGroup.id + row.subject.id}
                  rows={teacherSubjects}
                  columns={loadingTeacherClasses ? [] : teacherColumns}
                  loading={loadingTeacherClasses}
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
                  label="Turma"
                  name="segment_id"
                  value={selectedClassGroupId}
                  onChange={(e) => setSelectedClassGroupId(e.target.value)}
                  {...SHARED_CONTROL_PROPS}
                >
                  {classGroups.map((segment) => {
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
