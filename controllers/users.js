
const mongoose= require('mongoose');

const UsersSchema = mongoose.Schema({

    userName:{
        type: String
    },

    location:{
        type: String
    },

    questionAnswer:{
        type: Array
    }
});
const Users = mongoose.model('Users', UsersSchema);

module.exports= Users;

// module.exports = function() {
    
//     const UsersSchema = mongoose.Schema({

//         userName:{
//             type: String
//         },
    
//         location:{
//             type: String
//         },
    
//         questionAnswer:{
//             type: Array
//         }
//     });

//     return {
//         Users: mongoose.model('Users', UsersSchema)
//     };
//   };


