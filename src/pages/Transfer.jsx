import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

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

const Transfer = () => {
  const columns = [
    {
      name: "",
      selector: (row) => "",
      width: "5%",
    },
    {
      name: "Product ID",
      selector: (row) => row.variation_id,
      width: "15%",
    },
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      width: "20%",
    },

    {
      name: "Quantity",
      selector: (row) => row.transfer_qty,
      sortable: true,
      width: "10%",
    },
    {
      name: "From",
      selector: (row) => row.store_from_name,
      width: "15%",
    },
    {
      name: "To",
      selector: (row) => row.store_to_name,
      width: "15%",
    },
    {
      name: "Transfer Date",
      selector: (row) => row.date,
      width: "20%",
    },

  ];
  const { userInfo } = useAuth();

  const [data, setData] = useState([]);
  const [transferTo, setTransferTo] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log(selectedProducts)
  const [date, setDate] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);


  const [selectedProductName, setSelectedProductName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQty, setAvailableQty] = useState();


  const [description, setDescription] = useState("");

  const [productData, setProductData] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState(0);
  const [searchField, setSearchField] = useState(null);

  const [selectedVariations, setSelectedVariations] = useState([]);

  const fields = [
    "Transfer To",
    "Product ID",
    "Product Name",
    "Transfer Date",
  ];

  const conditions = [
    transferTo === "",
    selectedProducts === "",
    selectedProductName === "",
    date === "",
  ];

  const getAllTransfers = () => {
    const data = new FormData();
    fetch(`${import.meta.env.VITE_SERVER}/admin/getAllMainTransferWithStoreName`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (searchField) {
          setData(
            res.message.filter(
              (item) =>
                item.variation_id.toLowerCase().includes(searchField) ||
                item.product_name
                  .toLowerCase()
                  .includes(searchField.toLowerCase())
            )
          );
        } else {
          setData(res.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDropDownStore = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/getAllStoreForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setStoreList(res);
      })
      .catch((err) => console.log(err));
  };


  const getSearchedProduct = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("searchTerm", searchText);
    fetch(`${import.meta.env.VITE_SERVER}/product/searchProduct`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setSearchedProducts(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSearchedProduct();
  }, [searchText]);


  useEffect(() => {
    getDropDownStore();
    getAllTransfers();
  }, [update, searchField]);

  console.log(searchedProducts)

  const handleMakeTransfer = (e) => {
    e.preventDefault();
    // for (let i = 0; i < conditions.length; i++) {
    //   if (conditions[i]) {
    //     // setLoader(false);
    //     toast.error(`Fill up the ${fields[i]} field!`);
    //     return false;
    //   }
    // }
    const data = new FormData();
    data.append("store_from", "motherStoreId001");
    data.append("store_to", transferTo);
    data.append("selectedProducts", JSON.stringify(selectedProducts));
    data.append("date", date);
    // data.append("variations", JSON.stringify(selectedVariations));

    fetch(`${import.meta.env.VITE_SERVER}/stock/transferProducts`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        toast.success("Product Transferred");
        // setUpdate(update + 1);
      })
      .catch((err) => console.log(err));
  };


  return (
    <div onClick={() => setShow(false)} className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-6 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0">Main Store To Branch</p>
              <p className="font-12 mb-2">Transfer history</p>
            </div>
            <div className="col-lg-4 px-0"></div>
            <div className="col-lg-2 mt-2 ps-4">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@mdo"
                className="btn_primary py-2"
              >
                Make a Transfer
              </button>

              <div
                className="modal fade "
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered ">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Make a Transfer
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      <form className="col-lg-12 ">
                        <div className="row">
                          {/* <div className="mb-2 col-lg-6">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label  font-14 fw-bold"
                            >
                              Transfer From
                            </label>
                            <input
                              className="form-control py-2 font-13 shadow-none bg-white"
                              value={storeInfo?.name}
                              disabled
                            />
                          </div> */}
                          <div className="mb-2 col-lg-12">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label font-14 fw-bold"
                            >
                              Transfer To
                            </label>
                            <select
                              className="form-control py-2 font-13 shadow-none "
                              onChange={(e) => setTransferTo(e.target.value)}
                            >
                              <option selected disabled value="">
                                Select Store
                              </option>
                              {storeList?.map((item) => (
                                <option
                                  key={item.store_id}
                                  value={item.store_id}
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="mb-2">
                          <label
                            htmlFor="message-text"
                            className="col-form-label font-14 fw-bold"
                          >
                            Search product
                          </label>
                          <input
                            className="form-control py-2 font-13 shadow-none bg-white"
                            id="message-text"
                            placeholder="Search Product"
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              setShow(true);
                            }}
                          />
                        </div>
                        {/* search items */}

                        {show ? (
                          <div
                            style={{
                              position: "absolute",
                              background: "white",
                              width: "90%",
                              left: "5%",
                              top: "46%",
                              padding: 10,
                            }}
                            className="shadow-lg mb-0 pb-0 bg-white  rounded"
                          >
                            {searchedProducts
                              .map((item, index) => (
                                <div
                                  key={item.product_id}
                                  className="pb-0 mb-2 ps-2 border-bottom"
                                  onClick={() => {
                                    // setSelectedProductName(item.name);
                                    // make array of product_id
                                    setSelectedProducts(
                                      selectedProducts.includes(item)
                                        ? [...selectedProducts]
                                        : [...selectedProducts, item]
                                    );
                                    setShow(false);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <p>
                                    {" "}
                                    {item.product_id} ({item.name})
                                  </p>
                                </div>
                              ))}
                          </div>
                        ) : null}

                        {/* search items */}

                        <div className="row">
                          <div className=" mb-2 col-lg-6-12 ">
                            <label
                              htmlFor="message-text"
                              className="col-form-label font-14 fw-bold"
                            >
                              Selected Products
                            </label>
                            {
                              selectedProducts?.map((item, i) => (
                                <div key={item.product_id} className="row">
                                  <div className="col-lg-4 mb-2">
                                    <input
                                      type="text"
                                      className="form-control py-2 font-13 shadow-none bg-white"
                                      value={item.name}
                                      disabled
                                    />
                                  </div>
                                  <div className="col-lg-4 pt-2">
                                    {
                                      item?.attributeIds.split(",").map((id, i) => (
                                        <p className="d-inline bg-success p-2 rounded-2 me-2">{id}</p>
                                      ))
                                    }

                                  </div>

                                  <div className="col-lg-4 mb-2">
                                    <input
                                      type="number"
                                      className="form-control py-2 font-13 shadow-none bg-white"
                                      id={`quantity-${item.product_id}`}
                                      placeholder="Quantity"
                                      onChange={(e) => {
                                        const productId = item.product_id;
                                        const quantity = parseInt(e.target.value);
                                        const updatedProducts = [...selectedProducts];
                                        const existingIndex = updatedProducts.findIndex((p) => p.product_id === productId);

                                        if (existingIndex !== -1) {
                                          // If product ID already exists, update the quantity
                                          updatedProducts[existingIndex].quantity = quantity;
                                        } else {
                                          // If product ID doesn't exist, add it to the array
                                          updatedProducts.push({ productId, quantity });
                                        }

                                        setSelectedProducts(updatedProducts);
                                      }}
                                    />
                                    <p className="text-center text-muted font-13 mt-1">Available: {item.qty}</p>
                                  </div>

                                </div>
                              ))
                            }
                          </div>

                        </div>
                        <div className="row">
                          <div className="col-lg-8 mb-2">
                            <label
                              htmlFor="message-text"
                              className="col-form-label font-14 fw-bold"
                            >
                              Available Product Variations
                            </label>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <label
                              htmlFor="message-text"
                              className="col-form-label font-14 fw-bold"
                            >
                              Transfer Quantity
                            </label>
                          </div>
                          {
                            productData.variations?.map((item, i) => (
                              <div key={item.vid} className="row">
                                <div className="col-lg-8 mb-2">
                                  <input
                                    type="text"
                                    className="form-control py-2 font-13 shadow-none bg-white"
                                    value={`Size - ${item.size}`}
                                    disabled
                                  />
                                </div>
                                <div className="col-lg-4 mb-2">
                                  <input
                                    type="number"
                                    className="form-control py-2 font-13 shadow-none bg-white"
                                    id={`quantity-${item.vid}`}
                                    placeholder="Quantity"
                                    onChange={(e) => {
                                      const variationId = item.vid;
                                      const quantity = parseInt(e.target.value);
                                      const updatedVariations = [...selectedVariations];
                                      const existingIndex = updatedVariations.findIndex((v) => v.variationId === variationId);

                                      if (existingIndex !== -1) {
                                        // If variation ID already exists, update the quantity
                                        updatedVariations[existingIndex].quantity = quantity;
                                      } else {
                                        // If variation ID doesn't exist, add it to the array
                                        updatedVariations.push({ variationId, quantity });
                                      }

                                      setSelectedVariations(updatedVariations);
                                    }}
                                  />
                                  <p className="text-center text-muted font-13 mt-1">Available: {item.qty}</p>
                                </div>
                              </div>
                            ))
                          }

                        </div>

                        <div className="col-lg-6 ">
                          <label
                            htmlFor="message-text"
                            className="col-form-label font-14 fw-bold"
                          >
                            Transfer Date
                          </label>
                          <input
                            type="date"
                            className="form-control py-2 font-13 shadow-none bg-white"
                            id="message-text"
                            // defaultValue={
                            //   new Date().toISOString().split("T")[0]
                            // }
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </div>

                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn_danger"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        data-bs-dismiss="modal"
                        onClick={handleMakeTransfer}
                        type="button"
                        className="btn_primary"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border min-vh-66">
                <div className="card-head">
                  <div className="row mt-2">
                    <div className="col-lg-3 ps-4 ">
                      <input
                        onChange={(e) => setSearchField(e.target.value)}
                        type="text"
                        className="border border-1 shadow-none pos-input"
                      />
                      <button className="btn_small px-2 border-0 rounded-0 rounded-end ">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                    <div className="col-lg-8"></div>
                    <div className="col-lg-1 px-0"></div>
                  </div>
                </div>
                <div className="card-body px-0 pb-1">
                  <DataTable
                    columns={columns}
                    data={data}
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
      </div >
    </div >
  );
};

export default Transfer;
