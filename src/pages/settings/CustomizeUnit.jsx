import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeUnit = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    console.log(userInfo);

    const [update, setUpdate] = useState(false);

    const [unitName, setUnitName] = useState("");


    const addUnit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", unitName);
        data.append("orgId", userInfo?.organizationData?.org_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createUnit`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.unit_id) {
                    toast.success("Unit Added Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add Unit");
                }
            })
    };


    const [unitList, setUnitList] = useState([]);


    const getAllUnits = () => {
        const data = new FormData();
        data.append("orgId", userInfo?.organizationData?.org_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllUnitsForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setUnitList(res);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getAllUnits();
    }, [update]);


    const handleDelete = (id) => {
        const data = new FormData();
        data.append("unit_id", id);
        fetch(`${import.meta.env.VITE_SERVER}/product/deleteUnitById`, {
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
        <div className="container min-vh-84 d-flex justify-content-start align-items-start ">
            <div className='col-lg-12'>
                <h1 className="fs-5" >
                    Customize Unit
                </h1>
                <div className='row '>
                    <div className='col-3 border-end'>
                        <form onSubmit={addUnit} className="">
                            <div className="">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <label
                                            htmlFor="recipient-name"
                                            className="col-form-label text-muted fw-500"
                                        >
                                            Unit Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2 font-13 shadow-none bg-white"
                                            onChange={(e) => setUnitName(e.target.value)}
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
                                    Unit Name
                                </label>
                                {unitList.map((unit) => (
                                    <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                                        <p className="font-13">{unit.name}</p>
                                        <i className="fas fa-trash-alt cursor-pointer" onClick={() => handleDelete(unit.unit_id)}></i>
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

export default CustomizeUnit