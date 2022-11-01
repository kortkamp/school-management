import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { AppIconButton } from '../../../components';
// import { AppAddButton } from '../../../components/AppCustomButton';

interface Props {
  students: { id: string; name: string }[];
}

const StudentsTable = ({
  students,
}: // handleChangeRoutineValue,

Props) => {
  return (
    <Table size="small">
      <colgroup>
        <col width="10%" />
        <col width="20%" />
        <col width="20%" />
        <col width="10%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>dado1</TableCell>
          <TableCell>dado2</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell component="th" scope="row">
              <TextField
                required
                name="type"
                value={student.name}
                // onChange={(event) => handleChangeRoutineValue(routine.id, event)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
              ></TextField>
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>

            <TableCell component="th" scope="row">
              <AppIconButton title="Remover aluno" icon="delete"></AppIconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentsTable;
