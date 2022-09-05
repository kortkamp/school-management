import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { useAppStore } from '../../store';

interface Props {
  schools?: {
    role: string;
    role_name: string;
    id: string;
    name: string;
  }[];
}

const SelectSchoolView = ({ schools = [] }: Props) => {
  const [, dispatch] = useAppStore();

  const handleSelectSchool = (school: any) => {
    dispatch({ type: 'SELECT_SCHOOL', payload: school });
  };

  return (
    <Box display={'flex'} flexDirection="column" justifyContent="center" alignItems={'center'} marginTop={10}>
      <Typography variant="h5">Selecione uma Escola</Typography>
      <List>
        {schools.map((school) => (
          <ListItemButton key={school.id + school.role} onClick={() => handleSelectSchool(school)}>
            <ListItemIcon>
              <DoneIcon color="success" />
            </ListItemIcon>
            <ListItemText primary={school.name} secondary={school.role_name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default SelectSchoolView;
