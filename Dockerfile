FROM node:18-slim
WORKDIR /usr/src/app
COPY hazdec-backend/package*.json ./
RUN npm ci --only=production
COPY hazdec-backend/ .
EXPOSE 8080
CMD ["npm", "start"]
