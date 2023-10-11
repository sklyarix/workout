import express from 'express'
import { createNewExercise, deleteExersice, getExercises, updateExercise } from './exercise.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import {
	createNewExerciseLog,
	getExerciseLog,
	updateExerciseLogTime,
	completeExerciseLog
} from './log/exercise-log.controller.js'

const router = express.Router()

router.route('/')
	.post(protect, createNewExercise)
	.get(protect, getExercises)

router.route('/:id')
	.put(protect, updateExercise)
	.delete(protect, deleteExersice)

router.route('/log/:exerciseId')
	.post(protect, createNewExerciseLog)

router.route('/log/:exerciseId')
	.get(protect, getExerciseLog)

router.route('/log/complete/:id')
	.patch(protect, completeExerciseLog)

router.route('/log/time/:id')
	.put(protect, updateExerciseLogTime)

export default router
