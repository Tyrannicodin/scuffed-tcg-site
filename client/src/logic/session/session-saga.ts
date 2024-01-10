import { receiveMsg } from 'logic/socket/socket-saga'
import {call, delay, put, race, take} from 'redux-saga/effects'
import socket from 'socket'
import { disconnect } from './session-actions'

export default function* sessionSaga() {
	const {payload: {username, password}} = yield take('LOGIN')
    
    socket.auth = {
        username,
        password
    }

    socket.connect()

    const {connection, timeout} = yield race({
        connection: call(receiveMsg, 'USER_INFO'),
        timeout: delay(10e3) //10 seconds
    })

    if (timeout) {
        yield put(disconnect('timeout'))
        return
    }

    console.log(connection)
}
