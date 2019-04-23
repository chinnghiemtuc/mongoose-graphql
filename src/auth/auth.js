import { AuthenticationError } from 'apollo-server-express'
import { User } from '../models'

export const attemptSignIn = async (email, password) => {
	const message = 'Incorrect email or password. Please try again.'
	const user = await User.findOne({ email })

	if (!user || !(await user.matchesPassword(password))) {
		throw new AuthenticationError(message)
	}

	return user
}

const signedIn = req => req.session.userId

export const ensureSignedIn = req => {
	if (!signedIn(req)) {
		throw new AuthenticationError('You must be log in.')
	}
}

export const ensureSignedOut = req => {
	if (signedIn(req)) {
		throw new AuthenticationError('You are already signed in.')
	}
}

export const signOut = (req, res) =>
	new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) reject(err)

			res.clearCookie(process.env.SESS_NAME)

			resolve(true)
		})
	})
