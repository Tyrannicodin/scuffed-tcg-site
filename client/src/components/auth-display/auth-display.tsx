import QRCode from 'react-qr-code'
import {useSelector} from 'react-redux'
import {getTokenUri} from 'logic/session/session-selectors'

export function AuthDisplay() {
	const secretUrl = useSelector(getTokenUri)

	return <QRCode style={{width: '100%'}} value={secretUrl} />
}
