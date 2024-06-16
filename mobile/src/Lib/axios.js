import axios from 'axios'

//colocar seu ip
export const api = axios.create({
    baseURL: 'http://10.0.0.103:3030'
})