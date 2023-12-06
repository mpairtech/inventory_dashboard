import React, { useState } from 'react'
import { useAuth } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    console.log(userInfo?.user_id);

    const [update, setUpdate] = useState(0);

    const [orgName, setOrgName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [orgNumber, setOrgNumber] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    const [type, setType] = useState("");
    const [isMulti, setIsMulti] = useState("");
    const [orgLocation, setOrgLocation] = useState("");
    const [img, setImg] = useState("");

    const addOrg = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("img", img);
        data.append("name", orgName);
        data.append("owner_name", ownerName);
        data.append("number", orgNumber);
        data.append("email", orgEmail);
        data.append("user_id", userInfo.user_id);
        data.append("type", type);
        data.append("isMulti", isMulti);
        data.append("location", orgLocation);
        fetch(`${import.meta.env.VITE_SERVER}/authority/createOrganization`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.org_id) {
                    toast.success("Organization Setup Successfull");
                    navigate("/");
                } else {
                    toast.error("Failed to Add User");
                }
            })
    };


    return (
        <div className="container min-vh-84 d-flex justify-content-center align-items-center ">
            <form onSubmit={addOrg} className="col-lg-12 ">
                <h1 className="fs-5" >
                    Setup Your Organization
                </h1>
                <div className="col-lg-12 "
                >
                    <div className="row">
                        <div className="my-3 col-lg-3">
                            <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                            >Upload Logo</label>

                            <input type="file" className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => {
                                    setImg(e.target.files[0]);
                                }}
                            />
                        </div>
                        <div className="my-3 col-lg-3">
                            <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                            >
                                Organization Name
                            </label>
                            <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setOrgName(e.target.value)}
                            />
                        </div>
                        <div className="my-3 col-lg-3">
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
                        <div className="my-3 col-lg-3">
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
                        <div className="my-3 col-lg-3">
                            <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                            >
                                Owner Name
                            </label>
                            <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setOwnerName(e.target.value)}
                            />
                        </div>
                        <div className="my-3 col-lg-3">
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
                        <div className="my-3 col-lg-3">
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

                        <div className="my-3 col-lg-3">
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

                    </div>
                </div>
                <div className="">
                    <button
                        type="submit"
                        className="btn_primary w-100 mt-3"
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Setup