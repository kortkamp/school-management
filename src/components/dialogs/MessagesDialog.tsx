import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogProps, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import MessagesListView from '../../views/Messages/MessagesListView';

export const dialogStyles = (theme: Theme): { paper: any; content: any; actions: any } => ({
  paper: {
    // [theme.breakpoints.up('md')]: {
    //   minWidth: theme.breakpoints.values.sm / 2,
    // },
    [theme.breakpoints.down('sm')]: {
      // minWidth: theme.breakpoints.values.sm / 2,
      // left: 0,
      // margin: theme.spacing(3),
      width: 'unset',
      left: 0,
    },
    width: theme.breakpoints.values.sm / 2,
    position: 'absolute',
    right: 0,
    margin: theme.spacing(3),
    top: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
  },

  content: {
    padding: 0,
  },
  actions: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
});
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    ...dialogStyles(theme),
  })
);

/**
 * Shows generic "Common" dialog
 * @param {function} props.onConfirm - event for Confirm button, called as onConfirm(data)
 * @param {function} props.onClose - event for Close and Cancel buttons and the backdrop
 */
interface Props extends DialogProps {
  data?: unknown;
  title?: string;

  body?: ReactNode;

  onClose?: (event: {}) => void;
}
const MessagesDialog: React.FC<Props> = ({
  open = false, // Don't show dialog by default
  onClose,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.root}
      classes={{ paper: classes.paper }}
      open={open}
      onClose={onClose}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      aria-labelledby="form-dialog-title"
      {...props}
    >
      <DialogContent className={classes.content}>
        <MessagesListView />
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
