import { useDispatch } from "react-redux"
import css from './settings.module.scss'
import { useState } from "react"

type Props = {
    menuSetter: (arg0: 'userSettings' | 'mainMenu') => void
}

export function Settings({menuSetter}: Props) {
    const dispatch = useDispatch()
    const [pressedTime, setPressedTime] = useState<number>(Infinity)

    const startPasswordReset = () => {
        dispatch({
            type: 'RESET_PASSWORD',
            payload: {},
        })
    }

    const deleteMouseDown = () => {
        setPressedTime(new Date().getTime())
    }

    const startDeleteAccount = () => {
        if (new Date().getTime() - pressedTime < 10e3) return
        dispatch({
            type: 'DELETE_ACCOUNT',
            payload: {}
        })
    }

    return <div className={css.main}>
        <button className={css.button} onClick={startPasswordReset}>Reset password</button>
        <button className={css.danger} onMouseDown={deleteMouseDown} onClick={startDeleteAccount}>Delete account</button>
        <button className={css.button} onClick={() => menuSetter('mainMenu')}>Back</button>
    </div>
}