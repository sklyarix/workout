import expressAsyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.utils.js'


// @desc Create new exercise
// @route Post /api/exercises
// @access Private
export const createNewExercise = expressAsyncHandler(async (req, res) => {
	const { name, times, iconPath} = req.body

	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			iconPath
		}
	})
	res.json(exercise)
})

// @desc GET exercises
// @route Get /api/exercises
// @access Private

export const getExercises = expressAsyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany(
		{
			orderBy:{
				createdAt: 'desc',
			}
		}
	)
	res.json(exercises)
})

// @desc Update exercise
// @route PUT /api/exercises/:id
// @access Private
export const updateExercise = expressAsyncHandler(async (req, res) => {
	const { name, times, iconPath} = req.body
	try {
	const exercise = await prisma.exercise.update({
		where: {
			id: Number(req.params.id)
		},
		data: {
			name,
			times,
			iconPath
		},
	})
		res.json(exercise)
	} catch (error) {
		res.status(404)
		throw new Error('Exercise not found')
	}


})

// @desc Delete exercise
// @route DELETE /api/exercises/:id
// @access Private
export const deleteExersice = expressAsyncHandler( async (req, res) => {
	const exercise = await prisma.exercise.delete({
		where: { id: Number(req.params.id) }
	})
	res.json({message:'Exercise delete'})
})