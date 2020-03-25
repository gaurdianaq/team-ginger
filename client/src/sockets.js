import io from 'socket.io-client'
export const socket = io('http://mentions-crawler.herokuapp.com', {
    autoConnect: false
});