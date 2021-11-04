const { application } = require("express")
const express = require("express")
const {v4:uuid} = require("uuid")
const App = express()
App.use(express.json())
const dbfase = []


App.post("/account",(req,res)=>{
    const {cpf,name} = req.body
    
    const costumfAlreadExist = dbfase.some((dbfase)=> dbfase.cpf === cpf)

    if(costumfAlreadExist){
        return res.status(400).json( {Error:"cpf alread exist"})
    }

  dbfase.push({
      cpf,
      name,
      id:uuid(),
      statement:[]
  })  

  return res.status(201).send()
})

App.listen("3333",()=>{
    console.log("server is running");
})

