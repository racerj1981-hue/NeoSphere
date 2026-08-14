import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupChatApi } from './src/server/chatApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Setup Multi-Device Real-Time Chat API
setupChatApi(app);

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NeoSphere Server running on port ${PORT}`);
});
