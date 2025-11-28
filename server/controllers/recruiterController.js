import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

// Register recruiter
export const registerRecruiter = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        console.log('\n=== RECRUITER REGISTRATION ===');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Image:', imageFile ? imageFile.originalname : 'No image');

        // Check if recruiter already exists
        const existingRecruiter = await Recruiter.findOne({ email });
        if (existingRecruiter) {
            return res.status(400).json({ success: false, message: 'Recruiter already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = '';
        
        // Upload image to S3 if provided
        if (imageFile) {
            const fileName = `recruiter-logos/${Date.now()}-${imageFile.originalname}`;
            const fileStream = fs.createReadStream(imageFile.path);
            
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: fileName,
                    Body: fileStream,
                    ContentType: imageFile.mimetype
                }
            });
            
            const result = await upload.done();
            imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            
            // Delete temporary file
            fs.unlinkSync(imageFile.path);
            console.log('✅ Image uploaded to S3:', imageUrl);
        }

        // Create recruiter
        const recruiter = await Recruiter.create({
            name,
            email,
            password: hashedPassword,
            image: imageUrl
        });

        console.log('✅ Recruiter created:', recruiter._id);

        // Generate JWT token
        const token = jwt.sign(
            { id: recruiter._id, email: recruiter.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Recruiter registered successfully',
            token,
            recruiter: {
                id: recruiter._id,
                name: recruiter.name,
                email: recruiter.email,
                image: recruiter.image
            }
        });
    } catch (error) {
        console.error('❌ Error registering recruiter:', error);
        
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

// Login recruiter
export const loginRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('\n=== RECRUITER LOGIN ===');
        console.log('Email:', email);

        // Find recruiter
        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        console.log('✅ Recruiter logged in:', recruiter._id);

        // Generate JWT token
        const token = jwt.sign(
            { id: recruiter._id, email: recruiter.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            recruiter: {
                id: recruiter._id,
                name: recruiter.name,
                email: recruiter.email,
                image: recruiter.image
            }
        });
    } catch (error) {
        console.error('❌ Error logging in recruiter:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
