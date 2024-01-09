import { UnknownAction } from "redux"

type SessionState = {

}

const defaultState: SessionState = {
    
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	switch (action.type) {
        default:
            return state
    }
}

export default sessionReducer
