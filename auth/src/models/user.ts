import mongoose from 'mongoose';
import { Password } from '../services/password';

// required
interface UserAttrs {
  email: string,
  password: string
}

// describes properties of a User
//   what a user collection has, ie a method
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// describes properties of a single user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // createdAt: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

// not arrow function because 'this' is user, not class context.
// doesnt support async/wait can so have to forward 'done' function
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) { // new and updated password only
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// interface enforces this structure
// User.build({
//   email: "sdf@sdf.com",
//   password: 'sdfsdf'
// });

export { User };
