import mongoose from 'mongoose';

const jobSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    category: {type: String, required: true},
    level: {type: String, required: true},
    salary: {type: Number, required: true},
    companyId: {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        image: {type: String, required: true}
    },
    date: {type: Date, default: Date.now},
    visible: {type: Boolean, default: true}
})

const Job = mongoose.model('Job', jobSchema)

export default Job;
