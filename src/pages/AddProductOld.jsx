import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from "../providers/AuthProvider";

const AddProductOld = () => {
  const { userInfo } = useAuth();

  console.log(userInfo, "userInfo");
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [productId, setProductId] = useState("");
  console.log(productId, "productId");
  const [resProductId, setResProductId] = useState(0);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  console.log(subCategory, "subCategory");
  const [productCategory, setProductCategory] = useState("");
  const [sizeType, setSizeType] = useState("letter");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  console.log(description, "description");
  const [index, setIndex] = useState(1);
  const [itemsArray, setItemsArray] = useState([]);


  const [images, setImages] = useState([null, null, null, null]);

  console.log(images);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };



  const conditions = [
    productName === "",
    productCategory === "",
    color === "",
    price === "",
    description === "",
  ];

  const fields = [
    "Product Name",
    "Product Category",
    "Color",
    "Price",
    "Description",
  ];

  const totalQuantity = itemsArray.reduce((acc, item) => {
    return acc + parseInt(item.quantity);
  }, 0);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);

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
          res.message.filter((item) => +item.category_id === +category)
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
        // console.log(res.message, "res.message");
        setProductCategoryList(
          res.message.filter((item) => +item.category_id === +category && +item.sub_category_id === +subCategory)
        );
      })
      .catch((err) => console.log(err));
  };


  const addVariant = (e) => {
    e.preventDefault();

    const existingIndex = itemsArray.findIndex(item => item.size === size);

    if (existingIndex !== -1) {
      const updatedItemsArray = [...itemsArray];
      updatedItemsArray[existingIndex].quantity = quantity;
      setItemsArray(updatedItemsArray);
    } else {
      const newObject = {
        size: size,
        quantity: quantity,
      };
      setItemsArray([...itemsArray, newObject]);
    }
    setSize("");
    setQuantity("");

    setIndex(index + 1);
  };


  const handleAddProduct = async (e) => {
    e.preventDefault();
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i]) {
        // setLoader(false);
        toast.error(`Fill up the ${fields[i]} field!`);
        return false;
      }
    }

    const imagePromises = images
      .filter((image) => image !== null)
      .map((image) => imageUpload(image));

    Promise.all(imagePromises)
      .then((imageLinks) => {
        console.log(imageLinks);

        const data = new FormData();
        data.append("product_id", productId);
        data.append("pname", productName);

        data.append("imgSrc_1", imageLinks[0]?.filename || "");
        data.append("imgSrc_2", imageLinks[1]?.filename || "");
        data.append("imgSrc_3", imageLinks[2]?.filename || "");
        data.append("imgSrc_4", imageLinks[3]?.filename || "");

        data.append("color", color);
        data.append("category_id", category);
        data.append("sub_category_id", subCategory);
        data.append("product_category_id", productCategory);
        data.append("price", price);
        data.append("des", description);
        data.append("store_id", userInfo.store_id);
        fetch(`${import.meta.env.VITE_SERVER}/addNewProduct`, {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message == true) {
              handleProductVariation(itemsArray);
              toast.success("Product added successfully");
              // setUpdate((prevUpdate) => prevUpdate + 1);
              navigate("/product-list");
            } else {
              toast.error("Failed to add product");
            }
          })
          .catch((err) => {
            toast.error("An error occurred while adding the Store");
          });
      })
      .catch((error) => {
        console.error(error);
      });


  };

  const handleProductVariation = (itemsArray) => {
    itemsArray?.map((item) => {
      const data = new FormData();
      data.append(
        "variation_id",
        productId + "(" + item.size.toUpperCase() + ")"
      );
      data.append("product_id", productId);
      data.append("size", item.size);
      data.append("qty", item.quantity);
      fetch(`${import.meta.env.VITE_SERVER}/addNewProductVariation`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    });
  };


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
        setProductId(`P${new Date().getFullYear() % 100}${data.message}`);
      })
      .catch((err) => console.error(err.message));
  };


  useEffect(() => {
    getLastProductId();
    getAllCategory();
    getAllSubCategory();
    getAllProductCategory();
  }, [category, subCategory, productCategory]);


  const imageUpload = async (img) => {
    const formData = new FormData()
    formData.append('img', img)
    const url = `https://app.nokshikathabd.com/server/addImage`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    const data2 = await response.json()
    return data2
  }


  // const handleAddImages = () => {
  //   console.log(images);

  //   const imagePromises = images
  //     .filter((image) => image !== null)
  //     .map((image) => imageUpload(image));

  //   Promise.all(imagePromises)
  //     .then((imageLinks) => {
  //       console.log(imageLinks);
  //       setImageLinks(imageLinks);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

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
                                  setCategory(e.target.value)
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
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.category_name}
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
                                  setSubCategory(e.target.value)
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
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.sub_category_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6 py-2 ">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Product Category
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) =>
                                  setProductCategory(e.target.value)
                                }
                                placeholder="Choose category"
                                id="cars"
                              >
                                <option selected disabled value="">
                                  Choose Category
                                </option>
                                {productCategoryList.map((item) => {
                                  return (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.product_category_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>

                          <div className="col-lg-12 py-2 ">
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
                                Color
                              </label>
                              <input
                                type="color"
                                placeholder="Choose color"
                                className="form-control form-control-color rounded-1 font-13 shadow-none w-100"
                                style={{ height: "5.5vh" }}
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
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
          <div className="row d-flex align-items-center ">
            <div className="col-lg-4">
              <p className="fw-bold mb-3 ">Size Type</p>
              <div className="d-flex justify-content-start align-items-center gap-3 ">
                <div className="form-check mb-1">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="flexRadioDefault1"
                    id="flexRadioDefault1"
                    onChange={
                      () => {
                        setSizeType("letter")
                      }
                    }
                    checked={sizeType === "letter" ? true : false}
                  />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Letter
                  </label>
                </div>
                <div className="form-check mb-1">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="flexRadioDefault1"
                    id="flexRadioDefault1"
                    onChange={
                      () => {
                        setSizeType("number")
                      }
                    }
                    checked={sizeType === "number" ? true : false}
                  />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Number
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-4 py-2 ">
              {
                sizeType === "letter" ? (
                  <div className="mb-1 text-muted">
                    <label className="form-label addempfont">Size (Letter)</label>
                    <select
                      className="form-control py-2 font-13 shadow-none"
                      onChange={(e) => setSize(e.target.value)}
                      value={size}
                      placeholder="Choose size"
                      id="size"
                    >
                      <option className="shadow-none" value="volvo">
                        Choose Size
                      </option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                ) : (
                  <div className="mb-1 text-muted">
                    <label className="form-label addempfont">Size (Number)</label>
                    <select
                      className="form-control py-2 font-13 shadow-none"
                      onChange={(e) => setSize(e.target.value)}
                      value={size}
                      placeholder="Choose size"
                      id="size"
                    >
                      <option className="shadow-none" value="volvo">
                        Choose Size
                      </option>
                      <option value="28">28</option>
                      <option value="30">30</option>
                      <option value="32">32</option>
                      <option value="34">34</option>
                      <option value="36">36</option>
                      <option value="38">38</option>
                      <option value="40">40</option>
                    </select>
                  </div>
                )
              }
            </div>

            <div className="col-lg-4 py-2">
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
            <div className="col-lg-4">
              <button
                onClick={addVariant}
                className="btn_active3 w-100 py-2 mt-4"
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
                  {/* <div className="col-3">
                                      <label className="form-label fw-bold label1">
                                        Color
                                      </label>
                                    </div> */}
                  <div className="col-2">
                    <label className="form-label fw-bold label1">Size</label>
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
                    {/* <div className="col-3">
                                        <p className="form-label label1">{item.color}</p>
                                      </div> */}
                    <div className="col-2">
                      <p className="form-label label1 ms-2"> {item.size}</p>
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

          {/* <div>
            <input
            onChange={(e) => setImage2(e)}
            type="file" />
            <button onClick={()=> handleAddImages()}>upload image</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AddProductOld;
