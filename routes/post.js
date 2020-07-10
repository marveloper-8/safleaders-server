const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

// posts
router.post('/create-post', requireLogin, (req, res) => {
    const {
        companyName, 
        propertyName, 
        propertyLocation,
        typeOfDocument,
        youTubeLink,
        propertyDescription,
        pic
    } = req.body
    console.log(companyName, propertyName, propertyLocation, typeOfDocument, youTubeLink, propertyDescription, pic)
    if(!companyName || !propertyName || !propertyLocation || !typeOfDocument || !youTubeLink || !propertyDescription || !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }

    req.admin.password = undefined
    
    const post = new Post({
        companyName,
        propertyName,
        propertyLocation,
        typeOfDocument,
        youTubeLink,
        propertyDescription,
        photo: pic,
        postedBy: req.admin
    })
    post.save().then(result => {
        return res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/all-post', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/properties-details/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then(post => {
        Post.find({postId: req.params.id})
        .populate("postedBy", "_id propertyName")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({post, posts})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

router.delete('/delete-post/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.admin._id.toString()){
            post.remove()
            .then(result => {
                res.json({message: "successfully deleted"})
            }).catch(err => {
                console.log(err)
            })
        }
    })
})
// end of posts



router.get('/my-dashboard', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id name")
        .then(myPost => {
            return res.json({myPost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {
        new: true
    })
    .populate("likes", "-id firstName")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})

router.put('/comments', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
}) 

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})

module.exports = router