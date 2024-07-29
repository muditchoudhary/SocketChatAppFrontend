import React from "react";

import { useNavigate } from "react-router-dom";

// import profile from '../assets/images/profile.png';
import profile2 from "../assets/images/profile2.png";
// import backbg from '../assets/images/backbg.png';
// import { Input } from '@chakra-ui/react'
import AllPerson from "./AllPerson";
import ViewChat from "./ViewChat";

function chat() {
  const auth = JSON.parse(localStorage.getItem("user"));
  
  const navigate = useNavigate();

  function handleLogout () {
    console.log("logout")
    localStorage.removeItem("user");
    
    navigate("/");
  };

  return (
    <>
      <section>
        <div className="home-wp">
          <div className="mycontainer">
            <div className="home-sec">
              <div className="myrow">
                <div className="my-col-3 leftchat-profile">
                  <div className="chatleft">
                    <div className="chatleft-myprofile">
                      <ul>
                        <li>
                          <img src={profile2} alt="" />
                        </li>
                        <li>
                          <h5>{auth.user.userName}</h5>
                        </li>
                        <li> <button onClick={()=>handleLogout()}><p style={{paddingLeft:"124px", fontSize:"11px"}}>Logout</p></button></li>
                      </ul>
                    </div>
                    <AllPerson />
                  </div>
                </div>
                <div className="my-col-9 person-chatright">
                  {/* <ViewChat/> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default chat;
