FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
# RUN npm install --only=prod
COPY . .
CMD ["npm", "run", "dev"]
