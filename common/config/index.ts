import config from './server-config.json'
import dbConfig from './db-config.json'
import {createPrivateKey} from 'crypto'

export const CONFIG = config
export const DBKEY = createPrivateKey(dbConfig.encryptionKey)
