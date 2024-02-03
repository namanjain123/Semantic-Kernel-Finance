import React, { useEffect, useState } from 'react';
import "./tableMaker.css"
export default function TableMaker({data_table}) {
    const jsonData=JSON.parse(data_table);
    const [headers, setHeaders] = useState([]);
    const [dataRows, setDataRows] = useState([]);
    useEffect(() => {
        if (jsonData.length === 0) {
            setHeaders([]);
            setDataRows([]);
            return;
        }
        // Extract column headers dynamically from the first object in jsonData
        const extractedHeaders = Object.keys(jsonData[0]);
        setHeaders(extractedHeaders);
        setDataRows(jsonData);
    }, [data_table]);

    return (
        <div className="table-container">
            {headers.length === 0 ? (
                <></>
            ) : (
                <table className="custom-table">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((dataRow, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex}>{dataRow[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
  )
}
