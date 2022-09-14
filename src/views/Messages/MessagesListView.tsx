import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useState } from 'react';
import { useApi } from '../../api/useApi';
import { AppButton, AppIconButton, AppLoading } from '../../components';
import { messagesService } from '../../services/messages.service';

const useStyles = makeStyles((theme) => ({
  listSubHeaderRoot: {
    color: theme.palette.text.primary,
    fontWeight: 'bolder',
    fontSize: 20,
    /* To change the font, use the fontFamily rule */
  },
  listItemRoot: {
    padding: '9 30',
    position: 'relative',
    minHeight: theme.spacing(10),
  },

  confirmDeleteRoot: {
    // position: 'absolute',
    // left: 0,
    // up: 0,
    // right: 0,
    // down: 0,
    display: 'flex',
    // justifyContent: 'space-evenly',
  },
  confirmDeleteButton: {
    flex: 1,
    height: '100%',
    flexGrow: 1,
  },
}));
/**
 * Renders "MessagesListView" view
 * url: /mensagens/*
 */
const MessagesListView = () => {
  const [messagesData, , loading, callApi] = useApi(messagesService.getAllByUser, {});

  const [, , isDeleting, removeMessage] = useApi(messagesService.remove, { isRequest: true });

  const [selected, setSelected] = useState<number | undefined>();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string>();

  const classes = useStyles();

  const handleListItemClick = (index: number) => {
    setConfirmDeleteId(undefined);
    if (selected === index) {
      setSelected(undefined);
    } else {
      setSelected(index);
    }
  };

  const handleDeleteMessage = async (event: any, messageId: string) => {
    event.stopPropagation();
    console.log(messageId);
    await removeMessage({ id: messageId });
    callApi({});
  };

  const handleClickCancelDelete = (event: any) => {
    event.stopPropagation();
    setConfirmDeleteId(undefined);
  };

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" className={classes.listSubHeaderRoot}>
          Mensagens
        </ListSubheader>
      }
    >
      {messagesData?.result.length === 0 && <ListItem>Sem mensagens</ListItem>}

      {loading ? (
        <AppLoading />
      ) : (
        messagesData?.result.map((message, index) => (
          <React.Fragment key={message.id}>
            <ListItemButton
              selected={selected === index}
              className={classes.listItemRoot}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemAvatar>
                <Avatar src={message.sender.avatar_url} />
              </ListItemAvatar>

              {confirmDeleteId === message.id ? (
                <div className={classes.confirmDeleteRoot}>
                  <AppButton
                    loading={isDeleting}
                    className={classes.confirmDeleteButton}
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteMessage(event, message.id);
                    }}
                  >
                    Apagar
                  </AppButton>
                  <AppButton className={classes.confirmDeleteButton} onClick={handleClickCancelDelete}>
                    Cancelar
                  </AppButton>
                </div>
              ) : (
                <>
                  <ListItemText primary={message.sender.name} secondary={message.title} />
                  <AppIconButton
                    title="Apagar"
                    // style={index !== selected ? { display: 'none' } : {}}
                    icon="delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      setConfirmDeleteId(message.id);
                    }}
                  />
                </>
              )}
            </ListItemButton>
            {selected === index && (
              <ListItem className={classes.listItemRoot}>
                <ListItemText secondary={message.text} />
              </ListItem>
            )}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default MessagesListView;
