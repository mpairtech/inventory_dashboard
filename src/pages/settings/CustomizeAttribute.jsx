import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeAttribute = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    console.log(userInfo);

    const [update, setUpdate] = useState(false);

    const [AttributeName, setAttributeName] = useState("");


    const addAttribute = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", AttributeName);
        data.append("orgId", userInfo?.organizationData?.org_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createAttribute`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.Attribute_id) {
                    toast.success("Attribute Added Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add Attribute");
                }
            })
    };


    const [AttributeList, setAttributeList] = useState([]);


    const getAllAttributes = () => {
        const data = new FormData();
        data.append("orgId", userInfo?.organizationData?.org_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllAttributesForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setAttributeList(res);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getAllAttributes();
    }, [update]);


    const handleDelete = (id) => {
        const data = new FormData();
        data.append("Attribute_id", id);
        fetch(`${import.meta.env.VITE_SERVER}/product/deleteAttributeById`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                toast.success("Attribute Deleted Successfully");
                setUpdate(!update);
            })
            .catch((err) => console.log(err));
    }


    return (
        <div className="container min-vh-84 d-flex justify-content-start align-items-start ">
            <div className='col-lg-12'>
                <h1 className="fs-5" >
                    Customize Attribute
                </h1>
                <div className='row '>
                    <div className='col-3 border-end'>
                        <form onSubmit={addAttribute} className="">
                            <div className="">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <label
                                            htmlFor="recipient-name"
                                            className="col-form-label text-muted fw-500"
                                        >
                                            Attribute Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2 font-13 shadow-none bg-white"
                                            onChange={(e) => setAttributeName(e.target.value)}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="">
                                <button
                                    type="submit"
                                    className="btn_primary  mt-3"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='col-2'>
                        <div className="row">
                            <div className="col-lg-12">
                                <label
                                    htmlFor="recipient-name"
                                    className="col-form-label text-muted fw-500"
                                >
                                    Attribute Name
                                </label>
                                {AttributeList.map((Attribute) => (
                                    <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                                        <p className="font-13">{Attribute.name}</p>
                                        <i className="fas fa-trash-alt cursor-pointer" onClick={() => handleDelete(Attribute.Attribute_id)}></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomizeAttribute