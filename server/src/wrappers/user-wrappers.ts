import {User} from '../../../common/classes/user.ts'
import {Uuid} from '../../../common/types/user.ts'
import {selectUserRowFromUuid} from '../db/db.ts'
import {Socket} from 'socket.io'

export async function createUserFromUuid(uuid: Uuid, socket: Socket): Promise<User | null> {
	const result = await selectUserRowFromUuid(uuid)

	if (!result) return null

	const userSecret = Math.random().toString()

	return new User(
		uuid,
		userSecret,
		result.username,
		result.tokens,
		result.picture,
		result.is_admin,
		socket
	)
}
