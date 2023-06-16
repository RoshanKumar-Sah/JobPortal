const validateSchema = (schema) => {

return(req,res,next)=>{
    let {error} = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if(error){
        let errors = error.details.map(validation_error =>{
            return {
                parameter: validation_error.context.key,
                message: validation_error.message
            }
        })
        return res.status(400).send({msg : "Bad Request", errors })

    }else{
        next()
    }
}
}

module.exports = validateSchema