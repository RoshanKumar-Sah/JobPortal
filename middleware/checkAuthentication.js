var jwt = require('jsonwebtoken');

let checkAuthentication = (key) => {
    return (req, res, next) => {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1]

            // console.log(token);

            if (token) {
                try {

                    let decoded_token = jwt.verify(token, key);
                    req.user = decoded_token
                    // console.log(req.user);


                    return next()
                } catch (err) {

                }
            }
        }
        res.status(401).send({ msg: "unauthenticated" })

    }
}

module.exports = checkAuthentication