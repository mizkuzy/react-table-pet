import React from 'react';
import './App.css';
import BasicTable from "./BasicTable";
import SortedTable from "./SortedTable";
import FilterTable from "./FilterTable";
import TableWithSubTables from "./TableWithSubTables";
import TableWithSubTablesAndFooters from "./TableWithSubTablesAndFooters";

function App() {
    return (
        <div className="App">
            {/*<BasicTable/>*/}
            {/*<p>With Sorting Table</p>*/}
            {/*<SortedTable/>*/}

            {/*<p>With Filter Table (NOT READY)</p>*/}
            <FilterTable/>
            {/*<TableWithSubTablesAndFooters/>*/}
        </div>
    )
}

export default App;
