import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppIconButton } from '../../../components';
interface Props {
  value: string;
  onSave: (newValue: string) => void;
}
const NameEditor = ({ value, onSave }: Props) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    setEditingName(value);
    setIsEditingName(false);
  }, [value]);

  const toggleIsEditing = () => {
    setIsEditingName((prev) => !prev);
    if (isEditingName && editingName !== value) {
      onSave(editingName);
    }
  };
  const onKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      toggleIsEditing();
    }
  };
  return (
    <TextField
      required
      name="name"
      value={editingName}
      onChange={(event) => setEditingName(event.target.value)}
      onDoubleClick={() => setIsEditingName(true)}
      onKeyPress={onKeyPress}
      placeholder="Nome do Período"
      variant="standard"
      InputProps={{
        disableUnderline: !isEditingName,
        style: { fontSize: 30 },
        endAdornment: (
          <InputAdornment position="start">
            <AppIconButton
              aria-label="toggle password visibility"
              icon={isEditingName ? 'done' : 'edit'}
              title={isEditingName ? 'Salvar' : 'Editar'}
              onClick={() => toggleIsEditing()}
            />
          </InputAdornment>
        ),
        readOnly: !isEditingName,
      }}
    />
  );
};

export default NameEditor;
