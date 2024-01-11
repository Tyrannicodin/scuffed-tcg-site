import {all, fork} from 'typed-redux-saga'
import {loginSaga} from './login-saga'

function* rootSaga() {
	console.log('Sagas running...')
	yield* all([fork(loginSaga)])
}

export default rootSaga
