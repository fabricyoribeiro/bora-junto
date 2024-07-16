import {io} from 'socket.io-client'

export const socket = () => io(process.env.EXPO_PUBLIC_SOCKET_BASE_URL, {
    reconnection: false
})