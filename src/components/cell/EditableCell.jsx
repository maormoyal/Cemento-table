// src/components/EditableCell.js
import { useState, useEffect, useCallback } from 'react';
import styles from './EditableCell.module.scss';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, type, options = [] }, // Add options default to empty array
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);
  const [IsEditMode, setIsEdiMode] = useState(false);

  const onChange = (e) => {
    const newValue = type === 'boolean' ? e.target.checked : e.target.value;
    setValue(newValue);
  };

  const onBlur = useCallback(() => {
    updateMyData(index, id, value);
    setIsEdiMode(false);
  }, [updateMyData, index, id, value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (type === 'boolean') onBlur();
  }, [value, onBlur, type]);

  switch (type) {
    case 'image':
      return (
        <img
          src={value}
          alt='avatar'
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      );

    case 'selection':
      return (
        <>
          <select
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setIsEdiMode(true)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {IsEditMode && <span className={styles.saveBtn}>Save</span>}
        </>
      );

    case 'boolean':
      return (
        <input
          type='checkbox'
          checked={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );

    case 'number':
      return (
        <>
          <input
            type='number'
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setIsEdiMode(true)}
          />
          {IsEditMode && <span className={styles.saveBtn}>Save</span>}
        </>
      );

    default: {
      let disabled = false;
      if (id === '_id') disabled = true;
      return (
        <>
          <input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setIsEdiMode(true)}
            disabled={disabled}
          />
          {IsEditMode && <span className={styles.saveBtn}>Save</span>}
        </>
      );
    }
  }
};

export default EditableCell;
