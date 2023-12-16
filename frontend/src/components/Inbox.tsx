import moment from 'moment';
import Userlist from './Userlist';

const ids = [222,223,224,225,238,239,240,241,242,243,244];


export default function Inbox({inbox, setRoomid, setCurrentUserInfo, setFirstLoad}) {
    return (
        <div className="userlist h-[585px] my-2 overflow-scroll">
            {inbox.map((conversation) => {
                let formattedTime = '';
                const date = new Date(conversation.last_sent_time);
                if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
                    formattedTime = moment(date).format('hh:mm A');
                }
                else if (date.getDate() === new Date().getDate() - 1 && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
                    formattedTime = 'Yesterday';
                }
                else {
                    formattedTime = moment(date).format('DD/MM/YYYY');
                }

                if (conversation.last_message.length > 20) {
                    conversation.last_message = conversation.last_message.slice(0, 25) + '...';
                };

                return (
                    <Userlist id={234} 
                        owner={conversation.owner}
                        hash={conversation.conversation_hash} 
                        name={conversation.friend_name} 
                        message={conversation.last_message} 
                        time={formattedTime} 
                        unread={conversation.unread_count} 
                        setRoomid={setRoomid} 
                        setCurrentUserInfo={setCurrentUserInfo}
                        setFirstLoad={setFirstLoad}/>
                )
            }
            )}
        </div>
    )
}