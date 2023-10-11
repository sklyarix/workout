import { prisma } from '../prisma.js'
import expressAsyncHandler from 'express-async-handler'
import { faker, tr } from '@faker-js/faker'

import { hash, verify } from 'argon2'

import { generateToken } from './generate-token.js'
import { UserFields } from '../utils/user.utils.js'

// @desc Auth user
// @route POST /api/auth/login
// @access Public
export const authUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (!user) {
		throw new Error('User not found')
	} else {
		const correctPassword = await verify(user.password, password)
		if (!correctPassword) {
			throw new Error('Incorrect password')
		}
	}
	const token = generateToken(user.id)
	res.json({ user, token })
})

// @desc register user
// @route POST /api/auth/register
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body
	const isHaveUser = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			name: faker.name.fullName(),
			password: await hash(password),
			email
		},
		select: UserFields
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
