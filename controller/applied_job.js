const Applied_job = require("../model/Applied_job");
const Job = require("../model/Job")
const express = require("express")
const app = express()

const apply_jobs = async (req, res, next) => {
    console.log(req.params.id);
    try {
        const generated_date = Date.now()
        const job_id = req.params.id
        const client_id = req.user


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
    // console.log(req.user);
    try {
        let applied_jobs = await Applied_job.find({ client: req.user })
        res.send(applied_jobs);
    } catch (err) {
        next(err)
    }


}

const emp_fetch_jobs = async (req, res, next) => {
    // let jobs = await Job.find({ created_by: req.user })
    // console.log(jobs);
    // console.log("------------------------------------------------------------------");
    // // let temp = Object.entries(jobs)
    // // console.log(temp);

    // let applied_jobs = await Applied_job.find()
    // let applied_jobs_id = []
    // for (let i = 0; i < jobs.length; i++) {
    //     if (jobs._id == applied_jobs.job) {
    //         await applied_jobs_id.push(applied_jobs)
    //     }
    // }

    // console.log("Applied jobs ",applied_jobs_id);
    res.send("fetch applied jobs")



}

module.exports = {
    apply_jobs,
    client_fetch_jobs,
    emp_fetch_jobs
}