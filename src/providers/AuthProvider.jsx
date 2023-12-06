import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserInfoContext = createContext([]);

export const AuthProvider = (props) => {

  let navigator = useNavigate();
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(userInfo, "==>AUTH");

  let token = JSON.parse(localStorage.getItem("token"));

  const getUserData = () => {
    setLoading(true);
    const data = new FormData();
    data.append("user_id", token?.user_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/getUserAndOrganization`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res[0].user_id !== null) {
          setUserInfo(res[0]);
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          navigator("/login");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err)
        navigator("/login");
        setLoading(false);
      }
      );
  };
  useEffect(() => {
    getUserData();
  }, []);


  return (
    <>
      <UserInfoContext.Provider
        value={{
          userInfo,
          loading,
          setLoading,
        }}
      >
        {props.children}
      </UserInfoContext.Provider>
    </>
  );
};

export function useAuth() {
  const context = useContext(UserInfoContext)
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return context
}