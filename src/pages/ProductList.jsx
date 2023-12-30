import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../providers/AuthProvider";

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [update, setUpdate] = useState(0);
  const [result, setResult] = useState([]);
  const [allData, setAllData] = useState([]);

  const [searchField, setSearchField] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");

  createTheme({
    background: {
      default: "#f9f9e1",
    },
  });

  const customStyles = {
    rows: {
      style: { minWidth: "5%" },
    },
    headCells: {
      style: {
        backgroundColor: "#f9f9e1",
      },
    },
  };

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.product_id,
      sortable: true,
      minWidth: false,
      center: false,
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
    },
    {
      name: "Category",
      selector: (row) => row?.category?.name,
      width: "20%",
    },
    {
      name: "Brand",
      selector: (row) => row?.brand,
      width: "15%",
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.des,
    // },
    {
      name: "Quantity",
      selector: (row) =>
        row.qty,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      width: "10%",
    },
    {
      name: "Action",
      button: true,
      width: "10%",
      cell: (row) => (
        <>
          <Link to={`/product/${row.product_id}`}>
            <i className="fa-solid fa-eye fa-icon me-2 text-warning"></i>
          </Link>
          <button
            onClick={() => {
              setSelectedProduct(row.product_id)
              setSelectedProductName(row.pname)
            }}
            className="border-0 bg-transparent"
          >
            <i class="fa-regular fa-circle-right text-info"></i>
          </button>
        </>
      ),
    },
  ];

  const { userInfo } = useAuth();

  const [data, setData] = useState([]);
  console.log(data)
  const getAllProducts = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/product/getAllProductsForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (searchField) {
          setData(
            res.filter(
              (item) =>
                item.product_id.toLowerCase().includes(searchField) ||
                item.name
                  .toLowerCase()
                  .includes(searchField.toLowerCase())
            )
          );
        } else {
          setData(res);
        }
      })
      .catch((err) => console.log(err));
  };


  useEffect(() => {
    getAllProducts();
  }, [update, searchField]);

  const [productData, setProductData] = useState(null);
  const [productTotalQty, setProductTotalQty] = useState(null);

  const getProductData = () => {
    const data = new FormData();
    data.append("product_id", selectedProduct);
    fetch(`${import.meta.env.VITE_SERVER}/getProductById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setProductData(res);
        setProductTotalQty(
          res.variations.reduce((acc, variation) => acc + variation.qty, 0)
        );
      })
      .catch((err) => console.log(err));
  };

  const getStoreStockByProductId = () => {
    const data = new FormData();
    data.append("product_id", selectedProduct);
    fetch(`${import.meta.env.VITE_SERVER}/getAllStockProduct`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setAllData(res.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const processProductData = () => {
      const processedResult = {};

      allData.forEach((row) => {
        const {
          store_id,
          product_id,
          variation_id,
          product_name,
          product_qty,
          name,
        } = row;

        if (product_id === selectedProduct) {
          if (!processedResult[store_id]) {
            processedResult[store_id] = {
              store_id,
              name,
              product_name,
              variation: [],
            };
          }

          processedResult[store_id].variation.push({
            vID: variation_id,
            qty: product_qty,
          });
        }
      });

      setResult(Object.values(processedResult));
    };

    processProductData();
  }, [allData]);

  useEffect(() => {
    getProductData();
    getStoreStockByProductId();
  }, [selectedProduct]);


  return (
    <div className="container-fluid bg-light2">
      <div className="row p-2">
        <div className="col-lg-12 bg-white min-vh-81">
          <div className="row ">
            <div className="col-lg-12 border-bottom p-3">
              <p className="fs-5 pt-2 fw-600 mb-0">Product List</p>
              <div className="row align-items-center justify-content-between font-14">

                <div className="col-lg-7 d-flex align-items-center">
                  <p className="m-0">
                    Total product
                    <span class="badge text-bg-primary mx-2">
                      {" "}
                      {data?.length}
                    </span>
                  </p>
                  <p className="m-0">
                    Total Stock Quantity
                    <span class="badge text-bg-primary ms-2">
                      432423
                    </span>
                  </p>
                </div>
                {/* <div className="col-lg-4  ">     </div> */}

                <div className="col-lg-3 text-end d-flex ">
                  <input
                    onChange={(e) => setSearchField(e.target.value)}
                    type="text"
                    className="border  shadow-none  pos-input w-75"
                  />
                  <button className="btn_small serach-magnify px-3 border-0 rounded-0 rounded-end">
                    <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                  </button>
                </div>
                <div className="col-lg-2 text-end">
                  <Link to="/add-product" className="">
                    <button className="btn_primary w-100 text-white">
                      Add New Product

                    </button>
                  </Link>
                </div>

              </div>
            </div>
            <div className="col-lg-7 px-0 border-end min-vh-70">
              <div className="row">
                <div className="col-lg-12">
                  <div className="">
                    <div className="card-body px-0 pb-1">
                      <DataTable
                        columns={columns}
                        data={data}
                        dense
                        pagination
                        paginationPerPage={10}
                        center
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* { */}
            {/* selectedProduct &&  productData.variations &&  */}
            <div className="col-lg-5">
              <div className="">
                <div className="col-lg-12 p-0">
                  <div className="my-3">
                    <div className="">


                      {selectedProduct &&
                        productData.variations &&
                        productData?.variations[0].size &&
                        ["S", "M", "L", "XL", "XXL"].includes(
                          productData?.variations[0].size
                        ) ? (
                        <div className="">
                          <div className="">
                            {productData?.variations && (
                              <div className="px-2 pb-1 border-bottom">
                                <p className="font-14 fw-bold text-dark">
                                  {selectedProductName}
                                </p>
                                <span className="font-14 text-white rounded-pill bg-primary px-3">
                                  {selectedProduct}
                                </span>
                                <p className="font-12 fst-italic">Total
                                  Stock: {productTotalQty}
                                </p>
                              </div>
                            )}

                            <table class="table">
                              <thead className="text-center ">
                                {productData?.variations ? (
                                  <tr>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      S{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      M{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      L{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XL{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XXL{" "}
                                    </th>
                                  </tr>
                                ) : (
                                  <div>
                                    <p className="my-5">
                                      No Product Selected. Please select a
                                      product
                                    </p>
                                  </div>
                                )}
                              </thead>
                              {productData?.variations && (
                                <tbody>
                                  <tr className="text-center ">
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "S"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "S"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "M"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "M"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "L"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "L"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "XL"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "XL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "XXL"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "XXL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>

                          {result.map((storeInfo) => (
                            <div key={storeInfo.store_id} className="card mb-2">
                              <div className="pos-orange h-50 p-2 rounded-top-1">
                                <p className="text-white ps-2">
                                  Store : {storeInfo.name}
                                </p>
                              </div>
                              <table class="table">
                                <thead className="text-center ">
                                  <tr>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      S{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      M{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      L{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XL{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XXL{" "}
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr className="text-center ">
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "S"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "S"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "M"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "M"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "L"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "L"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "XL"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "XL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "XXL"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "XXL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // size number section
                        <div className="
                      ">
                          <div className="card mb-4 bg-bg-danger ">
                            {productData?.variations && (
                              <div className="pos-orange h-50 p-2 rounded-top-1">
                                <p className="text-white ps-2">
                                  Total Quantity : {productTotalQty}
                                </p>
                              </div>
                            )}

                            <table class="table">
                              <thead className="text-center ">
                                {productData?.variations ? (
                                  <tr>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="10%"
                                    >
                                      28{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      30{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      32{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      34{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      36{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      38{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="16%"
                                    >
                                      40{" "}
                                    </th>
                                  </tr>
                                ) : (
                                  <div>
                                    <p className="mt-4 ">
                                      No Product Selected. Please select a
                                      product
                                    </p>
                                  </div>
                                )}
                              </thead>
                              {productData?.variations && (
                                <tbody>
                                  <tr className="text-center ">
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "28"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "28"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "30"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "30"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "32"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "32"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "34"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "34"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "36"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "36"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "38"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "38"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {productData?.variations?.filter(
                                        (item) => item.size === "40"
                                      )[0]?.qty
                                        ? productData?.variations?.filter(
                                          (item) => item.size === "40"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>

                          {result.map((storeInfo) => (
                            <div key={storeInfo.store_id} className="card">
                              <div className="pos-orange h-50 p-2 rounded-top-1">
                                <p className="text-white ps-2">
                                  Store : {storeInfo.name}
                                </p>
                              </div>
                              <table class="table">
                                <thead className="text-center ">
                                  <tr>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      S{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      M{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      L{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XL{" "}
                                    </th>
                                    <th
                                      className="font-12"
                                      scope="col"
                                      width="20%"
                                    >
                                      XXL{" "}
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr className="text-center ">
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "S"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "S"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "M"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "M"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "L"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "L"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "XL"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "XL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                    <td className="border-0 mb-0 pb-0 font-12">
                                      {storeInfo.variation?.filter(
                                        (item) =>
                                          (item.vID.match(/\(([^)]+)\)/) ||
                                            [])[1] === "XXL"
                                      )[0]?.qty
                                        ? storeInfo.variation?.filter(
                                          (item) =>
                                            (item.vID.match(/\(([^)]+)\)/) ||
                                              [])[1] === "XXL"
                                        )[0]?.qty
                                        : 0}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* } */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
