import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { HOST } from "@/utils/constant";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    setUserInfo(null);
    // localStorage.removeItem("token");
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative ">
          <Avatar className="h-12 w-12 right-full overflow-hidden">
            {userInfo.img ? (
              <AvatarImage
                src={`${HOST}/${userInfo.img}`}
                alt="Profile pic"
                className="object-cover w-full h-full bg-black rounded-full border-2 border-red-300"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
      </div>
      <div className="">
        {userInfo.firstName && userInfo.lastName
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : ""}
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500  text-xl font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOutOutline
                className="text-red-500  text-xl font-medium"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
