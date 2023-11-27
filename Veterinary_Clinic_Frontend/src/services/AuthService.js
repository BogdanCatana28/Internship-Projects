import api from "./Api";
import TokenService from "./TokenService";

const register = (firstName, lastName, email, address, phone, password) => {
  return api.post("/auth/sign-up", {
        firstName,
        lastName,
        email,
        address,
        phone,
        password
  });
};

const registerMedic = (firstName, lastName, email, address, phone, password, education, specializations, experience) => {
  return api.post("/auth/sign-up/medic", {
        firstName,
        lastName,
        email,
        address,
        phone,
        password,
        education,
        specializations,
        experience,
  });
};
  instance
const login = (email, password) => {
  return api
    .post("/auth/sign-in", {
      email,
      password
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
   api.post("/auth/sign-out")
    .then(() => {
      TokenService.removeUser();
    });
};


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post("auth/generate-password-reset-token", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AuthService = {
  register,
  registerMedic,
  login,
  logout,
  getCurrentUser,
  sendPasswordResetEmail
};

export default AuthService;

