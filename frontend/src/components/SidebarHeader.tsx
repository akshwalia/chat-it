import { useNavigate } from "react-router-dom";
export default function SidebarHeader({ userInfo, setShowAddFriend, setShowRequests }) {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    }

    return (
        <div className="sidebarheader bg-[#e8e8e8] flex flex-grow-0 flex-shrink-0 items-center justify-between px-6 py-4">
            <div className="flex gap-2 items-center">
                <img src="https://picsum.photos/id/237/200" alt="" className="w-10 h-10 rounded-[50%]" />
                <div className="" >{userInfo.name}</div>
            </div>
            <div className="flex gap-2">
                <div onClick={() => setShowAddFriend(true)} className="option w-7 h-7 rounded-[50%] bg-primary-blue flex items-center justify-center cursor-pointer">
                    <i className="fa-solid fa-plus" style={{ color: "#ffffff" }}></i>
                </div>    
                <div onClick={() => setShowRequests(true)} className="option w-7 h-7 rounded-[50%] bg-primary-blue flex items-center justify-center cursor-pointer">
                <i className="fa-solid fa-user-group fa-xs" style={{ color: "#ffffff" }}></i>
                </div>
                <div onClick={logout} className="option w-7 h-7 rounded-[50%] border-primary-blue border-[2px] flex items-center justify-center cursor-pointer">
                    <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: "#3978d3" }}></i>
                </div>
            </div>
        </div>
    )
}