import axios from 'axios'

export const API = axios.create({
	URL: 'http://127.0.0.1:3000/'
})