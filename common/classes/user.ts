import {Socket} from 'socket.io'
import {Uuid} from '../types/user'

export class User {
	public uuid: Uuid
	public userSecret: string
	public socket: Socket
	public username: string
	public tokens: number
	public picture: string | null
	public is_admin: boolean

	constructor(
		uuid: Uuid,
		userSecret: string,
		username: string,
		tokens: number,
		picture: string | null,
		is_admin: boolean,
		socket: Socket
	) {
		this.uuid = uuid
		this.userSecret = userSecret
		this.username = username
		this.tokens = tokens
		this.picture = picture
		this.is_admin = is_admin
		this.socket = socket
	}
}
