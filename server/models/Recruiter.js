import mongoose from 'mongoose';

const recruiterSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    image: {type: String},
    createdAt: {type: Date, default: Date.now}
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;
