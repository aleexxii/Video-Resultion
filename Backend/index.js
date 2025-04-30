import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import router from './routes/video.route.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000

app.use(cors()); // Enable CORS for all routes
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/output', express.static(path.join(__dirname, 'output')));
// Middleware to serve static files from the 'output' directory
app.use('/video', router)


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});