import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";

const ContactListComponent = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessage,
  } = useAppStore();

  const handleClickFun = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((e) => (
        <div
          key={e._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData &&
            (selectedChatData._id === e._id
              ? " bg-[#8417ff] hover:bg-[#841fff] "
              : "hover:bg-[#f1f1f111]")
          }`}
          onClick={() => handleClickFun(e)}
        >
          <div className="flex items-center justify-start gap-5 text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {e.img ? (
                  <AvatarImage
                    src={`${HOST}/${e.img}`}
                    alt="Profile pic"
                    className="object-cover w-full h-full bg-black rounded-full border-2 border-red-300"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === e._id
                        ? "bg-[#ffffff22] border border-white text-white"
                        : getColor(e.color)
                    } uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      e.color
                    )}`}
                  >
                    {e.firstName
                      ? e.firstName.split("").shift()
                      : e.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            <div className="w-15 flex items-center justify-center">
              {isChannel ? (
                <span>{e.name}</span>
              ) : (
                <span>{`${e.firstName} ${e.lastName}`}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactListComponent;
