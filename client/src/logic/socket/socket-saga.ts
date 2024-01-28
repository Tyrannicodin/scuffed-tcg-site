import {getUser} from 'logic/session/session-selectors'
import socket from 'socket'
import store from 'store'

export type ServerMessage = {
	type: string
	payload?: any
}

export const receiveMsg = (type: string) => {
	return new Promise<ServerMessage>((resolve) => {
		const listener = (message: ServerMessage) => {
			resolve(message)
		}
		socket.once(type, listener)
	})
}

export const sendMsg = (message: ServerMessage) => {
	const user = getUser(store.getState())
	socket.emit(message.type, {
		type: message.type,
		payload: message.payload,
		auth: user
			? {
					uuid: user.uuid,
					secret: user.secret,
				}
			: undefined,
	})
}
