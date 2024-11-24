import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000"
})

export const getData = async (category) => {
    try {
        const response = await api.get("/instructions");
        return response.data;
    } catch(error) {
        throw Error(error.message);
    }
}

export const postData = (where, data) => { 
    try { 
        const promise = api.post(where, data, {headers :{ 
            'Content-Type' : 'multipart/form-data',},
        });
        return promise.then((response) => response.data._id);
        
    } catch (error){ 
        console.error(`Error: ${error.response?.data?.message || error.message}`);
    }
}

export const postDocData = (where, data) => { 
    try { 
        const promise = api.post(where, data, {headers :{ 
            'Content-Type' : 'multipart/form-data',},
        });
        return promise.then((response) => response.data);
        
    } catch (error){ 
        console.error(`Error: ${error.response?.data?.message || error.message}`);
    }
}