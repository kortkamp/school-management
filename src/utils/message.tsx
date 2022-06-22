import { AlertColor } from '@mui/material';
import { useCallback, useState } from 'react';
import { AppAlert } from '../components';

export interface IMessage {
  type: AlertColor;
  text: string;
}

export const useAppMessage = () => {
  const [message, setMessage] = useState<IMessage>();
  const handleCloseMessage = useCallback(() => setMessage(undefined), []);

  const AppMessage = () => (
    <div>
      {message && (
        <AppAlert severity={message.type} onClose={handleCloseMessage}>
          {message.text || message.type.toUpperCase()}
        </AppAlert>
      )}
    </div>
  );
  return [AppMessage, setMessage] as const;
};
