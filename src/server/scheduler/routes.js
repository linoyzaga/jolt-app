var mongoose = require('mongoose');
var express = require('express');
var People = require('./db').People;
var router = express.Router();

// Get all people by query
router.post('/', function (req, res) {

    // Save the conditions into variables
    var name = req.body.query.name;
    var age = req.body.query.age;
    var phone = req.body.query.phone;
    var numToSkip = req.body.query.numToSkip;

    // Build the query
    var query = queryBuilder(name, age, phone);

    People.find(query, function (err, docs) {

        // Check if there is are any results for query
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

        // Init the results to return
        var resultsToReturn = {};
        resultsToReturn.docs = docs;

        if (resultsToReturn.docs.length < 10){
            resultsToReturn.isEnd = true}
        else {
            resultsToReturn.isEnd = false;
        }

        // Return value
        res.send(resultsToReturn);
    }).limit(10).skip(numToSkip);

});

var queryBuilder = function (name, age, phone) {

    // Init the variable to return
    var queryToReturn = {};

    // Add the name condition
    if (name.length > 0) {
        try {
            var nameExp = new RegExp(name.join(" "), 'i');
        }
        catch(err) {
            nameExp = [];
        }

        queryToReturn.name = nameExp;
    }

    // Add the phone condition
    if (phone != undefined) {
        queryToReturn.phone = phone;
    }

    // Add the age condition
    if (age != undefined) {

        var todayDate = new Date();
        var thisYear = todayDate.getFullYear();
        var thisMonth = todayDate.getMonth() + 1;
        var thisDay = todayDate.getUTCDate();
        var birthYear = (thisYear - age);

        var beginString = "01/01/" + birthYear;
        var endString = thisMonth + "/" + thisDay +"/" + birthYear;

        var beginOFYear = Date.parse(new Date(beginString));
        var endOfYear = Date.parse(new Date(endString));


        // Set the query for all the people who got this age in this year
        queryToReturn.birthday = {$gte: beginOFYear, $lt: endOfYear};
    }

    // Return the new query
    return queryToReturn;
}

module.exports = router;