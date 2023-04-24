const Job = require("../model/Job");
const path = require("path")
const fs = require("fs")

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


let updateJobs = async (req, res, next) => {

    try {
        // console.log(req.params.id);
        let to_be_updated = await Job.findById(req.params.id)

        if (to_be_updated) {
            if (req.user == to_be_updated.created_by) {
                // console.log(to_be_updated);
                // return console.log(path.resolve("public/images/cover"));


                let existing_profile_file_name = to_be_updated.profile_image
                let existing_cover_file_name = to_be_updated.cover_image

                let profile_file_name = ""
                let cover_file_name = ""


                try {
                    if (req.files?.profile_image) {
                        if (existing_profile_file_name) {
                            if (req.files.profile_image == existing_profile_file_name) {
                                profile_file_name = existing_profile_file_name
                            } else {
                                fs.unlinkSync(path.resolve("public/images/profile", existing_profile_file_name))
                                profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);

                                req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);
                            }
                        } else {
                            profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);

                            req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);
                        }

                    } else {
                        fs.unlinkSync(path.resolve("public/images/profile", existing_profile_file_name))
                    }
                } catch (err) {

                }


                try {
                    if (req.files?.cover_image) {
                        if (existing_cover_file_name) {
                            if (req.files.cover_image == existing_cover_file_name) {
                                cover_file_name = existing_cover_file_name
                            } else {
                                fs.unlinkSync(path.resolve("public/images/cover", existing_cover_file_name))
                                cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

                                req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);
                            }
                        } else {
                            cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

                            req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);
                        }

                    } else {
                        fs.unlinkSync(path.resolve("public/images/cover", existing_cover_file_name))
                    }
                } catch (err) {

                }

                try {
                    let deadline_date = new Date(req.body.deadline)
                    let updated_job = await Job.findByIdAndUpdate(req.params.id, { ...req.body, deadline: deadline_date, cover_image: cover_file_name, profile_image: profile_file_name }, { new: true })
                    return res.send(updated_job)
                } catch (err) {

                }



            } else {
                return res.status(403).send({ msg: "Access Denied - This job wasn't posted by this user." })
            }
        } else {
            return res.status(404).send({ msg: "Resouce not found" })
        }
    } catch (err) {
        next(err)
    }

}


const removeJobs = async (req, res, next) => {

    try {
        let to_be_deleted = await Job.findById(req.params.id)

    //    return console.log(to_be_deleted);

        if (to_be_deleted) {
            if (req.user == to_be_deleted.created_by) {
                try {

                    fs.unlinkSync(path.resolve("public/images/profile", to_be_deleted.profile_image))
                    fs.unlinkSync(path.resolve("public/images/cover", to_be_deleted.cover_image))

                } catch (err) {

                }

                let deleted_job = await Job.findByIdAndDelete(req.params.id)

                return res.status(204).end()

            } else {
                return res.status(403).send({ msg: "Access Denied - This job wasn't posted by this user." })
            }
        } else {
            return res.status(404).send({ msg: "Resouce not found" })
        }
    } catch (err) {
        next(err)
    }

}

module.exports = {
    fetchJobs,
    postJobs,
    updateJobs,
    removeJobs
}