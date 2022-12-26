import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Controller } from 'react-hook-form';
import { AppLoading } from '../../../components';
import FormCheckBoxInput from '../../../components/HookFormInput/FormCheckBoxInput';

const useStyles = makeStyles(() => ({
  attendance_list: {
    // margin: theme.spacing(1),
    // padding: theme.spacing(1),
    // border: '1px solid',
    // borderColor: theme.palette.grey[400],
    // borderRadius: theme.shape.borderRadius,
  },
}));

interface Props {
  attendances: {
    student_id: string;
    name: string;
    presence: boolean;
  }[];
  control: any; //Control<FormValues, any>;
  editable?: boolean;
  loading?: boolean;
  errors?: any;
}

const AttendanceTable = ({ attendances, control, editable = false, loading = false }: Props) => {
  const classes = useStyles();

  if (loading) {
    return <AppLoading />;
  }
  return (
    <TableContainer component={Paper} sx={{ minWidth: 350 }}>
      <Table size="small" className={classes.attendance_list}>
        <colgroup>
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Aluno</TableCell>
            <TableCell>Presente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendances.map((grade, index) => (
            <TableRow key={grade.student_id}>
              <TableCell component="th" scope="row">
                <Controller
                  name={`attendances.${index}.name`}
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
                <FormCheckBoxInput control={control} name={`attendances.${index}.presence`} editable={editable} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
