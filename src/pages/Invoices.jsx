import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { UserInfoContext } from "../providers/AuthProvider";

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

const Invoices = () => {
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date.split("T")[0],
      sortable: true,
      minWidth: false,
      center: true,
      width: "15%",
    },
    {
      name: "Invoice ID",
      selector: (row) => row.sale_id,
      sortable: true,
      minWidth: false,
      center: true,
      width: "25%",
    },

    {
      name: "Quantity",
      selector: (row) => row.p_qty,
      sortable: true,
      width: "15%",
    },
    {
      name: "Price",
      selector: (row) => row.total_amount + " BDT",
      sortable: true,
      width: "30%",
    },
    {
      name: "Action",
      button: true,
      width: "15%",
      cell: (row) => (
        <>
          <button
            className="btn_small w-50 "
            onClick={() => handleSelect(row.sale_id)}
          >
            <i className="fa-solid fa-chevron-right fa-lg fa-icon white"></i>
          </button>
          <button
            className="btn_small w-50 mx-2"
            data-bs-toggle="modal"
            data-bs-target={`#exampleModalPrint${row.sale_id}`}
          >
            <i className="fa-solid fa-print fa-lg fa-icon white"></i>
          </button>

          <div
            className="modal fade "
            id={`exampleModalPrint${row.sale_id}`}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title font-14" id="exampleModalLabel">
                    Confirm
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
                    <p className="mb-0">Are you sure you want to print this invoice?</p>
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
                    onClick={() => handlePrint(row.sale_id)}
                    className="btn_green font-13"
                    data-bs-dismiss="modal"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            className="btn_small w-50 me-2"
            data-bs-toggle="modal"
            data-bs-target={`#exampleModalDelete${row.sale_id}`}
          >
            <i className="fa-solid fa-trash fa-lg fa-icon white"></i>
          </button>
          <div
            className="modal fade "
            id={`exampleModalDelete${row.sale_id}`}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title font-14" id="exampleModalLabel">
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
                    onClick={() => handleDelete(row.sale_id, row.p_var, row.p_qty)}
                    className="btn_danger font-13"
                    data-bs-dismiss="modal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];
  const { userInfo, storeInfo } = useContext(UserInfoContext);
  // console.log(userInfo, storeInfo);
  const [storeList, setStoreList] = useState([]);
  const [store, setStore] = useState(null);
  const [update, setUpdate] = useState(0);
  const [allInvoiceInfoItem, setAllInvoiceInfoItem] = useState([]);
  console.log(allInvoiceInfoItem);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const getDropDownStore = () => {
    const data = new FormData();
    data.append("store_id", "0");
    fetch(`${import.meta.env.VITE_SERVER}/admin/getAllGeneralStores`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreList(res.message);
      })
      .catch((err) => console.log(err));
  };

  const getAllSalesInfoItemByStoreId = () => {
    const data = new FormData();
    fetch(`${import.meta.env.VITE_SERVER}/admin/getAllSalesInfoItem`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.message);
        if (selectedDate) {
          const filteredData = res.message.filter((item) => {
            const itemDate = new Date(item.date).toISOString().slice(0, 10); // Extract date in "YYYY-MM-DD" format
            return itemDate === selectedDate && item.store_id === store;
          });
          setAllInvoiceInfoItem(filteredData);
        } else {
          setAllInvoiceInfoItem(res.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const [invoice, setInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSelect = (id) => {
    console.log(id);
    const data = new FormData();
    data.append("sale_id", id);

    fetch(`${import.meta.env.VITE_SERVER}/admin/getInvoiceForStore`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setSelectedInvoice(res);
      })
      .catch((err) => console.log(err));
  };

  const handlePrint = (id) => {
    console.log(id);
    const data = new FormData();
    data.append("sale_id", id);

    fetch(`${import.meta.env.VITE_SERVER}/admin/getInvoiceForStore`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setInvoice(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (invoice) {
      window.print();
    }
  }, [invoice]);


  useEffect(() => {
    getAllSalesInfoItemByStoreId();
  }, [update, selectedDate, store]);

  useEffect(() => {
    getDropDownStore();
  }, []);

  const handleDelete = (sale_id, p_var, p_qty) => {
    const data = new FormData();
    data.append("sale_id", sale_id);
    data.append("p_var", p_var);
    data.append("p_qty", p_qty);

    fetch(`${import.meta.env.VITE_SERVER}/admin/deleteInvoiceById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          toast.success(res.message);
          setUpdate(update + 1);
        }
        else {
          toast.error("Something went wrong");
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="container-fluid  noprint">
        <div className="row">
          <div className="col-lg-12 bg-white rounded-2">
            <div className="row mt-2">
              <div className="col-lg-2 ps-4">
                <span className="fs-5 pt-2 fw-600 mb-0">Invoices History</span> <span class="badge font-13 ms-2 text-bg-primary">{allInvoiceInfoItem?.length}</span>
                <p className="font-12 mb-2">Invoices List</p>
              </div>
              <div className="col-lg-3 d-flex gap-3">
                <input type="date"
                  className="ps-4 form-control font-14 p-2 my-2 rounded-1 shadow-none"
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                />
                <select
                  className="ps-4 form-control font-14 p-2 my-2 rounded-1 shadow-none"
                  onChange={(e) => setStore(e.target.value)}
                >
                  <option className="fw-bold" selected disabled value="">
                    Select Store
                  </option>
                  {storeList.map((item) => (
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

            <div className="row">
              <div className="col-lg-6">
                <div className="card border min-vh-66">
                  <div className="card-head">
                    <div className="row mt-2">
                    </div>
                  </div>
                  <div className="card-body px-0 pb-1">
                    <DataTable
                      className="px-0"
                      columns={columns}
                      //filterout duplicate sale_id  
                      data={allInvoiceInfoItem && allInvoiceInfoItem.filter((item, index, self) =>
                        index === self.findIndex((t) => (
                          t.sale_id === item.sale_id
                        ))
                      )
                      }
                      dense
                      pagination
                      paginationPerPage={6}
                      center
                      customStyles={customStyles}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">

                {
                  selectedInvoice ? (
                    <>
                      <div className="row ">
                        <div className="col-lg-12">
                          <div className="card border min-vh-66 p-4">
                            <div className="card-head">
                              <div className="row mt-2">
                                <div className="col-lg-12">
                                  <span className="fs-5 pt-2 fw-600 mb-0">Invoice Details</span>
                                  <p className="font-12 mb-2">Invoice Details ({selectedInvoice.info[0].sale_id})</p>
                                </div>
                              </div>
                            </div>
                            <div className="card-body px-0 pb-1">
                              <table className="table mt-2 ">
                                <thead>
                                  <tr className=" border-top border-bottom border-dark  ">
                                    <th
                                      scope="col"
                                      className="border-0 font-12  font-weight-600 text-superdark"
                                      width="55%"
                                    >
                                      Product
                                    </th>

                                    <th
                                      scope="col"
                                      className="border-0 font-12  font-weight-600 text-superdark"
                                      width="15%"
                                    >
                                      Size
                                    </th>
                                    <th
                                      scope="col"
                                      className="border-0 font-12  font-weight-600 text-superdark ps-4"
                                      width="10%"
                                    >
                                      Qty
                                    </th>
                                    <th
                                      scope="col"
                                      className="border-0 font-12  font-weight-600 text-superdark text-end "
                                      width="20%"
                                    >
                                      Price
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="border-0">
                                  {selectedInvoice?.item?.map((item, index) => (
                                    <tr key={item.id} className="border-bottom">
                                      <td width="55%" className="border-0 font-12 text-superdark">
                                        {item.p_name} <br />
                                        {item.p_var}
                                      </td>
                                      <td
                                        width="15%"
                                        className="border-0 font-12 ps-3 text-superdark "
                                      >
                                        {item.p_size}
                                      </td>

                                      <td
                                        width="10%"
                                        className="border-0 font-12 ps-4 text-superdark"
                                      >
                                        {item.p_qty}
                                      </td>

                                      <td width="20%" className="border-0 font-12 text-superdark">
                                        <p className="mb-0 px-0 font-weight-600 text-nowrap text-end ">
                                          {item.p_price.toFixed(2)} BDT
                                        </p>
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="">
                                    <td scope="col" className="border-0 font-10 "></td>
                                    <td scope="col" className="border-0 font-10 ps-3"></td>

                                    <td
                                      scope="col"
                                      className="border-0 font-14 ps-4 text-superdark"
                                    >
                                      Subtotal
                                    </td>

                                    <td className="border-0 font-14">
                                      <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                                        {(selectedInvoice?.info[0]?.subtotal).toFixed(2)} BDT
                                      </p>
                                    </td>
                                  </tr>

                                  <tr className="border-bottom">

                                    <td scope="col" className="border-0 font-10 "></td>
                                    <td scope="col" className="border-0 font-10 ps-3"></td>

                                    <td scope="col" className="border-0 font-14 ps-4 text-superdark">
                                      Discount
                                    </td>

                                    <td className="border-0 font-14">
                                      <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                                        {(selectedInvoice?.info[0]?.d_amount).toFixed(2)} BDT
                                      </p>
                                    </td>
                                  </tr>

                                  <tr className="">

                                    <td scope="col" className="border-0 font-10 "></td>
                                    <td scope="col" className="border-0 font-10 ps-3"></td>

                                    <td scope="col" className="border-0 font-14 ps-4 text-superdark fw-semibold ">
                                      Total
                                    </td>

                                    <td className="border-0 font-14 fw-semibold">

                                      <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                                        {(selectedInvoice?.info[0]?.total_amount).toFixed(2)} BDT
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </div>
                      </div>
                    </>


                  ) : (
                    <div className="row ">
                      <div className="col-lg-12">
                        <div className="card border min-vh-66 p-4">
                          <div className="card-head">
                            <div className="row mt-2">
                              <div className="col-lg-12">
                                <span className="fs-5 pt-2 fw-600 mb-0">Invoice Details</span>
                                <p className="font-12 mb-2">Invoice Details</p>
                              </div>
                            </div>
                          </div>
                          <div className="card-body px-0 pb-1">
                            <div className="font-14 ms-2">
                              <p className="mb-0">Select an invoice to view details</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* printable div */}
      {invoice?.info && invoice?.item && (
        <div
          style={{
            width: "275px",
            color: "#000000",
          }}
          className="printarea bg-white pb-4"
        >
          <img
            style={{ marginLeft: "110px" }}
            src="/nowbab.jpeg"
            alt=""
            className="invoice_icon"
          />
          <p className="font-14 text-center mt-2 ms-1">
            Nowbab
          </p>
          <p className="font-14 text-center mt-1 ms-2">
            <i class="fa-solid fa-location-dot"></i> {storeInfo.location}
          </p>
          <p className="font-14 text-center my-1 ms-2">
            {storeInfo.phone}
          </p>
          <p className="font-14 text-center my-2 ms-2">
            #{invoice?.info[0]?.sale_id}
          </p>
          <p className="font-12 text-start">
            Customer Name: {invoice?.info[0]?.customer_name}
          </p>
          <p className="font-12 text-start">
            Mobile Number: {invoice?.info[0]?.customer_phone}
          </p>

          <table className="table mt-2 ">
            <thead>
              <tr className=" border-top border-bottom border-dark  ">
                <th
                  scope="col"
                  className="border-0 font-12  font-weight-600 text-superdark"
                  width="55%"
                >
                  Product
                </th>

                <th
                  scope="col"
                  className="border-0 font-12  font-weight-600 text-superdark"
                  width="15%"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="border-0 font-12  font-weight-600 text-superdark ps-4"
                  width="10%"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="border-0 font-12  font-weight-600 text-superdark text-end "
                  width="20%"
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="border-0">
              {invoice?.item?.map((item, index) => (
                <tr key={item.id} className="border-bottom">
                  <td width="55%" className="border-0 font-12 text-superdark">
                    {item.p_name} <br />
                    {item.p_var}
                  </td>
                  <td
                    width="15%"
                    className="border-0 font-12 ps-3 text-superdark "
                  >
                    {item.p_size}
                  </td>

                  <td
                    width="10%"
                    className="border-0 font-12 ps-4 text-superdark"
                  >
                    {item.p_qty}
                  </td>

                  <td width="20%" className="border-0 font-12 text-superdark">
                    <p className="mb-0 px-0 font-weight-600 text-nowrap ">
                      {item.p_price.toFixed(2)} BDT
                    </p>
                  </td>
                </tr>
              ))}

              <tr className="">
                <td scope="col" className="border-0 font-10 "></td>
                <td scope="col" className="border-0 font-10 ps-3"></td>

                <td
                  scope="col"
                  className="border-0 font-14 ps-4 text-superdark"
                >
                  Subtotal
                </td>

                <td className="border-0 font-14">
                  <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                    {(invoice?.info[0]?.subtotal).toFixed(2)} BDT
                  </p>
                </td>
              </tr>

              <tr className="border-bottom">
                <td scope="col" className="border-0 font-10 "></td>
                <td scope="col" className="border-0 font-10 ps-3"></td>

                <td
                  scope="col"
                  className="border-0 font-14 ps-4 text-superdark"
                >
                  Discount
                </td>

                <td className="border-0 font-14">
                  <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                    {(invoice?.info[0]?.d_amount).toFixed(2)} BDT
                  </p>
                </td>
              </tr>

              <tr className="">
                <td scope="col" className="border-0 font-10 "></td>
                <td scope="col" className="border-0 font-10 ps-3"></td>

                <td
                  scope="col"
                  className="border-0 font-14 ps-4 text-superdark fw-semibold "
                >
                  Total
                </td>

                <td className="border-0 font-14 fw-semibold">
                  <p className="mb-0 px-0 font-weight-600 text-nowrap text-end text-superdark">
                    {(invoice?.info[0]?.total_amount).toFixed(2)} BDT
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{
            marginLeft: "5px",
          }} className="">
            <p className="font-12 fw-semibold  text-center pt-1 border-top  border-dark ">
              Vat Included with Price
            </p>
            <p className="font-10 text-center">
              No change on discount on any product.
            </p>
            <p className="font-10 text-center">
              No money refund on any product.
            </p>
            <p className="font-10 text-center mb-2">
              Regular product changeable within 7 days with invoice slip.
            </p>
            <p className="font-10 text-center">Thanks for shopping with us.</p>
            <p className="font-10 text-center link-underline mb-2">
              www.nowbab.com
            </p>
          </div>
          <div style={{
            marginLeft: "5px",
          }} className="">
            <p className=" text-center mb-2 font-12 text-center pt-1 border-top  border-dark">
              Powered By mPair Technologies LTD.
            </p>
          </div>
          {/* <div style={{
            marginLeft: "35px",
          }} className="ms-4 ps-4 font-12 text-center pt-1 border-top  border-dark ">
            Powered By mPair Technologies LTD.
          </div> */}
        </div>
      )}
    </>
  );
};

export default Invoices;
