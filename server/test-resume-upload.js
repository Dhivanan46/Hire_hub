import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from 'fs';
import mongoose from 'mongoose';
import 'dotenv/config';

// Test configuration
const testUserId = 'test_user_123'; // Replace with your actual Clerk user ID
const testFilePath = 'E:\\projects\\mervin\\mervin\\Dhivanan_Wipro_Resume (1).pdf';

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// User Schema
const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    resume: {type: String},
    image: {type: String, required: true},
    phone: {type: String},
    skills: {type: [String]},
    bio: {type: String}
});

const User = mongoose.model('User', userSchema);

async function testResumeUpload() {
    try {
        console.log('\n=== STARTING RESUME UPLOAD TEST ===\n');
        
        // Connect to database
        console.log('1. Connecting to MongoDB...');
        await mongoose.connect(`${process.env.MONGODB_URI}/hirehub`);
        console.log('✅ Connected to MongoDB\n');
        
        // Check if file exists
        console.log('2. Checking if test file exists...');
        if (!fs.existsSync(testFilePath)) {
            console.log('❌ Test file not found:', testFilePath);
            return;
        }
        console.log('✅ Test file found:', testFilePath, '\n');
        
        // Check/Create test user
        console.log('3. Checking for test user in database...');
        let user = await User.findById(testUserId);
        
        if (!user) {
            console.log('⚠️  Test user not found, creating one...');
            user = await User.create({
                _id: testUserId,
                name: 'Test User',
                email: 'test@example.com',
                image: 'https://example.com/image.png',
                resume: ''
            });
            console.log('✅ Test user created:', user._id);
        } else {
            console.log('✅ Test user found:', user._id);
            console.log('   Current resume:', user.resume || 'None');
        }
        console.log('');
        
        // Upload to S3
        console.log('4. Uploading file to S3...');
        const fileName = `resumes/${testUserId}-${Date.now()}-Dhivanan_Wipro_Resume.pdf`;
        const fileStream = fs.createReadStream(testFilePath);
        
        console.log('   Bucket:', process.env.AWS_S3_BUCKET_NAME);
        console.log('   Region:', process.env.AWS_REGION);
        console.log('   File Key:', fileName);
        
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: fileStream,
                ContentType: 'application/pdf'
            }
        });
        
        const result = await upload.done();
        console.log('✅ S3 Upload successful!');
        console.log('   Location:', result.Location);
        console.log('');
        
        // Construct resume URL
        const resumeUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        console.log('5. Constructed Resume URL:', resumeUrl, '\n');
        
        // Update user in database
        console.log('6. Updating user in database...');
        user.resume = resumeUrl;
        await user.save();
        console.log('✅ User updated successfully\n');
        
        // Verify update
        console.log('7. Verifying database update...');
        const updatedUser = await User.findById(testUserId);
        console.log('   User ID:', updatedUser._id);
        console.log('   Name:', updatedUser.name);
        console.log('   Email:', updatedUser.email);
        console.log('   Resume URL:', updatedUser.resume);
        console.log('   Has Resume:', !!updatedUser.resume);
        
        if (updatedUser.resume === resumeUrl) {
            console.log('\n✅ SUCCESS! Resume URL saved correctly in database');
        } else {
            console.log('\n❌ ERROR! Resume URL mismatch');
            console.log('   Expected:', resumeUrl);
            console.log('   Got:', updatedUser.resume);
        }
        
        console.log('\n=== TEST COMPLETED ===\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED WITH ERROR:');
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the test
testResumeUpload();
