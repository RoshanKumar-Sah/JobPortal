
var jwt = require('jsonwebtoken');



const getUser = async (req, res, next) => {


    return res.send(req.user)


}

module.exports = {


    getUser
}