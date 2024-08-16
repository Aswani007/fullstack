import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constant";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      console.log(userInfo.img);
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.img) {
      setImage(`${HOST}/${userInfo.img}`);
    }
  }, [userInfo]);

  const formValidation = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (formValidation()) {
      try {
        const data = {
          firstName,
          lastName,
          color: selectedColor,
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(UPDATE_PROFILE_ROUTE, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        console.log(response.status);
        if (response.status === 200) {
          setUserInfo({ ...response.data.data });
          toast.success("Profile Updated Successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup your profile");
    }
  };

  const handleImagePickerClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const token = localStorage.getItem("token");
      const res = await axios.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: res.data.image });
        toast.success("Image Updated Successfully");
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, img: null });
        toast.success("Image Removed Successfully");
        setImage(null);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-slate-400 h-[100vh] flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col gap-10 w-[80vw] md:w-max">
          <div>
            <IoArrowBack
              className="text-2xl lg:text-4xl text-white cursor-pointer"
              onClick={handleNavigate}
            />
          </div>
          <div className="grid grid-cols-2">
            <div
              className="h-20 w-20 md:w-25 md:h-25 relative flex items-center justify-center mt-8"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-20 w-20 md:w-25 md:h-25 right-full overflow-hidden ">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="Profile pic"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-20 w-20 md:w-25 md:h-25 text-4xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 ring-fuchsia-50 cursor-pointer  rounded-full"
                  onClick={image ? handleDeleteImage : handleImagePickerClick}
                >
                  {image ? (
                    <FaTrash className="text-white/30 text-1xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-1xl cursor-pointer" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                name="profile-image"
                accept=".png, .jpg, .jpeg, .svg, . webp"
              />
            </div>
            <div className="flex min-w-20 md:min-w- flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="First Name"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={userInfo.firstName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="Last Name"
                  type="text"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setLastName(e.target.value);
                  }}
                  value={userInfo.lastName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="flex w-full gap-5">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedColor === index
                        ? "outline outline-white/70 outline-5"
                        : ""
                    }`}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <Button
              className="h-10 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-400"
              onClick={saveChanges}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
