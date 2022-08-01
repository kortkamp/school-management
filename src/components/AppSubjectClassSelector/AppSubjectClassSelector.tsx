import { useState, useCallback, useEffect } from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

import { SHARED_CONTROL_PROPS } from '../../utils/form';

import { teacherClassGroupsService } from '../../services/teacherClassGroups.service';
import { useAppStore } from '../../store';
import { studentsService } from '../../services/students.service';

export interface IData {
  subjectId: string;
  classGroupId: string;
}

interface IClassSubjects {
  id: string;
  name: string;
  subjects: { id: string; name: string }[];
}

interface Props {
  onChange?: (allocation: IData) => void;
  selectorAll?: boolean;
}

const AppSubjectClassSelector: React.FC<Props> = ({ onChange = () => {}, selectorAll = false }) => {
  const [state] = useAppStore();

  const [data, setData] = useState<IData>({ subjectId: '', classGroupId: '' });

  const [subjects, setSubjects] = useState<any[]>([]);

  const [classSubjects, setClassSubjects] = useState<IClassSubjects[]>([]);

  const handleSelectClassGroup = (id: string) => {
    setData({ classGroupId: id, subjectId: '' });
    setSubjects(classSubjects.find((classSubject) => classSubject.id === id)?.subjects || []);
  };

  const handleSelectSubject = (id: string) => {
    setData((prevState) => ({ classGroupId: prevState.classGroupId, subjectId: id }));
  };

  useEffect(() => {
    onChange(data);
  }, [data]);

  const loadData = useCallback(async () => {
    let componentMounted = true;
    let classSubjectsData: IClassSubjects[];

    async function fetchData() {
      try {
        switch (state.currentSchool?.role) {
          case 'student':
            const response = await studentsService.getById(state.currentUser?.id as string);
            const student = response.data.student;
            classSubjectsData = [
              { id: student.class_group_id, name: student.classGroup.name, subjects: student.subjects },
            ];

            break;
          case 'teacher':
            const teacherResponse = await teacherClassGroupsService.getAllbyTeacher(state.currentUser?.id as string);
            classSubjectsData = teacherResponse.data.teacherClasses.map((teacherClass: any) => ({
              id: teacherClass.id,
              name: teacherClass.name,
              subjects: teacherClass.teacherClassGroups.map((teacherSubject: any) => ({
                id: teacherSubject.subject_id,
                name: teacherSubject.subject.name,
              })),
            }));

            break;
          default:
            return;
        }

        if (!componentMounted) {
          return;
        }

        setClassSubjects(classSubjectsData);

        if (classSubjectsData.length === 1) {
          handleSelectClassGroup(classSubjectsData[0].id);
          setSubjects(classSubjectsData[0].subjects);
        }
      } catch (err: any) {
        console.log(err);
      }
    }

    fetchData();

    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (subjects.length === 1) {
      handleSelectSubject(subjects[0].id);
    }
  }, [subjects]);

  return (
    <>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          select
          label="Turma"
          name="class_id"
          value={data.classGroupId}
          onChange={(e) => handleSelectClassGroup(e.target.value)}
          {...SHARED_CONTROL_PROPS}
        >
          {selectorAll && (
            <MenuItem key={'all'} value={''}>
              Todos
            </MenuItem>
          )}
          {classSubjects.map((classSubject) => {
            return (
              <MenuItem key={classSubject.id} value={classSubject.id}>
                {classSubject.name}
              </MenuItem>
            );
          })}
        </TextField>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          disabled={data.classGroupId ? false : true}
          select
          label="Matéria"
          name="subject_id"
          value={data.subjectId}
          onChange={(e) => handleSelectSubject(e.target.value)}
          {...SHARED_CONTROL_PROPS}
        >
          {selectorAll && (
            <MenuItem key={'all'} value={'all'}>
              Todos
            </MenuItem>
          )}
          {subjects
            // .filter((grade) => grade.segment_id === segmentId)
            .map((subject) => {
              return (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              );
            })}
        </TextField>
      </Grid>
    </>
  );
};

export default AppSubjectClassSelector;
