/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IClassGroupRoutine, IRoutineData, routinesService, IRoutineSubject } from '../../services/routines.service';
import { AppLoading } from '../AppLoading';
import { makeStyles } from '@mui/styles';

export interface ITableCell
  extends React.FC<{ subject: string | undefined; classGroup: string | undefined; data: IRoutineSubject }> {}

interface TableRoutines extends Omit<IClassGroupRoutine, 'routineSubjects'> {
  routineSubjects?: any[];
}

interface Props {
  type?: string;
  userId?: string;
  Cell: ITableCell;
  routines: TableRoutines[];
  onClickCell?: (props: { routine_id: string; week_day: number }) => void;
}

const useStyles = makeStyles({
  table: {
    minWidth: 350,
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  cell: {
    '&:hover': {
      backgroundColor: '#ddd',
    },
    transition: 'all 0.2s',
    padding: 0,
  },
});

/**
 * Application WeekRoutines Tables
 * @param {ITableCell} [Cell] - Component to be rendered inside each cell
 */
const WeekRoutines: React.FC<Props> = ({ Cell, userId, type, routines, onClickCell = () => {} }) => {
  const weekDays = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  // const [routines, setRoutines] = useState<IClassGroupRoutine[]>([]);

  // const loadData = useCallback(async () => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     let routinesData: IClassGroupRoutine[] = [];

  //     routinesData = await routinesService.getRoutinesByUser(userId);

  //     if (!mounted.current) {
  //       return;
  //     }

  //     routinesData.forEach((routine) => {
  //       const fullWeekRoutineSubjects: IRoutineData[] = [];

  //       for (let i = 0; i <= 6; i += 1) {
  //         let routineSubject = routine.routineSubjects.find((item) => item.week_day === i);
  //         if (!routineSubject) {
  //           routineSubject = {
  //             week_day: i,
  //             subject: { id: '', name: '' },
  //             classGroup: { id: '', name: '' },
  //           };
  //         }
  //         fullWeekRoutineSubjects.push(routineSubject);
  //       }
  //       routine.routineSubjects = fullWeekRoutineSubjects;
  //     });

  //     setRoutines(routinesData);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, [userId, type]);

  // useEffect(() => {
  //   mounted.current = true;
  //   loadData();
  //   return () => {
  //     mounted.current = false;
  //   };
  // }, [loadData]);

  const showWeekDays = weekDays;

  return (
    <TableContainer component={Paper} sx={{ minWidth: 350, minHeight: 100 }}>
      {loading ? (
        <AppLoading />
      ) : (
        <Table className={classes.table} size="small">
          <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Hora</TableCell>
              {showWeekDays.map((weekDay) => (
                <TableCell key={weekDay} align="center">
                  {weekDay}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {routines.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.start_at.slice(0, 5)}
                </TableCell>
                {showWeekDays.map((weekDay, index) => (
                  <TableCell
                    key={weekDay}
                    component="th"
                    scope="row"
                    align="center"
                    className={classes.cell}
                    onClick={() => onClickCell({ routine_id: row.id, week_day: index })}
                  >
                    <Cell
                      subject={row.routineSubjects ? row.routineSubjects[index]?.subject?.name : ''}
                      classGroup={row.routineSubjects ? row.routineSubjects[index]?.classGroup?.name : ''}
                      data={{
                        class_group_id: '', //type === 'student' ? userId : row.routineSubjects[index + 1].classGroup.id,
                        routine_id: row.id,
                        subject_id: row.routineSubjects ? row.routineSubjects[index]?.subject.id : '',
                        week_day: index,
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
