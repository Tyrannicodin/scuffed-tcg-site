import {Server} from 'socket.io'
import {CONFIG} from '../../common/config'
import {getUsers} from './login/login-selectors'
import store from './stores'
import version from './version'
import env from 'env-var'

const nodeEnv = env.get('NODE_ENV').asString() || 'development'
const isValidVersion = (clientVersion: string) => {
	if (nodeEnv === 'development') {
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
		const clientVersion = socket.handshake.auth?.version || ''
		if (!isValidVersion(clientVersion)) {
			console.log('Invalid version: ', clientVersion)
			return next(new Error('invalid_version'))
		}
		next()
	})

	io.on('connection', (socket) => {
		const unauthorisedHandler = (message: any) => {
			if (!message.type) return
			store.dispatch({...message, socket})
		}

		store.dispatch({
			type: 'CLIENT_CONNECTED',
			payload: socket,
		})
		socket.on('LOGIN', unauthorisedHandler)
		socket.on('SIGNUP', unauthorisedHandler)
		socket.on('OTP_LOGIN', unauthorisedHandler)
		socket.onAny((event, message) => {
			if (!message?.type) return
			if (!message?.auth || !message.auth.uuid || !message.auth.secret) return
			const user = getUsers(store.getState())[message.auth.secret]
			if (!user || message.auth.uuid !== user.uuid) return
			store.dispatch({...message, user, socket})
		})
		socket.on('disconnect', () => {
			store.dispatch({
				type: 'CLIENT_DISCONNECTED',
				payload: {},
				socket: socket,
			})
		})
	})
}

export default startSocketIO
