// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SIB-RMS Backend API',
      version: '1.0.0',
      description: 'API documentation for SIB-RMS Backend (Vendor/User endpoints)',
      contact: {
        name: 'Your Name',
        email: 'you@example.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local server'
      }
    ]
  },
  // Point to the files where Swagger will look for JSDoc comments to build the spec
  apis: [
    './routes/*.js',        // your route files
    './controllers/*.js',   // optional: controllers with JSDoc
    './models/*.js'         // optional: model files if you add JSDoc there
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  // Serve the swagger ui at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Optional: expose raw JSON at /api-docs.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
