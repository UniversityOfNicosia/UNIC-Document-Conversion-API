# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /workspace

# Install Python 3
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Optionally install global npm packages
RUN npm install -g nodemon