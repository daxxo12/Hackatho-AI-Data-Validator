import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000"
})

export const getData = async (category) => {
    try {
        const response = await api.get(category);
        return response.data;
    } catch(error) {
        throw Error(error.message);
    }
}