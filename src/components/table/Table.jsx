// src/components/EditableTable.js
import { useState, useEffect, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useRowSelect,
} from 'react-table';
import EditableCell from '../cell/EditableCell';
import ColumnToggleDropdown from '../columnToggleDropdown/ColumnToggleDropdown';
import { generateColumns, generateData } from '../../utils/generateData';
import styles from './Table.module.scss';

const Table = () => {
  const columns = useMemo(
    () =>
      generateColumns().map((col) => ({
        Header: col.title,
        accessor: col.id,
        width: col.width || 100,
        Cell: (cellProps) => (
          <EditableCell
            value={cellProps.value}
            row={cellProps.row}
            column={cellProps.column}
            updateMyData={updateMyData}
          />
        ),
      })),
    []
  );

  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('tableData');
    return savedData ? JSON.parse(savedData) : generateData(20);
  });

  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, column) => {
      acc[column.accessor] = true;
      return acc;
    }, {})
  );

  // Save data to local storage on data change
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);

  const updateMyData = (rowIndex, columnId, value) => {
    setData((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    allColumns,
    toggleHideColumn,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { EditableCell },
      updateMyData,
      initialState: {
        hiddenColumns: columns
          .filter((col) => !columnVisibility[col.accessor])
          .map((col) => col.accessor),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const handleColumnVisibilityChange = (accessor) => {
    const newVisibility = !columnVisibility[accessor];
    setColumnVisibility((prev) => ({
      ...prev,
      [accessor]: newVisibility,
    }));
    toggleHideColumn(accessor, !newVisibility);
  };

  return (
    <>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchBar}>
          <input
            value={state.globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Search...'
          />
        </div>
        <ColumnToggleDropdown
          allColumns={allColumns}
          columnVisibility={columnVisibility}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: columnKey, ...restColumnProps } =
                      column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th
                        key={columnKey}
                        {...restColumnProps}
                        style={{ width: column.width }} // Apply width style here
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row);
                const { key: rowKey, ...restRowProps } = row.getRowProps();
                return (
                  <tr key={rowKey} {...restRowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...restCellProps } =
                        cell.getCellProps();
                      return (
                        <td key={cellKey} {...restCellProps}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
