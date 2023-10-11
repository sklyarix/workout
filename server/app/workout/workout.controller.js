import expressAsyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.utils.js'
import { tr } from '@faker-js/faker'
import {calculateMinute} from "./calculate-minute.js";

// @desc GET workout
// @route Get /api/workouts/:id
// @access Private
export const getWorkout = expressAsyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where:{
			id: Number(req.params.id),
		},
		include:{
			exercises: true
		}
	})
	if(!workout){
		res.status(404)
		throw new Error('Workout not found')
	}
	const minutes = calculateMinute(workout.exercises.length)
	res.json({ ...workout, minutes })
})

// @desc GET workouts
// @route Get /api/workouts
// @access Private
export const getWorkouts = expressAsyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})
	res.json(workouts)
})

// @desc Create new workout
// @route Post /api/workouts
// @access Private
export const createNewWorkout = expressAsyncHandler(async (req, res) => {
	const { name, exerciseIds} = req.body

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: +id }))
			}
		}
	})
	res.json(workout)
})

// @desc Update workout
// @route PUT /api/workouts/:id
// @access Private
export const updateWorkout = expressAsyncHandler(async (req, res) => {
	const { name, exerciseIds} = req.body
	try {
	const workout = await prisma.workout.update({
		where: {
			id: Number(req.params.id)
		},
		data: {
			name,
			exercises:{
					set: exerciseIds.map(id => ({ id: +id }))
			}
		},
	})
		res.json(workout)
	} catch (error) {
		res.status(404)
		throw new Error('Workout not found')
	}


})

// @desc delete workout
// @route PUT /api/workouts/:id
// @access Private
export const deleteWorkout = expressAsyncHandler( async (req, res) => {
	try {
	const workout = await prisma.workout.delete({
		where: { id: Number(req.params.id) }
	})
	res.json({message:'Workout delete'})
	} catch (error){
		res.status(404)
		throw new Error('Workout not found')
	}
})