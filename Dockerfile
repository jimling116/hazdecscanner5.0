FROM node:18-slim
WORKDIR /usr/src/app

# Copy package files from root
COPY package*.json ./

# Install dependencies (using npm install instead of npm ci)
RUN npm install --only=production

# Copy all application files
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
