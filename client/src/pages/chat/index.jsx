import { useAppStore } from "@/store";
import { GET_USER_INFO } from "@/utils/constant";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/epmty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const navigate = useNavigate();
  const { userInfo, selectedChatType } = useAppStore();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
    const getUserData = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(GET_USER_INFO, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response);
      console.log(userInfo._id);
    };

    getUserData();
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  );
};

export default Chat;
