import { IconProps, SvgIcon } from '@mui/material';
// SVG assets
import { ReactComponent as LogoIcon } from './logo.svg';
// Material Icons
import DefaultIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DayNightIcon from '@mui/icons-material/Brightness4';
import NightIcon from '@mui/icons-material/Brightness3';
import DayIcon from '@mui/icons-material/Brightness5';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarToday from '@mui/icons-material/CalendarToday';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SchoolIcon from '@mui/icons-material/School';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS: Record<string, React.ComponentType> = {
  default: DefaultIcon,
  logo: () => (
    <SvgIcon>
      <LogoIcon />
    </SvgIcon>
  ),
  close: CloseIcon,
  menu: MenuIcon,
  settings: SettingsIcon,
  visibilityon: VisibilityIcon,
  visibilityoff: VisibilityOffIcon,
  daynight: DayNightIcon,
  night: NightIcon,
  day: DayIcon,
  search: SearchIcon,
  info: InfoIcon,
  home: HomeIcon,
  account: AccountCircle,
  signup: PersonAddIcon,
  login: PersonIcon,
  person: PersonIcon,
  logout: ExitToAppIcon,
  notifications: NotificationsIcon,
  exams: ListAltIcon,
  group: GroupsIcon,
  teacher: BusinessCenterIcon,
  calendar: CalendarToday,
  clock: WatchLaterIcon,
  school: AccountBalanceIcon,
  delete: DeleteIcon,
  welcome: AutoAwesomeIcon,
  add: AddIcon,
  edit: EditIcon,
  save: SaveIcon,
  done: DoneIcon,
  error: ErrorOutlineIcon,
  class: MenuBookIcon,
  interval: AccessTimeIcon,
  finish: AssignmentTurnedInIcon,
  clear: ClearIcon,
  course: SchoolIcon,
  details: ManageSearchIcon,
};

/**
 * Renders SVG icon by given Icon name
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - name of the Icon to render
 */
interface Props extends IconProps {
  name?: string; // Icon's name
  icon?: string; // Icon's name alternate prop
}
const AppIcon: React.FC<Props> = ({ name, icon, ...restOfProps }) => {
  const iconName = (name || icon || 'default').trim().toLowerCase();
  const ComponentToRender = ICONS[iconName] || DefaultIcon;
  return <ComponentToRender {...restOfProps} />;
};

export default AppIcon;
