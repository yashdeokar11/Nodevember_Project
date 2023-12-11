const express = require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const blogPostArray=require("./data.js")

const app = express();


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

const mongoURL="mongodb+srv://yashdeokar_11:12345@cluster0.smbvpwe.mongodb.net/";
mongoose.connect(mongoURL)
.then(() => {
    console.log("Database connected succesfully");
  })
  .catch((err) => {
    console.log("Error occured while Database connection", err);
  })

const blogSchema = new mongoose.Schema({
    title:String,
    imageURL:String,
    description:String
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  })

const Blog = new mongoose.model("blog", blogSchema);

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('login')
  })
app.get("/index",(req,res)=>{
    Blog.find({})
    .then((arr)=>{
        res.render("index",{blogPostArray:arr})  
    })
    .catch((err)=>{
       console.log("Cannot find blogs.")
       res.render("404");
    });

     
})

app.get("/contact",(req,res)=>{
    res.render("contact")
})

app.get("/about",(req,res)=>{
    res.render("about")
})

app.post("/compose",(req,res)=>{
    const title= req.body.title;
    const image= req.body.imageUrl;
    const description= req.body.description;

    const newBlog=new Blog({
        imageURL:image,
        title:title,
        description: description
    })

    newBlog.save()
    .then(()=>{
        console.log("Blog posted successfully");
    })
    .catch((err)=>{
        console.log("something happend",err);
    });
    
    res.redirect("/");
})


app.get("/compose",(req,res)=>{
    res.render("compose")
})

// app.get("/post",(req,res)=>{
//     console.log(req.params.id);
//     const id=req.params.id;
//     var title=""
//     var imageURL=""
//     var description=""
//     blogPostArray.forEach(post =>{
//         if (post._id == id){
//            title = post.title;
//            imageURL = post.imageURL;
//            description = post.description; 
//         }
//     });

//     const post = {
//         title : title,
//         imageURL : imageURL,
//         description : description
//     }

//     res.render("post",{post:post})
// })
//task1: Signup and login
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.post("/signup", (req, res) => {
    // Hint:
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    newUser.save()
    .then(() => {
      console.log("New User Created");
    })
    .catch((err) => {
      console.log("Error Creating New User");
    });

    res.render('login')


});

app.post("/login", (req, res) => {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
  
    User.findOne({ email: reqEmail })
      .then((user) => {
        if (user) {
          if (user.password == reqPassword) {
            Blog.find({})
              .then((posts) => {
                res.render('index', { blogPosts: posts });
              })
              .catch((err) => {
                console.log("Error getting blog posts", err);
                res.render('index', { blogPosts: posts });
              });
          } else {
            console.log("Password is incorrect");
            res.render('login');
          }
        } else {
          console.log("User Not Found");
          res.render('login');
        }
      })
      .catch((err) => {
        console.log("Error finding user", err);
        res.render('login');
      });
  });

  //task2: Delete Operation
  app.get('/post/delete/:id', (req, res) => {
    const idToDelete = req.params.id;
  
    Blog.findOneAndDelete({ _id: idToDelete })
      .then((deletedPost) => {
        if (deletedPost) {
          console.log("Post deleted:", deletedPost);
          res.redirect('/index');
        } else {
          console.log("Post Not Found");
          res.redirect('/index');
        }
      })
      .catch((err) => {
        console.log("Error deleting post", err);
        res.redirect('/index');
      });
  });

  //tash3: Dynamic routing
  app.get('/post/:id', (req, res) => {
    const reqID = req.params.id;
  
    Blog.findOne({ _id: reqID })
      .then((post) => {
        if (post) {
          res.render('post', { blogPost: post });
        } else {
          console.log("Post Not Found");
          res.render('index');
        }
      })
      .catch((err) => {
        console.log("Error finding post", err);
        res.render('index');
      });
  });

app.listen(3001, (req, res)=>{
    console.log("Server running at port number 3001");
})
