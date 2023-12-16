export default function Userlist({id, owner,hash, name, message, time, unread, setRoomid, setCurrentUserInfo, setFirstLoad}) {

    function handleClick() {
        setCurrentUserInfo({id, name, _id: hash.replace(owner, '')});
        setRoomid(hash);
        setFirstLoad(false);
    }

    return (
        <div className="user py-4 px-5 flex justify-between hover:bg-primary-gray cursor-pointer" onClick={handleClick}>
            <div className="flex gap-5 items-center">
                <img src={`https://picsum.photos/id/${id}/200`} alt="" className="w-14 h-14 rounded-[50%]" />
                <div className="username">
                    <div className="font-bold">{name}</div>
                    <div className="opacity-[85%] text-sm">{message}</div>
                </div>
            </div>
            
            <div className="flex flex-col items-end justify-around">
                <div className="opacity-[85%] text-sm">{time}</div>
                {unread!==0 && <div className="bg-primary-blue rounded-[40%] text-[10px] px-2 py-1 text-white">{unread}</div>}
            </div>
        </div>
    )
}