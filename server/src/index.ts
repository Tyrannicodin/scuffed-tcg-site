import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {createServer} from 'http'
import cors from 'cors'
import {CONFIG} from '../../common/config'
import {createTables, addCardsToDatabase, destroyTables} from 'db/db'
import {updateShop} from 'db/shop'
import startSocketIO from 'sockets'
import {CronJob} from 'cron'
import { exit } from 'process'

const port = process.env.PORT || CONFIG.port || 9000

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = createServer(app)

var dbReady = true
process.argv.forEach(function (val) {
	if (val === 'buildDatabase') {
		dbReady = false
		createTables().then(addCardsToDatabase).then(() => dbReady = true)
	}
	if (val === 'destroyDatabase') {
		dbReady = false
		destroyTables().then(() => exit())
	}
})

while (!dbReady) {}

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

// Shop stuff
/*const shopJob = new CronJob(
	'0 0 * * * *', // cronTime
	updateShop,
	null,
	true, // start
	'UTC',
	null,
	true
)*/
