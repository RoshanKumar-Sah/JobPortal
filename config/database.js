const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/JobPortal')
//     .then(() => console.log('Connected!'));

mongoose.connect('mongodb+srv://mail4sahrs:Rtyfghvbn%40123%24@jobportal.g7u8ge7.mongodb.net/JobPortal?retryWrites=true&w=majority')
    .then(() => console.log('Connected!'));