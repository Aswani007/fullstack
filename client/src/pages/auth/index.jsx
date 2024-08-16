import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validation = (isLogin) => {
    if (!email.length) {
      toast.error("Email is Required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is Required");
      return false;
    }
    if (isLogin) {
      if (confirmPassword !== password) {
        toast.error("Password is not same");
        return false;
      }
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validation(false)) {
        console.log(LOGIN_ROUTE);

        const response = await axios.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          }
          // { withCredentials: true }
        );
        if (response.status === 200 && response.data.token) {
          setUserInfo(response.data.data);
          localStorage.setItem("token", response.data.token);
          if (response.data.data.profileSetup) navigate("/chat");
          else navigate("/profile");
        }

        console.log(response.data.data);
      }
    } catch (error) {
      const errorString = error.response?.data.message || error;
      toast.error(errorString);
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    try {
      if (validation(true)) {
        console.log(SIGNUP_ROUTE);
        const response = await axios.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          }
          // { withCredentials: true }
        );
        if (response.status === 200) {
          setUserInfo(response.data.data);
          localStorage.setItem("token", response.data.token);
          navigate("/profile");
        }
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Something went Wrong! Please try again");
      console.log(error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold md:text-6xl text-center">
                Welcome
              </h1>
              <h1>emoji</h1>
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with chat
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-pink-50 rounded-xl w-full grid grid-cols-2">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-pink-200 text-opacity-90  text-black rounded-xl data-[state=active]:text-black data-[state=active]:font-semibold p-3 transition-all duration-600"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signUp"
                  className="data-[state=active]:bg-pink-200 text-opacity-90  text-black rounded-xl data-[state=active]:text-black data-[state=active]:font-semibold p-3 transition-all duration-600"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-3 mt-8" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full mt-4 font-bold"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-3" value="signUp">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full mt-4 font-bold"
                  onClick={handleSignUp}
                >
                  Sign-up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <img src="../../../loginScreen.png" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
