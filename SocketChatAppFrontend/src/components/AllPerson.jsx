import React from 'react'
import profile from '../assets/images/profile.png';
import { Input } from '@chakra-ui/react'

function AllPerson() {
    return (
        <>
            <div className="person-search">
                <Input placeholder='Search Person' size='md' />
            </div>
            <div className="chatleft-allperson">
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span2>send 4:40pm</span2>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span2>send 3:40pm</span2>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
                <div className="person-chats">
                    <ul>
                        <li>
                            <img src={profile} alt="" />
                        </li>
                        <li>
                            <h5>My Name</h5>
                            <span>seen</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default AllPerson