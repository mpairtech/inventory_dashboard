import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { imageUpload } from "../utils/utils";
// import CategoryInfo from "../components/CategoryInfo";

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

const Categories = () => {
    const [update, setUpdate] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);

    const [showAddCat, setShowAddCat] = useState(false);
    const [showAddSubCat, setShowAddSubCat] = useState(false);
    const [showAddProCat, setShowAddProCat] = useState(false);

    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [productCategory, setProductCategory] = useState("");

    const [activeCategory, setActiveCategory] = useState(categoryList[0]?.category_name);
    const [activeSubCategory, setActiveSubCategory] = useState("");
    const [activeProductCategory, setActiveProductCategory] = useState("");


    const [image, setImage] = useState(null);


    const [categoryWiseProducts, setCategoryWiseProducts] = useState([]);
    const [productsExist, setProductsExist] = useState(false);
    const [YN, setYN] = useState(false);
    const [YNSub, setYNSub] = useState(false);
    const [YNSubSub, setYNSubSub] = useState(false);
    const [searchField, setSearchField] = useState("");
    const columns = [
        {
            name: "Product ID",
            selector: (row) => row.product_id,
            sortable: true,
            minWidth: false,
            center: true,
        },
        {
            name: "Product Name",
            selector: (row) => row.pname,
        },
        {
            name: "Category",
            selector: (row) => row.cat,
        },
        {
            name: "Quantity",
            selector: (row) => row.qty,
        },
        {
            name: "Price",
            selector: (row) => row.price,
        },
        {
            name: "Action",
            button: true,
            cell: (row) => (
                <>
                    <Link
                        to={`/product-list/${row.product_id}`}
                        className="border-0 bg-transparent"
                    >
                        <i className="fa-solid fa-eye fa-lg fa-icon me-2 text-warning"></i>
                    </Link>
                </>
            ),
        },
    ];

    const handleAddCategory = () => {
        if (!category && !image) {
            toast.error("Category name & image is required");
            return;
        }
        imageUpload(image).then(data2 => {
            const data = new FormData();
            data.append("category_name", category);
            data.append("imgSrc", data2.filename);
            fetch(`${import.meta.env.VITE_SERVER}/admin/addNewCategory`, {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((res) => {
                    setUpdate(update + 1);
                    setCategory("");
                })
                .catch((err) => console.log(err));
        }).catch(err => {
            console.log(err.message)
        })
    };

    const handleAddSubCategory = () => {

        if (!activeCategory) {
            toast.error("Select a category first");
            return;
        }

        if (!subCategory) {
            toast.error("Sub category name is required");
            return;
        }

        const data = new FormData();
        data.append("sub_category_name", subCategory);
        data.append("category_id", activeCategory);
        fetch(`${import.meta.env.VITE_SERVER}/admin/addNewSubCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setUpdate(update + 1);
                setSubCategory("");
            })
            .catch((err) => console.log(err));
    };

    const handleAddProductCategory = () => {

        if (!activeCategory) {
            toast.error("Select a category first");
            return;
        }

        if (!activeSubCategory) {
            toast.error("Select a sub category first");
            return;
        }

        if (!productCategory) {
            toast.error("Product category name is required");
            return;
        }

        const data = new FormData();
        data.append("product_category_name", productCategory);
        data.append("sub_category_id", activeSubCategory);
        data.append("category_id", activeCategory);
        fetch(`${import.meta.env.VITE_SERVER}/admin/addNewProductCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setUpdate(update + 1);
                setProductCategory("");
            })
            .catch((err) => console.log(err));
    };



    const getAllCategory = () => {
        const data = new FormData();
        fetch(`${import.meta.env.VITE_SERVER}/getAllCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setCategoryList(res.message);
            })
            .catch((err) => console.log(err));
    };

    const getAllSubCategory = () => {
        const data = new FormData();
        fetch(`${import.meta.env.VITE_SERVER}/getAllSubCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setSubCategoryList(
                    res.message.filter((item) => +item.category_id === +activeCategory)
                );
            })
            .catch((err) => console.log(err));
    };

    const getAllProductCategory = () => {
        const data = new FormData();
        fetch(`${import.meta.env.VITE_SERVER}/getAllProductCategory`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                setProductCategoryList(
                    res.message.filter((item) => +item.category_id == +activeCategory && +item.sub_category_id == +activeSubCategory)
                );
            })
            .catch((err) => console.log(err));
    };

    const getAllProductByCats = () => {
        const data = new FormData();
        data.append("category_id", activeCategory);
        data.append("sub_category_id", activeSubCategory);
        data.append("product_category_id", activeProductCategory);
        fetch(`${import.meta.env.VITE_SERVER}/getProductByCats`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (searchField) {
                    setCategoryWiseProducts(
                        res.filter(
                            (item) =>
                                item.product_id.toLowerCase().includes(searchField) ||
                                item.pname
                                    .toLowerCase()
                                    .includes(searchField.toLowerCase())
                        )
                    );
                } else {
                    setCategoryWiseProducts(res);
                }
            })
            .catch((err) => console.log(err));
    };


    const handleDelete = (category_name) => {
        const data = new FormData();
        data.append("category_name", category_name);
        fetch(`${import.meta.env.VITE_SERVER}/deleteCategoryByName`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.message === true) {
                    toast.success("Category Deleted Successfully");
                    setUpdate(update + 1);
                } else {
                    toast.error("Delete Failed. Check if products exist in this category");
                }
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getAllCategory();
        getAllSubCategory();
        getAllProductCategory();
    }, [update, activeCategory, activeSubCategory, activeProductCategory]);

    useEffect(() => {
        getAllProductByCats();
    }, [activeCategory, activeSubCategory, activeProductCategory, searchField]);


    return (
        <div className="container-fluid ">
            <div className="row px-0">
                <div className="col-lg-12 px-0">
                    <div className="py-2 px-0 bg-white border-0 rounded  ">
                        <p className=" my-2 pb-2 text-muted ps-4 fw-700 border-bottom fs-5">
                            Product Category
                        </p>
                        <div className="row mx-0">

                            {/* category */}

                            <div className="col-lg-2 px-0 custom_border">
                                <div className=" mt-2 mx-2" >

                                    <div className="card rounded-1 p-2 my-2">
                                        <button
                                            onClick={() => setShowAddCat(!showAddCat)}
                                            className="btn_primary w-100 py-2 font-14 d-flex justify-content-center align-items-center gap-2"
                                        >
                                            <p> Add Main Category</p>
                                            {showAddCat ? (
                                                <i className="fa-solid fa-chevron-down"></i>
                                            ) : (
                                                <i className="fa-solid fa-chevron-up"></i>
                                            )}
                                        </button>
                                        {showAddCat && (
                                            <div className="mt-1">
                                                <div className="mb-1">
                                                    <label className="form-label font-12 fw-medium ">Upload Image</label>

                                                    <input type="file" className="form-control shadow-none font-12"
                                                        onChange={(e) => {
                                                            setImage(e.target.files[0]);
                                                        }
                                                        }
                                                    />
                                                </div>
                                                <label className="form-label font-12 fw-medium">Main Category Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control py-1 rounded-1 font-13 shadow-none bg-white"
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    value={category}
                                                />
                                                <div className="d-flex justify-content-between align-items-center mx-2 mt-2">
                                                    <input type="checkbox"
                                                        onChange={() => setYN(!YN)}
                                                        checked={YN}
                                                    />
                                                    <p className="font-13 me-5">Are you sure?</p>
                                                    <button
                                                        disabled={!YN}
                                                        onClick={handleAddCategory}
                                                        className="btn_small px-3 py-1 font-13"
                                                    >Add</button>
                                                </div>
                                            </div>

                                        )}
                                    </div>



                                    {categoryList.map((category) => (
                                        <button
                                            key={category.id}
                                            className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeCategory === category.id ? "btn_active" : "btn_inactive"}`}
                                            onClick={() => setActiveCategory(category.id)}
                                        >
                                            {category.category_name}
                                            <i className="fa-solid fa-angle-right"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sub category */}

                            {activeCategory &&
                                <div className="col-lg-2 px-0 custom_border">
                                    <div className=" mt-2 mx-2" >
                                        <div className="card rounded-1 p-2 my-2">
                                            <button
                                                onClick={() => setShowAddSubCat(!showAddSubCat)}
                                                className="btn_primary w-100 py-2 font-14 d-flex justify-content-center align-items-center gap-2"
                                            >
                                                <p> Add Sub Category</p>
                                                {showAddSubCat ? (
                                                    <i className="fa-solid fa-chevron-down"></i>
                                                ) : (
                                                    <i className="fa-solid fa-chevron-up"></i>
                                                )}
                                            </button>
                                            {showAddSubCat && (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 rounded-1 font-13 shadow-none bg-white"
                                                        onChange={(e) => setSubCategory(e.target.value)}
                                                        value={subCategory}
                                                    />
                                                    <div className="d-flex justify-content-between align-items-center mx-2 mt-2">
                                                        <input type="checkbox"
                                                            onChange={() => setYNSub(!YNSub)}
                                                            checked={YNSub}
                                                        />
                                                        <p className="font-13 me-5">Are you sure?</p>
                                                        <button
                                                            disabled={!YNSub}
                                                            onClick={handleAddSubCategory}
                                                            className="btn_small px-3 py-1 font-13"
                                                        >Add</button>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                        {subCategoryList.map((subCategory) => (
                                            <button
                                                key={subCategory.id}
                                                className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeSubCategory === subCategory.id ? "btn_active2" : "btn_inactive2"}`}
                                                onClick={() => setActiveSubCategory(subCategory.id)}
                                            >
                                                {subCategory.sub_category_name}
                                                <i className="fa-solid fa-angle-right"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            }

                            {/* Sub sub category */}

                            {
                                activeCategory && activeSubCategory &&

                                <div className="col-lg-2 px-0 custom_border">
                                    <div className=" mt-2 mx-2" >
                                        <div className="card rounded-1 p-2 my-2">
                                            <button
                                                onClick={() => setShowAddProCat(!showAddProCat)}
                                                className="btn_primary w-100 py-2 font-14 d-flex justify-content-center align-items-center gap-2"
                                            >
                                                <p> Add Product Category</p>
                                                {showAddProCat ? (
                                                    <i className="fa-solid fa-chevron-down"></i>
                                                ) : (
                                                    <i className="fa-solid fa-chevron-up"></i>
                                                )}
                                            </button>
                                            {showAddProCat && (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 rounded-1 font-13 shadow-none bg-white"
                                                        onChange={(e) => setProductCategory(e.target.value)}
                                                        value={productCategory}
                                                    />
                                                    <div className="d-flex justify-content-between align-items-center mx-2 mt-2">
                                                        <input type="checkbox"
                                                            onChange={() => setYNSubSub(!YNSubSub)}
                                                            checked={YNSubSub}
                                                        />
                                                        <p className="font-13 me-5">Are you sure?</p>
                                                        <button
                                                            disabled={!YNSubSub}
                                                            onClick={handleAddProductCategory}
                                                            className="btn_small px-3 py-1 font-13"
                                                        >Add</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>



                                        {productCategoryList.map((productCategory) => (
                                            <button
                                                key={productCategory.id}
                                                className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeProductCategory === productCategory.id ? "btn_active3" : "btn_inactive3"}`}
                                                onClick={() => setActiveProductCategory(productCategory.id)}
                                            >
                                                {productCategory.product_category_name}
                                                <i className="fa-solid fa-angle-right"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            }
                            {/* col-lg-6 px-0 */}
                            <div className={`
                            ${!activeCategory && !activeSubCategory && !activeProductCategory && "col-lg-10 px-0"}
                            ${activeCategory && !activeSubCategory && !activeProductCategory && "col-lg-8 px-0"}
                            ${activeCategory && activeSubCategory && !activeProductCategory && "col-lg-6 px-0"}
                            ${activeCategory && activeSubCategory && activeProductCategory && "col-lg-6 px-0"}
                            
                            `}>
                                <div className=" border-start  overflow-auto h_fixedFIX">
                                    <div className="">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-lg-12 bg-white rounded-2">
                                                    <div className="row ">
                                                        <div className="col-lg-2 ps-4">
                                                            <p className="fs-5 pt-2 fw-500 mb-0 text-nowrap ">
                                                                Category : {category.category_name}
                                                            </p>
                                                            <p className="font-12 mb-3">Product List</p>
                                                        </div>
                                                        <div className="col-lg-8 px-0"></div>
                                                        <div className="col-lg-2 mt-3 ps-4">
                                                            <button
                                                                className="btn_danger "
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#exampleModalDelete${category.category_name}`}
                                                            >
                                                                <i className="fa fa-trash" /> Delete
                                                            </button>
                                                            <div
                                                                className="modal fade "
                                                                id={`exampleModalDelete${category.category_name}`}
                                                                tabIndex="-1"
                                                                aria-labelledby="exampleModalLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h1
                                                                                className="modal-title font-14"
                                                                                id="exampleModalLabel"
                                                                            >
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
                                                                                onClick={() =>
                                                                                    handleDelete(category.category_name)
                                                                                }
                                                                                className="btn_danger font-13"
                                                                                data-bs-dismiss="modal"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="card border min-vh-50">
                                                                <div className="card-head">
                                                                    <div className="row mt-2">
                                                                        <div className={`
                            ${!activeCategory && !activeSubCategory && !activeProductCategory && "col-lg-3 m-2 d-flex"}
                            ${activeCategory && !activeSubCategory && !activeProductCategory && "col-lg-4 m-2 d-flex"}
                            ${activeCategory && activeSubCategory && !activeProductCategory && "col-lg-4 m-2 d-flex"}
                            ${activeCategory && activeSubCategory && activeProductCategory && "col-lg-4 m-2 d-flex"}
                            `} >
                                                                            <input
                                                                                onChange={(e) => setSearchField(e.target.value)}
                                                                                type="text"
                                                                                className="form-control py-1 rounded-1 font-13 shadow-none bg-white rounded-end-0 "
                                                                            />
                                                                            <button
                                                                                className="btn_small py-2 px-2 border-0 rounded-0 rounded-end ">
                                                                                <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                                                                            </button>
                                                                        </div>
                                                                        <div className="col-lg-9 "></div>
                                                                    </div>
                                                                </div>
                                                                <div className="card-body px-0 pb-1">
                                                                    <DataTable
                                                                        className="px-0"
                                                                        columns={columns}
                                                                        data={categoryWiseProducts}
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
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
