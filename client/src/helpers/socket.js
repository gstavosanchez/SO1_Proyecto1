import io from 'socket.io-client';
const socket = io('http://localhost:4000/');

export default socket;

// useEffect(() => {
//   socket.on('chat message', (data) => {
//     setMsgList([...data]);
//   });
// }, [socket, msgList, msg]);

// socket.emit('chat message', msg);
