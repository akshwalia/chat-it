import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Friendrequests({ setShowFriendRequests, setReload, reload }) {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [AcceptLoading, setAcceptLoading] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function getRequests() {
            try {
                const response = await axios.get('http://localhost:3000/friendrequests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                    }
                });
                setFriendRequests(response.data);
                setLoading(false);
            }
            catch (err) {
                console.error(err.response.data);
                setError('There was some error fetching requests right now. Please try again later.')
            }
        }
        getRequests();
    }, []);

    async function handleAccept(e) {
        setAcceptLoading(e.target.id);
        try {
            const response = await axios.post('http://localhost:3000/acceptrequest', {
                friendId: e.target.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                }
            });
            console.log(response.data);
            setFriendRequests(friendRequests.filter((req) => req._id !== e.target.id));
            setReload(reload + 1);
        }
        catch (err) {
            console.error(err.response.data);
        }
    }

    async function handleReject(e) {
        setAcceptLoading(e.target.id);
        try {
            const response = await axios.post('http://localhost:3000/rejectrequest', {
                friendId: e.target.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`
                }
            });
            console.log(response.data);
            setFriendRequests(friendRequests.filter((req) => req._id !== e.target.id));
            
        }
        catch (err) {
            console.error(err.response.data);
        }
    }

    function handleOutsideClick(e) {
        if (e.target.classList.contains('backdrop')) {
            setShowFriendRequests(false);
        }
    }

    return (
        <>
            <div className="backdrop absolute w-screen h-screen top-0 left-0 backdrop-blur-sm flex flex-col justify-center items-center" onClick={handleOutsideClick}>
                <div className="popup bg-white rounded-md p-5 flex flex-col items-center gap-3 w-[300px]">
                    <h2 className="text-[#707070] font-bold text-[20px]">Friend Requests</h2>
                    {loading ? <p>Loading...</p> :
                        error ? <p className="text-red-500">{error}</p> :
                            friendRequests.length === 0 ? <p>No friend requests</p> :

                                friendRequests.map((req) => {
                                    return (
                                        <div className="req flex justify-between w-full">
                                            <div className="flex gap-5 items-center">
                                                <img src='https://picsum.photos/id/294/150' alt="" className="w-10 h-10 rounded-full" />
                                                <p className='text-[17px]'>{req.username}</p>
                                            </div>
                                            {AcceptLoading === req._id ? <i className="fa-solid fa-spinner" style={{ color: "#707070" }}></i> :
                                                <div className='flex gap-5'>
                                                    <button className="approve">
                                                        <i className="fa-solid fa-check" style={{ color: "#707070" }} id={req._id} onClick={handleAccept}></i>
                                                    </button>
                                                    <button className='reject'>
                                                        <i className="fa-solid fa-xmark" style={{ color: "#707070" }} id={req._id} onClick={handleReject}></i>
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                                )}
                </div>
            </div>
        </>
    )
}