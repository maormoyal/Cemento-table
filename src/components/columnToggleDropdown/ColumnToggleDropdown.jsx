// src/components/ColumnToggleDropdown.js
import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './ColumnToggleDropdown.module.scss';

const ColumnToggleDropdown = ({
  allColumns,
  columnVisibility,
  handleColumnVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const isAllSelected = useMemo(() => {
    return Object.values(columnVisibility).every((v) => v);
  }, [columnVisibility]);

  const handleToggleAll = () => {
    allColumns.forEach((column) => {
      handleColumnVisibilityChange(column.id, !isAllSelected);
    });
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        Toggle Columns
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          <label className={styles.dropdownItem}>
            <input
              type='checkbox'
              checked={isAllSelected}
              onChange={handleToggleAll}
            />
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </label>
          {allColumns.map((column) => (
            <label key={column.id} className={styles.dropdownItem}>
              <input
                type='checkbox'
                checked={columnVisibility[column.id]}
                onChange={() => handleColumnVisibilityChange(column.id)}
              />
              {column.Header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnToggleDropdown;
