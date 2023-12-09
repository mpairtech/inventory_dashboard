import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { formatDate } from "../utils/utils";

createTheme({
    background: {
        default: "#f9f9e1",
    },
});

const customStyles = {
    rows: {
        style: {},
    },
    headCells: {
        style: {
            backgroundColor: "#f9f9e1",
        },
    },
};

const Activities = () => {
    const columns = [

        {
            name: "User ID",
            selector: (row) => row.user,
            sortable: true,
            minWidth: false,
            center: true,
            width: "15%",
        },
        {
            name: "Activity Type",
            selector: (row) => row.type,
            sortable: true,
            minWidth: false,
            width: "20%",
        },
        {
            name: "Description",
            selector: (row) => (row.des).slice(0, 200) + "...",
            sortable: true,
            minWidth: false,
            width: "30%",
        },
        {
            name: "Date",
            selector: (row) => formatDate(row?.date),
            sortable: true,
            minWidth: false,
            width: "20%",
        },
        {
            name: "Action",
            button: true,
            width: "15%",
            cell: (row) => (
                <>
                    <button
                        className="border-0 "
                        data-bs-toggle="modal"
                        data-bs-target={`#exampleModalDelete${row.expense_id}`}
                    >
                        <i className="fa-solid fa-trash fa-lg fa-icon  red"></i>
                    </button>
                    <div
                        className="modal fade "
                        id={`exampleModalDelete${row.expense_id}`}
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title font-14" id="exampleModalLabel">
                                        Confirm Delete
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="font-14 ms-2">
                                        Are you sure you want to delete?
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn_secondary font-13"
                                        data-bs-dismiss="modal"
                                    >
                                        Close
                                    </button>

                                    <button
                                        onClick={() => handleDelete(row.expense_id)}
                                        className="btn_danger font-13"
                                        data-bs-dismiss="modal"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ),
        },
    ];
    const { userInfo } = useAuth();

    const [update, setUpdate] = useState(0);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);


    const getAllActivities = () => {
        const data = new FormData();
        data.append("user_id", userInfo?.user_id);
        data.append("page", page);
        fetch(`${import.meta.env.VITE_SERVER}/authority/getAllActivitiesForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res.activities)
            }
            )
            .catch((err) => console.log(err))
    }

    const handleDelete = (id) => {
        const data = new FormData();
        data.append("expense_id", id);
        fetch(`${import.meta.env.VITE_SERVER}/admin/deleteExpenseById`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                toast.success("Expense Deleted Successfully");
                setUpdate(update + 1);
            })
            .catch((err) => console.log(err));
    };



    useEffect(() => {
        getAllActivities();
    }, [update, page]);
    return (
        <div className="container-fluid  ">
            <div className="row">
                <div className="col-lg-12 bg-white rounded-2">
                    <div className="row ">
                        <div className="col-lg-2 ps-4">
                            <p className="fs-5 pt-2 fw-600 mb-0">Activity Log</p>
                            <p className="font-12 mb-2">See activity history</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card border min-vh-66">
                                <div className="card-head">
                                    <div className="row mt-2">

                                    </div>

                                </div>
                                <div className="card-body px-0 pb-1">
                                    <DataTable
                                        // title="Activities"
                                        className="px-0"
                                        customStyles={customStyles}
                                        center
                                        columns={columns}
                                        data={data}
                                        highlightOnHover
                                        dense
                                        pagination
                                        paginationServer
                                        // paginationTotalRows={users.total}
                                        paginationPerPage={3}
                                        paginationComponentOptions={{
                                            noRowsPerPage: true
                                        }}
                                        onChangePage={page => setPage(page)}

                                    // paginationPerPage={10}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;
