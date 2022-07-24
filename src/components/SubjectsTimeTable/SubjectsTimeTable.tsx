import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AppLoading } from '../AppLoading';

interface ISubjectsTotalTime {
  id: string;
  name: string;
  time: number;
}

interface Props {
  data: ISubjectsTotalTime[];
  loading?: boolean;
}

/**
 * Application WeekRoutines Tables
 * @param {ISubjectsTotalTime[]} [data] - Data to generate the table
 * @param {boolean} [loading] - The data is still loading
 */
const SubjectsTimeTable: React.FC<Props> = ({ data, loading = false }) => {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 350, minHeight: 100 }}>
      {loading ? (
        <AppLoading />
      ) : (
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>Por Semana</TableCell>
              <TableCell>Por Ano Letivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.time}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.time * 40}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default SubjectsTimeTable;
