import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SKY Membership API',
    version: '1.0.0',
    description: 'This is the API documentation for the SKY Membership service.',
  },
};

const options = {
  definition: swaggerDefinition,  // Use 'definition' here instead of 'swaggerDefinition'
  apis: ['./src/routes/*.ts'], // Adjust this based on your project structure
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
