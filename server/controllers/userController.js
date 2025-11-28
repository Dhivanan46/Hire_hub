import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from 'fs';

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const { userId, name, email, image } = req.body;
        console.log('\n=== GET USER PROFILE REQUEST ===');
        console.log('userId:', userId);
        console.log('name:', name);
        console.log('email:', email);
        console.log('image:', image ? 'provided' : 'not provided');
        
        let user = await User.findById(userId);
        console.log('User lookup result:', user ? 'FOUND' : 'NOT FOUND');
        
        // Auto-create user if doesn't exist (fallback for Clerk webhook)
        if (!user && name && email && image) {
            console.log('Creating new user from Clerk data...');
            console.log('User data:', { userId, name, email });
            
            user = await User.create({
                _id: userId,
                name: name,
                email: email,
                image: image,
                resume: ''
            });
            console.log('✅ New user created successfully:', user._id);
        } else if (!user) {
            console.log('❌ User not found and insufficient data to create');
            console.log('Missing data - name:', !!name, 'email:', !!email, 'image:', !!image);
            return res.status(404).json({ success: false, message: 'User not found. Please try logging out and logging in again.' });
        }
        
        console.log('User profile data:', { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            hasResume: !!user.resume,
            resumeUrl: user.resume || 'none'
        });
        console.log('=== END GET USER PROFILE ===\n');
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('❌ Error getting user profile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, resume } = req.body;
        
        const updateData = { name };
        if (resume) {
            updateData.resume = resume;
        }
        
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload resume to AWS S3
export const uploadResume = async (req, res) => {
    try {
        const { userId, name, email, image } = req.body;
        const resumeFile = req.file;
        
        console.log('\n=== UPLOAD RESUME REQUEST ===');
        console.log('userId:', userId);
        console.log('name:', name);
        console.log('email:', email);
        console.log('image:', image ? 'provided' : 'not provided');
        console.log('File received:', resumeFile ? resumeFile.originalname : 'No file');
        
        if (!resumeFile) {
            console.log('❌ No file uploaded');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        // Check if user exists, create if not (fallback for Clerk webhook)
        let user = await User.findById(userId);
        console.log('User lookup result:', user ? 'FOUND' : 'NOT FOUND');
        
        if (!user) {
            if (name && email && image) {
                console.log('Creating user from Clerk data...');
                console.log('User data:', { userId, name, email });
                
                user = await User.create({
                    _id: userId,
                    name: name,
                    email: email,
                    image: image,
                    resume: ''
                });
                console.log('✅ User created successfully:', user._id);
            } else {
                console.log('❌ Cannot create user - missing data');
                console.log('Missing data - name:', !!name, 'email:', !!email, 'image:', !!image);
                return res.status(404).json({ success: false, message: 'User not found in database and insufficient data to create user.' });
            }
        }
        
        // Create unique file name
        const fileName = `resumes/${userId}-${Date.now()}-${resumeFile.originalname}`;
        
        // Upload to S3
        const fileStream = fs.createReadStream(resumeFile.path);
        
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: fileStream,
                ContentType: resumeFile.mimetype
            }
        });
        
        console.log('Starting S3 upload...');
        const result = await upload.done();
        console.log('✅ S3 upload completed:', result.Location);
        
        // Delete temporary file
        fs.unlinkSync(resumeFile.path);
        console.log('Temporary file deleted');
        
        // Construct S3 URL
        const resumeUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        console.log('Resume URL:', resumeUrl);
        
        // Update user with resume URL
        user.resume = resumeUrl;
        await user.save();
        
        console.log('✅ Resume URL saved to database');
        console.log('User data:', { id: user._id, name: user.name, hasResume: !!user.resume });
        console.log('=== END UPLOAD RESUME ===\n');
        
        res.json({ success: true, message: 'Resume uploaded successfully', resumeUrl, user });
    } catch (error) {
        console.error('❌ Error uploading resume:', error);
        // Clean up temp file on error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Apply for a job
export const applyForJob = async (req, res) => {
    try {
        const { userId, jobId, companyId, jobTitle, companyName, location } = req.body;
        
        // Check if user has resume
        const user = await User.findById(userId);
        if (!user || !user.resume) {
            return res.status(400).json({ success: false, message: 'Please upload your resume before applying' });
        }
        
        // Check if already applied
        const existingApplication = await JobApplication.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }
        
        const application = await JobApplication.create({
            userId,
            jobId,
            companyId,
            jobTitle,
            companyName,
            location
        });
        
        res.json({ success: true, message: 'Applied successfully', application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user applications
export const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const applications = await JobApplication.find({ userId }).sort({ appliedDate: -1 });
        
        // Calculate stats
        const stats = {
            total: applications.length,
            pending: applications.filter(app => app.status === 'Pending').length,
            accepted: applications.filter(app => app.status === 'Accepted').length,
            rejected: applications.filter(app => app.status === 'Rejected').length
        };
        
        res.json({ success: true, applications, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
