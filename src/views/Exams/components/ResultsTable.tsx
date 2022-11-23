import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Control, Controller } from 'react-hook-form';
import { FormValues } from '../CreateExamView';

const useStyles = makeStyles((theme: Theme) => ({
  grades_list: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    // border: '1px solid',
    // borderColor: theme.palette.grey[400],
    // borderRadius: theme.shape.borderRadius,
  },
  class_groups: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  class_group_item: {
    width: 100,
  },
}));

interface Props {
  results: {
    student_id: string;
    name: string;
    achievement: string;
  }[];
  control: Control<FormValues, any>;
  editable?: boolean;
  errors?: any;
  examValue: number;
}

const ResultsTable = ({ results, control, editable = false, errors, examValue }: Props) => {
  const classes = useStyles();

  const isValid = (index: number, field: string) => {
    return !(errors && errors[index] && errors[index][field]);
  };

  const getError = (index: number, field: string) => {
    if (!isValid(index, field)) {
      return errors[index][field].message as string;
    }
    return '';
  };

  return (
    <Table size="small" className={classes.grades_list}>
      <colgroup>
        <col width="20%" />
        <col width="20%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Aluno</TableCell>
          <TableCell>Nota</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((grade, index) => (
          <TableRow key={grade.student_id}>
            <TableCell component="th" scope="row">
              <Controller
                name={`results.${index}.name`}
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    variant="standard"
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <Controller
                name={`results.${index}.achievement`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Nota"
                    type="number"
                    value={Number(value) * examValue}
                    onChange={({ target }) => onChange({ target: { value: Number(target.value) / examValue } })}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                    error={!isValid(index, 'achievement')}
                    helperText={getError(index, 'achievement')}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;
