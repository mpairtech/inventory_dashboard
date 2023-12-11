import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from "../providers/AuthProvider";

const AddProduct = () => {
  const { userInfo } = useAuth();
  console.log(userInfo, "userInfo");

  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const [productId, setProductId] = useState("");

  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  console.log(selectedCategory, "setSelectedCategory");

  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  console.log(selectedSubCategory, "selectedSubCategory");

  const [attributes, setAttributes] = useState("");

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [index, setIndex] = useState(1);
  const [itemsArray, setItemsArray] = useState([]);

  console.log(itemsArray, "itemsArray");

  const [images, setImages] = useState([null, null, null, null]);


  const totalQuantity = itemsArray.reduce((acc, item) => {
    return acc + parseInt(item.quantity);
  }, 0);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const getLastProductId = () => {
    const date = new Date();
    const year = String(date.getFullYear());
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/product/getLastProductId`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setProductId(
          `P${new Date().getFullYear() % 100}${data.message}`
        );
      })
      .catch((err) => console.error(err.message));
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
        console.log("main categories==> ", res);
        setCategoryList(
          res.filter((category) => category.parent_id === null)
        );
      })
      .catch((err) => console.log(err));
  };


  const getAllSubCategories = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("parent_id", selectedCategory);
    fetch(`${import.meta.env.VITE_SERVER}/product/getAllSubcategoriesForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("sub categories==> ", res);
        setSubCategoryList(res);
      })
      .catch((err) => console.log(err));
  };


  const addVariant = (e) => {
    e.preventDefault();
    const existingItem = itemsArray.find(item => item.attributes === attributes);

    if (existingItem) {
      const updatedItemsArray = itemsArray.map(item =>
        item.attributes === attributes ? { ...item, quantity: item.quantity + parseInt(quantity, 10) } : item
      );
      setItemsArray(updatedItemsArray);
    } else {
      const newObject = {
        attributes: attributes,
        quantity: parseInt(quantity, 10),
      };
      setItemsArray([...itemsArray, newObject]);
    }

    setAttributes("");
    setQuantity("");

  };



  const [attributeList, setAttributeList] = useState([]);

  const [selectedAttribute, setSelectedAttribute] = useState("");

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
  }, []);


  const [attributeValueList, setAttributeValueList] = useState([]);

  const getAllAttributeValues = () => {
    const data = new FormData();
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
  }, [selectedAttribute]);



  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log(itemsArray, "itemsArray");

    const data = new FormData();
    data.append("product_id", productId);
    data.append("name", productName);
    data.append("price", price);
    data.append("qty", +itemsArray[0]?.quantity);
    data.append("des", description);
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("categoryIds", selectedCategory + ", " + selectedSubCategory);
    data.append("attributeIds", itemsArray[0]?.attributes);
    data.append("categoryId", selectedSubCategory);
    data.append("user_id", userInfo?.user_id);

    // console log all the data
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    fetch(`${import.meta.env.VITE_SERVER}/product/addProduct`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.product_id) {
          toast.success("Product Added Successfully");
          navigate("/product-list");
        } else {
          toast.error("Failed to Add Product");
        }
      })

  };



  useEffect(() => {
    getLastProductId();
    getAllCategories();
  }, []);

  useEffect(() => {
    getAllSubCategories();
  }, [selectedCategory, selectedSubCategory]);


  return (
    <div className="container-fluid overflow-x-hidden bg-white min-vh-84">
      <div className="row">
        <div className="col-lg-6 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-4 ps-4">
              {/* <p className="font-12 mb-2">Add New Product</p> */}
            </div>
            <div className="col-lg-10 px-0"></div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className=" ">
                <div className="card-head">
                  <div className="row">
                    <div className="d-flex justify-content-center align-items-center ms-3">
                      <div className="row ">
                        <form id="formreset" className="row">
                          <div className="col-lg-12">
                            <div className="px-0 border-0 rounded">
                              <p className="fs-5 pt-2 fw-600 mb-2">
                                Add Product
                              </p>
                              <h6 className="pb-3 text-muted mid_font border-bottom font-14">
                                Product Information
                              </h6>
                            </div>
                          </div>

                          <div className="col-lg-6  py-2 ">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Product ID
                              </label>
                              <input
                                type="id"
                                disabled
                                value={productId}
                                placeholder="ex. 2023001"
                                className="form-control py-2 font-13 shadow-none bg-white"
                              />
                            </div>
                          </div>



                          <div className="col-lg-6 py-2 ">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Main Category
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                                placeholder="Choose category"
                                id="cars"
                              >
                                <option selected disabled value="">
                                  Choose Category
                                </option>
                                {categoryList.map((item) => {
                                  return (
                                    <option
                                      key={item.category_id}
                                      value={item.category_id}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6 py-2 ">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Sub Category
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) =>
                                  setSelectedSubCategory(e.target.value)
                                }
                                placeholder="Choose category"
                                id="cars"
                              >
                                <option selected disabled value="">
                                  Choose Category
                                </option>
                                {subCategoryList.map((item) => {
                                  return (
                                    <option
                                      key={item.category_id}
                                      value={item.category_id}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>

                          {subCategoryList.length > 0 && (
                            <div className="col-lg-6 py-2 ">
                              <div className="mb-1 text-muted">
                                <label className="form-label addempfont">
                                  Sub Sub Category
                                </label>
                                <select
                                  className="form-control py-2 font-13 shadow-none"
                                  onChange={(e) =>
                                    setSelectedSubCategory(e.target.value)
                                  }
                                  placeholder="Choose category"
                                  id="cars"
                                >
                                  <option selected disabled value="">
                                    Choose Category
                                  </option>
                                  {subCategoryList.map((item) => {
                                    console.log(item, "item")
                                    return (
                                      <option
                                        key={item?.subcategories[0].category_id}
                                        value={item?.subcategories[0].category_id}
                                      >
                                        {item?.subcategories[0].name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          )}

                          <div className="col-lg-6 py-2 ">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Product Name
                              </label>
                              <input
                                type="text"
                                placeholder="Enter product name"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setProductName(e.target.value)}
                              />
                            </div>
                          </div>



                          <div className="col-lg-6 py-2">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Price
                              </label>
                              <input
                                type="number"
                                placeholder="Enter price"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 py-2">
                            <div className="text-muted">
                              <label className="form-label addempfont pe-auto">
                                Description
                              </label>
                              <ReactQuill theme="snow"
                                value={description}
                                onChange={setDescription}
                                className=" font-13 shadow-none "
                                style={{
                                  height: "10vh",
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 mt-5">
                            <div className="text-muted">
                              <label className="form-label addempfont">
                                Product Image
                              </label>
                            </div>
                          </div>

                          <div className="d-flex justify-content-start align-items-center gap-4 mb-3">
                            {images.map((image, index) => (
                              <div key={index} className="py-2 pe-2  ">
                                <label
                                  htmlFor={`image${index}`}
                                  className="btn btn-light rounded-2 p-0"
                                >
                                  <input
                                    type="file"
                                    id={`image${index}`}
                                    style={{ display: "none" }}
                                    onChange={(event) =>
                                      handleImageUpload(event, index)
                                    }
                                  />
                                  <div
                                    className="d-flex align-items-center text-center"
                                    style={{ height: "20.3vh", width: "10vw" }}
                                  >
                                    {image ? (
                                      <img
                                        src={URL.createObjectURL(image)}
                                        alt="Selected Image"
                                        className="uploaded-image"
                                      />
                                    ) : (
                                      <span className="fs-4 fw-500 w-100">+</span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "54px" }} className="col-lg-6 py-0 mb-2 pe-4">
          <h6 className="pb-3 text-muted mid_font border-bottom font-14">
            Stock Variation
          </h6>

          <div className="row py-2">
            {attributeList.length > 0 && (
              attributeList.map((attribute) => (
                <div className="col-lg-2 py-2" key={attribute.attribute_id}>
                  <div className="mb-1 text-muted">
                    <label className="form-label addempfont">{attribute.name}</label>
                    <select
                      className="form-control py-2 font-13 shadow-none"
                      onChange={(e) => {
                        let attributesArray = attributes.split(', ');
                        attributesArray.push(e.target.value);
                        let newAttributes = attributesArray.join(', ');
                        setAttributes(newAttributes.startsWith(', ') ? newAttributes.slice(2) : newAttributes);
                      }}
                      // value={attributes}
                      placeholder="Choose size"
                      id="size"
                    >
                      <option className="shadow-none" value="">
                        Choose
                      </option>
                      {attributeValueList
                        .filter((item) => item.parent_id === attribute.attribute_id)
                        .map((item) => (
                          <option key={item.value} value={item.value}>{item.value}</option>
                        ))}
                    </select>
                  </div>
                </div>
              ))
            )}

            <div className="col-lg-2 py-2">
              <div className="mb-1 text-muted">
                <label className="form-label addempfont">Quantity</label>
                <input
                  type="text"
                  placeholder="Enter quantity"
                  className="form-control py-2 font-13 shadow-none"
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
                />
              </div>
            </div>

            <div className="col-lg-2 py-2 mt-2">
              <button
                onClick={addVariant}
                className="btn_active3 w-100 mt-4"
              >
                Add Variation
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-2 ">
            {itemsArray.length !== 0 && (
              <>
                <div
                  className="row mx-1 mt-2 p-1 pb-0 border  d-flex  justify-content-between"
                  style={{ backgroundColor: "#F9F9E1" }}
                >
                  <div className="col-1">
                    <label className="form-label fw-bold label1">SL</label>
                  </div>
                  <div className="col-2">
                    <label className="form-label fw-bold label1">Att Values</label>
                  </div>
                  <div className="col-2">
                    <label className="form-label fw-bold label1">
                      Quantity
                    </label>
                  </div>

                  <div className="col-1">
                    <label className="form-label fw-bold label1">Action</label>
                  </div>
                </div>
              </>
            )}
            {itemsArray?.map((item, index) => {
              return (
                <>
                  <div
                    className="row pt-1 mx-1 border-start border-end border-bottom d-flex  justify-content-between"
                    key={item.id}
                  >
                    <div className="col-1">
                      <p className="form-label label1 ms-2">{index + 1}</p>
                    </div>
                    <div className="col-2">
                      <p className="form-label label1 ms-2"> {item.attributes}</p>
                    </div>
                    <div className="col-2  ">
                      <p className="form-label label1 ms-3"> {item.quantity}</p>
                    </div>

                    <div className="col-1">
                      <i
                        className="fa-solid fa-xmark fa-icon text-danger ms-3 pointer"
                        onClick={() => {
                          const updatedItemsArray = [...itemsArray];
                          updatedItemsArray.splice(index, 1);
                          setItemsArray(updatedItemsArray);
                        }}
                      ></i>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="col-lg-12 mt-5">
            <div className="text-end">
              <button
                onClick={handleAddProduct}
                type="submit"
                className="btn_primary px-5"
              >
                {load ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;