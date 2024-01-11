import socket from 'socket'

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
