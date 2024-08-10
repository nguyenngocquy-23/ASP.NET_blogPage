import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useEffectOnce from "../useEffectOne";

function ManagerCategory() {
    const Columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        }
    ]
    const [data , setData] = useState([])
    async function fetch() {
        try {
            const response = await axios.post(`https://localhost:7125/Category/getCategories`)
            setData(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=> {
        fetch();
    })
    const handleSearch = (event) => {
        const newData = data.filter(row => {
            return row.name.toLowerCase().includes(event.target.value.toLowerCase());
        })
        setData(newData)
    }
    return (
        <div style={{margin:" 20px"}}>
            <div><input type={"text"} onChange={handleSearch} placeholder={"Tìm kiếm..."}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}/></div>
            <DataTable
                search
                columns={Columns} data={data} fixedHeader={true} pagination={true}>
            </DataTable>
        </div>
    );
}

export default ManagerCategory;