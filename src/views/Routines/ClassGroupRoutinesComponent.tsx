/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../api/useApi';
import WeekRoutines from '../../components/WeekRoutines';
import { routinesService } from '../../services/routines.service';
import { sortByField } from '../../utils/sort';

const ClassGroupRoutinesComponent = () => {
  const { id } = useParams<{ id: string }>();

  const [routines, error, loadingRoutines, , setRoutines] = useApi(routinesService.getRoutineSubjectsByClassGroup, {
    args: { id },
    defaultValue: [],
  });

  useEffect(() => {
    const routineFullWeek = routines.map((routine) => {
      const routineSubjects = routine.routineSubjects;
      for (let i = 0; i < 7; i++) {
        if (!routineSubjects.find((item) => item?.week_day === i)) {
          routineSubjects.push({ week_day: i, subject: { id: '', name: '' }, classGroup: { id: '', name: '' } });
        }
      }
      return { ...routine, routineSubjects: sortByField(routineSubjects, 'week_day') };
    });
    setRoutines(routineFullWeek);
  }, [loadingRoutines]);

  return <WeekRoutines routines={routines} Cell={({ subject }) => <span>{subject}</span>} />;
};

export default ClassGroupRoutinesComponent;
