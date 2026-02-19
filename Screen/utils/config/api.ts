import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "./config";
const api = axios.create({
    baseURL,
});

export default api;