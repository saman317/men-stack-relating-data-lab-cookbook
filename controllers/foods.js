const express = require("express");
const router = express.Router();

const User= require("../models/user.js")

//Include router logic here
// I.N.D.U.C.E.S
// Index	‘/users/:userId/foods’	GET
// New	‘/users/:userId/foods/new’	GET
// Create	‘/users/:userId/foods’	POST
// Show	‘/users/:userId/foods/:itemId’	GET
// Edit	‘/users/:userId/foods/:itemId/edit’	GET
// Update	‘/users/:userId/foods/:itemId’	PUT
// Delete	‘/users/:userId/foods/:itemId’	DELETE

//Index
router.get("/", async (req,res)=> {
    try{
    const user= await User.findById(req.session.user._id);
    const foods = user.pantry;
    console.log(foods)
     res.render("foods/index.ejs", {foods})
    }catch(error){
        console.log(error)
        res.redirect("/")

    }

})

//New
router.get("/new", (req,res) => {
    res.render("foods/new.ejs")
})

//Create
router.post("/", async (req,res)=> {
    try{
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.push(req.body);

        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);

    }catch(error){
        console.log(error);
        res.redirect("/");

    }
})
//Show
router.get("/:itemId", async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    // .id is a mongoose method to find a subdocument by its id
    const food = currentUser.pantry.id(req.params.itemId);
  
    res.render("foods/show.ejs", { food});
})

//Edit
router.get("/:itemId/edit", async (req,res) =>{
    const currentUser = await User.findById(req.session.user._id);
    const food = currentUser.pantry.id(req.params.itemId);
    res.render("foods/edit.ejs", {food});
})

//Update
router.put("/:itemId", async (req,res)=>{
        try {
          const currentUser = await User.findById(req.session.user._id);
          const food= currentUser.pantry.id(req.params.itemId)
          //call set on subdocument to update it
          food.set(req.body);
         
      
          await currentUser.save();
          res.redirect(`/users/${currentUser._id}/foods`);
        } catch (error) {
          console.log(error);
          res.redirect("/");
        }
      });




//Delete
router.delete("/:itemId", async (req,res) => {
    try{
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.id(req.params.itemId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${req.session.user._id}/foods`)
    }catch(error){
        console.log(error);
        res.redirect("/")
    }
});



module.exports = router;
