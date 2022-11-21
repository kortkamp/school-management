import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ITeacherClassSubject } from '../../../services/teachers.service';
import clsx from 'clsx';
import { minutesToHours } from 'date-fns';

const SCHOOL_YEAR_WEEKS = 40;

const useStyles = makeStyles({
  row: {
    '&:hover': {
      backgroundColor: '#eee',
    },
    transition: 'all 0.2s',
    padding: 0,
  },

  selectedRow: {
    '& th': {
      fontWeight: 'bold',
      backgroundColor: '#ddd',
      transition: 'all 0.2s',
    },
  },
});

interface Props {
  teacherSubjects: ITeacherClassSubject[];
  teacherSubjectTotalTime: string[];
  selectedIndex: number | null;
  selectTeacherSubject: (index: number) => void;
}

const TeacherSubjectsTable = ({
  teacherSubjects,
  teacherSubjectTotalTime,
  selectedIndex,
  selectTeacherSubject,
}: Props) => {
  const classes = useStyles();

  const totalTime = teacherSubjectTotalTime.reduce((partialSum, a) => partialSum + Number(a), 0);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
        <colgroup>
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Disciplina</TableCell>
            <TableCell>Professor</TableCell>
            <TableCell>Total semanal(minutos)</TableCell>
            <TableCell>Previsão anual(horas)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teacherSubjects.map((teacherSubject, index) => (
            <TableRow
              key={index}
              style={{ cursor: 'pointer' }}
              className={clsx(classes.row, index === selectedIndex && classes.selectedRow)}
            >
              <TableCell component="th" scope="row" onClick={() => selectTeacherSubject(index)}>
                {teacherSubject.subject.name}
              </TableCell>
              <TableCell component="th" scope="row" onClick={() => selectTeacherSubject(index)}>
                {teacherSubject.teacher.person.name}
              </TableCell>
              <TableCell component="th" scope="row" onClick={() => selectTeacherSubject(index)}>
                {teacherSubjectTotalTime[index]}
              </TableCell>
              <TableCell component="th" scope="row">
                {minutesToHours(Number(teacherSubjectTotalTime[index] || 0) * SCHOOL_YEAR_WEEKS)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row">
              {totalTime}
            </TableCell>
            <TableCell component="th" scope="row">
              {minutesToHours(totalTime * SCHOOL_YEAR_WEEKS)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeacherSubjectsTable;
