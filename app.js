//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
var _ = require('lodash');
const mongoose = require('mongoose');
const mongodb = require('mongodb');



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BlogDB');

const entrySchema = new mongoose.Schema({
  title: String,
  content: String
});

//create model for the same schema
const Entry = mongoose.model('Entry', entrySchema);



app.get('/', async function (req, res) {
  //get all the entries/post here and pass it into the post array
  let posts = [];
  try{
    posts = await Entry.find();
  }catch(err){
    console.log(err);
  }

  //res.render is used in ejs to render ejs files, ejs files should be defined in 
  //views folder and just specify file name while rendering file
  res.render('home',{homeStartingContent: homeStartingContent, posts: posts});
});

app.get('/about', function (req, res) {
  res.render('about',{aboutContent: aboutContent});
});

app.get('/contact', function (req, res) {
  res.render('contact',{contactContent: contactContent});
});

app.get('/compose', function (req, res) {
  res.render('compose');
});

app.get('/posts/:rt', async function(req, res){
  let temp = _.lowerCase(req.params.rt);
  try{
    const document = await Entry.findOne({title:{'$regex' : temp, '$options' : 'i'}});
      if(document != null){
        console.log('match found');
        res.render('post', {
          title: document.title,
          content: document.content
        });
      }else{
        console.log("match not found");
        res.redirect('/');
      }
  }catch(err){
    console.log(err);
  }

});

app.post('/compose', function(req, res){
  const e1 = new Entry({
    title: req.body.compose_title,
    content: req.body.compose_post
  });
  //insert the newely created entry in database
  e1.save();
  res.redirect('/');
})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
}