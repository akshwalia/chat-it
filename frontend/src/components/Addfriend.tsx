import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Addfriend({ setShowAddFriend, userInfo }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [friends, setFriends] = useState([]);


    useEffect(() => {
        async function getUsers() {
            try {
                let [users, friends, friend_req_sent] = await Promise.all(
                    [axios.get('http://localhost:3000/users', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                        }
                    }), axios.get('http://localhost:3000/friends', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                        }
                    }), axios.get('http://localhost:3000/friendreqsent', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                        }
                    })]);
                users.data = users.data.filter((user) => user._id !== userInfo._id);
                setUsers(users.data);
                console.log(users.data);
                setFriends(friends.data.friends);
                setFriendRequestsSent(friend_req_sent.data.friend_requests_sent);
                setLoading(false);
            }
            catch (err) {
                console.error(err.response.data);
                setError('There was some error fetching users right now. Please try again later.')
            }
        }
        getUsers();
    }, []);

    async function handleSearch(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/users', {
                params: {
                    query: e.target.value
                }
            });
            setUsers(response.data);
            setLoading(false);
        }
        catch (err) {
            console.error(err.response.data);
            setError('There was some error fetching users right now. Please try again later.')
        }
    }

    async function handleAddFriend(e) {
        e.preventDefault();
        console.log(e.target.id);
        setFriendRequestsSent([...friendRequestsSent, e.target.id]);
        try {
            const response = await axios.post('http://localhost:3000/addfriend', {
                friendId: e.target.id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                }
            });
            console.log(response.data);
        }
        catch (err) {
            console.error(err.response.data);
        }
    }


    function handleOutsideClick(e) {
        if (e.target.classList.contains('backdrop')) {
            setShowAddFriend(false);
        }
    }

    return (
        <>
            <div className="backdrop absolute w-screen h-screen top-0 left-0 backdrop-blur-sm flex flex-col justify-center items-center" onClick={handleOutsideClick}>
                <div className="popup bg-white rounded-md p-5 flex flex-col items-center gap-3">
                    <h2 className="text-[#707070] font-bold text-[20px]">Add Friend</h2>
                    <div className="searchbar p-3 my-2 w-[300px] bg-[#e4e4e4] flex gap-3 items-center rounded-lg" >
                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#707070" }}></i>
                        <input type="text" name="searchusers" id="searchusers" onChange={handleSearch} className="bg-transparent outline-none placeholder:text-[#696969]" placeholder="Search here..." />
                    </div>
                    {loading ? <p>Loading...</p> :
                        error ? <p className="text-red-500">{error}</p> :
                            users.map((user) => {
                                return (
                                    <div className="user flex justify-between w-full">
                                        <div className="flex gap-5 items-center">
                                            <img src='https://picsum.photos/id/294/150' alt="" className="w-10 h-10 rounded-full" />
                                            <p className='text-[17px]'>{user.username}</p>
                                        </div>
                                        <button className="addfriend">
                                            {friends.includes(user._id) ?
                                                <i className="fa-solid fa-check" style={{ color: "#707070" }}></i> :
                                                friendRequestsSent.includes(user._id) ?
                                                    <i className="fa-solid fa-clock" style={{ color: "#707070" }}></i> :
                                                    <i className="fa-solid fa-plus" style={{ color: "#707070" }} id={user._id} onClick={handleAddFriend}></i>
                                            }
                                        </button>
                                    </div>
                                )
                            }
                            )}
                </div>
            </div>
        </>
    )
}