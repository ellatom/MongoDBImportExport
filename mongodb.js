const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'resturants'

MongoClient.connect(connectionURL, {useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName);

    // findAllRecords(db);
    findResturantsContainFirstThreeLettersWil(db);
    // findResturantsContainFirstThreeLettersCes(db);

    db.close;
})

function findAllRecords(db)
{
    db.collection('resturants').findOne({},(error, res) => { //can add {}"borough" : "Bronx"

    if (error) { 
        console.log('Unable to fatch!'); 
    } 
    console.log(res); 
    })
}

//db.getCollection("resturants").find({ "name": /^Wil/},{"restaurant_id":1}, {"name":1}, {"borough":1}, {"cuisine":1})
//,
function findResturantsContainFirstThreeLettersWil(db)
{
    // let reg = new RegExp(/^Wil/);
    db.collection('resturants').find({},{ $and: [{"name": {$regex:'/^Wil/',$options:'i'}},{"restaurant_id":1}, {"borough":1}, {"cuisine":1}]})
    .toArray(function (err, res) {
        if (err) throw err;
        console.log(res);
    });    
}

function findResturantsContainFirstThreeLettersCes(db)
{

    db.collection('resturants').find({},{ "cuisine": new RegExp("/ces/")},{"restaurant_id":1}, {"name":1}, {"borough":1}, {"cuisine":1}).limit(2)
    .toArray(function (err, res) {
        if (err) throw err;
        console.log(a); 
    });  
     
}