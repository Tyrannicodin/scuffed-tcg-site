import {all, fork, put} from 'typed-redux-saga'
import {entrySaga} from '../login/login-saga'
import {cardsSaga} from './cards-saga'
import {tradeSaga} from './trades-saga'
import {User} from '../../../common/models/user'
import {Socket} from 'socket.io'
import {updateUserState} from 'login/login-actions'
import {updateUserInfo} from 'db/user'

export function* updateUser(user: User, socket: Socket) {
	const newUser: User = yield updateUserInfo(user)
	yield put(updateUserState(newUser))
	socket.emit('UPDATE_USER', {
		type: 'UPDATE_USER',
		payload: newUser,
	})
}

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(entrySaga), fork(cardsSaga), fork(tradeSaga)])
}

export default rootSaga
