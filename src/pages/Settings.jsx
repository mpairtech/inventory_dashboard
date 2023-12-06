import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import CustomizeCategory from "./settings/CustomizeCategory";
import CustomizeUnit from "./settings/CustomizeUnit";
import CustomizeAttribute from "./settings/CustomizeAttribute";

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

const Settings = () => {

  const [activeTab, setActiveTab] = useState("Organization");
  const { userInfo } = useAuth();
  console.log(userInfo.user_id);
  //! ORGANIZATION

  const [update, setUpdate] = useState(0);

  const [orgName, setOrgName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [type, setType] = useState("");
  const [isMulti, setIsMulti] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [description, setDescription] = useState("");

  const addOrg = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", orgName);
    data.append("number", orgNumber);
    data.append("email", orgEmail);
    data.append("user_id", userInfo.user_id);
    data.append("type", type);
    data.append("isMulti", isMulti);
    data.append("location", orgLocation);
    data.append("des", description);
    fetch(`${import.meta.env.VITE_SERVER}/authority/createOrganization`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.id) {
          toast.success("User added successfully");
          setUpdate((prevUpdate) => prevUpdate + 1);
        } else {
          toast.error("Failed to Add User");
        }
      })
  };

  //! USER
  const columns = [
    {
      name: "User Name",
      selector: (row) => row.name,
    },
    {
      name: "Designation",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Contact",
      selector: (row) => row.phone,
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
            data-bs-target={`#exampleModalDelete${row.user_id}`}
          >
            <i className="fa-solid fa-trash fa-lg fa-icon text-danger"></i>
          </button>
          <div
            className="modal fade "
            id={`exampleModalDelete${row.user_id}`}
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
                    onClick={() => handleDelete(row.user_id)}
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

  const [userName, setUserName] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [store, setStore] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [searchField, setSearchField] = useState(null);


  const addUser = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", userName);
    data.append("user_id", userName);
    data.append("number", userNumber);
    data.append("email", userEmail);
    data.append("password", password);
    data.append("role", role);
    data.append("store_id", "1");
    data.append("status", "1");

    fetch(`${import.meta.env.VITE_SERVER}/authority/registerUser`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.message == true) {
          toast.success("User added successfully");
          setUpdate((prevUpdate) => prevUpdate + 1);
        } else {
          toast.error("Failed to Add User");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while adding the User");
      });
  };

  const [userList, setUserList] = useState([]);


  const getAllUser = () => {
    fetch(`${import.meta.env.VITE_SERVER}/authority/getAllUsers`, {
      method: "POST",
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

  useEffect(() => {
    getAllUser();
    // getDropDownStore();
  }, [update, searchField]);


  return (
    <div className="container-fluid ">
      <div className="row px-0">
        <div className="col-lg-12 px-0">
          <div className="py-2 px-0 bg-white border-0 rounded  ">
            <p className="pb-2 mb-1 text-muted ps-4 fw-700 border-bottom fs-5">
              Settings
            </p>
            <div className="row mx-0">
              <div className="col-lg-2 px-0 custom_border">

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Organization" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Organization")}
                  >
                    Organization
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Store" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Store")}
                  >
                    Store
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "User" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("User")}
                  >
                    User
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Employee" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Employee")}
                  >
                    Employee
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Category" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Category")}
                  >
                    Category
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Unit" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Unit")}
                  >
                    Unit
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Attribute" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Attribute")}
                  >
                    Attribute
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

              </div>

              <div className="col-lg-10 px-0">
                {
                  activeTab === "Organization" &&
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 mt-2 ps-0">
                        <div className="row">
                          <div className="col-lg-10">
                            <p className="mb-0 font-6 ms-2">
                              Welcome <b className="font-5 ">Mpair</b>
                            </p>
                            <p className="mb-0 ms-2 font-14 text-muted pb-5">
                              The organization info stays here
                            </p>
                          </div>
                          <div className="col-lg-2 ">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal3"
                              data-bs-whatever="@mdo"
                              className="btn_primary py-2 "
                            >
                              + Add Org
                            </button>

                            <div
                              className="modal fade"
                              id="exampleModal3"
                              tabIndex={-1}
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content">
                                  <form onSubmit={addOrg} className="col-lg-12 ">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Add New Org
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
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              User Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setOrgName(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Phone no
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setOrgNumber(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Email
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setOrgEmail(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="message-text"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Organization Type
                                            </label>
                                            <select
                                              className="form-control py-2 font-13 shadow-none"
                                              onChange={(e) => setType(e.target.value)}
                                            >
                                              <option selected disabled value="">
                                                Select role
                                              </option>
                                              <option value="Clothing">Clothing</option>
                                              <option value="Electronics">Electronics</option>
                                              <option value="Grocery">Grocery</option>
                                              <option value="Restaurant">Restaurant</option>
                                              <option value="Other">Other</option>
                                            </select>
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="message-text"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Store Type (Single/Multiple)
                                            </label>
                                            <select
                                              className="form-control py-2 font-13 shadow-none"
                                              onChange={(e) => setIsMulti(e.target.value)}
                                            >
                                              <option selected disabled value="">
                                                Is Multi
                                              </option>
                                              <option value="YES">YES</option>
                                              <option value="NO">NO</option>
                                            </select>
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Location
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setOrgLocation(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-12">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Description
                                            </label>
                                            <textarea
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setDescription(e.target.value)}
                                            />
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

                        <table className="table">
                          <tbody>
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-16 fw-600 text-muted">
                                  Logo
                                </p>
                              </td>
                              <td>
                                <div className="logobox text-start position-relative ">
                                  <img
                                    src="/logo.png"
                                    alt=""
                                    className="logo_icon2  my-2"
                                  />
                                  <div className="edit-position">
                                    <label className="font-12 text-primary text-decoration-underline">
                                      <input
                                        type="file"
                                        className="form-control d-none"
                                        placeholder=""
                                      />
                                      <i className="fa-solid fa-pen font-10 text-danger me-1"></i>
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Organization Name
                                </p>
                              </td>

                              <td>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                  Nokshikatha
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Organization Location
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                    34 WASA, CTG
                                  </p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Authorized Person
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                    Mainul bhai
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Designation
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                    Ostad
                                  </p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Organization Email
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                    saddam23@gmail.com
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Organization Phone
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-14">
                                    0182343535
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-14 fw-600 text-muted">
                                  Password
                                </p>
                              </td>
                              <td>
                                <p className="font-6 m-0 mt-1">********</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                }

                {
                  activeTab === "User" &&
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 bg-white rounded-2">
                        <div className="row mt-2">
                          <div className="col-lg-2 ps-4">
                            <p className="fs-5 pt-2 fw-500 mb-0">User List</p>
                            <p className="font-12 mb-2">User history</p>
                          </div>
                          <div className="col-lg-8 px-0"></div>
                          <div className="col-lg-2 mt-3 ps-4">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal2"
                              data-bs-whatever="@mdo"
                              className="btn_primary py-2 "
                            >
                              + Add User
                            </button>

                            <div
                              className="modal fade"
                              id="exampleModal2"
                              tabIndex={-1}
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content">
                                  <form onSubmit={addUser} className="col-lg-12 ">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Add New User
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
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              User Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setUserName(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Phone no
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setUserNumber(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="recipient-name"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Email
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              onChange={(e) => setUserEmail(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="message-text"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Password
                                            </label>
                                            <input
                                              className="form-control py-2 font-13 shadow-none bg-white"
                                              id="message-text"
                                              onChange={(e) => setPassword(e.target.value)}
                                            />
                                          </div>
                                          <div className="my-3 col-lg-4">
                                            <label
                                              htmlFor="message-text"
                                              className="col-form-label text-muted fw-500"
                                            >
                                              Role
                                            </label>
                                            <select
                                              className="form-control py-2 font-13 shadow-none"
                                              onChange={(e) => setRole(e.target.value)}
                                            >
                                              <option selected disabled value="">
                                                Select role
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
                }


                {
                  activeTab === "Category" &&
                  <CustomizeCategory />
                }

                {
                  activeTab === "Unit" &&
                  <CustomizeUnit />
                }
                

                {
                  activeTab === "Attribute" &&
                  <CustomizeAttribute />
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
