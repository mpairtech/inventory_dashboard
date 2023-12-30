import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Barcode from "react-barcode";
import { toast } from "react-hot-toast";
import { formatDate, formatTime } from "../utils/utils";

const ProductView = () => {
  const { id: product_id } = useParams();
  console.log(product_id)
  const [update, setUpdate] = useState(0);
  const [productData, setProductData] = useState([]);
  console.log(productData);
  const [editProductData, setEditProductData] = useState([]);
  const [itemsArray, setItemsArray] = useState([]);
  const [updateView, setUpdateView] = useState(false);
  const [editVarView, setEditVarView] = useState(false);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");

  const makepdf = () => {
    var printContents = document.getElementById("printarea").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const handleDelete = (id) => {
    const data = new FormData();
    data.append("product_id", id);
    fetch(`${import.meta.env.VITE_SERVER}/deleteProductById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Product Deleted Successfully");
        setUpdate(update + 1);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateProduct = (id) => {
    const data = new FormData();
    data.append("product_id", editProductData.product_id);
    data.append("price", editProductData.price);
    data.append("des", editProductData.des);
    data.append("pname", editProductData.pname);

    fetch(`${import.meta.env.VITE_SERVER}/updateProductById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.message);
        setUpdate(update + 1);
        setUpdateView(!updateView)
      })
      .catch((err) => console.log(err));
  };

  const handleProductVariation = () => {
    itemsArray?.map((item) => {
      const data = new FormData();
      data.append(
        "variation_id",
        product_id + "(" + item.size.toUpperCase() + ")"
      );
      data.append("product_id", product_id);
      data.append("size", item.size);
      data.append("qty", item.qty);
      fetch(`${import.meta.env.VITE_SERVER}/addNewProductVariation`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setEditVarView(!editVarView)
          setUpdate(update + 1)

        })
        .catch((err) => console.log(err));
    });
  };


  const getProductData = () => {
    const data = new FormData();
    data.append("product_id", product_id);
    fetch(`${import.meta.env.VITE_SERVER}/product/getProductById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setProductData(res);
        setEditProductData(res)
        setItemsArray(res.variations)
      })
      .catch((err) => console.log(err));
  };

  const addVariant = (e) => {
    e.preventDefault();

    const existingIndex = itemsArray.findIndex(item => item.size === size);

    if (existingIndex !== -1) {
      const updatedItemsArray = [...itemsArray];
      updatedItemsArray[existingIndex].qty = quantity;
      setItemsArray(updatedItemsArray);
    } else {
      const newObject = {
        size: size,
        qty: quantity,
      };
      setItemsArray([...itemsArray, newObject]);
    }
    setSize("");
    setQuantity("");

  };


  useEffect(() => {
    getProductData();
  }, [update]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-4 ps-4">
              <p className="fs-5 py-2 fw-600 mb-0 text-nowrap ">
                Product View {productData?.product_id}
              </p>
            </div>
            <div className="col-lg-8 px-0"></div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border">
                <div className="card-head">
                  <div className="row mt-2"></div>
                </div>
                <div className="card-body min-vh-66 row container m-0">
                  <div className="col-lg-12 bg-white ">
                    <div className="row">
                      <div class="col-lg-6">
                        <p class="text-secondary fw-bold  border-bottom pb-2">
                          Basic Info
                        </p>
                        <table className="table ">
                          <tbody>
                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Product ID
                                </p>
                              </td>

                              <td>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {productData?.product_id}
                                </p>
                              </td>
                            </tr>
                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Product Name
                                </p>
                              </td>

                              <td>
                                {updateView ?
                                  <input className="mb-0 py-2 font-12 form-control " type="text"
                                    value={editProductData.name}
                                    onChange={(e) => {
                                      setEditProductData({ ...editProductData, name: e.target.value })
                                    }}
                                  /> :
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                    {productData?.name}
                                  </p>
                                }


                              </td>
                            </tr>

                            {/* <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Product color
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                    {productData.color}
                                  </p>
                                </div>
                              </td>
                            </tr> */}

                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Category
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                    {productData?.category?.name}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Price
                                </p>
                              </td>
                              <td>
                                <div>
                                  {updateView ?
                                    <input className="mb-0 py-2 font-12 form-control " type="text"
                                      value={editProductData?.price}
                                      onChange={(e) => {
                                        setEditProductData({ ...editProductData, price: e.target.value })
                                      }}
                                    /> :
                                    <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                      {productData?.price}
                                    </p>
                                  }

                                </div>
                              </td>
                            </tr>

                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Quantity
                                </p>
                              </td>
                              <td>
                                <div>
                                  <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">

                                   123
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2  align-middle py-2 font-12 fw-600 text-muted">
                                  Description
                                </p>
                              </td>
                              <td>
                                <div>
                                  {updateView ?
                                    <textarea className="mb-0 py-2 font-12 form-control " type="text"
                                      value={editProductData.des}
                                      onChange={(e) => {
                                        setEditProductData({ ...editProductData, des: e.target.value })
                                      }}
                                    /> :
                                    <div id="description" className="mb-0 align-middle py-2 text-muted ">
                                      <div dangerouslySetInnerHTML={{ __html: productData?.des }} />
                                    </div>
                                  }

                                </div>
                              </td>
                            </tr>
                            <tr className="">
                              <td>
                                <p className="mb-0 ms-2  align-middle py-2 font-12 fw-600 text-muted">
                                  Images
                                </p>
                              </td>
                              <td>
                                <div className="d-flex justify-content-start align-items-center gap-4 mb-3">


                                  {
                                    productData?.imageSrc1 !== "" && <div
                                      className="d-flex align-items-center text-center"
                                      style={{ height: "20.3vh", width: "10vw" }}
                                    >
                                      <img
                                        src={`${import.meta.env.VITE_IMG}${productData.imageSrc1}`}
                                        alt="Selected Image"
                                        className="uploaded-image"
                                      />
                                    </div>
                                  }
                                  {
                                    productData?.imageSrc2 !== "" && <div
                                      className="d-flex align-items-center text-center"
                                      style={{ height: "20.3vh", width: "10vw" }}
                                    >
                                      <img
                                        src={`${import.meta.env.VITE_IMG}${productData.imageSrc2}`}
                                        alt="Selected Image"
                                        className="uploaded-image"
                                      />
                                    </div>
                                  }
                                  {
                                    productData?.imageSrc3 !== "" && <div
                                      className="d-flex align-items-center text-center"
                                      style={{ height: "20.3vh", width: "10vw" }}
                                    >
                                      <img
                                        src={`${import.meta.env.VITE_IMG}${productData.imageSrc3}`}
                                        alt="Selected Image"
                                        className="uploaded-image"
                                      />
                                    </div>
                                  }
                                  {
                                    productData?.imageSrc4 !== "" && <div
                                      className="d-flex align-items-center text-center"
                                      style={{ height: "20.3vh", width: "10vw" }}
                                    >
                                      <img
                                        src={`${import.meta.env.VITE_IMG}${productData.imageSrc4}`}
                                        alt="Selected Image"
                                        className="uploaded-image"
                                      />
                                    </div>
                                  }




                                </div>

                              </td>
                            </tr>
                            {/* <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Status
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {productData.status}
                                </p>
                              </td>
                            </tr> */}
                            <tr>
                              <td>
                                <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                  Added Date
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {formatDate(productData?.createdAt)}
                                </p>
                              </td>
                            </tr>
                            <tr></tr>
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-between" >
                          {
                            !updateView ? <p
                              type="button"
                              onClick={() => setUpdateView(!updateView)}
                              className="text-primary fw-semibold link-underline-danger mt-1 font-12 border-primary border-bottom pointer"
                            >
                              Update Product
                            </p> :
                              <p></p>
                          }

                          {updateView ?
                            <div className="d-flex">
                              <p
                                type="button"
                                onClick={handleUpdateProduct}
                                className="me-3 text-success fw-semibold link-underline-success mt-1 font-12 border-primary border-bottom pointer"
                              >
                                Save
                              </p>
                              <p
                                type="button"
                                onClick={() => setUpdateView(!updateView)}
                                className="text-primary fw-semibold link-underline-info mt-1 font-12 border-primary border-bottom pointer"
                              >
                                Cancel
                              </p>
                            </div>
                            :
                            <p
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target={`#exampleModalDelete`}
                              className="text-danger fw-semibold link-underline-danger mt-1 font-12 border-danger border-bottom pointer"
                            >
                              Delete Product
                            </p>
                          }
                        </div>
                        <div
                          className="modal fade "
                          id={`exampleModalDelete`}
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
                                  onClick={() => handleDelete(product_id)}
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
                      <div class="col-lg-6 ">
                        <div className="d-flex border-bottom justify-content-between">
                          <p class="text-secondary fw-bold  pb-2">
                            Variation Info
                          </p>
                          {
                            editVarView ? <p onClick={handleProductVariation} class="text-primary fw-bold   pb-2 pointer">
                              Update
                            </p> :
                              <p onClick={() => setEditVarView(!editVarView)} class="text-primary fw-bold   pb-2 pointer">
                                Edit
                              </p>

                          }
                        </div>
                        {

                          editVarView ?
                            <>
                              <div className="row d-flex align-items-center ">
                                <div className="col-lg-4 py-2 ">
                                  <div className="mb-1 text-muted">
                                    <label className="form-label addempfont">Size</label>
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
                                    className="btn_green btn-sm w-100 py-2 mt-4"
                                  >
                                    Add Variation
                                  </button>
                                </div>
                              </div>
                              <div className="mb-3 rounded-2 ">
                                {itemsArray.length !== 0 && (
                                  <>
                                    <div
                                      className="row mx-1 ps-2 mt-2 p-1 pb-0 border  d-flex  justify-content-between"
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

                                      <div className="col-2">
                                        <label className="form-label fw-bold label1">Action</label>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {itemsArray?.map((item, index) => {
                                  return (
                                    <>
                                      <div
                                        className="row pt-1 mx-1 ps-1 border-start border-end border-bottom d-flex  justify-content-between"
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
                                          <p className="form-label label1 ms-3"> {item.qty}</p>
                                        </div>

                                        <div className="col-2">
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

                            </>

                            :

                            productData?.variations?.map((item, index) => (
                              <div className="d-flex justify-content-between align-items-center gap-4 border-bottom">
                                <div className="pt-2">
                                  <span className="ms-4">Size : {item.size}</span>
                                  <span className="ms-4">
                                    Quantity : {item.qty}
                                  </span>
                                  <div
                                    style={{}}
                                    id="printarea"
                                    class="bg-light barcodeArea py-2 text-center "
                                  >
                                    <Barcode
                                      value={item.vid}
                                      width={1}
                                      height={60}
                                    />
                                  </div>
                                </div>
                                <Link
                                  className="btn_small font-14 px-3"
                                  to={`/print/${item.vid}`}
                                >
                                  Print Barcode
                                </Link>
                              </div>
                            ))


                        }
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

export default ProductView;
