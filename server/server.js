import 'colors'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

import authRoutes from './app/auth/auth.routes.js'
import userRoutes from './app/user/user.routes.js'
import exercisesRoutes from './app/exercise/exercise.routes.js'
import { prisma } from './app/prisma.js'
import { errorHandler, notFound } from './app/middleware/error.middleware.js'
import WorkoutRoutes from './app/workout/workout.routes.js'
const app = express()

dotenv.config()
async function main() {
	if (process.env.NODE_ENV == 'dev') app.use(morgan('dev'))

	app.use(express.json())

	const __dirname = path.resolve()
	app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)
	app.use('/api/exercises', exercisesRoutes)
	app.use('/api/workouts', WorkoutRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = 6000

	app.listen(
		PORT,
		console.log(
			`SERVER running in ${process.env.NODE_ENV} mode on port ${PORT}`.green
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

/*
Получить статистику
 */
