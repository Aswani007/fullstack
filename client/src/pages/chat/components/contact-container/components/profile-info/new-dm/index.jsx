import { animationDefaultOptions, getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import axios from "axios";
import { CONTACT_SEARCH_ROUTE, HOST } from "@/utils/constant";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { useAppStore } from "@/store";

const NewDm = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContactList, setSearchedContactList] = useState([]);

  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContact = async (searchQuery) => {
    try {
      if (searchQuery.length > 0) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          CONTACT_SEARCH_ROUTE,
          { searchQuery: searchQuery },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setSearchedContactList(response.data.data);
        }
      } else {
        setSearchedContactList([]);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later");
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContactList([]);
  };

  return (
    <div className="">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light  text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setOpenNewContactModel(true);
                if (searchedContactList.length > 0) {
                  setSearchedContactList([]);
                }
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2a3b] border-none"
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>
          {searchedContactList.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContactList.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative ">
                      <Avatar className="h-12 w-12 right-full overflow-hidden">
                        {contact.img ? (
                          <AvatarImage
                            src={`${HOST}/${contact.img}`}
                            alt="Profile pic"
                            className="object-cover w-full h-full bg-black rounded-full border-2 border-red-300"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>

                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContactList.length <= 0 && (
            <div className="">
              <Lottie
                isClickToPauseDisabled={true}
                height={170}
                width={170}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white  flex flex-col gap-5 items-center mt-4 lg:text-1xl text-xl transition-all duration-300 text-center">
                <h3 className="playwrite-font">
                  Hi<span className="text-purple-500 ">! </span>Search New
                  <span className="text-purple-500"> Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
