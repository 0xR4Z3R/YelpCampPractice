
var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

//Comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});


//Comments create route
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
              req.flash("error","something went wrong");
               console.log(err);
           } else {
               //add username and id yo comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               console.log("New comment's username is: " + req.user.username);
               //save comment
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success","successfully added Comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//Comment Edit Route

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwndership, function(req, res){
   
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "No Campground found");
           return res.redirect("back");
       } else{
        
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit",{ campgroundId: req.params.id, comment:foundComment});
        }
    });
           
       }
       
   })

});


//Comment Update Route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwndership, function(req, res){
   
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error","Something went Wrong!!");
            res.redirect("back");
        } else{
            req.flash("success","You successfully edited your comment");
            res.redirect("/campgrounds/" + req.params.id);
            
        }
        
    });
   
    
});

//Comment Delete Route

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwndership, function(req,res){
    
    //find by Id and Remove
    Comment.findByIdAndRemove(req.params.comment_id ,function(err){
        if(err){
            req.flash("error","Something went wrong!!");
            res.redirect("back");
        } else{
             req.flash("success","You successfully deleted your comment");
             res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

module.exports = router;