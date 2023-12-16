
export default function MessageHeader({currentUserInfo}) {
    return (
        <div className="messageheader bg-white flex-grow-0 flex-shrink-0 flex justify-between px-8 py-4 items-center ">
            <div className="flex gap-2 items-center">
                <img src={`https://picsum.photos/id/${currentUserInfo.id}/200`} alt="" className="w-10 h-10 rounded-[50%]" />
                <div className="">{currentUserInfo.name}</div>
            </div>
            <div className="flex gap-2">
                <div className="option w-7 h-7 rounded-[50%] border-primary-blue border-[2px] flex items-center justify-center">
                    <i className="fa-solid fa-gear" style={{ color: "#3978d3" }}></i>
                </div>
            </div>
        </div>
    )
}