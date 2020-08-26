import React from "react";
import { useTable, useSortBy } from "react-table";

const TableWithSubTables = () => {
  const data = React.useMemo(
    () => [
      {
        "mv-name": "MV NAME",
        "mv-code": "MV CODE",
        "m-code": "M CODE",
        "m-name": "M NAME",
        document: "DOCUMENT",
        number: "CC43",
        price: 1,
        sum: 200,
        "card-number": "DD213",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Material Values",
        columns: [
          {
            Header: "Name",
            accessor: "mv-name",
          },
          {
            Header: "Code",
            accessor: "mv-code",
          },
        ],
      },
      {
        Header: "Measure",
        columns: [
          {
            Header: "Code",
            accessor: "m-code",
          },
          {
            Header: "Name",
            accessor: "m-name",
          },
        ],
      },
      {
        Header: "Quantity",
        columns: [
          {
            Header: "Document",
            accessor: "document",
          },
          {
            Header: "Number",
            accessor: "number",
          },
        ],
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Sum",
        accessor: "sum",
      },
      {
        Header: "Card Number",
        accessor: "card-number",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  padding: "10px",
                  border: "solid 1px gray",
                  // background: 'papayawhip',
                }}
              >
                {column.render("Header")}
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
                      // background: 'papayawhip',
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
      {/*<tfoot>*/}
      {/*  {footerGroups.map((group) => (*/}
      {/*    <tr {...group.getFooterGroupProps()}>*/}
      {/*      {group.headers.map((column) => {*/}
      {/*        console.log("column", column);*/}
      {/*        return (*/}
      {/*          <td {...column.getFooterProps()}>{column.render("Footer")}</td>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </tr>*/}
      {/*  ))}*/}
      {/*</tfoot>*/}
    </table>
  );
};

export default TableWithSubTables;
