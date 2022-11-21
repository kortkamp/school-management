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
import { IClassGroup } from '../../services/classGroups.service';
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
  subject_id: string;
  teacher_id: string;
  class_group_id: string;
}

const ClassGroupRoutinesView = () => {
  const classes = useStyles();

  const { state } = useLocation() as { state: LocationProps };

  const history = useHistory();

  const classGroup = state?.classGroup;

  const [selectedRoutineGroup, setSelectedRoutineGroup] = useState(classGroup.routineGroup?.id || '');

  const [classGroupRoutinesTest, setClassGroupRoutinesTest] = useState<Record<string, number[]>>({});

  const [teacherSubjectTotalTime, setTeacherSubjectTotalTime] = useState<string[]>([]);

  const [selectedSubjectButton, setSelectedSubjectButton] = useState<number | null>(null);

  const [routineGroupsData, , loadingRoutinesGroups] = useApi(routinesService.getAllRoutineGroups, {
    defaultValue: [],
  });

  const [routines, error, loadingRoutines, , setRoutines] = useApi(routinesService.getRoutineSubjectsByClassGroup, {
    args: { id: classGroup?.id },
    defaultValue: [],
  });

  const [teacherClasses, , loadingTeacherClasses] = useApi(teachersService.getTeacherClasses, {
    args: { class_group_id: classGroup?.id },
    defaultValue: [],
  });

  const loading = loadingRoutines || loadingTeacherClasses || loadingRoutinesGroups;

  const [createRoutineSubjects, creating] = useRequestApi(routinesService.createRoutineSubject);

  useEffect(() => {
    if (routines.length && teacherClasses.length) {
      const newClassGroupRoutineSubjects: Record<string, number[]> = {};
      for (const routine of routines) {
        const routineId = routine.id;

        newClassGroupRoutineSubjects[routineId] = Array(7);

        for (const routineSubject of routine.routineSubjects) {
          const weekDay = routineSubject?.week_day;
          const teacherSubjectIndex = teacherClasses.findIndex(
            (teacherClass) => teacherClass.subject.id === routineSubject?.subject.id
          );

          newClassGroupRoutineSubjects[routineId][weekDay] = teacherSubjectIndex;
        }
      }
      setClassGroupRoutinesTest(newClassGroupRoutineSubjects);
    }
  }, [routines, teacherClasses]);

  useEffect(() => {
    if (selectedRoutineGroup !== classGroup.routineGroup?.id) {
      setClassGroupRoutinesTest({});
    }
  }, [selectedRoutineGroup]);

  useEffect(() => {
    if (loading) {
      return;
    }

    let totalTime = teacherClasses.map(() => 0);
    console.log('calculate total time');

    let routinesDuration: Record<string, string>;
    if (routines.length) {
      routinesDuration = routines.reduce(
        (total, routine) => ({ ...total, [routine.id]: routine.duration }),
        {} as Record<string, string>
      );
    } else {
      const selectedRoutines =
        routineGroupsData.find((routineGroup) => routineGroup.id === selectedRoutineGroup)?.routines || [];
      routinesDuration = selectedRoutines.reduce(
        (total, routine) => ({ ...total, [routine.id]: routine.duration }),
        {} as Record<string, string>
      );
    }
    Object.entries(classGroupRoutinesTest).forEach(([routineId, teacherSubjectIndexes]) => {
      teacherSubjectIndexes.forEach((teacherSubjectIndex) => {
        const routineDuration = timeToMinutes(routinesDuration[routineId] || '00:00');
        totalTime[teacherSubjectIndex] += routineDuration;
      });
    });
    setTeacherSubjectTotalTime(totalTime.map((i) => String(i)));
  }, [loading, classGroupRoutinesTest, selectedRoutineGroup]);

  const handleCellClick = useCallback(
    ({ routine_id, week_day }: { routine_id: string; week_day: number }) => {
      if (selectedSubjectButton === null) {
        return;
      }

      if (!classGroupRoutinesTest[routine_id]) {
        classGroupRoutinesTest[routine_id] = Array(7);
      }
      if (classGroupRoutinesTest[routine_id][week_day] === selectedSubjectButton) {
        classGroupRoutinesTest[routine_id][week_day] = undefined as any;
      } else {
        classGroupRoutinesTest[routine_id][week_day] = selectedSubjectButton;
      }
      setClassGroupRoutinesTest({ ...classGroupRoutinesTest });
    },
    [selectedSubjectButton]
  );

  const handleClearButtonClick = useCallback(() => {
    setClassGroupRoutinesTest({});
  }, []);

  // console.log(classGroupRoutinesTest);

  const handleSubmit = async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const routine_subjects: IClassGroupRoutine[] = [];

    const routineIds = Object.keys(classGroupRoutinesTest);
    for (const routineId of routineIds) {
      classGroupRoutinesTest[routineId].forEach((teacherSubjectIndex, week_day) => {
        if (teacherSubjectIndex === undefined) {
          return;
        }
        const teacherSubject = teacherClasses[teacherSubjectIndex];
        const classGroupRoutine: IClassGroupRoutine = {
          class_group_id: classGroup.id,
          routine_id: routineId,
          week_day,
          subject_id: teacherSubject?.subject.id,
          teacher_id: teacherSubject.teacher.id,
        };
        routine_subjects.push(classGroupRoutine);
      });
    }

    const response = await createRoutineSubjects({ data: { routine_subjects } });

    if (response?.success) {
      toast.success('Horário de turma salvo com sucesso');
      history.push(routePaths.classGroups.path);
    }
    console.log(response);
  };

  const Cell: ITableCell = ({ data: { week_day, routine_id } }) => {
    const teacherSubjectIndex = classGroupRoutinesTest[routine_id]
      ? classGroupRoutinesTest[routine_id][week_day]
      : undefined;

    const teacherSubject = teacherSubjectIndex !== undefined ? teacherClasses[teacherSubjectIndex] : undefined;

    return (
      <span className={clsx('', teacherSubjectIndex === selectedSubjectButton && classes.selectedCell)}>
        {teacherSubject?.subject.name}
      </span>
    );
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
        <AppSaveButton onClick={handleSubmit} loading={creating} />
        <AppClearButton onClick={handleClearButtonClick}></AppClearButton>
      </AppViewActions>
    </AppView>
  );
};

export default ClassGroupRoutinesView;
