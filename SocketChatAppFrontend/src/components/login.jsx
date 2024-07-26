import React, { useState } from 'react'
import { Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import logo from '../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from './globalConstatnt'


function login() {
    const [userName,setUserName] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()


    const submitLogin = async (e) =>{
     e.preventDefault()
     
     
     console.log(userName,password)
     try {
      
        let response = await fetch(`${BACKEND_URL}/user/login`, {
          method: "POST",
          body: JSON.stringify({
             userName : userName, 
             password : password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
       
  
        const result = await response.json();
        
  
        if (result.message=="Incorrect password") 
           return alert("Incorrect Password")
        console.log("four")
        if (result) {
           localStorage.setItem("user", JSON.stringify(result));
            
            navigate("/chat");
  
            alert("Welcome " + result.user.userName);
            
        }
        
            
          
    


      } catch (error) {
        console.error("There was an error during the fetch operation:", error);
        alert("An error occurred. Please try again.");
      } 


    
    }
    return (
        <>
            <div className="login-card">
                <br/>
                <br/>
                <form action="" >
                    <div className="login-cardlogo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="logincard-input">
                        <label htmlFor="">Username</label>
                        <Input type='text' placeholder='Username' size='md' onChange={(e)=>{setUserName(e.target.value)}} pattern='[A-Za-z ]+' title='Fill the Name only' required />
                    </div>
                    <div className="logincard-input">
                        <label htmlFor="">Password</label>
                        <Input minLength={8} maxLength={10} type='password' onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password' size='md' required/>
                    </div>
                    <br />
                    <Button onClick={submitLogin}>Submit</Button>
                </form>
            </div>
        </>
    )
}

export default login