import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Control, Controller } from 'react-hook-form';
import { FormValues } from '../CourseView';

const useStyles = makeStyles((theme: Theme) => ({
  grades_list: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    // border: '1px solid',
    // borderColor: theme.palette.grey[400],
    // borderRadius: theme.shape.borderRadius,
  },
}));

interface Props {
  grades: { id: string; name: string; total_hours: number; days: number }[];
  control: Control<FormValues, any>;
  editable?: boolean;
}

const GradesTable = ({ grades, control, editable = false }: Props) => {
  const classes = useStyles();

  return (
    <Table size="medium" className={classes.grades_list}>
      <colgroup>
        <col width="20%" />
        <col width="20%" />
        <col width="20%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Fase</TableCell>
          <TableCell>Carga Horária</TableCell>
          <TableCell>Dias Letivos</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {grades.map((grade, index) => (
          <TableRow key={grade.id}>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.name`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Nome da fase"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.total_hours`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Carga Horária"
                    type="number"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.days`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Dias letivos"
                    type="number"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        ))}

        {grades.length === 0 && (
          <TableRow>
            <TableCell component="th" scope="row">
              {'O curso ainda não possui fases'}
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GradesTable;
