import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppIconButton } from '../../../components';
interface Props {
  value: string;
  onSave?: (newValue: string) => void;
  onChange?: (newValue: string) => void;
  validate?: (name: string) => string;
  givenError?: string;
}
const NameEditor = ({ value, onSave = () => {}, onChange = () => {}, validate, givenError = '' }: Props) => {
  const [isEditingName, setIsEditingName] = useState(true);
  const [editingName, setEditingName] = useState('');

  const [error, setError] = useState(givenError);

  useEffect(() => {
    setEditingName(value);
    setIsEditingName(false);
  }, [value]);

  useEffect(() => {
    setError(givenError);
  }, [givenError]);

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

  const handleOnChange = (event: any) => {
    const newValue = event.target.value;
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
    setEditingName(newValue);
    onChange(newValue);
  };

  return (
    <TextField
      required
      name="period-group-name"
      value={editingName}
      onChange={handleOnChange}
      onDoubleClick={() => setIsEditingName(true)}
      onKeyPress={onKeyPress}
      onBlur={() => toggleIsEditing()}
      placeholder="Nome do Turno"
      variant="standard"
      error={error !== ''}
      helperText={error}
      style={{ width: 400 }}
      autoFocus={value ? false : true}
      InputProps={{
        disableUnderline: !isEditingName && error === '',
        style: { fontSize: 30 },
        endAdornment: (
          <InputAdornment position="start">
            <AppIconButton
              icon={isEditingName ? 'done' : 'edit'}
              title={isEditingName ? 'Salvar o Nome' : 'Editar o Nome'}
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
