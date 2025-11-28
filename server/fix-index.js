import mongoose from 'mongoose';
import 'dotenv/config';

async function fixDatabase(dbName) {
    try {
        console.log(`\n=== Fixing ${dbName} database ===`);
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        
        console.log('MongoDB URI loaded:', mongoUri.substring(0, 30) + '...');
        await mongoose.connect(`${mongoUri}/${dbName}`);
        console.log('✅ Connected to MongoDB\n');
        
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        // List all indexes
        console.log('Current indexes on users collection:');
        const indexes = await usersCollection.indexes();
        indexes.forEach(index => {
            console.log('-', index.name, ':', JSON.stringify(index.key));
        });
        
        // Drop the problematic phoneNumber index if it exists
        try {
            console.log('\nDropping phoneNumber_1 index...');
            await usersCollection.dropIndex('phoneNumber_1');
            console.log('✅ Successfully dropped phoneNumber_1 index');
        } catch (error) {
            if (error.code === 27 || error.codeName === 'IndexNotFound') {
                console.log('ℹ️  phoneNumber_1 index does not exist (already removed)');
            } else {
                throw error;
            }
        }
        
        // Check existing users
        const userCount = await usersCollection.countDocuments();
        console.log(`\nTotal users in ${dbName}:`, userCount);
        
        if (userCount > 0) {
            console.log('\nExisting users:');
            const users = await usersCollection.find({}).limit(10).toArray();
            users.forEach(user => {
                console.log(`- ${user._id}: ${user.name} (${user.email}) phone:${user.phone || 'null'} phoneNumber:${user.phoneNumber || 'null'}`);
            });
        }
        
        console.log(`\n✅ ${dbName} database cleanup completed`);
        
    } catch (error) {
        console.error(`❌ Error in ${dbName}:`, error.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function fixAll() {
    // Fix both test and hirehub databases
    await fixDatabase('test');
    await fixDatabase('hirehub');
    console.log('\n✅ All databases fixed');
}

fixAll();
