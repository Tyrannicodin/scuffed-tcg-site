import {Server} from 'socket.io'
import {CONFIG} from '../../common/config'
import store from './stores'
import version from './version'

const env = process.env.NODE_ENV || 'development'
const isValidVersion = (clientVersion: string) => {
	if (env === 'development') {
		return true
	}
	return version === clientVersion
}

function startSocketIO(server: any) {
	const io = new Server(server, {
		cors: {
			origin: CONFIG.cors,
			methods: ['GET', 'POST'],
		},
	})

	io.use((socket, next) => {
		const playerName = socket.handshake.auth?.playerName || ''
		const clientVersion = socket.handshake.auth?.version || ''
		if (!isValidVersion(clientVersion)) {
			console.log('Invalid version: ', clientVersion)
			return next(new Error('invalid_version'))
		}
		next()
	})

	io.on('connection', (socket) => {
		// TODO - use playerSecret to verify requests
		// TODO - Validate json of all requests

		store.dispatch({
			type: 'CLIENT_CONNECTED',
			payload: {socket},
		})
		socket.onAny((event, message) => {
			if (!message?.type) return
			store.dispatch({...message, socket})
		})
		socket.on('disconnect', () => {
			store.dispatch({
				type: 'CLIENT_DISCONNECTED',
				payload: {socket},
			})
		})
	})
}

export default startSocketIO
