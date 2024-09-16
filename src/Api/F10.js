import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_F10_URL,
    headers: {
        'x-auth': process.env.REACT_APP_X_AUTH,
        'Content-Type': 'application/json'
    }
})