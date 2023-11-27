import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

//When you declare a component, it's a good practice to use the same name of the file. In this Case const Api = axios
//When you import the component in an other component, it's a good practice to import with the name what you give in the component. See AuthService, you import Api from Api.js. 
//This approach it's working because you have an only export in this file and it's a default export. 