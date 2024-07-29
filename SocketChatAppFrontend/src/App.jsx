import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Login from "./components/Login";
import Chat from "./components/Chat";
import ViewChat from "./components/ViewChat";
import NoChatSelected from "./components/NoChatSelected";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />}>
            <Route index element={<NoChatSelected />} />
            <Route path="/chat/:id" element={<ViewChat />} />
          </Route>

          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/Allperson" element={<AllPerson />} /> */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
