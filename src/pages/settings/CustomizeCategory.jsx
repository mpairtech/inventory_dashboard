import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeCategory = () => {
    const navigate = useNavigate();

    const { userInfo } = useAuth();
    const [update, setUpdate] = useState(false);


    const [img, setImg] = useState(null);
    const [name, setName] = useState("");

    const [allMainCategories, setAllMainCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState(null)


    const addCategory = (e) => {
        e.preventDefault();
        if(userInfo?.organizationData?.category_length <= parentCategory?.depth){
            toast.error("Category Depth Exceeded");
            return;
        }

        const data = new FormData();
        data.append("img", img);
        data.append("name", name);
        if (parentCategory) data.append("parent_id", parentCategory.category_id);
        data.append("org_id", userInfo?.organizationData?.org_id);
        data.append("user_id", userInfo?.user_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.category_id) {
                    toast.success("Category Setup Successful");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add User");
                }
            })
    };

    const getAllCategories = () => {
        const data = new FormData();
        data.append("org_id", userInfo?.organizationData?.org_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllCategoriesForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setAllMainCategories(
                    res.filter((category) => category.parent_id === null)
                );
            })
            .catch((err) => console.log(err));
    };


    useEffect(() => {
        getAllCategories();
    }, [update]);


    const handleDelete = (id) => {
        const data = new FormData();
        data.append("category_id", id);
        data.append("user_id", userInfo?.user_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/deleteCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                toast.success("Category Deleted Successfully");
                setUpdate(!update);
            })
            .catch((err) => console.log(err));
    }


    const renderNestedCategories = (categories, depth = 1) => {
        return categories.map((category) => (
            <>
                <option key={category.category_id} value={JSON.stringify(category)}

                >
                    {'━'.repeat(depth)} {category.name}
                </option>
                {category.subcategories && category.subcategories.length > 0 &&
                    renderNestedCategories(category.subcategories, depth + 1)}
            </>
        ))
    };
    const renderCategories = (categories, handleDelete) => {
        return categories.map(category => (
            <div key={category.category_id} className={` justify-content-between align-items-center p-2 rounded-2`}>
                <div className='d-flex align-items-center'>
                    <span className='font-20'>{' ━ '.repeat(category.depth)} </span>
                    <span className="font-13 ms-2">{category.name}</span>
                    <i className="fas fa-trash-alt cursor-pointer ms-2" onClick={() => handleDelete(category.category_id)}></i>
                </div>

                {category.subcategories && category.subcategories.length > 0 && (
                    <div className="ms-4"> {/* Adjust the margin based on your styling */}
                        {renderCategories(category.subcategories, handleDelete)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className='container'>
            <div className="d-flex justify-content-start align-items-start pb-3">
                <div className='row'>
                    <form onSubmit={addCategory} className="col-6 mt-1">
                        <h1 className="fs-5" >
                            Customize Category
                        </h1>
                        <div className=""
                        >
                            <div className="row">
                                <div className="">
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
                                <div className="">
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
                                <div className="">
                                    <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted fw-500"
                                    >
                                        Parent Category
                                    </label>
                                    <select 
                                    onChange={
                                        (e) => setParentCategory(JSON.parse(e.target.value))
                                    }
                                    className='form-control shadow-none '>
                                        <option value={null}>Select parent category</option>
                                        {renderNestedCategories(allMainCategories)}
                                    </select>
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
                <div className="col-4">
                    <label
                        htmlFor="recipient-name"
                        className="col-form-label text-muted fw-500"
                    >
                        Category Name
                    </label>
                    <div>
                        {renderCategories(allMainCategories, handleDelete)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomizeCategory