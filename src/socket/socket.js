import { io } from 'socket.io-client';

const URL = "http://192.168.1.85:6200";

export const socket = io.connect(`${URL}`, {
    autoConnect: false
});
