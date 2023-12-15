import Message from "./message";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function ChatArea({ messages, showEmoji, setShowEmoji, userInfo}) {
    function handleEmojiSelection(e) {
        const input = document.getElementById('message');
        input.value += e.native;
        input?.focus();
    }

    return (
        <div className="messages relative overflow-scroll h-[600px] flex flex-col-reverse">
            <div className="message flex flex-col gap-2 p-5 text-[16px]">
                {
                    messages.map((message) => {
                        return (
                            <Message message={message.body} user={message.sender === userInfo._id ? 1 : 0} />
                        )
                    })
                }
            </div>

            {
                showEmoji ? <div className="absolute top-[27%] right-24">
                    <Picker data={data} onEmojiSelect={handleEmojiSelection} emojisize={20} />
                </div> : null
            }
        </div>
    )
}