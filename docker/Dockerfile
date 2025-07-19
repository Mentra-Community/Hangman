FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./


# Install dependencies
RUN bun install

# Copy the application code
# When built with GitHub Actions, this will include the submodule content
COPY . .

# Expose the port
EXPOSE 80
