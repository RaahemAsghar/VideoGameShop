const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
app.use(express.json({extended: false}))

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public/index.html"))
})




app.listen(PORT,()=>{
    console.log("Server started at port: ", PORT)
})
