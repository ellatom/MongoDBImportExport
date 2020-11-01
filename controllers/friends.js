
const mongoose= require('mongoose');

const FriendsSchema = mongoose.Schema({
    
    userName:{
        type: String
    },
    userId:{
        type: String
    },
    friendName:{
        type: String
    },
    questionAnswer:{
        type: Array
    }
});
const Friends = mongoose.model('Friends', FriendsSchema);

module.exports= Friends;
