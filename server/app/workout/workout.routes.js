import express from 'express'
import { createNewWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from './workout.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import {createWorkoutLog, getWorkoutLog, updateCompleteWorkoutLog} from "./log/workout-log.controller.js";

const router = express.Router()

router.route('/')
	.post(protect, createNewWorkout)
	.get(protect, getWorkouts)

router.route('/:id')
	.get(protect, getWorkout)
	.put(protect, updateWorkout)
	.delete(protect, deleteWorkout)

router.route('/log/:id')
	.post(protect, createWorkoutLog)
	.get(protect, getWorkoutLog)

router.route('/log/complete/:id')
	.patch(protect, updateCompleteWorkoutLog)
export default router
