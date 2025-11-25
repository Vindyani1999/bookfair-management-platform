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
  apis: [
    './routes/*.js',        
    './controllers/*.js',   
    './models/*.js'         
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
