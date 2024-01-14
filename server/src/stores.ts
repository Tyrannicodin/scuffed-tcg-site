import { configureStore, Tuple } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './routines/root'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {},
})

sagaMiddleware.run(rootSaga)

export default store
