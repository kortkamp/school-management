import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { MenuItem, TextField } from '@mui/material';
import { useAppStore } from '../../store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // minHeight: 'fit-content',
  },

  school: {
    marginTop: theme.spacing(1),
  },
}));

// interface Props {
//   currentSchool: IAuthSchool;
//   schools: IAuthSchool[];
// }

/**
 * Renders User info with Avatar
 * @param {string} [className] - optional className for <div> tag
 * @param {boolean} [showAvatar] - user's avatar picture is shown when true
 * @param {object} [user] - logged user data {name, email, avatar...}
 * @param {object} [school] - logged user school data {name, role...}
 */
const SchoolRoleSelector = () => {
  const classes = useStyles();

  const [state, dispatch] = useAppStore();

  const schools = state.currentUser?.schools || [];

  // const role = state.currentSchool?.role;

  // const currentSchoolId = state.currentSchool?.id;

  const currentSchoolRole = `${state.currentSchool?.name}${state.currentSchool?.role}`;

  const handleSelectSchoolRole = (event: any) => {
    const selectedSchool = state.currentUser?.schools.find(
      (school) => school.name + school.role === event.target.value
    );
    dispatch({ type: 'SELECT_SCHOOL', payload: selectedSchool });

    // if (selectedSchool && state.currentSchool) {
    //   if (selectedSchool.id !== state.currentSchool.id || selectedSchool?.role !== state.currentSchool.role) {
    //     dispatch({ type: 'SELECT_SCHOOL', payload: selectedSchool });
    //   }
    // }
  };

  return (
    <div className={clsx(classes.root)}>
      <TextField
        required
        name="schoolRole"
        select
        value={currentSchoolRole}
        onChange={handleSelectSchoolRole}
        size="small"
        variant="standard"
        style={{ padding: 0, lineHeight: 0, border: 0, margin: 0 }}
        InputProps={{ disableUnderline: true }}
        fullWidth
      >
        {schools.map((school) => (
          <MenuItem key={school.id + school.role} value={school.name + school.role}>
            {school.name + ' - ' + school.role_name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default SchoolRoleSelector;
