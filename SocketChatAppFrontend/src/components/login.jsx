import React from 'react'
import { Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import logo from '../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'


function login() {
    const navigate = useNavigate()
    const submitLogin = (e) =>{
     e.preventDefault()
     navigate("/Chat")
    }
    return (
        <>
            <div className="login-card">
                <br/>
                <br/>
                <form action="" onSubmit={submitLogin}>
                    <div className="login-cardlogo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="logincard-input">
                        <label htmlFor="">Username</label>
                        <Input type='text' placeholder='Username' size='md' pattern='[A-Za-z ]+' title='Fill the Name only' required />
                    </div>
                    <div className="logincard-input">
                        <label htmlFor="">Password</label>
                        <Input minLength={8} maxLength={10} type='password' placeholder='Password' size='md' required/>
                    </div>
                    <br />
                    <Button type='submit'>Submit</Button>
                </form>
            </div>
        </>
    )
}

export default login