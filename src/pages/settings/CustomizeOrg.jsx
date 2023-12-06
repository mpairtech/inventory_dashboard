import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeOrg = () => {

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


    return (
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
    )
}

export default CustomizeOrg