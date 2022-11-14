import { useState, useCallback, useRef, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AppLoading } from '../AppLoading';
import { IExam } from '../../services/exams.service';
import Moment from 'moment';

interface Props {}

/**
 * Application OpenExams Table
 */
const OpenExams: React.FC<Props> = () => {
  const mounted = useRef(false);

  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<IExam[]>([]);

  const loadData = useCallback(async () => {
    const fetchData = async () => {
      setLoading(true);

      // let filter = {
      //   by: 'status',
      //   value: 'open',
      //   type: 'eq',
      // };

      let examResponse: IExam[] = [];
      try {
        // const response = await examsService.getAll(1000, 1, filter.by, filter.value, filter.type);
        examResponse = [];
      } catch (err: any) {
        console.log(err);
      }

      if (!mounted.current) {
        return;
      }

      setExams(examResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadData();
    return () => {
      mounted.current = false;
    };
  }, [loadData]);

  return (
    <TableContainer component={Paper} sx={{ minWidth: 350, minHeight: 100 }}>
      {loading ? (
        <AppLoading />
      ) : (
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Matéria</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {exam.type.toUpperCase()}
                </TableCell>
                <TableCell component="th" scope="row">
                  {exam.class_group.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {exam.subject.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {Moment(exam.date).utcOffset('+0300').format('DD-MM-YYYY')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default OpenExams;
