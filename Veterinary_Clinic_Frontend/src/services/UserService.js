import api from "./Api";

const getPublicContent = () => {
  return api.get("/test/all");
};

const getUserBoard = () => {
  return api.get("/test/customer");
};


const getAdminBoard = () => {
  return api.get("/test/admin");
};

const getMedicBoard = () => {
  return api.get("/test/medic");
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
  getMedicBoard
};

export default UserService;