import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getItems = async () => {
    const response = await axios.get(`${API_URL}/api/items`)
    return response.data
}
export const createItems = async (itemData) => {
    const response = await axios.post(`${API_URL}/api/items`, itemData)
    return response.data
}
export const updateItems = async (id, itemData) => {
    const response = await axios.put(`${API_URL}/api/items/${id}`, itemData)
    return response.data
}
export const deleteItems = async (id) => {
    const response = await axios.delete(`${API_URL}/api/items/${id}`)
    return response.data
}