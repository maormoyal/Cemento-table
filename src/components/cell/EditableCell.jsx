// src/components/EditableCell.js
import { useState, useEffect, useRef } from 'react';
import styles from './EditableCell.module.scss';
import Modal from '../modal/Modal';

const EditableCell = ({
  value: initialValue,
  row: { index, original },
  column: { id, type, options = [] },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef(null);

  const onChange = (e) => {
    const newValue = type === 'boolean' ? e.target.checked : e.target.value;
    setValue(newValue);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  const onSave = () => {
    updateMyData(index, id, value);
    setIsEditMode(false);
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
            onClick={() => setShowModal(true)}
          />
          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <img
              src={value}
              alt='avatar'
              style={{ width: '300px', height: '300px' }}
            />
            <div className={styles.rowContent}>
              {Object.keys(original).map((key) => (
                <span key={key}>
                  <strong>{key}:</strong> {original[key]}
                </span>
              ))}
            </div>
          </Modal>
        </>
      );

    case 'selection':
      return (
        <select
          ref={inputRef}
          value={value || undefined}
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
        <input
          ref={inputRef}
          type='number'
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => setIsEditMode(true)}
          onKeyDown={handleKeyDown}
        />
      );

    default: {
      let disabled = false;
      if (id === '_id') disabled = true;
      return (
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => setIsEditMode(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      );
    }
  }
};

export default EditableCell;
