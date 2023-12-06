import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend, Label } from "recharts";
import { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";
import { UserInfoContext, useAuth } from "../providers/AuthProvider";

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
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
};

const columns2 = [
  {
    name: "Product Id",
    selector: (row) => row.variation_id,
    sortable: true,
    minWidth: false,
    center: true,
  },
  {
    name: "Product Name",
    selector: (row) => row.product_name,
  },
  {
    name: "Store",
    selector: (row) => row.name,
  },
  {
    name: "Quantity",
    selector: (row) => row.product_qty,
    sortable: true,
  },
];

const Dashboard = () => {
  const columns = [
    {
      name: "Sale Id",
      selector: (row) => row.sale_id,
      minWidth: false,
      center: true,
    },
    {
      name: "Store",
      selector: (row) => row.store_name,
    },
    {
      name: "Quantity",
      selector: (row) => row.p_qty,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.p_price,
    },
  ];

  const { userInfo } = useAuth();

  const [data, setData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [allSalesInfoItem, setAllSalesInfoItem] = useState([]);
  const [todaysSaleInfoItem, setTodaysSaleInfoItem] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productAlert, setProductAlert] = useState([]);
  //filter data by todays date

  const todaysSale = allSalesInfoItem.filter((item) => {
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    return item.date.slice(0, 10) === today;
  });

  const todaySaleQuantity = todaysSale.reduce((acc, item) => {
    return acc + +item.p_qty;
  }, 0);

  const todaySaleAmount = todaysSale.reduce((acc, item) => {
    return acc + item.total_amount;
  }, 0);


  const [expenses, setExpenses] = useState([]);

  const todaysExpense = expenses.filter((item) => {
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    return item.cdate.slice(0, 10) === today;
  });

  const todaysExpenseAmount = todaysExpense.reduce((acc, item) => {
    return acc + item.expense_amount;
  }, 0);


  // const handleSalesInfoItemByDate = (e) => {
  //   const date = new Date(e.target.value);
  //   const todaySale = allSalesInfoItem.filter((item) => {
  //     const today = date?.toISOString().slice(0, 10);
  //     return item.date.slice(0, 10) === today;
  //   });
  //   setTodaysSaleInfoItem(todaySale);
  // };

  const getExpenses = () => {
    const data = new FormData();
    fetch(`${import.meta.env.VITE_SERVER}/getAllExpenses`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setExpenses(res.message);
      })
      .catch((err) => console.log(err));
  };

  // const todaySale = () => {
  //   fetch(`${import.meta.env.VITE_SERVER}/getAllSalesInfoItem`, {
  //     method: "POST",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const date = new Date();
  //       const today = date.toISOString().slice(0, 10);
  //       if (selectedStore || selectedCategory) {
  //         const storeData = res.message.filter((item) => {
  //           return (
  //             item.date.slice(0, 10) === today &&
  //             item.store_id === selectedStore &&
  //             item.category === selectedCategory
  //           );
  //         });
  //         setData(storeData);
  //       } else {
  //         const storeData = res.message.filter((item) => {
  //           return item.date.slice(0, 10) === today;
  //         });
  //         setData(storeData);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getAllSalesInfoItemByStoreId = () => {
    const data = new FormData();
    data.append("store_id", userInfo.store_id);
    fetch(`${import.meta.env.VITE_SERVER}/getAllSalesInfoItem`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setAllSalesInfoItem(res.message);
        setData(
          res.message.filter((item) => {
            const date = new Date();
            const today = date.toISOString().slice(0, 10);
            return item.date.slice(0, 10) === today;
          })
            .filter((item) => {
              if (!selectedStore && !selectedCategory) {
                return item;
              }
              else if (!selectedStore) {
                return item.category === selectedCategory;
              }
              else if (!selectedCategory) {
                return item.store_id === selectedStore;
              }
              else {
                return (
                  item.store_id === selectedStore &&
                  item.category === selectedCategory
                );
              }
            })
        );
      })
      .catch((err) => console.log(err));
  };

  const getDropDownStore = () => {
    const data = new FormData();
    data.append("store_id", userInfo.store_id);
    fetch(`${import.meta.env.VITE_SERVER}/getAllGeneralStores`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreList(res.message);
      })
      .catch((err) => console.log(err));
  };
  const getAllCategories = () => {
    const data = new FormData();
    data.append("store_id", userInfo.store_id);
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

  const getAllStockAlert = () => {
    fetch(`${import.meta.env.VITE_SERVER}/getAllStockAlert`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setProductAlert(res.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // todaySale();
    getAllSalesInfoItemByStoreId();

  }, [selectedStore, selectedCategory]);


  useEffect(() => {

    getAllStockAlert();
    getAllCategories();
    getExpenses();
    getDropDownStore();
  }, []);

  //chart
  const today = new Date()
  const td = today.toISOString().slice(0, 10);

  const cashMoney = allSalesInfoItem
    .filter(item => item.date.slice(0, 10) === td)
    .reduce((acc, item) => {
      if (item.pmode_c === "active") {
        return acc + item.c_amount;
      } else {
        return acc;
      }
    }, 0);

  const bankMoney = allSalesInfoItem
    .filter(item => item.date.slice(0, 10) === td)
    .reduce((acc, item) => {
      if (item.pmode_bc === "active") {
        return acc + item.bc_amount;
      } else {
        return acc;
      }
    }, 0);

  const otherMoney = allSalesInfoItem
    .filter(item => item.date.slice(0, 10) === td)
    .reduce((acc, item) => {
      if (item.pmode_o === "active") {
        return acc + item.o_amount;
      } else {
        return acc;
      }
    }, 0);


  const data2 = [
    { name: "Cash", value: cashMoney },
    { name: "Bank", value: bankMoney },
    { name: "Bkash/Nogod", value: otherMoney },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    value
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) - 5;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) + 10;


    return (
      value > 0 ? <text
        x={x}
        y={y}
        fill="white"
        fontSize="12px"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight={600}
      >
        {value} BDT
      </text> : null
    );
  };

  const PaymentPieChart = () => {
    return (
      <PieChart width={480} height={365} margin={{ top: 0, right: 0, bottom: 20, left: 30 }} >
        <Pie
          data={data2}
          cx={220}
          cy={180}
          innerRadius={50}
          outerRadius={120}
          fill="#8884d8"
          style={{ outline: 'none' }}
          paddingAngle={0}
          labelLine={false}
          label={renderCustomizedLabel}
          dataKey="value"
          animationDuration={700}
        >
          {data2.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="top" align='right' wrapperStyle={{ lineHeight: '20px' }} layout="vertical" />
        <Tooltip />
      </PieChart>
    );
  }


  return (
    <div className="container-fluid bg-light2">
      <div className="row p-2 px-1">
        <div className="col-lg-3 p-0">
          <div className="bg-white mx-1">
            <div className="card-body p-4">
              <h5 className="fs-1">{todaysSale.length}</h5>
              <div className="d-flex justify-content-start align-items-center gap-1 mt-2">
                <span className="d-block fs-5 text-muted ">
                  Todays Sale
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 p-0">
          <div className="bg-white mx-1">
            <div className="card-body p-4">
              <h5 className="fs-1">{parseInt(todaySaleQuantity)}</h5>
              <div className="d-flex justify-content-start align-items-center gap-1 mt-2">
                <span className="d-block fs-5 text-muted ">
                  Sell Quantity
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 p-0">
          <div className="bg-white mx-1">
            <div className="card-body p-4">
              <h5 className="fs-1">
                {parseFloat(todaySaleAmount).toFixed(2) + " BDT"}
              </h5>
              <div className="d-flex justify-content-start align-items-center gap-1 mt-2">
                <span className="d-block fs-5 text-muted ">
                  Sell Amount
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 p-0">
          <div className="bg-white mx-1">
            <div className="card-body p-4">
              <h5 className="fs-1">
                {parseFloat(todaysExpenseAmount).toFixed(2) + " BDT"}
              </h5>
              <div className="d-flex justify-content-start align-items-center gap-1 mt-2">
                <span className="d-block fs-5 text-muted ">
                  Todays Expense
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row p-2'>
        <div className="col-lg-4 p-0">
          <div className="bg-white border-end" style={{ minHeight: "60.3vh" }}>
            {/* chartjs */}
            <span className="ps-3 pt-3 d-block fw-medium  font-16 text-muted ">
              Payment Method
            </span>
            {
              allSalesInfoItem && allSalesInfoItem.
                filter(item => item.date.slice(0, 10) === td).
                length > 0 ? <PaymentPieChart /> : <div className="text-center py-5">No Data Found</div>
            }
          </div>
        </div>

        <div className="col-lg-4 p-0">
          <div className="bg-white border-end" style={{ minHeight: "60.3vh" }}>
            <div className="row p-3">
              <div className="col-lg-4">
                <p className="fs-6 fw-600 text-muted m-0">
                  Todays Sale
                </p>
              </div>

              <div className="col-lg-4">
                <select
                  className="form-control form-select font-12 shadow-none"
                  onChange={(e) => setSelectedStore(e.target.value)}
                  defaultValue="Select Category"
                >
                  <option disabled value="Select Category" >
                    Select Store
                  </option>
                  {/* <option  value="">
                              All Store
                            </option> */}
                  {storeList.map((item) => (
                    <option key={item.store_id} value={item.store_id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-4">
                <select
                  className="form-control form-select font-12 shadow-none"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  defaultValue="Select Category"
                >

                  <option disabled value="Select Category">
                    Select Category
                  </option>
                  {categoryList.map((item) => (
                    <option key={item.id
                    } value={item.category_name}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DataTable

              className="px-0 "
              columns={columns}
              data={data}
              pagination
              paginationPerPage={4}
              dense
              center
              customStyles={customStyles}
            />
          </div>
        </div>

        <div className="col-lg-4 p-0">
          <div className="bg-white" style={{ minHeight: "60.3vh" }}>
            <p className="fs-6 fw-600 text-muted p-3">
              Stock Out Soon
            </p>
            <DataTable
              className="px-0"
              columns={columns2}
              data={productAlert}
              dense
              center
              pagination
              paginationPerPage={4}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
