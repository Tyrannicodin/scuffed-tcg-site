import {all, fork} from 'typed-redux-saga'
import {entrySaga} from '../login/login-saga'
import {cardsSaga} from './cards-saga'
import {tradeSaga} from './trades-saga'
import { User } from '../../../common/models/user'
import { Socket } from 'socket.io'

export const sendUpdatedUser = (user: User, socket:Socket) => {
	socket.emit('UPDATE_USER', {
		type: 'UPDATE_USER',
		payload: user
	})
}

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(entrySaga), fork(cardsSaga), fork(tradeSaga)])
}

export default rootSaga
