import mongoose from 'mongoose';

const jobApplicationSchema = mongoose.Schema({
    userId: {type: String, required: true, ref: 'User'},
    jobId: {type: String, required: true},
    companyId: {type: String, required: true},
    jobTitle: {type: String, required: true},
    companyName: {type: String, required: true},
    location: {type: String, required: true},
    appliedDate: {type: Date, default: Date.now},
    status: {type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending'}
})

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema)

export default JobApplication;
