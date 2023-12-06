import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [load, setLoader] = useState(false);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  let navigator = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setLoader(true);
    const data = new FormData();
    data.append("number", number);
    data.append("password", password);

    // if (password.length < 6) {
    //   toast.error('Password must be 6 characters long')
    //   return
    // }
    if (number === "" || password === "") {
      toast.error("Please fill all the fields");
      setLoader(false);
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER}/authority/loginUser`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.user_id) {
          setLoader(false);
          localStorage.setItem("token", JSON.stringify(res));
          toast.success("Login Successfull");
          navigator("/");
        } else {
          toast.error("Invalid Credentials");
          setLoader(false);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="container-fluid bg-light2">
        <div className="row">
          <div className="col-lg-4 mx-auto" style={{ marginTop: "20vh" }}>
            <div className="rounded-4 bg-white p-4 border-0 ">
              <div className="card-head">
                <div className="row pb-3">
                  <div className="text-center mx-auto">
                    <img
                      src="/logo.png"
                      alt=""
                      className="logo_icon  my-2 text-center me-4"
                    />
                    <p className="d-flex justify-content-center fs-5 fw-500">
                      Login to continue
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleLogin} className="card-body">
                <div className="form-group">
                  <label className="mb-2 fs-13">Phone No </label>
                  <input
                    type="phone"
                    className="form-control shadow-none py-1 fs-13"
                    placeholder="+88018-000000 "
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="mb-2 mt-3 fs-13">Password </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="form-control shadow-none py-1 fs-13"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className=" btn_primary btn-sm w-100 py-2 mt-2"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
