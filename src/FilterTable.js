import React from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// by default filtering is case INSENSITIVE
const FilterTable = () => {
  const data = React.useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
        col3: 1,
        col5: 10,
        col6: "PERFECT",
      },
      {
        col1: "react-table",
        col2: "rocks",
        col3: 2,
        col4: 15,
        col5: 15,
        col6: "ROCKET",
      },
      {
        col1: "whatever",
        col2: "you want",
        col3: 12,
        col4: 20,
        col5: 20,
        col6: "YES",
      },
      {
        col1: "react",
        col2: "rocks",
        col3: 4,
        col4: 11,
        col5: 17,
        col6: "ROCKET",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
      {
        Header: "Age (filter EQUALS)",
        accessor: "col3",
        Filter: SliderColumnFilter,
        filter: "equals",
      },
      {
        Header: "Profile Progress (custom filter BETWEEN)",
        accessor: "col4",
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
      },
      {
        Header: "Visits (RANGE)",
        accessor: "col5",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Status",
        accessor: "col6",
        Filter: SelectColumnFilter,
        filter: "starts",
      },
    ],
    []
  );

  // This is a custom filter UI for selecting
  // a unique option from a list
  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  // This is a custom UI for our 'between' or number range
  // filter. It uses two number boxes and filters rows to
  // ones that have values between the two
  function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      preFilteredRows.forEach((row) => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      });
      return [min, max];
    }, [id, preFilteredRows]);

    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          value={filterValue[0] || ""}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: "70px",
            marginRight: "0.5rem",
          }}
        />
        to
        <input
          value={filterValue[1] || ""}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: "70px",
            marginLeft: "0.5rem",
          }}
        />
      </div>
    );
  }

  // This is a custom filter UI that uses a
  // slider to set the filter value between a column's
  // min and max values
  function SliderColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the min and max
    // using the preFilteredRows
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      preFilteredRows.forEach((row) => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      });
      return [min, max];
    }, [id, preFilteredRows]);

    return (
      <>
        <input
          type="range"
          min={min}
          max={max}
          value={filterValue || min}
          onChange={(e) => {
            setFilter(parseInt(e.target.value, 10));
          }}
        />
        <button onClick={() => setFilter(undefined)}>Reset</button>
      </>
    );
  }

  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Allows overriding or adding additional filter types for columns to use.
  // If a column's filter type isn't found on this object, it will default to using the built-in filter types.
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { columns, data, defaultColumn, filterTypes },
    useFilters,
    useGlobalFilter
  );

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FilterTable;
