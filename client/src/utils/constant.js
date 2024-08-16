//if using create-react-app then use process.env.REACT_NAME
// export const HOST = import.meta.env.VITE_SERVER_URL;
export const HOST = "http://localhost:4100";

const AUTH_ROUTE = "http://localhost:4100/api/auth";

//contact route
const CONTACT_ROUTE = "http://localhost:4100/api/contacts";

//messages route
const MESSAGE_ROUTE = "http://localhost:4100/api/messages";

//endpoints
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;

//LOGIN
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;

//get user info
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`;

//update profile
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;

//add profile image route
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`;

//remove profile image

export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`;

//search contact
export const CONTACT_SEARCH_ROUTE = `${CONTACT_ROUTE}/search`;

//get all contact with whom user have done chatting
export const GET_ALL_CONTACT_DM_ROUTE = `${CONTACT_ROUTE}/get-contacts-for-dm`;

//get all messages
export const GET_MESSAGES = `${MESSAGE_ROUTE}/get-messages`;

//file upload
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTE}/upload-file`;
