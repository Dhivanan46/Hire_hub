import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import Recruiter from './models/Recruiter.js';

async function createSampleRecruiter() {
    try {
        console.log('\n=== Creating Sample Recruiter Account ===\n');
        
        // Connect to database
        console.log('Connecting to MongoDB...');
        await mongoose.connect(`${process.env.MONGODB_URI}/hirehub`);
        console.log('✅ Connected to MongoDB\n');
        
        const recruiterData = {
            name: 'Admin Company',
            email: 'admin@gmail.com',
            password: 'admin@123'
        };
        
        console.log('Checking if recruiter already exists...');
        const existing = await Recruiter.findOne({ email: recruiterData.email });
        
        if (existing) {
            console.log('⚠️  Recruiter already exists!');
            console.log('Email:', existing.email);
            console.log('Name:', existing.name);
            console.log('\nYou can login with:');
            console.log('Email: admin@gmail.com');
            console.log('Password: admin@123');
            return;
        }
        
        console.log('Creating new recruiter...');
        console.log('Name:', recruiterData.name);
        console.log('Email:', recruiterData.email);
        console.log('Password:', recruiterData.password);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
        
        // Create recruiter
        const recruiter = await Recruiter.create({
            name: recruiterData.name,
            email: recruiterData.email,
            password: hashedPassword,
            image: ''
        });
        
        console.log('\n✅ SUCCESS! Recruiter account created');
        console.log('');
        console.log('Account Details:');
        console.log('- ID:', recruiter._id);
        console.log('- Name:', recruiter.name);
        console.log('- Email:', recruiter.email);
        console.log('');
        console.log('You can now login with:');
        console.log('Email: admin@gmail.com');
        console.log('Password: admin@123');
        
    } catch (error) {
        console.error('❌ Error creating recruiter:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

createSampleRecruiter();
