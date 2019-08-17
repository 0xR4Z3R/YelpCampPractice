//all the middleware goes here
var express = require("express");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareobj = {};

middlewareobj.checkCampgroundOwnership = function(req,res,next){
    
    //if is user logged in
        if(req.isAuthenticated()){
             
            //find campground by its id 
             Campground.findById(req.params.id, function(err, foundCampground){
                    if(err || !foundCampground){
                            req.flash("error", "Campground not found");
                            res.redirect("back");
                    }else{
                        
                        //console.log(foundCampground.author.id);
                        //console.log(req.user._id);
                        
                        //does user own the campground?
                        if(foundCampground.author.id.equals(req.user._id)){
                            next();

                        }else{
                            res.redirect("back");
                          //res.send("You do not have permission to do that!!");
                        }
                    
                        }
                });
                
        } else{
            
           // res.send("you need to be logged in ")
              req.flash("error","You need to be logged in");
              res.redirect("/");
       
        }
    
    
}

middlewareobj.checkCommentOwndership = function(req,res,next){
    //if is user logged in
        if(req.isAuthenticated()){
             
            //find campground by its id 
             Comment.findById(req.params.comment_id, function(err, foundComment){
                    if(err || !foundComment){
                            req.flash("error", "Comment not found");
                            res.redirect("back");
                    }else{
                        
                        //console.log(foundCampground.author.id);
                        //console.log(req.user._id);
                        
                        //does user own the campground?
                        if(foundComment.author.id.equals(req.user._id)){
                            next();

                        }else{
                            req.flash("error", "Permission denied!!");
                            res.redirect("back");
                          //res.send("You do not have permission to do that!!");
                        }
                    
                        }
                });
                
        } else{
            
           // res.send("you need to be logged in ")
              req.flash("error","You need to be logged in");
              res.redirect("back");
       
        }
    
}

middlewareobj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    req.flash("error","Please Login First!");
    res.redirect("/login");
    
}

module.exports = middlewareobj;