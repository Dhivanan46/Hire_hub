import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import {clerkwebhooks} from './controllers/webhooks.js'
import multer from 'multer';
import { getUserProfile, updateUserProfile, uploadResume, applyForJob, getUserApplications } from './controllers/userController.js';
import { getAllJobs, getJob, createJob } from './controllers/jobController.js';
import { registerRecruiter, loginRecruiter } from './controllers/recruiterController.js';

//initialize express
const app = express();

//connecting DataBase
await connectDB();

// Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Temporary storage folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Separate multer instance for image uploads (recruiter logos)
const uploadImage = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

//middlewares
app.use(cors());
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

//Routes
app.get("/",(req,res)=>res.send("API WORKING"));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Test endpoint to check request data
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit:', req.body);
  res.json({ success: true, received: req.body });
});

app.post('/webhooks',clerkwebhooks)

// User routes
app.post('/api/user/profile', getUserProfile);
app.post('/api/user/update-profile', updateUserProfile);
app.post('/api/user/upload-resume', upload.single('resume'), uploadResume);
app.post('/api/user/apply', applyForJob);
app.post('/api/user/applications', getUserApplications);

// Recruiter routes
app.post('/api/recruiter/register', uploadImage.single('image'), registerRecruiter);
app.post('/api/recruiter/login', loginRecruiter);

// Job routes
app.get('/api/jobs', getAllJobs);
app.get('/api/jobs/:id', getJob);
app.post('/api/jobs/create', createJob);

//PORT
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
