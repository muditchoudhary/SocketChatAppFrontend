import React from 'react';
// import profile from '../assets/images/profile.png';
import profile2 from '../assets/images/profile2.png';
// import backbg from '../assets/images/backbg.png';
// import { Input } from '@chakra-ui/react'
import AllPerson from './AllPerson';
import ViewChat from './ViewChat';


function chat() {
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
                                                    <h5>My Name</h5>
                                                </li>
                                            </ul>
                                        </div>
                                        <AllPerson/>
                                    </div>
                                </div>
                                <div className="my-col-9 person-chatright">
                                    <ViewChat/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}

export default chat;