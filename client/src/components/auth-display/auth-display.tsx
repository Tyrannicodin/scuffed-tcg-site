import QRCode from 'react-qr-code'
import { useSelector } from 'react-redux'
import { getTokenSecret } from 'logic/session/session-selectors'

export function AuthDisplay() {
    const secretUrl = useSelector(getTokenSecret)

    return <QRCode style={{width: '100%'}} value={secretUrl} />
}