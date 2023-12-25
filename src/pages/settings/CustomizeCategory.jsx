import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomizeCategory = () => {
    const navigate = useNavigate();

    const { userInfo } = useAuth();
    console.log(userInfo);

    const [update, setUpdate] = useState(false);

    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);

    const [img, setImg] = useState("");
    const [name, setName] = useState("");

    const [allCategoriesAll, setAllCategoriesAll] = useState([]);
    console.log(allCategoriesAll)
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeSubCategory, setActiveSubCategory] = useState("")
    console.log(activeSubCategory)
    console.log(activeCategory);

    const addCategory = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("img", img);
        data.append("name", name);
        if (activeCategory) data.append("parent_id", activeCategory);
        data.append("org_id", userInfo?.organizationData?.org_id);
        data.append("user_id", userInfo?.user_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createSubCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.category_id) {
                    toast.success("Category Setup Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add User");
                }
            })
    };


    const getAllCategories = () => {
        const data = new FormData();
        data.append("org_id", userInfo?.organizationData?.org_id);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllMainCategoriesForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setAllCategoriesAll(res);
                console.log("main cat==>", res.filter((category) => category.parent_id === null));
                console.log("sub cat==>", res.filter((category) => category.parent_id !== null && category.subcategories.length === 1));
                console.log("subsub cat==>", res.filter((category) => category.parent_id !== null && category.subcategories.length === 0));
                setCategoryList(
                    res.filter((category) => category.parent_id === null)
                );
            })
            .catch((err) => console.log(err));
    };


    const addSubCategory = (e) => {
        e.preventDefault();

        if (activeCategory === "") return toast.error("Please Select a Category");

        const data = new FormData();
        data.append("name", name);
        data.append("parent_id", activeCategory);
        data.append("org_id", userInfo?.organizationData?.org_id);
        data.append("user_id", userInfo?.user_id);

        fetch(`${import.meta.env.VITE_SERVER}/product/createSubCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.category_id) {
                    toast.success("Category Setup Successfull");
                    setUpdate(!update);
                } else {
                    toast.error("Failed to Add Category");
                }
            })
    };


    const getAllSubCategories = () => {
        const data = new FormData();
        data.append("org_id", userInfo?.organizationData?.org_id);
        // data.append("parent_id", activeSubCategory);
        fetch(`${import.meta.env.VITE_SERVER}/product/getAllSubcategoriesForOrg`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setSubCategoryList(res);
            })
            .catch((err) => console.log(err));
    };



    useEffect(() => {
        getAllCategories();
        getAllSubCategories();
    }, [userInfo, update, activeSubCategory]);



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
                                        className='form-control py-2 font-13 shadow-none'
                                        onChange={(e) => setActiveCategory(e.target.value)}
                                    >
                                        <option value={null}>Select Category</option>
                                        {allCategoriesAll.map((category) => (
                                            <option value={category.category_id}>{category.name}</option>
                                        ))}
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

                <div className="col-2">
                    <label
                        htmlFor="recipient-name"
                        className="col-form-label text-muted fw-500"
                    >
                        Category Name
                    </label>
                    {allCategoriesAll.map((category) => (
                        <div
                            className={`d-flex justify-content-between align-items-center  p-2 rounded-2`}>
                            <div className='d-flex align-items-center'>
                                <span className='font-20'>{' ━ '.repeat(category.depth)} </span> <span className="font-13 ms-2">{category.name}</span>
                            </div>
                            <i className="fas fa-trash-alt cursor-pointer" onClick={() => handleDelete(category.category_id)}></i>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="d-flex justify-content-start align-items-start border-bottom pt-2">
                <div className='row'>
                    <form onSubmit={addSubCategory} className="col-12 mt-1">
                        <h1 className="fs-5" >
                            Customize Sub Category
                        </h1>
                        <div className=""
                        >
                            <div className="row">
                                <div className="">
                                    <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted fw-500"
                                    >
                                        Sub Category Name
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
                <div className="col-2">
                </div>
                <div className="col-2">
                    <label
                        htmlFor="recipient-name"
                        className="col-form-label text-muted fw-500"
                    >
                        Sub Category Name
                    </label>
                    {subCategoryList.map((category) => (
                        <div
                            onClick={() => setActiveSubCategory(category.category_id)}
                            className={`d-flex justify-content-between align-items-center  p-2 rounded-2 cursor-pointer  ${activeCategory
                                ? activeCategory === category.category_id ? "bg-light3" : ""
                                : ""
                                }`}>
                            <p className="font-13">{category.name}</p>
                            <i className="fas fa-trash-alt cursor-pointer" onClick={() => handleDelete(category.category_id)}></i>
                        </div>
                    ))}
                </div>
            </div> */}

        </div>
    )
}

export default CustomizeCategory