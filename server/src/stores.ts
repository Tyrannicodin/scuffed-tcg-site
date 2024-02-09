import {configureStore, Tuple} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './routines/root'

import cardReducer from 'cards/card-reducer'
import userReducer from 'login/login-reducer'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
	reducer: {
		cards: cardReducer,
		users: userReducer,
	},
	middleware: () => new Tuple(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
