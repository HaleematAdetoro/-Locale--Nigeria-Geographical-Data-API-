const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Nigeria Locale",
      version: "1.0.0",
      description:
        "This is an API which provides geographical data os NIgeria. It allows users to retrieve information about states, local governemnts and regions withing Nigeria.",
      contact: {
        email: "haleematadetoro24@gmail.com",
        name: "Haleemat Adetoro",
        url: "https://github.com/haleematadetoro/locale",
      },
      license: {
        url: "https://www.mit.edu/~amini/LICENSE.md",
        name: "MIT license",
      },
    },

    servers: [
      {
        url: "http://localhost:3333",
        description: "development",
      },
    ],

    paths: {
      
    },

    components: {
      schemas: {
        signup: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              description: "A unique username you want to use to sign up",
            },
            email: {
              type: "string",
              description:
                "A valid email address that ends with .com, .net or .org",
            },
            password: {
              type: "string",
              description: "A password that no one knows",
            },
          },
          example: {
            username: "muffin",
            email: "johndoe@gmail.com",
            password: "carty",
          },
        },
          login: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
                description: 'username used for signup'
              },
              password: {
                type: 'string',
                description: 'password used for signup'
              }
            },
            example: {
              username: 'muffin',
              password: 'carty'
            }
          }
      },
      responses: {
        201: {
          description: "user created",
          content: "application/json",
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              message: {
                type: "string",
              },
              data: {
                type: "object",
                properties: {
                  APIKey: {
                    type: "string",
                  },
                  token: {
                    type: "string",
                  },
                },
              },
            },
          },
          example: {
            status: "success",
            message: "sign up successful",
            data: {
              APIKey: "359ff6a3-591b-4ffb-8191-f6988ae9807a",
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDliNmZiNzE1ZDYzYjQ3YjJjMTA0YjQiLCJ1c2VybmFtZSI6ImxlZTAwMSIsImlhdCI6MTY4NzkxMjk2MSwiZXhwIjoxNjkwNTA0OTYxfQ.zPIwBVXCVXWJEBXtBFr3xZcOPKssE2GfO2diiwDtb88",
            },
          }, 
        },
        400: {
          description: "invalid user data",
          content: "application/json",
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              message: {
                type: "string",
              },
            },
          },
          example: {
            status: "error",
            message: "Invalid user data",
          },
        },
        200: {
          description: "OK",
          content: "application/json",
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              message: {
                type: "string",
              },
              data: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                  },
                },
              },
            },
          },
          example: {
              status: "success",
              message: "login successful",
              data: {
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDliNmZiNzE1ZDYzYjQ3YjJjMTA0YjQiLCJ1c2VybmFtZSI6ImxlZTAwMSIsImlhdCI6MTY4NzkxMjk2MSwiZXhwIjoxNjkwNTA0OTYxfQ.zPIwBVXCVXWJEBXtBFr3xZcOPKssE2GfO2diiwDtb88",
              },
          },
        },
        401: {
          description: "Unauthorized",
          content: "application/json",
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              message: {
                type: "string",
              },
            },
          },
          example: {
              status: "error",
              message: "Invalid username or password",
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token"
        }
        
        
      },
    },
    security: [
      {
        ApiKeyAuth: []
      },
      {
        cookieAuth: []
      }
    ],
  },
  apis: ['./routes/*.js'],
};



module.exports = options;