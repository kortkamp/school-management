import clsx from 'clsx';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import AppIcon from '../AppIcon';
import SideBarLink from './SideBarLink';
import { LinkToPage } from '../../utils/type';
import { useState } from 'react';
import { Collapse, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import SideBarNavigation from './SideBarNavigation';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    // color: theme.palette.button,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    // fontWeight: theme.typography.fontWeightMedium,
    flexGrow: 1,
  },
  iconOrMargin: {
    // color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
}));

/**
 * Renders list of Navigation Items inside SideBar
 * @param {string} [prop.className] - optional className for styling
 * @param {array} props.items - list of objects to render as navigation links
 * @param {boolean} [props.showIcons] - icons in links are visible when true
 * @param {func} [props.afterLinkClink] - optional callback called when some link was clicked
 */
interface Props {
  className?: string;
  item: LinkToPage;
  showIcons?: boolean;
  afterLinkClick?: React.MouseEventHandler;
}
const SideBarCollapse: React.FC<Props> = ({ className, item, showIcons = false, afterLinkClick, ...restOfProps }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const classes = useStyles();
  return (
    <>
      <ListItem key={`${item.title}-${item.path}`} className={className} disableGutters>
        <ListItemButton className={classes.button} onClick={handleClick}>
          <div className={classes.iconOrMargin}>{showIcons && item.icon ? <AppIcon icon={item.icon} /> : null}</div>
          {item.title}
        </ListItemButton>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open}>
        {item.subMenus && (
          <SideBarNavigation className={classes.root} items={item.subMenus} afterLinkClick={afterLinkClick} />
        )}
      </Collapse>
    </>
  );
};

export default SideBarCollapse;
