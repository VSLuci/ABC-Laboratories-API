import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
	firstName: {
		type: Schema.Types.String,
		required: true,
	},
	lastName: {
		type: Schema.Types.String,
		required: true,
	},
	email: {
		type: Schema.Types.String,
		required: true,
		index: { unique: true },
	},
	mobile: {
		type: Schema.Types.String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	tokens: {
		type: [String],
	},
})

UserSchema.pre('save', function (next) {
	let user = this

	if (!user.isModified('password')) return next()

	bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
		if (error) return next(error)

		bcrypt.hash(user.password, salt, (error, hash) => {
			if (error) return next(error)

			user.password = hash
			next()
		})
	})
})

UserSchema.methods.comparePassword = async function (claimantPassword) {
	return await bcrypt.compare(claimantPassword, this.password)
}

const User = mongoose.model('user', UserSchema)

export default User
