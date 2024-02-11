import {disconnect} from 'logic/session/session-actions'
import io from 'socket.io-client'
import store from 'store'

const getClientVersion = () => {
	const scriptTag = document.querySelector(
		'script[src^="/assets/index"][src$=".js"]'
	) as HTMLScriptElement | null
	if (!scriptTag) return null

	return scriptTag.src.replace(/^.*index-(.+)\.js/i, '$1')
}

const url =
	__ENV__ === 'development'
		? `${window.location.protocol}//${window.location.hostname}:${__PORT__}`
		: window.location.protocol + '//' + window.location.host

console.log(url)
console.log(getClientVersion())
const socket = io(url, {autoConnect: false, auth: {version: getClientVersion()}})

socket.on('error', (error) => {
	console.log('Socket error: ', error)
})

socket.on('disconnect', () => {
	store.dispatch(disconnect('Logged out'))
})

export default socket
