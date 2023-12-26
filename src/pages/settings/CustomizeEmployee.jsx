import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { useAuth } from "../../providers/AuthProvider";

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

const CustomizeEmployee = () => {

  //! Employee
  const columns = [
    {
      name: "User Name",
      selector: (row) => row.name,
    },
    {
      name: "Number",
      selector: (row) => row.number,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <Link to={`/zone/employeeinfo/${row.employee_id}`}>
            <i className="fa-solid fa-edit fa-lg fa-icon me-2"></i>
          </Link>
          <button
            className="border-0 "
            data-bs-toggle="modal"
            data-bs-target={`#exampleModalDelete${row.employee_id}`}
          >
            <i className="fa-solid fa-trash fa-lg fa-icon text-danger"></i>
          </button>
          <div
            className="modal fade "
            id={`exampleModalDelete${row.employee_id}`}
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
                    onClick={() => handleDelete(row.employee_id)}
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
  console.log(userInfo);
  const [update, setUpdate] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [store, setStore] = useState("");
  const [nid, setNid] = useState("");
  const [address, setAddress] = useState("");
  const [searchField, setSearchField] = useState(null);


  const addEmployee = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", employeeName);
    data.append("number", number);
    data.append("address", address);
    data.append("nid", nid);
    data.append("store_id", store);
    data.append("designation", designation);
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("user_id", userInfo.user_id);
    fetch(`${import.meta.env.VITE_SERVER}/employee/addEmployee`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res?.employee_id) {
          toast.success("Employee added successfully");
          setUpdate(!update);
        } else {
          toast.error("Failed to Add Employee");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while adding the Employee");
      });
  };

  const [userList, setUserList] = useState([]);
  console.log(userList);

  const [storeList, setStoreList] = useState([]);
  console.log(storeList);

  const getAllEmployee = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/employee/getAllEmployeeForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        // setUserList(res.message);
        if (searchField) {
          setUserList(
            res.filter(
              (item) =>
                item.name
                  .toLowerCase()
                  .includes(searchField.toLowerCase())
            )
          );
        } else {
          setUserList(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllStores = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/getAllStoreForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreList(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllEmployee();
    getAllStores();
  }, [update, searchField]);

  const handleDelete = (id) => {
    console.log(id);
    const data = new FormData();
    data.append("user_id", id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/deleteUser`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Unit Deleted Successfully");
        setUpdate(!update);
      })
      .catch((err) => console.log(err));
  }


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-500 mb-0">Employee List</p>
              <p className="font-12 mb-2">See all employee</p>
            </div>
            <div className="col-lg-8 px-0"></div>
            <div className="col-lg-2 mt-3 ps-5">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                data-bs-whatever="@mdo"
                className="btn_primary py-2 "
              >
                + Add Employee
              </button>

              <div
                className="modal fade"
                id="exampleModal2"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form onSubmit={addEmployee} className="col-lg-12 ">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="exampleModalLabel"
                        >
                          Add New Employee
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div
                          // onSubmit={addEmployee}
                          className="col-lg-12 "
                        >
                          <div className="row">
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setEmployeeName(e.target.value)}
                              />
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Phone no
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setNumber(e.target.value)}
                              />
                            </div>

                            <div className="my-3 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Address
                              </label>
                              <input
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>

                            <div className="my-3 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                NID
                              </label>
                              <input
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setNid(e.target.value)}
                              />
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="message-text"
                                className="col-form-label text-muted fw-500"
                              >
                                Assign to Store
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setStore(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Store
                                </option>
                                {
                                  storeList.map((item) => (
                                    <option 
                                    key={item.store_id}
                                    value={item.store_id}>{item.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="message-text"
                                className="col-form-label text-muted fw-500"
                              >
                                Designation
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setDesignation(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Designation
                                </option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn_danger"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          className="btn_primary"
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border min-vh-66">
                <div className="card-head">
                  <div className="row mt-2">
                    <div className="col-lg-3 ps-4 d-flex ">
                      <input
                        onChange={(e) => setSearchField(e.target.value)}
                        type="text"
                        className="border border-1 shadow-none pos-input"
                      />
                      <button className="btn_small px-2 border-0 rounded-0 rounded-end ">
                        <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                      </button>
                    </div>
                    <div className="col-lg-9 "></div>
                  </div>
                </div>
                <div className="card-body px-0 pb-1 ">
                  <DataTable
                    className="px-0"
                    columns={columns}
                    data={userList}
                    dense
                    pagination
                    paginationPerPage={5}
                    center
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeEmployee