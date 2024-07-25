import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Login from './components/login';
import Chat from './components/chat';
import ViewChat from './components/ViewChat';
// import AllPerson from './components/AllPerson';


function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path = "/chat/:id" element={<ViewChat/>}/>
          {/* <Route path="/Allperson" element={<AllPerson />} /> */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;