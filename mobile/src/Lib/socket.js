import {io} from 'socket.io-client'

export const socket = () => io('http://10.0.0.103:3030', {
    reconnection: false
})