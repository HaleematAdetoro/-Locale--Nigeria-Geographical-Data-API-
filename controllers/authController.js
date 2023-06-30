const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const { v4: uuidv4 } = require("uuid");
const Cache = require("../config/redisConfig");

require("dotenv").config();

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({
      username,
    });
    const existingEmail = await User.findOne({
      email,
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "username already exists",
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        message: "email already exists",
      });
    }

    const APIKey = uuidv4();

    const user = new User({
      username,
      email,
      password,
      APIKey,
    });

    if (user) {
      // const cacheKey = username;
      // Cache.redis.set(cacheKey, APIKey);

      await user.save();

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      const cookieOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      };

      res.cookie("jwt", token, cookieOptions);

      return res.status(201).json({
        status: "success",
        message: "signup succesful",
        APIKey: APIKey,
        data: {
          APIKey,
          token,
        },
      });
    } else {
      res.status(400).json({ status: "error", message: "Invalid user data" });
    }
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username",
      });
    }

    const isPasswordCorrect = await user.isValidPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "invalid Password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };

    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      message: "login succesful",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};