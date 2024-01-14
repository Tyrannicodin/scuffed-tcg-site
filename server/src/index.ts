import express, {response} from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {createServer} from 'http'
import cors from 'cors'
import {CONFIG} from '../../common/config'
import {
	createTables,
	addCardsToDatabase,
	addCardsToPlayer,
	removeCardsFromPlayer,
	destroyTables,
} from 'db/db'
import startSocketIO from 'sockets'
import {PartialCardT} from '../../common/types/cards'

const port = process.env.PORT || CONFIG.port || 9000

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = createServer(app)

process.argv.forEach(function (val) {
	if (val === 'buildDatabase') {
		createTables()
		addCardsToDatabase()
	}
	if (val === 'destroyDatabase') {
		destroyTables()
	}
})

app.use(express.json())
app.use(cors({origin: CONFIG.cors}))

// Sockets
startSocketIO(server)

app.use(
	express.static(path.join(__dirname, '../..', CONFIG.clientPath), {
		maxAge: 1000 * 60 * 60,
	})
)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../..', CONFIG.clientPath, 'index.html'))
})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

const card: PartialCardT = {
	name: 'Aint',
	rarity: 'Rare',
}
