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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
