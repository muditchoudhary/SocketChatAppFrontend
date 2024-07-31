import { io } from "socket.io-client";

import { BACKEND_URL } from "./components/globalConstatnt";

export const socket = io(BACKEND_URL, { autoConnect: false });
