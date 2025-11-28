import Job from "../models/Job.js";

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ visible: true }).sort({ date: -1 });
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single job
export const getJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);
        
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create job (for recruiter)
export const createJob = async (req, res) => {
    try {
        const { title, description, location, category, level, salary, companyId } = req.body;
        
        const job = await Job.create({
            title,
            description,
            location,
            category,
            level,
            salary,
            companyId
        });
        
        res.json({ success: true, message: 'Job created successfully', job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
