import axios from 'axios'

//colocar seu ip
export const api = axios.create({
    baseURL: 'http://192.168.1.108:3030'
})