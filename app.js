require("dotenv").config();

const express = require("express");

const app = express();
const passport = require("passport");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const locationRouter = require("./routes/locationRoutes");
const rateLimiter = require("./middleware/rateLimit");
const loggerMw = require("./middleware/loggerMw");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./utils/appError");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("./swagger");

const swaggerSpec = swaggerJSDoc(options);

//middleware

app.use(loggerMw);
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(passport.initialize());

app.disable("x-powered-by"); // less hackers know about our stack

app.use("/auth", authRouter);
app.use("/api/v1", locationRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome to locale API",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;