import { useAppStore } from "@/store";
import { GET_MESSAGES } from "@/utils/constant";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const MessageContainer = () => {
  const scrollRef = useRef();

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessage,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(`other user id -> ${selectedChatData._id}`);
        const response = await axios.post(
          GET_MESSAGES,
          { id: selectedChatData._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.data) {
          setSelectedChatMessage(response.data.data);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|)/i;
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
