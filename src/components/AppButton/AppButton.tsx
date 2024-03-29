import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import { buttonStylesByNames, ColorName } from '../../utils/style';
import { CircularProgress } from '@mui/material';

/**
 * Note: You can change these const to control default appearance of the AppButton component
 */
const APP_BUTTON_VARIANT = 'contained'; // | 'text' | 'outlined'
const APP_BUTTON_MARGIN = 1;

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    display: 'inline-block',
    position: 'relative',
  },
  // Add "filled" styles for Material UI names 'primary', 'secondary', 'warning', and so on
  ...buttonStylesByNames(theme),
}));

interface Props extends Omit<ButtonProps, 'color'> {
  color?: ColorName | 'inherit';
  label?: string; // Alternate to text
  text?: string; // Alternate to label
  m?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  // Missing props
  component?: React.ElementType; // Could be RouterLink, AppLink, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
  loading?: boolean;
  underline?: 'none' | 'hover' | 'always'; // Link prop
}

/**
 * Application styled Material UI Button with Box around to specify margins using props
 * @class AppButton
 * @param {string} [color] - name of color from Material UI palette 'primary', 'secondary', 'warning', and so on
 * @param {string} [children] - content to render, overrides .label and .text
 * @param {string} [label] - text to render, alternate to .text
 * @param {string} [text] - text to render, alternate to .label
 */
const AppButton: React.FC<Props> = ({
  children,
  className,
  color = 'default',
  label,
  m = 0,
  mt = APP_BUTTON_MARGIN,
  mb = APP_BUTTON_MARGIN,
  ml = APP_BUTTON_MARGIN,
  mr = APP_BUTTON_MARGIN,
  text,
  loading,
  underline = 'none',
  variant = APP_BUTTON_VARIANT,
  ...restOfProps
}) => {
  const classes = useStyles();
  const classButton = clsx(classes[color as ColorName], className);
  return (
    <Box {...{ m, mt, mb, ml, mr }} className={classes.box}>
      <Button className={classButton} variant={variant} {...{ ...restOfProps, underline }}>
        <span style={loading ? { color: 'transparent' } : {}}>{children || label || text}</span>
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: 'primary',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};

export default AppButton;
