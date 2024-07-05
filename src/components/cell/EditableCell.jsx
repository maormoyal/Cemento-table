// src/components/EditableCell.js
import { useState, useEffect } from 'react';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (id === 'avatar') {
    return (
      <img
        src={value}
        alt='avatar'
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      />
    );
  }

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

export default EditableCell;
