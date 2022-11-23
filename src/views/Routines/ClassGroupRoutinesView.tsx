/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, MenuItem, TextField } from '@mui/material';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppClearButton, AppSaveButton } from '../../components/AppCustomButton';
import AppView, { AppViewActions, AppViewData, AppViewParams } from '../../components/AppView';
import WeekRoutines from '../../components/WeekRoutines';
import { ITableCell } from '../../components/WeekRoutines/WeekRoutines';
import { classGroupsService, IClassGroup } from '../../services/classGroups.service';
import { routinesService } from '../../services/routines.service';
import { teachersService } from '../../services/teachers.service';
import { timeToMinutes } from '../../utils/time';
import TeacherSubjectsTable from './components/TeacherSubjectsTable';
import { toast } from 'react-toastify';
import { routePaths } from '../../routes/RoutePaths';

const useStyles = makeStyles({
  selectedCell: {
    fontWeight: 'bold',
    // backgroundColor: '#ddd',
    transition: 'all 0.2s',
  },
});

interface LocationProps {
  classGroup: IClassGroup;
}

interface IClassGroupRoutine {
  routine_id: string;
  week_day: number;
  teacher_class_group_id: string;
}

const ClassGroupRoutinesView = () => {
  const classes = useStyles();

  const { state } = useLocation() as { state: LocationProps };

  const history = useHistory();

  const classGroup = state?.classGroup;

  const [selectedRoutineGroup, setSelectedRoutineGroup] = useState(classGroup.routineGroup?.id || '');

  const [teacherSubjectTotalTime, setTeacherSubjectTotalTime] = useState<string[]>([]);

  const [selectedSubjectButton, setSelectedSubjectButton] = useState<number | null>(null);

  const [routineGroupsData, , loadingRoutinesGroups] = useApi(routinesService.getAllRoutineGroups, {
    defaultValue: [],
  });

  const [teacherClasses, , loadingTeacherClasses, , setTeacherClasses] = useApi(teachersService.getTeacherClasses, {
    args: { class_group_id: classGroup?.id },
    defaultValue: [],
  });

  const loading = loadingTeacherClasses || loadingRoutinesGroups;

  const [updateClassGroup, isUpdatingClassGroup] = useRequestApi(classGroupsService.update);
  const [updateTeacherClasses, isUpdatingTeacherClasses] = useRequestApi(teachersService.updateTeacherClasses);

  const clearRoutineSubjects = () => {
    setTeacherClasses((prevTeacherClasses) =>
      prevTeacherClasses.map((teacherClass) => ({ ...teacherClass, routines: [] }))
    );
  };

  // clear routineSubjects when change classGroupId
  useEffect(() => {
    if (selectedRoutineGroup !== classGroup.routineGroup?.id) {
      clearRoutineSubjects();
    }
  }, [selectedRoutineGroup]);

  //calculate total time for each teacherClassSubject
  useEffect(() => {
    if (loading) {
      return;
    }

    let totalTime = teacherClasses.map(() => 0);

    let routinesDuration: Record<string, string>;

    const selectedRoutines =
      routineGroupsData.find((routineGroup) => routineGroup.id === selectedRoutineGroup)?.routines || [];

    routinesDuration = selectedRoutines.reduce(
      (total, routine) => ({ ...total, [routine.id]: routine.duration }),
      {} as Record<string, string>
    );

    teacherClasses.forEach((teacherClass, index) => {
      teacherClass.routines.forEach((routine) => {
        const routineDuration = timeToMinutes(routinesDuration[routine.routine_id] || '00:00');
        totalTime[index] += routineDuration;
      });
    });

    setTeacherSubjectTotalTime(totalTime.map((i) => String(i)));
  }, [loading, selectedRoutineGroup]);

  const handleCellClick = useCallback(
    ({ routine_id, week_day }: { routine_id: string; week_day: number }) => {
      if (selectedSubjectButton === null) {
        return;
      }

      const isInterval = routineGroupsData
        .find((routineGroup) => routineGroup.id === selectedRoutineGroup)
        ?.routines.find((routine) => routine.id === routine_id && routine.type === 'intervalo');

      if (isInterval) {
        return;
      }

      let teacherClassRoutineIDWeeDayExists = false;

      // clear previous routine_id/week_day combination on any teacherClass
      const clearedTeacherClass = teacherClasses.map((teacherClass, index) => ({
        ...teacherClass,
        routines: teacherClass.routines.filter((routine) => {
          // if (index === selectedSubjectButton) return true;
          const matches = routine.routine_id === routine_id && routine.week_day === week_day;

          if (index === selectedSubjectButton && matches) {
            teacherClassRoutineIDWeeDayExists = true;
          }
          return !matches;
        }),
      }));

      // if we clicked in a cell with current selected subject, just clear it
      if (teacherClassRoutineIDWeeDayExists) {
        setTeacherClasses(clearedTeacherClass);
        return;
      }

      // set a cell to the new subject
      const newTeacherClasses = clearedTeacherClass.map((teacherClass, index) => {
        if (index !== selectedSubjectButton) {
          return teacherClass;
        }
        return { ...teacherClass, routines: teacherClass.routines.concat({ routine_id, week_day }) };
      });

      setTeacherClasses(newTeacherClasses);
    },
    [selectedSubjectButton, teacherClasses]
  );

  const handleClearButtonClick = useCallback(() => {
    clearRoutineSubjects();
  }, []);

  // console.log(classGroupRoutinesTest);

  const handleSubmit = async () => {
    const updateResponse = await updateClassGroup({
      id: classGroup.id,
      data: { routine_group_id: selectedRoutineGroup },
    });

    if (!updateResponse?.success) {
      // toast.error('Não foi possível atualizar o turno');
      return;
    }

    const teacherClassesData = teacherClasses.map(({ id, routines }) => ({ id, routines }));

    const response = await updateTeacherClasses({ data: { teacherClasses: teacherClassesData } });

    if (response?.success) {
      toast.success('Horário de turma salvo com sucesso');
      history.push(routePaths.classGroups.path);
    }
  };

  const Cell: ITableCell = ({ data: { week_day, routine_id } }) => {
    for (const teacherClass in teacherClasses) {
      for (const routine of teacherClasses[teacherClass].routines) {
        if (routine.routine_id === routine_id && routine.week_day === week_day) {
          return (
            <span className={clsx('', Number(teacherClass) === selectedSubjectButton && classes.selectedCell)}>
              {teacherClasses[teacherClass]?.subject.name}
            </span>
          );
        }
      }
    }

    const isInterval = routineGroupsData
      .find((routineGroup) => routineGroup.id === selectedRoutineGroup)
      ?.routines.find((routine) => routine.id === routine_id && routine.type === 'intervalo');

    if (isInterval) {
      return <span>Intervalo</span>;
    }

    return <span></span>;
  };

  return (
    <AppView title={`Definir Horários`} loading={loading}>
      <AppViewParams>
        <Grid item md={6} sm={6} xs={12}>
          <TextField
            label="Turma"
            name="name"
            value={classGroup.name}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <TextField
            label="Turno"
            select
            name="name"
            value={selectedRoutineGroup}
            onChange={(e) => setSelectedRoutineGroup(e.target.value as any)}
            fullWidth
          >
            {routineGroupsData.map((routineGroup) => (
              <MenuItem key={routineGroup.id} value={routineGroup.id}>
                {routineGroup.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </AppViewParams>
      <AppViewData>
        <div style={{ cursor: selectedSubjectButton !== null ? 'copy' : '' }}>
          <WeekRoutines
            onClickCell={(data) => handleCellClick(data)}
            routines={routineGroupsData.find((item) => item.id === selectedRoutineGroup)?.routines || []}
            Cell={Cell}
          />
        </div>
        <p>Selecione uma disciplina:</p>
        <TeacherSubjectsTable
          teacherSubjects={teacherClasses}
          teacherSubjectTotalTime={teacherSubjectTotalTime}
          selectedIndex={selectedSubjectButton}
          selectTeacherSubject={setSelectedSubjectButton}
        />
      </AppViewData>
      <AppViewActions>
        <AppSaveButton onClick={handleSubmit} loading={isUpdatingClassGroup || isUpdatingTeacherClasses} />
        <AppClearButton onClick={handleClearButtonClick}></AppClearButton>
      </AppViewActions>
    </AppView>
  );
};

export default ClassGroupRoutinesView;
