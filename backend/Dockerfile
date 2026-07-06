FROM node:20-slim

# Install system dependencies for LibreOffice, Ghostscript, Tesseract, and Puppeteer (Chromium)
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    tesseract-ocr \
    chromium \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the installed Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Create necessary directories
RUN mkdir -p uploads output

# Expose the port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
