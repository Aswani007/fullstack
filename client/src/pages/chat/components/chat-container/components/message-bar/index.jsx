import { useSocket } from "@/context/socket-context";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const fileInputRef = useRef();
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((oldMessage) => oldMessage + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem("token");
        const response = await axios.post(UPLOAD_FILE_ROUTE, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);

        if (response.status === 200 && response.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
      console.log(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[100vh bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className=" flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5 ">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-[20px]" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-[20px]" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:bg-[#741bda] focus:bg-[#741bda]"
        onClick={handleSendMessage}
      >
        <IoSend className="text-[20px]" />
      </button>
    </div>
  );
};

export default MessageBar;
