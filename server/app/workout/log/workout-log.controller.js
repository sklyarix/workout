
import expressAsyncHandler from "express-async-handler";
import {prisma} from "../../prisma.js";
import {calculateMinute} from "../calculate-minute.js";

// @desc Create new workoutLog
// @route Post /api/workouts/log/:id
// @access Private

export const createWorkoutLog = expressAsyncHandler(async (req, res) => {

    const workoutId = Number(req.params.id)

    const workout = await prisma.workout.findUnique({
        where: {
            id: workoutId
        },
        include: {
            exercises: true
        }
    })

    if (!workout){
        res.status(404)
        throw new Error('Not found workout')
    }

    const workoutLog = await prisma.workoutLog.create({
        data: {
            user: {
                connect: {
                    id: req.user.id
                }
            },
            workout: {
                connect: {
                    id: workoutId
                }
            },
            exerciseLogs: {
                create: workout.exercises.map(exercise => ({
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    },
                    exercise:{
                        connect: {
                            id: exercise.id
                        }
                    },
                    times:{
                        create: Array.from({length: exercise.times}, () => ({
                            weight: 0,
                            repeat: 0
                        }))
                    }
                }))
            },
        },
        include: {
                exerciseLogs: {
                include: {
                    times: true
                }
            }
        }
    })

    res.json(workoutLog)
})


// @desc GET workoutLog
// @route Get /api/workouts/log/:id
// @access Private

export const getWorkoutLog = expressAsyncHandler(async (req, res) => {

    const workoutId = Number(req.params.id)

    const workoutLog = await prisma.workoutLog.findUnique({
        where: {
            id: workoutId
        },
        include: {
            workout: {
                include:{
                    exercises: true
                }
            },
            exerciseLogs: {
                orderBy: {
                    id: 'asc'
                },
                include: {
                    exercise: true
                }
            }
        }
    })

    if (!workoutLog){
        res.status(404)
        throw new Error('Workout log not found')
    }

    const minute = calculateMinute(workoutLog.workout.exercises.length)

    res.json({...workoutLog, minute})
})


// @desc Update workoutLog complete
// @route PATCH /api/workouts/log/complete/:id
// @access Private

export const updateCompleteWorkoutLog = expressAsyncHandler( async (req, res) => {
    const logId = Number(req.params.id)

    try {
        const workoutLog = await prisma.workoutLog.update({
            where: {
                id: logId
            },
            data: {
                isCompleted: true
            }
        })

        res.json(workoutLog)

    } catch (error){
        res.status(400)
        throw new Error('Workout Log not found')
    }
})

