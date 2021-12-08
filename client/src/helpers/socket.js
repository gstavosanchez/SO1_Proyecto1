import { w3cwebsocket } from 'websocket';

const socket = new w3cwebsocket('ws://localhost:5000/ws');

export default socket;

// useEffect(() => {
//   socket.on('chat message', (data) => {
//     setMsgList([...data]);
//   });
// }, [socket, msgList, msg]);

// socket.emit('chat message', msg);
