import React, {useState,useEffect} from 'react';
import axios from "axios";

const Dashboard = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7125/DashBoard/contact')
            .then(response => {
                setSalesData(response.data);
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    }, []);

    return (
        <div>
            <h2>Sales Data</h2>

        </div>
    );
};

export default Dashboard;
