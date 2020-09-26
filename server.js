const express = require('express')
const app = express()
const PORT = 5000
const path = require('path')
app.use(express.json({extended: false}))

app.set("view engine", "ejs")

app.get("/", (req,res)=>{
   res.render("index")
})




app.listen(PORT,()=>{
    console.log("Server started at port: ", PORT)
})
