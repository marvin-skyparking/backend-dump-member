# Use the official Node.js image as the base image
FROM node:20.11
ENV DB_HOST=147.139.137.204
ENV DB_USER=unikas
ENV DB_PASSWORD=5ky50p4y123!.
ENV DB_NAME=skybillingdb
ENV ACCESS_TOKEN_SECRET=90091c6db732c4119b8c56a54c31e560
ENV REFRESH_TOKEN_SECRET=b356a21e77ca808ee38a383991f61d4a

# Create and set the working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install application dependencies
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port the app runs on
EXPOSE 9000

# Specify the command to run the application
CMD ["yarn", "start"]
