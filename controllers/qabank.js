
const mongoose= require('mongoose');

const QABankSchema = mongoose.Schema({
    
    id:{
        type:Number
    },
    question:{
        type: String
    },
    answers:{
        type: Array
    }
});
const QABank = mongoose.model('QABank', QABankSchema);

module.exports= QABank;
