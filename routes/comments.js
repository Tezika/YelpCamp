var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//===============
//COMMENTS ROUTE
//===============

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", { campground: foundCampground });
        }
    });
});

//POST THE NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //create a new comment.
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                }
                else {
                    //add username and id to comment and save the comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    //connect new comment to campground.
                    foundCampground.comments.push(newComment);
                    console.log(newComment);
                    foundCampground.save(function(err, savedCampground) {
                        if (err) {
                            console.log(err);
                            res.redirect("/campgrounds");
                        }
                        else {
                            console.log("Associated a new comment with a campground successfully");
                            //redirect camoground show page.
                            res.redirect("/campgrounds/" + foundCampground._id);
                        }
                    });
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { comment: foundComment, campground_id: req.params.id })
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
