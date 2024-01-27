import {all, fork} from 'typed-redux-saga'
import {entrySaga} from '../login/login-saga'
import {cardsSaga} from './cards-saga'
import {tradeSaga} from './trades-saga'

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(entrySaga), fork(cardsSaga), fork(tradeSaga)])
}

export default rootSaga
