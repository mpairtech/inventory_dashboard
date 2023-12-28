import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const TopBar = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg py-0 bg-white noprint border-bottom shadow-sm">
        <div className="container-fluid p-0 max_width">
          <Link to="/" className="nav-start d-flex align-items-center logoitem">
            <img
              src={`${import.meta.env.VITE_IMG}${userInfo?.organizationData?.logo}`}
              alt=""
              className="logo_icon mx-2 my-2 text-center nav-img"
            />
          </Link>

          <Link to="/settings" className="ms-auto">
            <div className=" me-4 rounded-3  settings_icon ">
              <i className="fa-solid fa-gear"></i>
            </div>
          </Link>

          <div className="nav-right bg-white rounded me-3 d-flex align-items-center py-1 border">
            <h6 className="mx-3 my-2 text-muted font-14 fw-bold">{userInfo?.role}</h6>
            <div className="dropdown me-2 shadow-none border-0 ">
              <p
                className="user-nav m-0 text-end shadow-none"
                type="button"
                id="userdropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="">
                  {userInfo?.name}
                </span>
                <i className="fa-regular fa-user ms-2"></i>
              </p>
              <div
                className="dropdown-menu user-dropdown shadow px-3 rounded-3 border-0"
                aria-labelledby=""
              >
                <div className="container px-0">
                  <div className="row p-2 shadow-none">
                    <div className="col-lg-12 px-0 bg-white shadow-none">
                      <p className="p-2 mb-1 font-14 fw-600">
                      {userInfo?.name}
                        <br />
                        {/* <span className="font-10 fw-300"> </span> */}
                      </p>
                      <div className="bg-light p-1 px-2 rounded-2">


                        {
                          userInfo.store_id !== "0" ?
                            <div className="my-1 p-2 font-12 text-muted border-bottom cursor-pointer">
                              <Link to="/pos" className="ms-auto">
                                <div className=" text-dark  ">
                                  <i className="fa-solid fa-cart-arrow-down me-2 text-success fa-lg"></i>
                                  POS
                                </div>
                              </Link>
                            </div> : <></>
                        }


                        <div className="my-1 p-2 font-12 text-muted border-bottom cursor-pointer">
                          <i className="fa-solid fa-shield me-2 text-primary fa-lg"></i>
                          Security & Privacy
                        </div>

                        <div
                          className="my-1 p-2 pb-0 font-12 text-muted dropdown pointer"
                          onClick={handleLogout}
                        >
                          <i className="fa-solid fa-right-from-bracket me-2 text-danger fa-lg"></i>
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default TopBar