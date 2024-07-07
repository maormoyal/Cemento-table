// src/components/EditableCell.js
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './EditableCell.module.scss';
import Modal from '../modal/Modal'; // Import the Modal component

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, type, options = [] },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);
  const [IsEditMode, setIsEdiMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const inputRef = useRef(null);

  const onChange = (e) => {
    const newValue = type === 'boolean' ? e.target.checked : e.target.value;
    setValue(newValue);
  };

  const onBlur = useCallback(() => {
    updateMyData(index, id, value);
    setIsEdiMode(false);
  }, [updateMyData, index, id, value]);

  const onSave = () => {
    updateMyData(index, id, value);
    setIsEdiMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSave();
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (type === 'boolean' || type === 'selection') onBlur();
  }, [value, onBlur, type]);

  switch (type) {
    case 'image':
      return (
        <>
          <img
            src={value}
            alt='avatar'
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            onClick={() => setShowModal(true)} // Show modal on click
          />
          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <img
              src={value}
              alt='avatar'
              style={{ width: '300px', height: '300px' }}
            />
          </Modal>
        </>
      );

    case 'selection':
      return (
        <>
          <select
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
            ref={inputRef}
            type='number'
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setIsEdiMode(true)}
            onKeyDown={handleKeyDown}
          />
          {IsEditMode && (
            <span className={styles.saveBtn} onClick={onSave}>
              ✓save
            </span>
          )}
        </>
      );

    default: {
      let disabled = false;
      if (id === '_id') disabled = true;
      return (
        <>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => setIsEdiMode(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          {IsEditMode && (
            <span className={styles.saveBtn} onClick={onSave}>
              ✓save
            </span>
          )}
        </>
      );
    }
  }
};

export default EditableCell;
