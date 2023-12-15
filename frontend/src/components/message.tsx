export default function Message({message, user=0}) {
    let className;
    if(user==1) 
        className = 'messagecontent bg-primary-blue text-white self-end rounded-lg p-2 max-w-[550px]';
    else
        className = 'messagecontent bg-white self-start rounded-lg p-2 max-w-[550px]'
    return (
        <div className={className}>
            <p >{message}</p>
        </div>
    )
}