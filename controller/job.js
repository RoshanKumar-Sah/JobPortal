const Job = require("../model/Job");
const path = require("path")
const fs = require("fs");
const cloudinary = require('../utils/cloudinary')
const mongoose = require("mongoose")

const { ObjectID } = require('mongodb');


const singleJob = async (req, res, next) => {
    try {
        // let job = await Job.findById(req.params.id)
        let jobId = new mongoose.Types.ObjectId(req.params.id)

        // console.log(jobId);
        let job = await Job.aggregate([
            { $match: { _id: jobId } },
            {
                $lookup: {
                    from: "employers",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "empDetails"
                }
            },
            {
                $unwind: "$empDetails"
            },
            {
                $project: {
                    title: "$title",
                    category: "$category",
                    job_level: "$job_level",
                    offered_salary: "$offered_salary",
                    location: "$location",
                    deadline: "$deadline",
                    type: "$type",
                    description: "$description",
                    profile_image: "$profile_image",
                    cover_image: "$cover_image",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    number_of_vacancy: "$number_of_vacancy",
                    EmpName: "$empDetails.name",
                    EmpWebsite: "$empDetails.website",
                    EmpContact: "$empDetails.contact",
                    EmpDescription: "$empDetails.description"
                }
            }
        ]
        )

        if (job) {
            res.send(job)
        }

    } catch (err) {
        next(err)
    }
}


const fetchJobs = async (req, res, next) => {
    // console.log("connected fetch jobs");

    let per_page = parseInt(req.query.per_page) || 10
    let page = parseInt(req.query.page) || 1
    let search_term = req.query.search_term || ""
    let sort_by = req.query.sort_by || ""


    // let jobs = await Job.find()
    // res.send(jobs)

    switch (sort_by) {



        case "latest":
            sort_by = { createdAt: -1 }

            break;
        case "old":
            sort_by = { createdAt: 1 }

            break;
        default:
            sort_by = { title: 1 }
            break;
    }


    let jobs = await Job.aggregate(
        [

            {
                $match: {
                    $or: [
                        { title: RegExp(search_term, "i") },
                        { category: RegExp(search_term, "i") },
                        { job_level: RegExp(search_term, "i") },
                        { location: RegExp(search_term, "i") }
                    ]
                },
            },
            {
                $lookup: {
                    from: "employers",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "empDetails"
                }
            },
            {
                $unwind: "$empDetails"
            },
            {
                $project: {
                    title: "$title",
                    category: "$category",
                    job_level: "$job_level",
                    offered_salary: "$offered_salary",
                    location: "$location",
                    deadline: "$deadline",
                    type: "$type",
                    description: "$description",
                    profile_image: "$profile_image",
                    cover_image: "$cover_image",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    number_of_vacancy: "$number_of_vacancy",
                    EmpName: "$empDetails.name",
                    EmpWebsite: "$empDetails.website",
                    EmpContact: "$empDetails.contact",
                    EmpDescription: "$empDetails.description"
                }
            },
            {
                $sort: sort_by
            },
            {
                $facet: {
                    meta_data: [{ $count: "total" }, { $addFields: { page, per_page } }],
                    jobs: [{ $skip: ((page - 1) * per_page) }, { $limit: per_page }]
                }
            }
        ]
    )
    res.send(jobs)
}



const employerJobs = async (req, res, next) => {

    try {

        let empId = new mongoose.Types.ObjectId(req.user._id)
        // console.log(empId);

        let per_page = parseInt(req.query.per_page) || 10
        let page = parseInt(req.query.page) || 1
        let search_term = req.query.search_term || ""
        let sort_by = req.query.sort_by || ""


        // let jobs = await Job.find()
        // res.send(jobs)

        switch (sort_by) {



            case "latest":
                sort_by = { createdAt: -1 }

                break;
            case "old":
                sort_by = { createdAt: 1 }

                break;
            default:
                sort_by = { title: 1 }
                break;
        }


        let jobs = await Job.aggregate(
            [
                {
                    $match: {
                        $and: [{ created_by: empId }, {
                            $or: [
                                { title: RegExp(search_term, "i") },
                                { category: RegExp(search_term, "i") },
                                { job_level: RegExp(search_term, "i") },
                                { location: RegExp(search_term, "i") }
                            ]
                        }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: "employers",
                        localField: "created_by",
                        foreignField: "_id",
                        as: "empDetails"
                    }
                },
                {
                    $unwind: "$empDetails"
                },
                {
                    $project: {
                        title: "$title",
                        category: "$category",
                        job_level: "$job_level",
                        offered_salary: "$offered_salary",
                        location: "$location",
                        deadline: "$deadline",
                        type: "$type",
                        description: "$description",
                        profile_image: "$profile_image",
                        cover_image: "$cover_image",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt",
                        number_of_vacancy: "$number_of_vacancy",
                        EmpName: "$empDetails.name",
                        EmpWebsite: "$empDetails.website",
                        EmpContact: "$empDetails.contact",
                        EmpDescription: "$empDetails.description"
                    }
                },
                {
                    $sort: sort_by
                },
                {
                    $facet: {
                        meta_data: [{ $count: "total" }, { $addFields: { page, per_page } }],
                        jobs: [{ $skip: ((page - 1) * per_page) }, { $limit: per_page }]
                    }
                }
            ]
        )
        res.send(jobs)
    } catch (err) {
        next(err)
    }

}


const postJobs = async (req, res, next) => {
    // console.log(req.body);
    //  console.log(req.files.profile_image);

    let profile_file_name = ""
    let cover_file_name = ""
    let uploaded_profile_img = ""
    let profile_img_url = ""
    let uploaded_cover_img = ""
    let cover_img_url = ""

    try {
        // console.log(req.files);
        profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);
        req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);

        uploaded_profile_img = await cloudinary.uploader.upload(path.join(__dirname, "../public/images/profile/" + profile_file_name), { folder: "JobPortal/Profile" })
        profile_img_url = uploaded_profile_img.secure_url

        // console.log(uploaded_profile_img);

        if (profile_img_url) {
            fs.unlinkSync(path.resolve("public/images/profile", profile_file_name))
        }

    } catch (err) { }

    try {
        cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

        req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);

        uploaded_cover_img = await cloudinary.uploader.upload(path.join(__dirname, "../public/images/cover/" + cover_file_name), { folder: "JobPortal/Cover" })
        cover_img_url = uploaded_cover_img.secure_url

        if (cover_img_url) {
            fs.unlinkSync(path.resolve("public/images/cover", cover_file_name))
        }

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
                "created_by": req.user._id,
                profile_image: profile_img_url,
                cover_image: cover_img_url
            })
        res.send(job)
    } catch (err) {
        console.log(err);
        next(err)
    }

}


let updateJobs = async (req, res, next) => {

    // console.log(req.body.profile_image);

    try {
        // console.log(req.params.id);
        let to_be_updated = await Job.findById(req.params.id)

        // console.log(req.body);

        if (to_be_updated) {
            if (req.user._id == to_be_updated.created_by) {
                // console.log(to_be_updated);
                // return console.log(path.resolve("public/images/cover"));


                let existing_profile_file_name = to_be_updated.profile_image
                let existing_cover_file_name = to_be_updated.cover_image

                // console.log(existing_profile_file_name);

                let profile_file_name = ""
                let cover_file_name = ""
                let public_id = ""
                let remove_profile_img = ""
                let uploaded_profile_img = ""
                let profile_img_url = ""
                let remove_cover_img = ""
                let uploaded_cover_img = ""
                let cover_img_url = ""
                try {
                    if (!req.body.profile_image) {



                        const pattern = /(JobPortal[^.]+)/;

                        const match = existing_profile_file_name.match(pattern);
                        // console.log(match);
                        if (match) {
                            public_id = match[0];
                            // console.log(public_id);
                            remove_profile_img = await cloudinary.uploader.destroy(public_id)
                        }
                    } else {

                        profile_img_url = existing_profile_file_name
                    }

                    if (req?.files?.profile_image) {
                        // console.log(req.files.profile_image);
                        profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);
                        req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);

                        uploaded_profile_img = await cloudinary.uploader.upload(path.join(__dirname, "../public/images/profile/" + profile_file_name), { folder: "JobPortal/Profile" })
                        profile_img_url = uploaded_profile_img.secure_url

                        // console.log(uploaded_profile_img);

                        if (profile_img_url) {
                            fs.unlinkSync(path.resolve("public/images/profile", profile_file_name))
                        }
                    }

                    if (!req.body.cover_image) {

                        const pattern = /(JobPortal[^.]+)/;

                        const match = existing_cover_file_name.match(pattern);
                        // console.log(match);
                        if (match) {
                            public_id = match[0];
                            // console.log(public_id);
                            remove_cover_img = await cloudinary.uploader.destroy(public_id)
                        }
                    } else {
                        cover_img_url = existing_cover_file_name
                    }

                    if (req?.files?.cover_image) {
                        cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

                        req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);

                        uploaded_cover_img = await cloudinary.uploader.upload(path.join(__dirname, "../public/images/cover/" + cover_file_name), { folder: "JobPortal/Cover" })
                        cover_img_url = uploaded_cover_img.secure_url

                        if (cover_img_url) {
                            fs.unlinkSync(path.resolve("public/images/cover", cover_file_name))
                        }
                    }
                } catch (err) {

                }


                // try {
                //     if (req.files?.profile_image) {
                //         if (existing_profile_file_name) {
                //             if (req.files.profile_image == existing_profile_file_name) {
                //                 profile_file_name = existing_profile_file_name
                //             } else {
                //                 fs.unlinkSync(path.resolve("public/images/profile", existing_profile_file_name))
                //                 profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);

                //                 req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);
                //             }
                //         } else {
                //             profile_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.profile_image.name);

                //             req.files.profile_image.mv(path.join(__dirname, "../public/images/profile/") + profile_file_name);
                //         }

                //     } else {
                //         fs.unlinkSync(path.resolve("public/images/profile", existing_profile_file_name))
                //     }
                // } catch (err) {

                // }


                // try {
                //     if (req.files?.cover_image) {
                //         if (existing_cover_file_name) {
                //             if (req.files.cover_image == existing_cover_file_name) {
                //                 cover_file_name = existing_cover_file_name
                //             } else {
                //                 fs.unlinkSync(path.resolve("public/images/cover", existing_cover_file_name))
                //                 cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

                //                 req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);
                //             }
                //         } else {
                //             cover_file_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.files.cover_image.name);

                //             req.files.cover_image.mv(path.join(__dirname, "../public/images/cover/") + cover_file_name);
                //         }

                //     } else {
                //         fs.unlinkSync(path.resolve("public/images/cover", existing_cover_file_name))
                //     }
                // } catch (err) {

                // }

                try {
                    let deadline_date = new Date(req.body.deadline)
                    let updated_job = await Job.findByIdAndUpdate(req.params.id, { ...req.body, deadline: deadline_date, cover_image: cover_img_url, profile_image: profile_img_url }, { new: true })
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
            let existing_profile_file_name = to_be_deleted.profile_image
            let existing_cover_file_name = to_be_deleted.cover_image
            if (req.user._id == to_be_deleted.created_by) {
                try {

                    let remove_profile_img = ""
                    let remove_cover_img = ""

                    const pattern = /(JobPortal[^.]+)/;

                    const match_profile = existing_profile_file_name.match(pattern);
                    // console.log(match_profile);
                    if (match_profile) {
                        profile_public_id = match_profile[0];
                        // console.log(profile_public_id);
                        remove_profile_img = await cloudinary.uploader.destroy(profile_public_id)
                        // console.log(remove_profile_img);
                    }

                    const match_cover = existing_cover_file_name.match(pattern);
                    // console.log(match_cover);
                    if (match_cover) {
                        cover_public_id = match_cover[0];
                        // console.log(cover_public_id);
                        remove_cover_img = await cloudinary.uploader.destroy(cover_public_id)
                        // console.log(remove_cover_img);
                    }

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
    removeJobs,
    singleJob,
    employerJobs
}