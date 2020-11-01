const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'resturants'

// /home/ellatom/Desktop/mongodb/mongodb-org-server_4.4.1_amd64/data/usr/bin/mongod 
// --dbpath=/home/ellatom/Desktop/mongodb-data
MongoClient.connect(connectionURL, {useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName);

    // findAllRecords(db);
    // findResturantsContainFirstThreeLettersWil(db);
    // findResturantsContainFirstThreeLettersCes(db);
    findNotBrough(db);
    // let student={ name: "Shani Raba", address: "Rishon LeZiyon"};
    // insertStudent(student,db);

    db.close;
})


function insertStudent(student,db)
{
    db.collection("students").insertOne(student);
}

function findNotBrough(db)
{//Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which are not belonging to the borough Staten Island or Queens or Bronx or Brooklyn (find 10)
    const query = 
        {"borough" :{$nin :["Staten Island","Queens","Bronx","Brooklyn"]}
      };
      const options = {
        limit: 10,
        projection: {"restaurant_id": 1, "name": 1, "borough": 1, "cuisine": 1 }
      };
    
    db.collection('resturants').find(query,options)
    .toArray(function (err, res) {
        if (err) throw err;
        console.log(res);
    });  
}//select resru_id,name
//from resturants 
//where brough not in ("","","") 
//limit 10


// Insert the following object(s) to a new db (college) and in a new collection (students)
// You can use insertOne …
// // { name: “Shani Raba”, address: “Rishon LeZiyon”}
// // { name: “Pinchas Hoddad”, address: “Bat Yam” }
// What other methods we can use to insert (beside insertOne)


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