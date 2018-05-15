var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
        name: "Cloud's Rest",
        image: "https://pixabay.com/get/ea36b00d2df4003ed1584d05fb1d4e97e07ee3d21cac104497f5c67da1eab6be_340.png",
        description: "Bacon ipsum dolor amet sausage turducken alcatra swine shankle picanha frankfurter capicola filet mignon ball tip."
    },
    {
        name: "Desert Mesa",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
        description: "Sausage meatball spare ribs, hamburger frankfurter pork loin pork belly short loin."
    },
    {
        name: "Canyon Floor",
        image: "https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",
        description: "Sausage chuck rump jowl short ribs buffalo. Fatback pork belly cow doner t-bone."
    }
];

function seedDB() {
    //wipe out all  campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Wipe out all campgrounds successfully!");
            //add some new campgrounds
            Comment.remove({}, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Wipe out all comments successfully");
                    //create new campgrounds through data
                    data.forEach(function(seed) {
                        Campground.create(seed, function(err, campground) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Added a new campground: " + campground.name);
                                //add a test comment
                                Comment.create({
                                    text: "This place is great, you should definately try it.",
                                    author: "Homer"
                                }, function(err, comment) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        //associate the comment to corresponding campground.
                                        campground.comments.push(comment);
                                        campground.save(function(err, ground) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log("Added a test comment successfully!");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDB;
