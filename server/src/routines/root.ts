import {all, fork} from 'typed-redux-saga'
import {entrySaga} from './login-saga'

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(entrySaga)])
}

export default rootSaga
