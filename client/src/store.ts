import {Tuple, configureStore} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import sessionReducer from 'logic/session/session-reducer'
import rootSaga from './root-saga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
	reducer: {
		session: sessionReducer,
	},
	middleware: () => new Tuple(sagaMiddleware),
	devTools: true,
})

sagaMiddleware.run(rootSaga)

export default store
