const express = require('express')
const app = express()
const PORT = 5000
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const { runInNewContext } = require('vm')

app.use(express.json({extended: true}))
app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret:'hello',
   saveUninitialized:false,
   resave:true
}))

app.use(flash())

app.set("view engine", "ejs")

app.get("/", (req,res)=>{
   res.render("index")
})

app.get("/table", (req,res)=>{
    res.render("table")
 })
 
 app.get("/login", (req,res)=>{

   res.render("login",{msg:req.flash('error')})
 })

 app.post('/login', (req,res)=>{
   const {username, password} = req.body
   req.flash('error','Credentials are incorrect.')

   res.redirect('/login')


 })

 app.get("/register", (req,res)=>{
    res.render("register")
 })
 app.get("/profile", (req,res)=>{
    res.render("profile")
 })

 app.get('/test', (req, res)=>{
    req.flash('info', "Welcome")
    res.send(res.locals.flash)
 })

 app.get('*', (req,res)=>{
     res.render("404")
 })
 
 
 
 
 
  


app.listen(PORT,()=>{
    console.log("Server started at port: ", PORT)
})
