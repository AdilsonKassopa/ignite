
const { application } = require("express")
const express = require("express")
const {v4:uuid} = require("uuid")
const App = express()
App.use(express.json())
const customers = []

function verifyExistAccountCPF(req,res,next){
    const {cpf} = req.headers

    const customer = customers.find((customer)=> customer.cpf === cpf)
    if(!customer){
        return res.status(400).json({Error:"customer not exist"})
    }

    req.customer=customer

    return next()
}

function getBalance(statement){
    const balance = statement.reduce((acc,operation)=>{
        if(operation.type === "credit"){
            return acc + operation.amount
        }else{
            return acc - operation.amount
        }
    },0)

    return balance
}


App.post("/account",(req,res)=>{
    const {cpf,name} = req.body
    
    const costumfAlreadExist = customers.some((customers)=> customers.cpf === cpf)

    if(costumfAlreadExist){
        return res.status(400).json( {Error:"cpf alread exist"})
    }

    customers.push({
      cpf,
      name,
      id:uuid(),
      statement:[]
  })  

  return res.status(201).send()
})

App.get("/statement",verifyExistAccountCPF,(req,res)=>{
   const {customer} = req

    return res.json(customer.statement)
    
})

App.post("/deposit",verifyExistAccountCPF,(req,res)=>{
    const {description,amount} = req.body

    const {customer } =req

    const statementOperation = {
        description,
        amount,
        created: new Date,
        type:"credit"
    }

    customer.statement.push(statementOperation)
    return res.status(201).send()
})

App.post("/withdraw",verifyExistAccountCPF,(req,res)=>{
    const {amount} = req.body

    const {customer} = req

    const balance = getBalance(customer.statement)
    if(balance < amount){
        return res.status(400).json({Error:"insufienti funds"})
    }

    const statementOperation = {
        amount,
        created: new Date,
        type:"debit"
    }

    customer.statement.push(statementOperation)
    return res.status(201).send()
})

App.listen("3333",()=>{
    console.log("server is running");
})

