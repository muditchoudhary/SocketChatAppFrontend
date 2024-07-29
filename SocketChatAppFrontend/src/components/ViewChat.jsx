import React, { useEffect, useState } from "react";
import profile3 from "../assets/images/profile3.png";
import { Input } from "@chakra-ui/react";
import backbg from "../assets/images/backbg.png";
import { BACKEND_URL } from "./globalConstatnt";
import { useParams } from "react-router-dom";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";

function ViewChat() {
  const [friend, setFriend] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    fetchSingleUser();
  }, []);

  const fetchSingleUser = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("user"));
      // if (!auth || !auth.token) {
      //   throw new Error("No auth token found");
      // }

      const response = await fetch(
        `${BACKEND_URL}/user/singleUser/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const results = await response.json();

      setFriend(results.result);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };
  
  const blockUser = async (currentStatus) => {
    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem("user"));
  
      if (!auth || !auth.token) {
        throw new Error("No auth token found");
      }
  
      const requestBody = {
        block: !currentStatus,
      };
  
      
      
  
      const response = await fetch(
        `${BACKEND_URL}/user/blockUser/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Error: ${JSON.stringify(errorData)}`);
      }
  
      const result = await response.json();
     
  
      // Update the state with the new block status
      setFriend((prevFriend) => ({
        ...prevFriend,
        blockStatus: !currentStatus,
      }));
  
     
    } catch (error) {
      console.error("Fetch error: ", error);
      alert(`Failed to update user status. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      <div className="personchats-right">
        <div className="personchats-topprofile">
          <div className="myrow">
            <div className="my-col-11">
              <ul>
                <li>
                  <img src={profile3} alt="" />
                </li>
                <li>
                  <h5>{friend.userName}</h5>
                  <span>Tyoing....</span>
                </li>
              </ul>
            </div>
            <div className="col-md-1">
              <div className="blockdiv">
                <Popover>
                  <PopoverTrigger>
                    <Button>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <button onClick={()=> blockUser(friend.blockStatus)}>
                        <i className="fa-solid fa-ban"></i> {friend.blockStatus ?"Unblock" :"Block" }
                      </button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
       {friend.blockStatus ? `${friend.userName} is Blocked`:<><div className="chatcmn" style={{ backgroundImage: `url(${backbg})` }}>
          <div className="mytext-left">hii</div>
          <div className="mytext-right">
            Hello
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mytext-left">Who are you?</div>
          <div className="mytext-right">
            I am the sum of my experiences, aspirations, and beliefs.
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mytext-left">What defines you?</div>
          <div className="mytext-right">
            My choices and how I respond to challenges define who I am.
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mytext-left">How do you see yourself?</div>
          <div className="mytext-right">
            I see myself as a work in progress, constantly evolving and
            learning.
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mytext-left">What motivates you?</div>
          <div className="mytext-right">
            The pursuit of growth and making a positive impact in the world
            drive me forward.
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mytext-left">What are your strengths?</div>
          <div className="mytext-right">
            Adaptability, resilience, and empathy are among my strongest
            qualities.
            <Popover>
              <PopoverTrigger>
                <Button>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <button>
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <br />
                  <button>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="typing-input">
          <div className="myrow">
            <div className="my-col-10">
              <Input placeholder="Type a message" size="md" />
            </div>
            <div className="my-col-2">
              <i className="fa-regular fa-paper-plane"></i>
            </div>
          </div>
        </div></> }  
        
      </div>
    </>
  );
}

export default ViewChat;
