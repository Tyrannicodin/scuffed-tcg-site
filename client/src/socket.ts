import {disconnect} from 'logic/session/session-actions'
import io from 'socket.io-client'
import store from 'store'

const url =
	__ENV__ === 'development'
		? `${window.location.protocol}//${window.location.hostname}:${__PORT__}`
		: window.location.protocol + '//' + window.location.host

console.log(url)
const socket = io(url, {autoConnect: false})

socket.on('error', (error) => {
	console.log('Socket error: ', error)
})

socket.on('disconnect', () => {
	store.dispatch(disconnect('Logged out'))
})

export default socket
