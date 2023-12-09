import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeAttribute = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [update, setUpdate] = useState(false);

    const [AttributeName, setAttributeName] = useState("");

    const [selectedAttribute, setSelectedAttribute] = useState("");

    console.log(selectedAttribute);

    const addAttribute = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", AttributeName);
        data.append("org_id", userInfo?.organizationData?.org_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createAttribute`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.attribute_id) {
                    toast.success("Attribute Added Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add Attribute");
                }
            })
    };


    const [attributeList, setAttributeList] = useState([]);


    const getAllAttributes = () => {
        const data = new FormData();
        data.append("org_id", userInfo?.organizationData?.org_id);
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
        data.append("attribute_id", id);
        fetch(`${import.meta.env.VITE_SERVER}/product/deleteAttributeById`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                toast.success("Attribute Deleted Successfully");
                setUpdate(!update);
            })
            .catch((err) => console.log(err));
    }

    //! Attribute Value Section

    const addAttributeValue = (e) => {
        e.preventDefault();

        if (selectedAttribute === "") {
            toast.error("Please Select Attribute First");
            return;
        }

        const data = new FormData();
        data.append("value", AttributeName);
        data.append("parent_id", selectedAttribute);
        data.append("user_id", userInfo?.user_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createAttributeValue`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.attribute_value_id) {
                    toast.success("Attribute Value Added Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add Attribute Value");
                }
            })
    };


    const [attributeValueList, setAttributeValueList] = useState([]);


    const getAllAttributeValues = () => {
        const data = new FormData();
        data.append("parent_id", selectedAttribute);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllAttributeValues`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setAttributeValueList(res);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getAllAttributeValues();
    }, [update, selectedAttribute]);


    const handleDeleteValue = (id) => {
        const data = new FormData();
        data.append("attribute_value_id", id);
        data.append("user_id", userInfo?.user_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/deleteAttributeValueById`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                toast.success("Attribute Value Deleted Successfully");
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
                <div className='row'>
                    <div className='col-6'>
                        <div className='col-6'>
                            <form onSubmit={addAttribute} className="">
                                <div className="">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label text-muted fw-500"
                                            >
                                                Enter Attribute Name
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
                                        className="btn_primary my-3"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='col-6'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted fw-500"
                                    >
                                        Attribute Name List
                                    </label>
                                    {attributeList.map((attribute) => (
                                        <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                                            <button
                                                key={attribute.attribute_id}
                                                className={`w-100 text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${selectedAttribute === attribute.attribute_id ? "btn_active" : "btn_inactive"}`}
                                                onClick={() => setSelectedAttribute(attribute.attribute_id)}
                                            >
                                                {attribute.name}
                                                <i className="fa-solid fa-angle-right"></i>
                                            </button>
                                            <i className="fas fa-trash-alt cursor-pointer text-danger ms-2" onClick={() => handleDelete(attribute.attribute_id)}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='col-6'>
                            <form onSubmit={addAttributeValue} className="">
                                <div className="">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label text-muted fw-500"
                                            >
                                                Enter Attribute Value
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
                                        className="btn_primary my-3"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='col-6'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted fw-500"
                                    >
                                        Attribute Values List
                                    </label>
                                    {attributeValueList.map((attribute) => (
                                        <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                                            <button
                                                key={attribute.attribute_value_id}
                                                className={`w-100 text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${selectedAttribute === attribute.attribute_value_id ? "btn_active" : "btn_inactive"}`}
                                            >
                                                {attribute.value}
                                                <i className="fa-solid fa-angle-right"></i>
                                            </button>
                                            <i className="fas fa-trash-alt cursor-pointer text-danger ms-2" onClick={() => handleDeleteValue(attribute.attribute_value_id)}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomizeAttribute