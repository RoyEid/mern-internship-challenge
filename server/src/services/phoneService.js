import axios from "axios";

export const validatePhoneNumber = async (mobileNumber) => {
    const response = await axios.post(`${process.env.PHONE_SERVICE_URL}/api/phone/validate`, { mobileNumber });
    return response.data;
};