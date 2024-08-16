import { useEffect } from "react";
import ProfileInfo from "./components/profile-info";
import NewDm from "./components/profile-info/new-dm";
import axios from "axios";
import { GET_ALL_CONTACT_DM_ROUTE } from "@/utils/constant";
import { useAppStore } from "@/store";
import ContactListComponent from "@/c/contact-list";

const ContactContainer = () => {
  const { directMessageContactList, setDirectMessageContactList } =
    useAppStore();

  useEffect(() => {
    const getContactListDm = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(GET_ALL_CONTACT_DM_ROUTE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data) {
        setDirectMessageContactList(response.data.data);
      }
    };
    getContactListDm();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-[full]">
      <Logo />
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct message" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactListComponent contacts={directMessageContactList} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        {/* <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path> */}
        {/* {" "} */}
        {/* <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "} */}
      </svg>
      <span className="text-2xl font-semibold ">Talk Yourself</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
