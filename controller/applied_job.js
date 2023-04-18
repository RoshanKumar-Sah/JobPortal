const Applied_job = require("../model/Applied_job");

const apply_jobs = async(req,res,next)=>{
console.log(req.params.id);
try{
const generated_date = Date.now()
const job_id = req.params.id
const client_id = req.user

let applied_job = await Applied_job.create({job: job_id, client: client_id, applied_date: generated_date})

res.send(applied_job)

}catch(err){
    next(err)
}

}

module.exports = {
    apply_jobs
}