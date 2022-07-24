import { useState, useCallback, useRef, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IClassGroupRoutine, IRoutineData, routinesService, IRoutineSubject } from '../../services/routines.service';
import { AppLoading } from '../AppLoading';

export interface ITableCell extends React.FC<{ subject: string; classGroup: string; data: IRoutineSubject }> {}

interface Props {
  type: string;
  userId: string;
  Cell: ITableCell;
}

/**
 * Application WeekRoutines Tables
 * @param {ITableCell} [Cell] - Component to be rendered inside each cell
 */
const WeekRoutines: React.FC<Props> = ({ Cell, userId, type }) => {
  const weekDays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  const mounted = useRef(false);

  const [loading, setLoading] = useState(true);

  const [routines, setRoutines] = useState<IClassGroupRoutine[]>([]);

  const loadData = useCallback(async () => {
    const fetchData = async () => {
      setLoading(true);
      let routinesData: IClassGroupRoutine[] = [];

      routinesData = await routinesService.getRoutinesByUser(userId);

      if (!mounted.current) {
        return;
      }

      routinesData.forEach((routine) => {
        const fullWeekRoutineSubjects: IRoutineData[] = [];

        for (let i = 0; i <= 6; i += 1) {
          let routineSubject = routine.routineSubjects.find((item) => item.week_day === i);
          if (!routineSubject) {
            routineSubject = {
              week_day: i,
              subject: { id: '', name: '' },
              classGroup: { id: '', name: '' },
            };
          }
          fullWeekRoutineSubjects.push(routineSubject);
        }
        routine.routineSubjects = fullWeekRoutineSubjects;
      });

      setRoutines(routinesData);
      setLoading(false);
    };

    fetchData();
  }, [userId, type]);

  useEffect(() => {
    mounted.current = true;
    loadData();
    return () => {
      mounted.current = false;
    };
  }, [loadData]);

  const showWeekDays = weekDays.slice(1, 6);

  return (
    <TableContainer component={Paper} sx={{ minWidth: 350, minHeight: 100 }}>
      {loading ? (
        <AppLoading />
      ) : (
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Hora (início)</TableCell>
              {showWeekDays.map((weekDay) => (
                <TableCell key={weekDay} align="center">
                  {weekDay}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {routines.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.start_at.slice(0, 5)}
                </TableCell>
                {showWeekDays.map((weekDay, index) => (
                  <TableCell key={weekDay} component="th" scope="row" align="center">
                    <Cell
                      subject={row.routineSubjects[index + 1].subject?.name}
                      classGroup={row.routineSubjects[index + 1].classGroup?.name}
                      data={{
                        class_group_id: type === 'student' ? userId : row.routineSubjects[index + 1].classGroup.id,
                        routine_id: row.id,
                        subject_id: row.routineSubjects[index + 1].subject.id,
                        week_day: index + 1,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default WeekRoutines;
