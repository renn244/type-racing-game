## THIS ONLY FOR DEVELOPMENT

# this is a variable for the version of node 
#NOTE: you can edit this to any version you want
ARG NODE_VERSION=19.5.0
ARG PORT=5000

FROM node:${NODE_VERSION}-alpine

# set the working directory in the containe
WORKDIR /app

# just copy the package.json and package-lock.json to the container
COPY package*.json ./

# install the dependencies
RUN npm install

# copy the rest of the files to the container
COPY . .

# generate prisma
RUN npx prisma generate

# expose the port 5000
EXPOSE ${PORT}

# run the app
CMD ["npm", "run", "start:dev"]
