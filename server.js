const express = require('express')
const app = express()
const PORT = 5000
const path = require('path')
app.use(express.json({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs")

app.get("/", (req,res)=>{
   res.render("index")
})

app.get("/table", (req,res)=>{
    res.render("table")
 })
 
 app.get("/login", (req,res)=>{
    res.render("login")
 })
 app.get("/register", (req,res)=>{
    res.render("register")
 })
 app.get("/profile", (req,res)=>{
    res.render("profile")
 })

 app.get('*', (req,res)=>{
     res.render("404")
 })
 
 
 
 
 
  


app.listen(PORT,()=>{
    console.log("Server started at port: ", PORT)
})
