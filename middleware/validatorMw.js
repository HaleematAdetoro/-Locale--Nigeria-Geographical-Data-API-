const signupValidator = require('../validators/signupValidator');
const loginValidator = require('../validators/loginValidator')
const express = require('express');

const validators = {
  signup: signupValidator,
  login:loginValidator,
}

function ValidatorMw (validator) {
  if (!validators.hasOwnProperty(validator)) {
    throw new Error(`Invalid Validator: "${validator}" does not exist`);
  }

  return async (req, res, next) => {
    try {
      await validators[validator].validateAsync(req.body);
      next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = ValidatorMw;