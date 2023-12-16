import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


import Addfriend from "./components/Addfriend";
import Friendrequests from "./components/Friendrequests";
import SidebarHeader from "./components/SidebarHeader";
import Inbox from "./components/Inbox";
import MessageHeader from "./components/MessageHeader";
import ChatArea from './components/ChatArea';


// const sidebarHeaderHeight = document.querySelector('.sidebarheader').offsetHeight;
// const searchBarHeight = document.querySelector('.searchbar').offsetHeight;

const socket = io.connect('http://localhost:3000/');

export default function Mainpage() {
    const [inbox, setInbox] = useState([]);
    const [messages, setMessages] = useState([]);
    const [roomid, setRoomid] = useState('');
    const [currentUserInfo, setCurrentUserInfo] = useState({ id: '', name: '', _id: '' });
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [reload, setReload] = useState(1);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem('auth-token');

        if (!token) {
            setLoading(false);
            navigate('/login');
            return;
        }
        token = `Bearer ${token}`;


        async function checkAuth() {
            try {
                const response = await axios.get('http://localhost:3000/inbox', {
                    headers: {
                        'Authorization': token
                    }
                });
                localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                setInbox(response.data.conversations);
                console.log(response.data.conversations);
                setLoading(false);
                console.log('A user has opened the main page');
                socket.emit('join_room', response.data.user._id);
            }
            catch (err) {
                alert('Please Log In again')
                navigate('/login');
            }
        }
        checkAuth();

    }, [reload]);

    //SOCKET for receiving messages
    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((messages) => [...messages, { body: data, sender: 0 }]);
            setReload((reload) => reload + 1);
        });

        socket.on('reload_conversations', () => {
            setReload((reload) => reload + 1);
        });

        return () => {
            socket.off('receive_message');
            socket.off('reload_conversations');
        }
    }, [socket]);

    //SOCKET for joining room and getting messages
    useEffect(() => {
        console.log('joining room');

        socket.emit('join_room', roomid);

        async function getMessages() {
            try {
                const response = await axios.get('http://localhost:3000/messages', {
                    params: {
                        roomid: roomid
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                    }
                });
                setMessages(response.data.messages);
            }
            catch (err) {
                console.error(err.response.data);
            }
        }
        getMessages();

    }, [roomid]);

    function handleEmojiClick() {
        setShowEmoji(!showEmoji)
    }

    async function handleMessageSubmit(e: any) {
        e.preventDefault();
        const message = e.target.message.value;
        if (message === '') return;

        const temp = [...messages, { body: message, sender: userInfo._id }];

        setMessages(temp);
        e.target.message.value = '';
        const response = await socket.emitWithAck('message', { message, roomid, sender: userInfo._id, receiver: currentUserInfo._id });
        setReload(reload + 1);
    }

    function handleOutsideClick(e) {
        if (!e.target.closest('.messagebar')) {
            setShowEmoji(false);
        }
    };

    if (loading) {
        return (
            <div className="text-[60px] flex flex-col justify-center items-center">Loading...</div>
        )
    }

    return (
        <>

            <div className="mainwrapper flex w-screen" onClick={handleOutsideClick}>
                <div className="sidebar bg-white h-screen flex-1 flex flex-col">

                    <SidebarHeader userInfo={userInfo} setShowAddFriend={setShowAddFriend} setShowRequests={setShowRequests} />

                    <div className="searchbar p-3 mx-5 my-2 bg-[#e4e4e4] flex gap-3 items-center rounded-lg flex-grow-0 flex-shrink-0" >
                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#707070" }}></i>
                        <input type="text" name="searchusers" id="searchusers" className="bg-transparent outline-none placeholder:text-[#696969]" placeholder="Search here..." />
                    </div>

                    <Inbox inbox={inbox} setRoomid={setRoomid} setCurrentUserInfo={setCurrentUserInfo} setFirstLoad={setFirstLoad} />
                </div>
                <div className="messagemain h-screen flex-3 flex flex-col justify-between">
                    {firstLoad ? null :
                        <>
                            <MessageHeader currentUserInfo={currentUserInfo} />


                            <ChatArea messages={messages} showEmoji={showEmoji} setShowEmoji={setShowEmoji} userInfo={userInfo} />

                            <div className="messagebar flex-grow-0 flex-shrink-0 justify-self-end px-2">
                                <form onSubmit={handleMessageSubmit} autoComplete="off">
                                    <div className="messageinput flex items-center justify-between gap-4 ">
                                        <div className="flex justify-between w-full bg-white px-5 py-3 rounded-md">
                                            <input type="text" name="message" id="message" className="bg-transparent outline-none w-full placeholder:text-[#696969]" placeholder="Type a message..." />
                                            <div className="flex items-center gap-2">
                                                <div className="option w-7 h-7 rounded-[50%] border-primary-blue border-[2px] flex items-center justify-center cursor-pointer">
                                                    <i className="fa-solid fa-plus" style={{ color: "#3978d3" }}></i>
                                                </div>
                                                <div
                                                    className="option w-7 h-7 rounded-[50%] border-primary-blue border-[2px] flex items-center justify-center cursor-pointer"
                                                    onClick={handleEmojiClick}
                                                >
                                                    <i className="fa-solid fa-smile" style={{ color: "#3978d3" }}></i>
                                                </div>
                                                <div className="option w-7 h-7 rounded-[50%] border-primary-blue border-[2px] flex items-center justify-center cursor-pointer">
                                                    <i className="fa-solid fa-paperclip" style={{ color: "#3978d3" }}></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <button>
                                                <div className="option w-7 h-7 rounded-[50%] bg-primary-blue flex items-center justify-center">
                                                    <i className="fa-solid fa-paper-plane" style={{ color: "#ffffff" }}></i>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>


                        </>
                    }
                </div>
                <div className="description hidden flex-1">

                </div>
            </div>

            {showAddFriend ? <Addfriend setShowAddFriend={setShowAddFriend} userInfo={userInfo} /> : null}
            {showRequests ? <Friendrequests setShowFriendRequests={setShowRequests} setReload={setReload} reload={reload} socket={socket}/> : null}
        </>
    )
}