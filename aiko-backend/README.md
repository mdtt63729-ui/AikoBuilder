# AikoBuilder Backend

Express.js backend server for AikoBuilder project management and build system.

## Features

- **File Upload**: Handle project file uploads with multer
- **Build Management**: Start, track, and manage build processes
- **Logging**: Real-time build logs and history
- **Download**: Download build outputs and artifacts

## Project Structure

```
aiko-backend/
├── package.json          # Dependencies and scripts
├── server.js            # Express server configuration
├── routes/
│   ├── upload.js        # File upload endpoints
│   ├── build.js         # Build process endpoints
│   ├── logs.js          # Logging endpoints
│   └── download.js      # Download endpoints
├── uploads/             # Uploaded project files
├── workspace/           # Build workspace and configs
└── output/              # Build outputs and artifacts
```

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Running the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Upload
- `POST /api/upload` - Upload a file
- `GET /api/upload` - List uploaded files

### Build
- `POST /api/build/start` - Start a new build
- `GET /api/build` - List all builds
- `GET /api/build/status/:buildId` - Get build status

### Logs
- `GET /api/logs/:buildId` - Get build logs
- `POST /api/logs/:buildId` - Add log entry
- `DELETE /api/logs/:buildId` - Clear logs

### Download
- `GET /api/download/:buildId` - List build outputs
- `GET /api/download/:buildId/:filename` - Download a file

### Health Check
- `GET /health` - Server health status

## Example Usage

```bash
# Upload a file
curl -X POST -F "file=@myproject.zip" http://localhost:5000/api/upload

# Start a build
curl -X POST http://localhost:5000/api/build/start \
  -H "Content-Type: application/json" \
  -d '{"projectName": "my-project", "config": {}}'

# Get build status
curl http://localhost:5000/api/build/status/{buildId}

# Add a log entry
curl -X POST http://localhost:5000/api/logs/{buildId} \
  -H "Content-Type: application/json" \
  -d '{"message": "Build step completed"}'

# Get logs
curl http://localhost:5000/api/logs/{buildId}

# List outputs
curl http://localhost:5000/api/download/{buildId}

# Download a file
curl -O http://localhost:5000/api/download/{buildId}/{filename}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## Dependencies

- **express** - Web framework
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Development

- **nodemon** - Auto-reload during development

## License

ISC
