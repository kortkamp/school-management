/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppSaveButton } from '../../components/AppCustomButton';
import AppView, { AppViewActions, AppViewData, AppViewParams } from '../../components/AppView';
import { routinesService } from '../../services/routines.service';
import { studentsService } from '../../services/students.service';
import { ITeacherClassSubject, teachersService } from '../../services/teachers.service';
import * as yup from 'yup';
import { Grid, MenuItem } from '@mui/material';
import FormNumberFormat from '../../components/HookFormInput/FormNumberFormat';
import { dateToString, getWeekDay, stringToDate } from '../../utils/date';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import AttendanceTable from './components/AttendanceTable';
import { useAppStore } from '../../store/AppStore';

const DEFAULT_PRESENCE_VALUE = true;

interface IStudentAttendance {
  student_id: string;
  name: string;
  presence: boolean;
}

export interface FormValues {
  routine_id: string;
  subject_id: string;
  class_group_id: string;
  teacher_id: string;
  date: string;
  attendances: IStudentAttendance[];
}

const defaultValues: FormValues = {
  date: dateToString(new Date(), 'ddMMyyyy'),
  class_group_id: '',
  subject_id: '',
  teacher_id: '',
  routine_id: '',
  attendances: [],
};

const schema = yup.object({
  subject_id: yup.string().required('O campo é obrigatório'),
  class_group_id: yup.string().required('O campo é obrigatório'),
  date: yup.string().length(8, 'Data inválida').required('O campo é obrigatório'),
  results: yup.array().of(
    yup.object().shape({
      presence: yup.boolean().required('Campo obrigatório'),
    })
  ),
});

const AttendanceView = () => {
  const [isEditing, setIsEditing] = useState(true);

  const [state] = useAppStore();

  const [teacherClasses, , loadingTeacherClasses, , setTeacherClasses] = useApi(
    teachersService.getTeacherClassesByTeacher,
    {
      defaultValue: [],
    }
  );

  const [routineGroupsData, , loadingRoutinesGroups] = useApi(routinesService.getAllRoutineGroups, {
    defaultValue: [],
  });

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { ...defaultValues, teacher_id: state.currentSchool?.teacher_id },
    resolver: yupResolver(schema),
  });

  const [loadStudents, loadingStudents] = useRequestApi(studentsService.getAll);

  const loading = loadingRoutinesGroups || loadingTeacherClasses;

  const [dateSubjectClasses, setDateSubjectClasses] = useState<ITeacherClassSubject[]>([]);

  const fetchStudents = async () => {
    const classGroupId = watch('class_group_id');

    if (!classGroupId) {
      return;
    }
    const studentsData = await loadStudents({
      page: 1,
      per_page: 1000,
      class_group_id: classGroupId,
      course_id: '',
      grade_id: '',
    });

    if (studentsData?.success) {
      const studentsResult = studentsData?.result.map((student) => ({
        student_id: student.id,
        name: student.person.name,
        presence: DEFAULT_PRESENCE_VALUE,
      }));

      if (!studentsResult.length) {
        toast.warning('Nenhum aluno encontrado na turma');
        return;
      }

      setValue('attendances', studentsResult);
    }
  };

  useEffect(() => {
    if (watch('class_group_id')) {
      fetchStudents();
    } else {
      setValue('attendances', []);
    }
  }, [watch('class_group_id')]);

  useEffect(() => {
    const formDate = watch('date');
    if (formDate.length !== 8) {
      return;
    }
    const weekDay = getWeekDay(stringToDate(formDate, 'ddMMyyyy'));

    const weekDayRoutinesSubjects: ITeacherClassSubject[] = [];

    setValue('class_group_id', '');
    setValue('subject_id', '');

    for (const teacherClass of teacherClasses) {
      const dateRoutines = teacherClass.routines.filter((routine) => routine.week_day === weekDay);
      if (dateRoutines.length) {
        weekDayRoutinesSubjects.push({ ...teacherClass, routines: dateRoutines });
      }
    }
    if (weekDayRoutinesSubjects.length === 1) {
      setValue('class_group_id', weekDayRoutinesSubjects[0].classGroup.id);
      setValue('subject_id', weekDayRoutinesSubjects[0].subject.id);
    }

    setDateSubjectClasses(weekDayRoutinesSubjects);
  }, [watch('date')]);

  // const dateSubjectClasses =
  //   useMemo(() => {
  //     const formDate = watch('date');
  //     if (formDate.length !== 8) {
  //       return;
  //     }
  //     const weekDay = getWeekDay(stringToDate(formDate, 'ddMMyyyy'));

  //     const weekDayRoutinesSubjects: ITeacherClassSubject[] = [];

  //     for (const teacherClass of teacherClasses) {
  //       const dateRoutines = teacherClass.routines.filter((routine) => routine.week_day === weekDay);
  //       if (dateRoutines.length) {
  //         weekDayRoutinesSubjects.push({ ...teacherClass, routines: dateRoutines });
  //       }
  //     }
  //     return weekDayRoutinesSubjects;
  //   }, [watch('date')]) || [];

  const onSubmit = async (formData: FormValues) => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <AppView title="Chamada" loading={loading}>
        <AppViewParams>
          <Grid item md={4} sm={6} xs={12}>
            <FormNumberFormat
              name={'date'}
              format="##/##/####"
              label={'Data'}
              control={control}
              editable={isEditing}
              // onKeyUp={handleChangeDate}
              errorMessage={errors?.date?.message}
              fullWidth
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormStandardInput
              name={'class_group_id'}
              label={'Turma'}
              select
              type="number"
              control={control}
              editable={isEditing}
              errorMessage={errors?.class_group_id?.message}
              fullWidth
            >
              {dateSubjectClasses.map((dateSubjectClass, index) => (
                <MenuItem key={index} value={dateSubjectClass.classGroup.id}>
                  {dateSubjectClass.classGroup.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormStandardInput
              name={'subject_id'}
              label={'Disciplina'}
              select
              type="number"
              control={control}
              editable={isEditing}
              errorMessage={errors?.subject_id?.message}
              fullWidth
            >
              {dateSubjectClasses
                .filter((item) => item.classGroup.id === watch('class_group_id'))
                .map((dateSubjectClass, index) => (
                  <MenuItem key={index} value={dateSubjectClass.subject.id}>
                    {dateSubjectClass.subject.name}
                  </MenuItem>
                ))}
            </FormStandardInput>
          </Grid>
        </AppViewParams>
        <AppViewData>
          <AttendanceTable
            control={control}
            editable={isEditing}
            attendances={watch('attendances')}
            loading={loadingStudents}
          ></AttendanceTable>
        </AppViewData>
        <AppViewActions>
          <AppSaveButton type="submit"></AppSaveButton>
        </AppViewActions>
      </AppView>
    </form>
  );
};

export default AttendanceView;
