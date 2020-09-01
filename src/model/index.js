import mongoose from 'mongoose'
import logger from '../logger'

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(_ => logger.info(`Mongo DB connection established`))
	.catch(error => logger.error(`Mongo DB connection failed | Error: ${error.message}`.red))
