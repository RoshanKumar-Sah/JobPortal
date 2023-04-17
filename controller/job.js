const Job = require("../model/Job");
const path = require("path")

const fetchJobs = async (req, res, next) => {
    // console.log("connected fetch jobs");

    let jobs = await Job.find()
    res.send(jobs)
}


const postJobs = async (req, res, next) => {
    // console.log(req.body);
    //  console.log(req.files.profile_image);

    let profile_file_name = ""
    let cover_file_name = ""
    try {
        profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);
        req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);
    } catch (err) { }

    try {
        cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

        req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);
    } catch (err) {

    }

    try {
        // console.log(path.resolve(__dirname, "../public/images/cover/"));
        // console.log(path.join(__dirname, "../public/images/cover/"));


        let deadline_date = new Date(req.body.deadline)
        // .toLocaleDateString()
        // console.log(deadline_date);

        let job = await Job.create(
            {
                ...req.body,
                deadline: deadline_date,
                "created_by": req.user,
                profile_image: profile_file_name,
                cover_image: cover_file_name
            })
        res.send(job)
    } catch (err) {
        console.log(err);
        next(err)
    }

}

module.exports = {
    fetchJobs,
    postJobs
}