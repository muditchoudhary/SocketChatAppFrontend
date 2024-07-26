import React, { useEffect, useState } from 'react'
import profile from '../assets/images/profile.png';
import { Input } from '@chakra-ui/react'
import { BACKEND_URL } from './globalConstatnt';
import { useNavigate } from 'react-router-dom';

function AllPerson() {
    const [allUser, setAllUser] = useState([])
   

    const navigate = useNavigate();

    async function fetchUsers(){
        try {
            
            const auth = JSON.parse(localStorage.getItem("user"));
            
            
            // if (!auth || !auth.token) {
            //   throw new Error("No auth token found");
            // }
      
            const response = await fetch(`${BACKEND_URL}/user/getUser`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `${auth.token}`,
              },
            });
      
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
      
            const results = await response.json();
            if (results.message === 'Users fetched') {
                // Filter out the logged-in user
                const filteredUsers = results.allUser.filter(user => user._id !== auth.user._id);
                setAllUser(filteredUsers);
            }
            // setAllUser(results.allUser);
            

          } catch (error) {
            console.error("Fetch error: ", error);
          } 
    }
    

    useEffect(()=>{
        fetchUsers();

    },[])

    

    const navigateChat = (id)=>{
        
         navigate(`/chat/${id}`)

    }
    
    

    return (
        <>
            <div className="person-search">
                <Input placeholder='Search Person' size='md' />
            </div>
            <div className="chatleft-allperson">
                {allUser.map((item,index)=>(
                    <div className="person-chats"  key={index} onClick={() => navigateChat(item._id)}>
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>{item.userName}</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                ))}
                
            </div>
        </>
    )
}

export default AllPerson