const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true
  
  },
  APIKey: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

UserSchema.methods.getAPIKey = async function () {
  const APIKey = await bcrypt.hash(this.username, 10)
  this.APIKey = APIKey
  return APIKey
}

UserSchema.methods.verifyAPIKey = async function (APIKey) {
  return APIKey === this.APIKey
}
module.exports = mongoose.model('User', UserSchema)