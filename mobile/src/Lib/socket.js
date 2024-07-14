import {io} from 'socket.io-client'

export const socket = () => io('http://10.0.0.106:3030', {
    reconnection: false
})