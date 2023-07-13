const Post = require("../models/posts");
const fs = require('fs');

module.exports = class API {

    //Fetching all posts in the database
    static async fetchAllPost(req, res) {
        try {
            const posts = await Post.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(404).json({
                message: err.message
            })
        }
    }

    //Fetching posts by the creator's id 
    static async fetchPostById(req, res) {
        const id = req.params.id; //prendo l'id dall'url 
        try {
            const post = await Post.findById(id);
            res.status(200).json(post);
        } catch (error) {
            res.status(200).json({
                message: error.message
            })
        }
    }

    //Creation of the post 
    static async createPost(req, res) {
        const post = req.body;

        // Checking if the user gave some image
        if (req.file) {
            const imagename = req.file.originalname;
            post.image= imagename
        }

        try {
            await Post.create(post);
            res.status(201).json({
                message: 'il Post è stato creato!'
            });
        } catch (err) {
            res.status(400).json({
                message: 'Ho avuto un errore'
            });
        }

    }

    //Updating the post, allowing user to change only the image or even the content 
    static async updatePost(req, res) {
        const id = req.params.id;
        let new_image = '';

        //if the file is attached change the image and the content
        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        } else {
            new_image = req.body.old_image;
        }


        const newPost = req.body;
        newPost.image = new_image;

        try {
            await Post.findByIdAndUpdate(id, newPost);
            res.status(200).json({
                message: 'il Post è stato cambiato!'
            });
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }

    // Deleting the post 
    static async deletePost(req, res) {
        const id = req.params.id;
        try {
            const result = await Post.findByIdAndDelete(id);
            if (result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image);
                } catch (error) {
                    console.log(error);
                }
            }
            res.status(200).json({
                message: 'il post è stato eliminato'
            })
        } catch (error) {

        }
    }


    static async comment(req, res) {
        console.log("sono nel comment")
        const postId = req.params.id;
        const comment = req.body.comment;
        console.log(comment)
        
        try {
            const post = await Post.findById(postId);
            post.comments.push({ comment: comment });
            await post.save();
            res.status(201).json({
                message: 'Il commento è stato aggiunto al post!'
            });
        } catch (err) {
            res.status(400).json({
                message: 'Ho avuto un errore'
            });
        }
    }
}