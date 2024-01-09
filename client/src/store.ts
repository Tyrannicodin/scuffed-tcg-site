import {configureStore} from '@reduxjs/toolkit' 
import sessionReducer from 'logic/session/session-reducer'

const store = configureStore({
    reducer: {
        session: sessionReducer
    }
})

export default store
