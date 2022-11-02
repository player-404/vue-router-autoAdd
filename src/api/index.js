import axios from "axios";

export const getMenu = () => axios.get("http://localhost:8080/v1/api/test");
