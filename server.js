const express = require('express')
const awsHandlers = require('./controllers/awsHandlers.js')
const app = express();

app.get('/',(req,res)=>{
    res.send('API Running')
})

app.get('/doctor/meeting/Prod/join',(req,res)=>{
    console.log(req.query);
    awsHandlers.join(req.query).then(awsres=>{
        console.log(awsres);
        if(awsres.statusCode==200)
            res.status(200).send(awsres.body);
        else
            res.status(500).send('Error');
    });
})

app.get('/doctor/meeting/Prod/end',(req,res)=>{
    console.log(req.query);
    awsHandlers.end(req.query).then(awsres=>{
        console.log(awsres);
        if(awsres.statusCode==200)
            res.status(200).send(awsres.body);
        else
            res.status(500).send('Error');
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`) 
});

