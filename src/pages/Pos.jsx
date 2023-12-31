import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { useAuth } from "../providers/AuthProvider";

const Pos = () => {
  const [updateCount, setUpdateCount] = useState(0);

  const myRef = useRef(null);
  const [show, setShow] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerShow, setCustomerShow] = useState(false);

  // Function to open the customer info modal
  const openCustomerModal = () => {
    setShowCustomerModal(true);
  };

  // Function to close the customer info modal
  const closeCustomerModal = () => {
    setShowCustomerModal(false);
  };
  const { userInfo } = useAuth();

  const [refTotal, setRefTotal] = useState();

  const [searchedProducts, setSearchedProducts] = useState([]);


  const [searchCustomerText, setSearchCustomerText] = useState("");
  const [searchText, setSearchText] = useState("");


  const [saleId, setSaleId] = useState("");

  const [allCustomers, setAllCustomers] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [dis, setDis] = useState(0);
  const [ultDiscountAmount, setUltDiscountAmount] = useState(0);
  const [cashMode, setCashMode] = useState("active");
  const [bankMode, setBankMode] = useState("inactive");
  const [otherMode, setOtherMode] = useState("inactive");
  const [bankAcc, setBankAcc] = useState("");
  console.log(bankAcc)
  const [bankAccCardType, setBankAccCardType] = useState("");
  const [otherAcc, setOtherAcc] = useState("");
  console.log(otherAcc)
  const [soldBy, setSoldBy] = useState("");
  const [referredBy, setReferredBy] = useState("");

  const [invoiceData, setInvoiceData] = useState({});


  const [cashAccList, setCashAccList] = useState([]);
  const [bankAccList, setBankAccList] = useState([]);
  const [otherAccList, setOtherAccList] = useState([]);
  console.log(cashAccList, bankAccList, otherAccList)
  const getAllAccounts = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/account/getAccountsForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setCashAccList(res.filter((item) => item.accountType === "CASH"));
        setBankAccList(res.filter((item) => item.accountType === "BANK"));
        setOtherAccList(res.filter((item) => item.accountType === "OTHER"));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getLastProductId = () => {
    fetch(`${import.meta.env.VITE_SERVER}/getLastAddedCustomer`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setCustomerId("C" + (new Date().getFullYear() % 100) + "00" + res.id);
      })
      .catch((err) => console.log(err));
  };

  const getLastInvoiceId = () => {
    fetch(`${import.meta.env.VITE_SERVER}/getLastAddedSales`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setSaleId("IN" + (new Date().getFullYear() % 100) + "00" + res.id);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getLastProductId();
    getLastInvoiceId();
  }, []);

  const handleAddNewCustomer = () => {
    const data = new FormData();
    // data.append("c_id", customerId ?? "C" + (new Date().getFullYear() % 100) + "00" + Math.floor(Math.random() * 1000000) + 1);
    data.append("name", customerName);
    data.append("number", customerMobile);
    data.append("address", customerAddress);
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("user_id", userInfo.user_id);
    // field validation
    if (customerName === "") {
      toast.error("Customer name is required !");
      return;
    }
    if (customerMobile === "") {
      toast.error("Customer phone is required !");
      return;
    }
    if (customerAddress === "") {
      toast.error("Customer address is required !");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER}/customer/addCustomer`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.name) {
          setCustomerName("");
          setCustomerMobile("");
          setCustomerAddress("");
          toast.success("Customer added !");
        } else {
          toast.error(res.message);
        }
      }

      )
      .catch((err) => toast.error(err.message));

  };

  const getSearchCustomer = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("searchTerm", searchCustomerText);
    fetch(`${import.meta.env.VITE_SERVER}/customer/getSearchCustomers`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setAllCustomers(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSearchCustomer();
  }, [searchCustomerText]);


  const [employeeList, setEmployeeList] = useState([]);

  const getAllEmployee = () => {
    const data = new FormData();
    data.append("store_id", userInfo.store_id);
    fetch(`${import.meta.env.VITE_SERVER}/getAllEmployeeByStoreId`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setEmployeeList(res.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllEmployee();
  }, [userInfo.store_id]);


  const [discountPercent, setDiscountPercent] = useState("active");
  const [fixedDiscount, setFixedDiscount] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [otherAmount, setOtherAmount] = useState("");

  useEffect(() => {
    //get the total amount from myRef
    if (myRef.current) {
      setRefTotal(parseFloat(myRef.current.innerText));
      setUltDiscountAmount(total - (total - total * (dis / 100)));
    }
  }, [dis, fixedDiscount, updateCount, items, cardAmount, cashAmount, otherAmount]);


  useEffect(() => {
    if (localStorage.getItem("items") != null) {
      setItems(JSON.parse(localStorage.getItem("items")));
      var i = 0;
      JSON.parse(localStorage.getItem("items")).map((item) => {
        i = i + item.quantity * item.price;
      });
      setTotal(i.toFixed(2));
    } else {
      setItems([]);
      setTotal(0);
      setDis(0);
      // setVat(0);
    }
  }, [updateCount]);


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
        setSearchedProducts(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSearchedProduct();
  }, [searchText]);

  function addToLocalCart(p_id, name, imageSrc1, quantity, price, total_quantity, attributeIds, des) {
    var productItem = {
      p_id: p_id,
      name: name,
      imageSrc1: imageSrc1,
      quantity: quantity,
      price: price,
      total_quantity: total_quantity,
      attributeIds: attributeIds,
      des: des,
    };
    var items = [];

    if (localStorage.getItem("items") == null) {
      items.push(productItem);
      localStorage.setItem("items", JSON.stringify(items));
    } else {
      var productItemArray = JSON.parse(localStorage.getItem("items"));
      productItemArray.push(productItem);
      localStorage.setItem("items", JSON.stringify(productItemArray));
    }
    setUpdateCount(updateCount + 1);
    document.getElementById("fname").value = "";
  }

  function clearCart() {
    localStorage.removeItem("items");
    setUpdateCount(updateCount + 1);

    toast.success("Cart cleared!", {
      icon: "✅",
    });

    setTotal(0);
    setDis(0);
    // setVat(0);
    setCashAmount("");
    setCardAmount("");
    setOtherAmount("");
    setFixedDiscount("");
    setUltDiscountAmount(0);
  }

  document.body.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      document.getElementById("fname").focus();
      var i = document.getElementById("fname").value;

      searchedProducts.map((item) => {
        if (item.id == i) {
          addToLocalCart(item.product_name, 10, 10, 10, 10);
        }
      });
    }
  });

  console.log(refTotal)
  console.log(+cashAmount + +cardAmount + +otherAmount)

  function handleSubmitSale() {
    if (refTotal !== +cashAmount + +cardAmount + +otherAmount) {
      toast.error("Please check amount!");
      return;
    } else {
      // if (soldBy === "") {
      //   toast.error("Please Enter sold by name!");
      //   return;
      // }
      if (+cashAmount + +cardAmount + +otherAmount === 0) {
        toast.error("Please Enter cash amount!");
        return;
      }
      setInvoiceLoading(false);

      const data = new FormData();

      // data.append("sale_id", Math.random().toString(36).substr(2, 9));
      data.append("store_id", "motherStoreId001");
      data.append("org_id", userInfo?.organizationData?.org_id);
      data.append("c_id", "C111111")
      data.append("c_name", customerName);
      data.append("c_number", customerMobile);
      data.append("total_paid", total);
      data.append("discount_type", discountPercent);
      data.append("discount", dis);
      data.append(
        "d_amount",
        parseFloat(fixedDiscount) ||
        parseFloat(total - (total - total * (dis / 100)))
      );
      data.append("total_payable", refTotal);
      data.append("payment_mode_cash", cashMode);
      data.append("payment_mode_card", bankMode);
      data.append("payment_mode_other", otherMode);
      data.append("bankAcc", bankAcc);
      data.append("bankAccCardType", bankAccCardType);
      data.append("otherAcc", otherAcc);
      data.append("cash_paid", cashAmount);
      data.append("bank_paid", cardAmount);
      data.append("other_paid", otherAmount);
      // data.append("sold_by", soldBy);
      data.append("sold_by", "asm");
      data.append("referred_by", referredBy);

      fetch(`${import.meta.env.VITE_SERVER}/sale/addSalesInfo`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (res.success) {
            setInvoiceLoading(false);
            items?.map((item) => {
              const data = new FormData();
              data.append("sale_id", res.result.sale_id);
              data.append("product_id", item.p_id);
              data.append("p_name", item.name);
              data.append("quantity", item.quantity);
              data.append("price", item.price);
              data.append("total_price", item.quantity * +item.price);
              data.append("store_id", "motherStoreId001");
              fetch(`${import.meta.env.VITE_SERVER}/sale/addSalesItem`, {
                method: "POST",
                body: data,
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.success) {
                    // toast.success("Product sold !", {
                    //   icon: "🛒",
                    // });

                    const data = new FormData();
                    data.append("sale_id", saleId);
                    fetch(`${import.meta.env.VITE_SERVER}/getInvoiceForStore`, {
                      method: "POST",
                      body: data,
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        if (res.info) {
                          // document.getElementById("mod").click();
                          setInvoiceData(res);
                          setInvoiceLoading(true);
                          localStorage.removeItem("items");
                          setUpdateCount(updateCount + 1);
                          setCashAmount("");
                          setCardAmount("");
                          setOtherAmount("");
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                })
                .catch((err) => console.log(err));
            });
          }
        })
        .catch((err) => toast.error(err.message));

      // toast.success("Product sold !", {
      //   icon: "🛒",
      // });

      // clearcart();
      // setInvoiceLoading(false);
    }
  }

  function increaseItem(index, i) {
    i++;
    var items = JSON.parse(localStorage.getItem("items"));
    items[index].quantity = i;

    if (i > items[index].total) {
      toast.error("Not enough stock!", {
        icon: "🛒",
      });
    } else {
      localStorage.setItem("items", JSON.stringify(items));
    }
    setUpdateCount(updateCount + 1);
  }

  function decreaseItem(index, i) {
    i--;
    if (i < 1) {
      i = 1;
    }
    var items = JSON.parse(localStorage.getItem("items"));
    items[index].quantity = i;
    localStorage.setItem("items", JSON.stringify(items));
    setUpdateCount(updateCount + 1);
  }

  function removeItem(x) {
    var all = JSON.parse(localStorage.getItem("items"));
    all.splice(x, 1);
    localStorage.setItem("items", JSON.stringify(all));
    setUpdateCount(updateCount + 1);
  }

  const printPDF = () => {
    window.print();
    // document.getElementById('cetakbutton').style.visibility = 'hidden';
    // // now printing the page - send to printer
    // self.print();
    setInvoiceLoading(false);
    setTimeout(() => {
      toast.success("Invoice printed !");
    }, 1000);
  };

  const [activeDiv, setActiveDiv] = useState("cart");


  const [allMainCategories, setAllMainCategories] = useState([]);
  const [data, setData] = useState([]);

  const [activeCategory, setActiveCategory] = useState(0);

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


  const getStoreProducts = () => {
    console.log(activeCategory)
    console.log(searchedProducts)
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("category_id", activeCategory);
    fetch(`${import.meta.env.VITE_SERVER}/product/getProductsByCategory`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (activeCategory === 0) {
          setData(searchedProducts)
        } else {
          setData(res)
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    getStoreProducts();
  }, [activeCategory, searchedProducts]);

  const navigate = useNavigate();
  return (
    <>
      <div onClick={() => setShow(false)} className="container-fluid noprint bg-light2" style={{ height: "100vh" }}>
        <div className="row">
          {
            activeDiv === "pos" ?
              <div className="col-lg-7 mt-3 " style={{ position: "relative" }}>
                {items?.map((item, index) => {
                  return (
                    <div key={
                      item.id
                    } className="px-2 bg-white rounded-2 ">
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex w-50 ms-2 align-items-center">
                          <div className="me-3 py-2">
                            {" "}
                            <img
                              src={`${import.meta.env.VITE_IMG}${item.imageSrc1}`}
                              className="card-offcanvas-img rounded border border-secondery"
                              alt=""
                              width={70}
                              height={70}
                            ></img>
                          </div>
                          <div className="w-50">
                            {" "}
                            <p className="font-14 fw-semibold mb-1">
                              {item.name}
                              {/* <span className="text-info">({(item.attributeIds)
                                .map((item) => {
                                  return item;
                                })
                                .join(", ")
                              })</span> */}
                            </p>
                            <p className="font-12 mb-1">
                              {item.id}
                            </p>
                            <p className="font-14 pos-card-price fw-bold mb-2">
                              Price: {item.price}$
                            </p>
                          </div>

                          <div className="w-50">

                            <p className="font-14  fw-medium mb-2">
                              <span dangerouslySetInnerHTML={{ __html: item.des }}></span>
                            </p>
                          </div>
                        </div>

                        <div className="w-25">
                          <input
                            type="button"
                            value="+"
                            className="btn_small px-2 fs-6 py-0 me-2"
                            data-field="quantity"
                            onClick={() => increaseItem(index, item.quantity)}
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            placeholder="1000 gm"
                            name="quantity"
                            className="quantity-field border-0 text-center w-25 fw-medium bg-white me-2"
                            disabled
                          />
                          <input
                            type="button"
                            value="-"
                            className="btn_small px-2 fs-6 py-0"
                            data-field="quantity"
                            onClick={() => decreaseItem(index, item.quantity)}
                          />
                        </div>

                        <div className=" text-end me-3">
                          <button
                            className="border-0 bg-white "
                            onClick={() => removeItem(index)}
                          >
                            <i className="fa-solid fa-xmark text-danger fa-lg"></i>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div> :
              <div className="col-lg-7 mt-3" style={{ position: "relative" }}>
                <div className="p-3">
                  <div className='d-flex align-content-center '>
                    <p className="mt-1 me-2 cursor-pointer" onClick={() => navigate(-1)}><i class="fa-solid fa-arrow-left fs-4"></i></p>
                    <p className='fs-5 fw-bold'>Categories</p>
                    <div
                      style={
                        {
                          background: activeCategory == 0 ? "#ffce00" : "",
                          hover: "#1e90ff",
                          cursor: "pointer",

                        }
                      }
                      className='ms-3 rounded-pill px-4 py-1 border'
                      onClick={() => setActiveCategory(0)}

                    >
                      <p className='fw-semibold m-0'>All Category</p>
                    </div>
                  </div>

                  <div className='row'>


                    <Swiper
                      slidesPerView={1}
                      spaceBetween={10}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 4,
                          spaceBetween: 40,
                        },
                        1024: {
                          slidesPerView: 6,
                          spaceBetween: 20,
                        },
                      }}
                      navigation={true} modules={[Navigation]}
                      className="mySwiper py-3"
                    >
                      {
                        allMainCategories.map((item, index) => (
                          <SwiperSlide key={item.id} className="p-1 rounded-3">
                            <div
                              key={item.category_id} className={`rounded-3 border-0 text-center p-3 cursor-pointer hover_effect2 ${activeCategory == item.category_id ? 'active-category-box' : ''}`}
                              onClick={() => setActiveCategory(item.category_id)}
                            >
                              <img

                                className='m-1'
                                src={`${import.meta.env.VITE_IMG}${item.image}`}
                                height={40}
                                width={40}
                                alt="" />
                              <p className='font-14 mx-auto mt-1 fw-semibold'> {item.name}</p>
                            </div>
                          </SwiperSlide>
                        ))
                      }
                    </Swiper>
                  </div>

                  <div
                    className="mt-3"
                  >
                    <p className='fw-bold mb-2'>Product List</p>
                    <div className='row'>
                      {
                        data.map((item, index) => (
                          <div
                            key={index} className='col-lg-4 cursor-pointer'
                            onClick={() => {
                              addToLocalCart(
                                item.product_id,
                                item.name,
                                item.imageSrc1,
                                1,
                                item.price,
                                item.qty,
                                item.attributeIds,
                                item.des
                              );
                            }}
                          >
                            <div className='p-2 bg-white shadow-sm border-0 rounded-3 card-hover d-flex mb-3'>
                              <img
                                className='pos-product-img me-2'
                                src={`${import.meta.env.VITE_IMG}${item.imageSrc1}`}
                                height={70}
                                width={70}
                                alt="" />
                              <div>
                                <p className='font-14 m-0 fw-semibold'> {item?.name} {item?.attributeIds}</p>
                                <p className='font-12 m-0 pos-card-price'> {item?.price} $</p>
                              </div>
                            </div>


                          </div>
                        ))
                      }
                    </div>

                  </div>
                </div>
              </div>
          }


          <div className="col-lg-5">
            {
              activeDiv === "cart" &&
              <div className="py-3" style={{ height: "100vh" }}>
                <div className="bg-white rounded-3 position-relative" >
                  <div>
                    <div className="p-3 border-bottom d-flex  align-items-center ">
                      <i
                        className="fa fa-search fs-5 px-3"
                        style={{ position: "absolute" }}
                      ></i>
                      <input
                        type="text"
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          setShow(true);
                        }}
                        onFocus={
                          () =>
                            setTimeout(() => {
                              setShow(true)
                            }, 200)
                        }
                        placeholder="Search Product"
                        className="form-control px-5 shadow-none"
                      />
                    </div>

                    {show ? (
                      <div
                        style={{
                          position: "absolute",
                          background: "white",
                          width: "93%",
                          left: '4%',
                          top: 58,
                          padding: 10,
                        }}
                        className="shadow-lg mb-0 pb-0  rounded"
                      >
                        {searchedProducts
                          .map((item, index) => (
                            <div
                              key={item.product_id}
                              className="pb-0 mb-2 ps-2 hover_effect border "
                              onClick={() => {
                                setShow(false);
                                addToLocalCart(
                                  item.product_id,
                                  item.name,
                                  item.imageSrc1,
                                  1,
                                  item.price,
                                  item.qty,
                                  item.attributeIds,
                                  item.des
                                );
                              }}
                              style={{ cursor: "pointer", zIndex: 999 }}
                            >
                              <p>
                                {item.name} | {item.product_id}
                              </p>
                            </div>
                          ))}

                      </div>
                    ) : null}
                    <div className="px-asm">
                      <div className=""
                        style={{
                          height: "75vh",
                          overflowY: "auto"
                        }}
                      >
                        <input
                          type="text"
                          id="fname"
                          name="fname"
                          autoFocus
                          style={{ display: "none" }}
                        />

                        {items?.map((item, index) => {
                          return (
                            <div key={
                              item.id
                            } className="px-2">
                              <div className="d-flex justify-content-between border-bottom border-secondery align-items-center py-2">
                                <div className="d-flex w-75 ms-2 align-items-center">
                                  <div className="me-3 py-2">
                                    {" "}
                                    <img
                                      src={`${import.meta.env.VITE_IMG}${item.imageSrc1}`}
                                      className="card-offcanvas-img rounded border border-secondery"
                                      alt=""
                                      width={70}
                                      height={70}
                                    ></img>
                                  </div>

                                  <div className="w-50">
                                    {" "}
                                    <p className="font-14 fw-semibold mb-1">
                                      {item.name}
                                      {/* <span className="text-info">({(item.attributeIds)
                                        .map((item) => {
                                          return item;
                                        })
                                        .join(", ")
                                      })</span> */}
                                    </p>
                                    <p className="font-12 mb-1">
                                      {item.id}
                                    </p>
                                    <p className="font-14 pos-card-price fw-bold mb-2">
                                      Price: {item.price}$
                                    </p>
                                  </div>
                                </div>

                                <div className="w-25">
                                  <input
                                    type="button"
                                    value="+"
                                    className="btn_small px-2 fs-6 py-0 me-2"
                                    data-field="quantity"
                                    onClick={() => increaseItem(index, item.quantity)}
                                  />
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    placeholder="1000 gm"
                                    name="quantity"
                                    className="quantity-field border-0 text-center w-25 fw-medium bg-white me-2"
                                    disabled
                                  />
                                  <input
                                    type="button"
                                    value="-"
                                    className="btn_small px-2 fs-6 py-0"
                                    data-field="quantity"
                                    onClick={() => decreaseItem(index, item.quantity)}
                                  />
                                </div>

                                <div className=" text-end me-3">
                                  <button
                                    className="border-0 bg-white "
                                    onClick={() => removeItem(index)}
                                  >
                                    <i className="fa-solid fa-xmark text-danger fa-lg"></i>
                                  </button>
                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                  <div className="container rounded-bottom-3" style={{ backgroundColor: "#ffce00" }}>
                    <div className="d-flex align-items-center m-0 py-2">
                      <div className="w-50 text-start font-14 ps-4">
                        <p className="fw-semibold fs-4 m-0"> {total} $</p>
                        <p className="fw-bold fs-6 text-muted m-0">Subtotal</p>
                      </div>
                      <div className="w-50 m-0">
                        <button
                          onClick={() => {
                            items.length === 0 ? toast.error("Please add some items !") :
                              setActiveDiv(activeDiv === "cart" ? "pos" : "cart")
                          }

                          }
                          className="btn_primary border-0 text-white font-16 rounded-1 w-100"
                        >
                          Go to Checkout
                          <i class="fa-solid fa-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            }

            {/* middle asm */}
            {
              activeDiv === "pos" &&

              <div
                className="bg-white my-3 rounded-3 position-relative" style={{ height: "95vh" }}

              >
                <div className="py-3 px-3">
                  <button
                    onClick={() => setShowCustomerModal(!showCustomerModal)}
                    className="btn_primary w-100 py-2 fs-6 d-flex justify-content-center align-items-center gap-2"
                  >
                    <p> Add Customer Info</p>
                    {showCustomerModal ? (
                      <i class="fa-solid fa-chevron-down"></i>
                    ) : (
                      <i class="fa-solid fa-chevron-up"></i>
                    )}
                  </button>
                  {showCustomerModal && (
                    <div className="customer-info-modal">
                      <div className="modal-content">
                        <div className="modal-header"></div>
                        <div className="modal-body">
                          <div className=" pt-2">
                            <div className="p-2 border-opacity-10 border border-1 border-secondary rounded-1 bg-white">
                              <div className="">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label fw-semibold"
                                  >
                                    Search Customer
                                  </label>
                                  <div className="d-flex gap-3">
                                    <input
                                      className="form-control font-13 shadow-none bg-white"
                                      placeholder="Search by name"
                                      onChange={(e) => {
                                        setSearchCustomerText(e.target.value);
                                        setCustomerShow(true);
                                      }}
                                    />
                                    <button
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                      data-bs-whatever="@mdo"
                                      className="btn_blue py-0 text-nowrap"
                                    >
                                      Add New
                                    </button>

                                    <div
                                      className="modal fade"
                                      id="exampleModal"
                                      tabIndex={-1}
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1
                                              className="modal-title fs-5"
                                              id="exampleModalLabel"
                                            >
                                              Add New Customer
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            />
                                          </div>
                                          <div className="modal-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mx-3">
                                              <div className="mb-3">
                                                <label
                                                  htmlFor="recipient-name"
                                                  className="col-form-label"
                                                >
                                                  Customer Name
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control py-1 font-14 bg-light shadow-none"
                                                  onChange={(e) =>
                                                    setCustomerName(e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div className="mb-3">
                                                <label
                                                  htmlFor="recipient-name"
                                                  className="col-form-label"
                                                >
                                                  Phone
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control py-1 font-14 bg-light shadow-none"
                                                  onChange={(e) =>
                                                    setCustomerMobile(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div className="mb-3 mx-3">
                                              <label
                                                htmlFor="recipient-name"
                                                className="col-form-label"
                                              >
                                                Add address
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control py-1 font-14 bg-light shadow-none"
                                                onChange={(e) =>
                                                  setCustomerAddress(e.target.value)
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn_secondary py-2 "
                                              data-bs-dismiss="modal"
                                            >
                                              Close
                                            </button>
                                            <button
                                              data-bs-dismiss="modal"
                                              onClick={handleAddNewCustomer}
                                              className="btn_blue py-2 me-3"
                                            >
                                              Add Customer
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* search items */}
                                {customerShow ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      background: "white",
                                      width: 310,
                                      top: 92,
                                      left: 10,
                                      padding: 10,
                                    }}
                                    className="shadow-lg mb-0 pb-0 bg-white  rounded"
                                  >
                                    {allCustomers
                                      .map((item, index) => (
                                        <div
                                          key={item.c_id}
                                          className="pb-0 mb-2 ps-2"
                                          onClick={() => {
                                            setCustomerName(item.name);
                                            setCustomerMobile(item.number);
                                            setCustomerAddress(item.address);
                                            setCustomerShow(false);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <p> {item.name}</p>
                                        </div>
                                      ))}
                                  </div>
                                ) : null}
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="mb-2">
                                    <label
                                      for="exampleInputEmail1"
                                      className="form-label fw-bold font-15 mb-0"
                                    >
                                      Customer Name
                                    </label>
                                    <input
                                      type="text"
                                      value={customerName}
                                      onChange={(e) => setCustomerName(e.target.value)}
                                      className="form-control py-1 font-14 bg-light shadow-none"
                                      id="exampleInputEmail1"
                                      aria-describedby="emailHelp"
                                    />
                                  </div>
                                  <div className="mb-2">
                                    <label
                                      for="exampleInputPassword1"
                                      className="form-label fw-bold font-15 mb-0"
                                    >
                                      Phone
                                    </label>
                                    <input
                                      value={customerMobile}
                                      type="text"
                                      onChange={(e) => setCustomerMobile(e.target.value)}
                                      className="form-control py-1 font-14 bg-light shadow-none"
                                      id="exampleInputPassword1"
                                    />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label
                                    for="exampleInputPassword1"
                                    className="form-label fw-bold font-15 mb-0"
                                  >
                                    Address
                                  </label>
                                  <input
                                    value={customerAddress}
                                    type="text"
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    className="form-control py-1 font-14 bg-light shadow-none"
                                    id="exampleInputPassword1"
                                  />
                                </div>
                                {/* <button
                              type="button"
                              className="btn_red py-1 "
                              onClick={closeCustomerModal}
                            >
                              Close
                            </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer "></div>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                <div className="container ps-4">
                  <div className="">
                    <div className="col-lg-12 d-flex justify-content-between align-items-center mb-1">
                      <span className="font-17 text-nowrap me-3 fw-bold ">
                        Sub Total
                      </span>
                      <input
                        value={`${total} BDT`}
                        className="w-35 text-end form-control font-14 py-1 rounded-1 shadow-none"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-12 d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex ">
                        <span className="font-17 text-nowrap me-3 fw-bold ">
                          Discount
                        </span>
                        <div className="form-check">
                          <input
                            checked={discountPercent === "active" ? true : false}
                            className="form-check-input shadow-none "
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            onChange={() => {
                              setDiscountPercent("active");
                              setFixedDiscount("");
                            }}
                          />
                          <label
                            className="form-check-label fw-bold me-1"
                            htmlFor="flexRadioDefault1"
                          >
                            %
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-none"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            defaultChecked=""
                            onChange={() => {
                              setDiscountPercent("inactive");
                              setDis(0);
                            }}
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="flexRadioDefault2"
                          >
                            Fixed
                          </label>
                        </div>
                      </div>
                      {discountPercent === "active" ? (
                        <div className="d-flex justify-content-end gap-1 w-35">
                          <input
                            value={dis === 0 ? "" : dis}
                            onChange={(e) => setDis(e.target.value)}
                            placeholder="%"
                            className=" text-end w-35 form-control font-14 py-1 rounded-1 shadow-none"
                            type="number"
                          />
                          <input
                            value={
                              (total - (total - total * (dis / 100))).toFixed(2) +
                              " BDT"
                            }
                            className=" text-end  form-control font-14 py-1 rounded-1 shadow-none"
                            type="text"
                          />
                        </div>
                      ) : (
                        <input
                          value={fixedDiscount}
                          onChange={(e) => setFixedDiscount(e.target.value)}
                          className="w-35 text-end  form-control font-14 py-1 rounded-1 shadow-none"
                          type="number"
                        />
                      )}
                    </div>
                    {/* <div className="col-lg-12 d-flex justify-content-between align-items-center my-3">
                    <span className="font-17 text-nowrap me-3 fw-bold ">
                      VAT %
                    </span>
                    <input
                      onChange={(e) => setVat(e.target.value)}
                      className="w-35 text-end form-control font-14 py-1 rounded-1 shadow-none"
                      type="number"
                    />
                  </div> */}
                  </div>
                </div>
                <hr className="" />
                <div className="container my-2">
                  <div className="row b">
                    <div className="col-lg-12 d-flex justify-content-end align-items-center gap-3 mb-3 pe-3">
                      <p className="font-24 ms-3 fw-bold">Total </p>
                      {discountPercent === "active" ? (
                        <p className="font-24 fw-semibold text-primary ">
                          {/* <span ref={myRef}> {(total - total * (dis / 100) + total * (vat / 100)).toFixed(2)}</span> */}
                          <span ref={myRef}> {(total - total * (dis / 100)).toFixed(2)}</span>
                          ‎ BDT
                        </p>
                      ) : (
                        <p className="font-24 fw-semibold text-primary ">
                          {/* <span ref={myRef}>
                          {(
                            total -
                            fixedDiscount +
                            total * (vat / 100)
                          ).toFixed(2)}
                        </span> */}
                          <span ref={myRef}>
                            {(
                              total -
                              fixedDiscount).toFixed(2)}
                          </span>
                          ‎  BDT
                        </p>
                      )}
                    </div>
                    <hr className="" />
                    <div className="row mb-2">
                      <div className="col-3">
                        <input
                          checked={cashMode === "active" ? true : false}
                          onChange={(e) =>
                            setCashMode(
                              `${cashMode === "active" ? "inactive" : "active"}`
                            )
                          }
                          className="form-check-input mb-1 ms-2 shadow-none "
                          type="checkbox"
                        />
                        <span className="font-17 text-nowrap me-3 fw-bold ms-3">
                          Cash
                        </span>
                      </div>
                      <div className="col-5"></div>
                      <div className="col-4">
                        <input
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          disabled={cashMode === "active" ? false : true}
                          className="form-control font-14 py-1 rounded-1 shadow-none"
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-3">
                        <input
                          onChange={(e) =>
                            setBankMode(
                              `${bankMode === "active" ? "inactive" : "active"}`
                            )
                          }
                          className="form-check-input mb-1 ms-2  shadow-none "
                          type="checkbox"
                        />
                        <span className="font-17 text-nowrap fw-bold mx-3">
                          Bank
                        </span>
                      </div>
                      <div className="col-1"></div>
                      <div className="col-2">
                        <select
                          onChange={(e) => setBankAcc(e.target.value)}
                          className="form-select shadow-none"
                        >
                          <option className="font-14" selected disabled value="">
                            Select
                          </option>
                          {
                            bankAccList.map((item) => {
                              return (
                                <option value={item.account_id}>{item.name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                      <div className="col-2">
                        <select
                          onChange={(e) => setBankAccCardType(e.target.value)}

                          className="form-select shadow-none "
                        >
                          <option className="font-14" selected disabled value="">
                            Select
                          </option>
                          <option value="VISA">Visa</option>
                          <option value="MASTER">Master</option>
                          <option value="EXPRESS">American Express</option>
                        </select>
                      </div>
                      <div className="col-4">
                        <input
                          onChange={(e) => setCardAmount(e.target.value)}
                          disabled={bankMode === "active" ? false : true}
                          className="  form-control font-14 py-1 rounded-1 shadow-none"
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4">
                        <input
                          onChange={(e) =>
                            setOtherMode(
                              `${otherMode === "active" ? "inactive" : "active"}`
                            )
                          }
                          className="form-check-input ms-2  mb-1 shadow-none "
                          type="checkbox"
                        />
                        <span className="font-17 text-nowrap fw-bold  mx-3">
                          Other
                        </span>
                      </div>
                      <div className="col-4">
                        <select
                          onChange={(e) => setOtherAcc(e.target.value)}
                          style={{ marginRight: "39px" }}
                          className="form-select shadow-none"
                          name=""
                          id=""
                        >
                          <option className="font-14" selected disabled value="">
                            Select
                          </option>
                          {
                            otherAccList.map((item) => {
                              return (
                                <option value={item.account_id}>{item.name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                      <div className="col-4">
                        <input
                          onChange={(e) => setOtherAmount(e.target.value)}
                          disabled={otherMode === "active" ? false : true}
                          className="form-control font-14 py-1 rounded-1 shadow-none"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="col-lg-12 d-flex justify-content-end align-items-end  pe-3 mb-3">
                  <div className="d-flex ">
                    <p className="font-24 fw-bold me-3">Total Paid</p>
                    <p className="font-24 fw-semibold text-danger ">
                      {parseFloat(+cashAmount + +cardAmount + +otherAmount).toFixed(2)} BDT
                    </p>
                  </div>
                </div>
                <hr />
                <div className="col-lg-12 d-flex justify-content-between align-items-end  pe-3 mb-3">
                  <div>
                    <p className="font-17 text-nowrap fw-bold ms-3 mb-2">
                      Sold By
                    </p>
                    {/* <input
                    onChange={(e) => {
                      setSoldBy(e.target.value);
                    }}
                    className="ms-3 form-control font-14 py-1 rounded-1 shadow-none w-75 "
                    type="text"
                  /> */}
                    <select
                      className="ms-3 form-control font-14 py-1 rounded-1 shadow-none w-100 "
                      onChange={(e) => {
                        setSoldBy(e.target.value);
                      }}
                      placeholder="Choose category"
                      id="cars"
                    >
                      <option selected disabled value="">
                        Choose employee
                      </option>
                      {employeeList.map((item) => {
                        return (
                          <option
                            key={item.employee_id}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="me-4">
                    <p className="font-17 text-nowrap fw-bold  mb-2">
                      Referred By
                    </p>
                    <input
                      type="text"
                      onChange={(e) => {
                        setReferredBy(e.target.value);
                      }}
                      className="form-control font-14 py-1 rounded-1 shadow-none w-100"
                    />
                  </div>
                </div>
                <hr />
                <div className="container rounded-bottom-3 pt-3" style={{ backgroundColor: "#ffce00" }}>
                  <div className="row b">
                    <div className="col-lg-4">
                      {/* <button
                        onClick={clearcart}
                        className="btn_danger border-0 text-white py-2 font-16 rounded-1 text-nowrap  w-100"
                      >
                        Clear Item <i class="fa-regular fa-trash-can ms-2"></i>
                      </button> */}
                      <button
                        onClick={
                          () => setActiveDiv(activeDiv === "pos" ? "cart" : "pos")
                        }
                        className="btn_secondary border-0 text-white py-2 font-16 rounded-1 text-nowrap  w-100"
                      >
                        Go to Cart <i class="fa-solid fa-arrow-left  ms-2"></i>
                      </button>
                    </div>

                    {/* <button
                        onClick={printPDF}
                        className="btn_green  border-0 text-white py-2 font-16 rounded-1 w-100"
                      >
                        Print Invoice <i class="fa-solid fa-receipt ms-2"></i>
                      </button> */}

                    <div className="col-lg-8">
                      {invoiceLoading ? (
                        <button
                          onClick={printPDF}
                          className="btn_green  border-0 text-white py-2 font-16 rounded-1 w-100"
                        >
                          Print Invoice <i class="fa-solid fa-receipt ms-2"></i>
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitSale}
                          className="btn_primary border-0 text-white py-2 font-16 rounded-1 w-100"
                        >
                          Confirm Sale
                          <i class="fa-regular fa-circle-check ms-2"></i>
                        </button>
                      )}
                    </div>
                    {/* <button onClick={(e) => printPDF()} className="btn_green mt-2 border-0 text-white py-2 font-16 rounded-1 w-75">
                    printPDF
                  </button> */}
                    {/* <a href="javascript:window.print();">Print</a> */}
                  </div>
                  <br />
                </div>
              </div>

            }
          </div>
        </div>
      </div>

      {/* printable div */}
      {invoiceData?.info && invoiceData?.item ? (
        <div
          style={{
            width: "275px",
            color: "#000000",
          }}
          className="printarea bg-white pb-4"
        >
          <img
            style={{ marginLeft: "110px" }}
            src="/logo.png"
            alt=""
            className="invoice_icon"
          />
          <p className="font-14 text-center my-2 ms-2">
            <i class="fa-solid fa-location-dot"></i> {storeInfo?.location}
          </p>
          <p className="font-14 text-center my-2 ms-2">
            #{invoiceData?.info[0]?.sale_id}
          </p>
          <p className="font-12 text-start">
            Customer Name: {invoiceData?.info[0]?.customer_name}
          </p>
          <p className="font-12 text-start">
            Mobile Number: {invoiceData?.info[0]?.customer_phone}
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
              {invoiceData?.item?.map((item, index) => (
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
                    {(invoiceData?.info[0]?.subtotal).toFixed(2)} BDT
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
                    {(invoiceData?.info[0]?.d_amount).toFixed(2)} BDT
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
                    {(invoiceData?.info[0]?.total_amount).toFixed(2)} BDT
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Pos;
