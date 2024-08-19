import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import Swal from "sweetalert2";
import {hover} from "@testing-library/user-event/dist/hover";

function ManagerCategory() {
    const Columns = [
        {
            name: 'Id',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Tên danh mục',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Tác vụ',
            cell: row => <button className="delete-button" onClick={() => handleDeleteCategory(row.id)}
                                 style={{padding: '10px 20px', borderRadius: '5px', backgroundColor: 'red', color: '#fff', border: 'none', cursor: 'pointer'}}>Xóa</button>,
        }
    ]
    const [data , setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const[searchData, setSearchData] = useState([])
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate(); // Khai báo biến điều hướng
    async function fetch() {
        try {
            const response = await axios.post(`https://localhost:7125/CategoryCotroller/category`)
            setData(response.data);
            setSearchData(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteCategory(id) {
        try {
            Swal.fire({
                icon: "warning",
                title: "Bạn có muốn xóa danh mục này?",
                text: "Thao tác này không được khôi phục!",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Có, xóa nó!",
                cancelButtonText: "Hủy",
              }).then( async (result) => {
                if (result.isConfirmed) {
                    const response = await  axios.get(`https://localhost:7125/CategoryCotroller/delete?id=${id}`)
                    if(response.data){
                        Swal.fire(
                          "Đã xóa!",
                          "Danh mục đã được xóa.",
                          "success"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                    "Đã hủy",
                    "Danh mục không bị xóa",
                    "error"
                  );
                }
              });
        } catch(error) {
            console.error("Delete error", error);
        }
        fetch();
    }

    async function addCategory(nameCategory) {
        try {
            const response = await axios.get(`https://localhost:7125/CategoryCotroller/add?nameCategory=${nameCategory}`)
            if (response.data) {
                console.log("Them thanh cong: " + nameCategory)
                fetch();
            }
        } catch (error) {
            console.error("Add category error", error);
        }
    }


    useEffect(() => {
        if (currentUser?.role != 0) {
            navigate('/unauthorized');
        }
    }, [currentUser, navigate]);

    useEffect(()=> {
        fetch();
    },[])
    const handleSearch = (event) => {
        const newData = data.filter(row => {
            return row.name.toLowerCase().includes(event.target.value.toLowerCase());
        })
        setSearchData(newData)
    }
    const handleDeleteCategory = async (id) => {
        deleteCategory(id);
    }

    const handleAddCategory = (name) => {
        addCategory(name);
    }
    const customStyle = {
        headCells: {
            style: {
                fontSize: "17px",
                background: "#009879",
                color: "#ffffff",
                fontWeight: "bold",
                textAlign: 'center',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', // Đảm bảo nội dung tiêu đề cũng được căn giữa theo chiều dọc
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                textAlign: 'center',
                padding: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
                '&:hover': {
                    backgroundColor: '#f1f1f1',
                },
            },
        },
        pagination: {
            style: {
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                padding: '10px',
            },
        },
    };
    return (
        <div className="table-container">
            <h2 className="table-title" style={{fontWeight: "bold"}}>Quản lý danh mục</h2>
            <div className="search-container"
                 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position:'absolute',top:'5px', width:'98%'}}>
                <input type={"text"} onChange={handleSearch} placeholder={"Tìm kiếm..."} className="search-input"
                       style={{width: '20%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}/>
                <button className="add-category-button"
                        onClick={() => setModalIsOpen(true)}
                        style={{padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', cursor: 'pointer'}}>
                    Thêm Danh mục
                </button>
            </div>
            <DataTable
                customStyles={customStyle}
                columns={Columns} data={searchData} fixedHeader={true} pagination={true}>
            </DataTable>

            {modalIsOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <h2>Thêm Danh mục</h2>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nhập tên danh mục"
                            style={modalStyles.input}
                        />
                        <button
                            style={modalStyles.button}
                            onClick ={() => handleAddCategory(newCategoryName)}
                        >
                            Thêm
                        </button>
                        <button
                            onClick={() => {
                                setModalIsOpen(false)
                                setNewCategoryName('')
                            }}
                            style={{ ...modalStyles.button, backgroundColor: 'gray' }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    },
    content: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginBottom: '10px',
        '&:hover': {
            opacity: '0.7',
        },
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: 'green',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
    }
};

export default ManagerCategory;