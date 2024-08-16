import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import { useAppStore } from "./store";
import axios from "axios";
import { GET_USER_INFO } from "./utils/constant";

//if user tries to access route that should be accessed then the user should then navigate to auth route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

//if user tries to go to auth page and is authenticated then it should not be able to go to auth page
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  console.log(isAuthenticated);
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     const token = localStorage.getItem("token");
  //     const isAuthenticated = !!token;
  //     console.log(isAuthenticated);
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(GET_USER_INFO, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log(response);
  //       // setUserInfo(response.data.data);
  //     } catch (error) {
  //       console.log(error, "error");
  //     }
  //   };
  //   if (!token) {
  //     getUserInfo();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [userin]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(GET_USER_INFO, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUserInfo(response.data.data);
          // console.log(response);
          // console.log(userInfo._id);
          setLoading(false);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        // setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center font-bold text-[50px] h-full">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} /> //default route
      </Routes>
    </BrowserRouter>
  );
};

export default App;
