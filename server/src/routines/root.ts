import {all, fork} from 'typed-redux-saga'
import {entrySaga} from './login-saga'
import {cardsSaga} from './cards-saga'

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(entrySaga), fork(cardsSaga)])
}

export default rootSaga
