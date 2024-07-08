import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useSortBy,
  useExpanded,
  useRowSelect,
} from 'react-table';
import styles from './Table.module.scss';
import groupIcon from '../../assets/table.png';

import EditableCell from '../cell/EditableCell';
import ColumnToggleDropdown from '../columnToggleDropdown/ColumnToggleDropdown';
import { generateColumns, generateData } from '../../utils/generateData';
import useControlledState from '../../utils/useControlledState';
import aggregationsValues from '../../utils/aggregationsValues';

const Table = () => {
  const columns = useMemo(
    () =>
      generateColumns().map((col) => ({
        Header: col.title,
        accessor: col.id,
        width: col.width || 100,
        canGroupBy: true,
        Cell: (cellProps) => (
          <EditableCell
            value={cellProps.value}
            row={cellProps.row}
            column={{ ...cellProps.column, options: col.options || [] }}
            updateMyData={updateMyData}
          />
        ),
        type: col.type,
        ...aggregationsValues(col.type, col.id),
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

  const updateMyData = useCallback((rowIndex, columnId, value) => {
    setData((oldData) => {
      const newData = [...oldData];
      newData[rowIndex][columnId] = value;
      return newData;
    });
  }, []);

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
      defaultColumn: { Cell: EditableCell },
      updateMyData,
      initialState: {
        hiddenColumns: columns
          .filter((col) => !columnVisibility[col.accessor])
          .map((col) => col.accessor),
      },
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    useRowSelect,
    (hooks) => {
      hooks.useControlledState.push(useControlledState);
      hooks.visibleColumns.push((columns, { instance }) => {
        if (!instance.state.groupBy.length) {
          return columns;
        }

        return [
          {
            id: 'expander',
            Header: ({ allColumns, state: { groupBy } }) => {
              return groupBy.map((columnId) => {
                const column = allColumns.find((d) => d.id === columnId);
                const headerProps = column.getHeaderProps();
                return (
                  <span key={columnId} {...headerProps}>
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()} title='Remove'>
                        {column.isGrouped ? (
                          '🛑 '
                        ) : (
                          <img src={groupIcon} alt='group icon' />
                        )}
                      </span>
                    ) : null}
                    {column.render('Header')}{' '}
                  </span>
                );
              });
            },
            Cell: ({ row }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find((d) => d.isGrouped);

                return (
                  <span
                    key={row.id}
                    {...row.getToggleRowExpandedProps({
                      style: {
                        paddingLeft: `${row.depth * 2}rem`,
                      },
                    })}
                    className={styles.groupedCell}
                  >
                    {row.isExpanded ? '⬇️' : '➡️'}
                    {groupedCell.column.type === 'boolean'
                      ? groupedCell.value
                        ? 'Active'
                        : 'Inactive'
                      : groupedCell.value}{' '}
                    ({row.subRows.length})
                  </span>
                );
              }

              return null;
            },
          },
          ...columns,
        ];
      });
    }
  );

  const handleColumnVisibilityChange = useCallback(
    (accessor, newVisibility = !columnVisibility[accessor]) => {
      setColumnVisibility((prev) => ({
        ...prev,
        [accessor]: newVisibility,
      }));
      toggleHideColumn(accessor, !newVisibility);
    },
    [columnVisibility, toggleHideColumn]
  );

  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);

  return (
    <>
      <div className={styles.pageHeader}>
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
              const { key: headerGroupKey, ...headerGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <tr key={headerGroupKey} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: headerKey, ...headerProps } =
                      column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th key={headerKey} {...headerProps}>
                        {column.canGroupBy ? (
                          <span {...column.getGroupByToggleProps()}>
                            {column.isGrouped ? (
                              '🛑 '
                            ) : (
                              <img src={groupIcon} alt='group icon' />
                            )}
                          </span>
                        ) : null}
                        {column.render('Header')}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
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
                const { key: rowKey, ...rowProps } = row.getRowProps();
                return (
                  <tr key={rowKey} {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();
                      return (
                        <td
                          key={cellKey}
                          {...cellProps}
                          className={
                            cell.isGrouped
                              ? styles.groupedCell
                              : cell.isAggregated
                              ? styles.aggregatedCell
                              : ''
                          }
                        >
                          {cell.isGrouped ? (
                            <>
                              <span {...row.getToggleRowExpandedProps()}>
                                {row.isExpanded ? '⬇️' : '➡️'}{' '}
                                {cell.render('Cell')} ({row.subRows.length})
                              </span>
                            </>
                          ) : cell.isAggregated ? (
                            cell.render('Aggregated')
                          ) : cell.isPlaceholder ? null : (
                            cell.render('Cell')
                          )}
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
