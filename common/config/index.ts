import config from './server-config.json'
import {createPrivateKey} from 'crypto'
import env from 'env-var'
import 'dotenv/config'

const key = env.get('DB_ENCRYPTION_KEY').asString()

if (!key) {
	console.log('Database encryption key has not been found.')
}

export const CONFIG = config
export const DBKEY = createPrivateKey(key ? key : '')
