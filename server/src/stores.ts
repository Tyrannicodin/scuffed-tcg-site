import {configureStore, Tuple} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './routines/root'

import cardReducer from 'cards/card-reducer'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
	reducer: {
		cards: cardReducer,
	},
	middleware: () => new Tuple(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export default store
