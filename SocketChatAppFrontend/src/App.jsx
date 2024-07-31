import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateComponent from "./components/PrivateComponent";

import Chat from "./components/Chat";
import ViewChat from "./components/ViewChat";
import NoChatSelected from "./components/NoChatSelected";
import "./App.css";
import Login from "./components/Login";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateComponent />}>
            <Route path="/chat" element={<Chat />}>
              <Route index element={<NoChatSelected />} />
              <Route path="/chat/:id" element={<ViewChat />} />
            </Route>
          </Route>

          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
