const express = require("express");
const locationController = require("../controllers/locationController");
const passport = require("passport");
const checkCache = require("../middleware/cachedData");

const verifyAPIKey = require("../middleware/verifyAPIKey");

const locationRouter = express.Router();

/**
 * @swagger
 * /api/v1/location/get_new_key:
 *   get:
 *     summary: Regenerate API key
 *     tags: [location]
 *     requestBody:
 *       description: You need to provide a jwt token before accessing this resource
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       "201":
 *         description: New key generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                    type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     APIKey:
 *                       type: string
 *                     Note:
 *                       type: string
 *             example:
 *               value:
 *                 status: success
 *                 message: New Key Generated
 *                 data:
 *                   APIKey: $359ff6a3-591b-4ffb-8191-f6988ae9807a
 *                   Note: Copy your key and save it. It won't show it to you again,
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               value:
 *                 status: error
 *                 message: unauthorized
 *
 *
 */

locationRouter.get(
  "/get_new_key",
  passport.authenticate("jwt", { session: false }),
  locationController.getNewAPIKey
);

/**
 * @swagger
 * /api/v1/location/regions:
 *   get:
 *     summary: Get a list of all regions in Nigeria
 *     tags: [location]
 *     requestBody:
 *       description: You need to provide an API Key before accessing this resource and jwt token to show logged in status
 *       content: {}
 *     responses:
 *       "201":
 *         description: list of all regions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                    type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                     result:
 *                       type: array
 *             example:
 *               value:
 *                 status: success
 *                 message: list of regions
 *                 data:
 *                   size: 6
 *                   result:
 *                     type: array
 *                     items: South East North East South South North Central South West North West
 *
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               value:
 *                 status: error
 *                 message: unauthorized
 *
 *
 */

locationRouter.get("/regions", verifyAPIKey, locationController.getRegions);

/**
 * @swagger
 * /api/v1/location/states:
 *   get:
 *     summary: Get a list of all states in Nigeria
 *     tags: [location]
 *     requestBody:
 *       description: You need to provide an API Key before accessing this resource and jwt token to show logged in status
 *       content: {}
 *     responses:
 *       "201":
 *         description: list of all states
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                    type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                     result:
 *                       type: array
 *             example:
 *               value:
 *                 status: success
 *                 message: list of states
 *                 data:
 *                   size: 37
 *                   result:
 *                     type: array
 *                     items:  Abia Adamawa Akwa Ibom Anambra ....
 *
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               value:
 *                 status: error
 *                 message: unauthorized
 *
 *
 */

locationRouter.get("/states", verifyAPIKey, locationController.getStates);

/**
 * @swagger
 * /api/v1/location/lgas:
 *   get:
 *     summary: Get a list of all Local Government Areas in Nigeria
 *     tags: [location]
 *     requestBody:
 *       description: You need to provide an API Key before accessing this resource and jwt token to show logged in status
 *       content: {}
 *
 *     responses:
 *       "201":
 *         description: list of all LGAs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                    type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                     result:
 *                       type: array
 *             example:
 *               value:
 *                 status: success
 *                 message: list of LGAs (LGAs)
 *                 data:
 *                   size: 846
 *                   result:
 *                     type: array
 *                     items: Aba North Aba South Arochukwu Bende Isuikwuato....
 *
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               value:
 *                 status: error
 *                 message: unauthorized
 *
 *
 */

locationRouter.get(
  "/lgas",
  verifyAPIKey,
  locationController.getLocalGovernmentArea
);

/**
 * @swagger
 * /api/v1/location/search/{id}:
 *   get:
 *     summary: It allows for search about Nigeria based on region state and LGA
 *     tags: [location]
 *     description: You need to provide an API Key before accessing this resource and jwt token to show logged in status
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Defines the catergory to search
 *         required: true
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The name to search for in a category
 *     content: {}
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                    type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           state:
 *                             type: string
 *                           lga:
 *                             type: string
 *                           metadata:
 *                             type: object
 *                             properties:
 *                               state:
 *                                 type: string
 *                               capital:
 *                                 type: string
 *                               slogan:
 *                                 type: string
 *                               senatorial_districts:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               lgas:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               landmass:
 *                                 type: string
 *                               population:
 *                                 type: string
 *                               dialect:
 *                                 type: string
 *                               map:
 *                                 type: string
 *                               latitude:
 *                                 type: string
 *                               longitude:
 *                                 type: string
 *                               website:
 *                                 type: string
 *                               geo_politcal_zone:
 *                                 type: string
 *                               created_date:
 *                                 type: string
 *                               created_by:
 *                                 type: string
 *                               past_governors:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               borders:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               known_for:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *             example:
 *               value:
 *                 status: success
 *                 message: list of LGAs (LGAs)
 *                 data:
 *                   size: 846
 *                   result:
 *                     type: array
 *                     items: Aba North Aba South Arochukwu Bende Isuikwuato....
 *
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               value:
 *                 status: error
 *                 message: unauthorized
 *
 *
 */

locationRouter.get(
  "/search/:id",
  verifyAPIKey,
  checkCache,
  locationController.search
);

module.exports = locationRouter;