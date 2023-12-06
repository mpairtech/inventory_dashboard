import React, { useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeCategory = () => {
    const navigate = useNavigate();

    const { userInfo } = useAuth();
    console.log(userInfo);

    const [update, setUpdate] = useState(0);

    const [name, setName] = useState("");
   
    const [img, setImg] = useState("");

    const addCategory = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("img", img);
        data.append("name", name);
        data.append("orgId", userInfo?.organizationData?.org_id);
        data.append("user_id", userInfo?.user_id);
      
        fetch(`${import.meta.env.VITE_SERVER}/product/createCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.category_id) {
                    toast.success("Category Setup Successfull");
                } else {
                    toast.error("Failed to Add User");
                }
            })
    };


    return (
        <div className="container min-vh-84 d-flex justify-content-start align-items-start ">
            <form onSubmit={addCategory} className="col-lg-12 mt-1">
                <h1 className="fs-5" >
                    Customize Category
                </h1>
                <div className="col-lg-2"
                >
                    <div className="row">
                        <div className="col-lg-12">
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
                        <div className="col-lg-12">
                            <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                            >
                                Category Name
                            </label>
                            <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setName(e.target.value)}
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
    )
}

export default CustomizeCategory