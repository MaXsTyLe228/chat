import React, {useEffect, useRef, useState} from "react";

const ServerTemperature: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([])
    const [value, setValue] = useState('')
    const socket = new WebSocket(`ws://localhost:5000`)
    const webSocket = useRef(socket).current
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        webSocket.send(JSON.stringify(message));
        setValue('')
    }

    const connect = () => {
        //webSocket.onopen = () => {
        setConnected(true)
        const message = {
            event: 'connection',
            username: username,
            message: value,
            id: Date.now()
        }
        webSocket.send(JSON.stringify(message))
        //}
        webSocket.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message])
        };
        webSocket.onclose = () => {
            setConnected(false);
            console.log('closed')
        };
        webSocket.onerror = () => {
            console.log('error')
        };
    }

    const clickConnect = () => {
        connect()
    }
    return (
        <div>
            {!connected && <div className="flex ">
                <div className="flex border-2 m-3 p-5 w-fit rounded">
                    <input type="text"
                           className="border-2 mr-2 rounded"
                           value={username}
                           onChange={e => setUsername(e.target.value)}
                           placeholder="Enter your name"/>
                    <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={connect}
                    >Enter
                    </button>
                </div>
            </div>}
            {connected && <div>
                <div className="flex border-2 m-3 p-5 w-fit rounded">
                    <input type="text"
                           value={value}
                           onChange={e => setValue(e.target.value)}
                           className="border-2 mr-2 rounded"
                           placeholder="Enter message"/>
                    <button
                        onClick={sendMessage}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >Send message
                    </button>
                </div>
                <div>
                    {messages.map((message, key) => (
                        <div key={key}>
                            {message.event === 'connection'
                                ? <div>User {message.username} connected</div>
                                : <div>{message.username}: {message.message}</div>
                            }
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default ServerTemperature;