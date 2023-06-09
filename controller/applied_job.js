const Applied_job = require("../model/Applied_job");
const Job = require("../model/Job")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const apply_jobs = async (req, res, next) => {
    // console.log(req.params.id);
    try {
        const generated_date = Date.now()
        const job_id = req.params.id
        const client_id = req.user._id


        try {
            let prev = await Applied_job.find({

                $and: [{ job: job_id }, { client: client_id }]
            })
            //    console.log(temp);

            if (prev) {
                let temp = Object.entries(prev)
                // console.log(temp);
                let date = new Date(temp[0][1].applied_date)

                return res.send(`Already applied on ${date}`)
            }
        } catch { }

        let applied_job = await Applied_job.create({ job: job_id, client: client_id, applied_date: generated_date })

        return res.send(applied_job)




    } catch (err) {
        next(err)
    }

}

const client_fetch_jobs = async (req, res, next) => {
    // console.log(req.user._id);
    try {
        // let applied_jobs = await Applied_job.find({ client: req.user._id })
        // res.send(applied_jobs);

        const reqClient = req.user._id;
        const reqClientId = new mongoose.Types.ObjectId(reqClient);
        // console.log(reqClientId);

        let applied_jobs = await Applied_job.aggregate([
            {
                $match: {
                    client: reqClientId
                }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },

            {
                $unwind: "$jobDetails"
            },
            {
                $lookup: {
                    from: "employers",
                    localField: "jobDetails.created_by",
                    foreignField: "_id",
                    as: "employerDetails"

                }
            },
            {
                $project: {
                    job: "$jobDetails.title",
                    category: "$jobDetails.category",
                    type: "$jobDetails.type",
                    level: "$jobDetails.job_level",
                    applied_date: 1,
                    employerName: "$employerDetails.name",
                    deadline: "$jobDetails.deadline",
                    profileImg: "$jobDetails.profile_image"

                }
            }

        ])
        res.send(applied_jobs);


    } catch (err) {
        next(err)
    }


}

const emp_fetch_jobs = async (req, res, next) => {

    try {


        const reqEmp = req.user._id;
        const reqEmpId = new mongoose.Types.ObjectId(reqEmp);


        let applied_clients = await Applied_job.aggregate([

            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client",
                    foreignField: "_id",
                    as: "clientDetails"
                }
            },
            {
                $unwind: "$jobDetails"
            },
            {
                $unwind: "$clientDetails"
            },
            {
                $lookup: {
                    from: "employers",
                    localField: "jobDetails.created_by",
                    foreignField: "_id",
                    as: "employerDetails"

                }
            },
            {
                $unwind: "$employerDetails"
            },
            { $match: { "employerDetails._id": reqEmpId } },
            {
                $project: {
                    job: "$jobDetails.title",
                    category: "$jobDetails.category",
                    type: "$jobDetails.type",
                    level: "$jobDetails.job_level",
                    applicantName: "$clientDetails.name",
                    applicantEmail: "$clientDetails.email",
                    applicantPhone: "$clientDetails.phone",
                    applied_date: 1,
                    employerName: "$employerDetails.name"


                }
            }



        ])

        res.send(applied_clients);

    } catch (err) {
        next(err)
    }

}

module.exports = {
    apply_jobs,
    client_fetch_jobs,
    emp_fetch_jobs
}