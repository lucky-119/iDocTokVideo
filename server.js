const express = require('express')
var bodyParser = require('body-parser')
const awsHandlers = require('./controllers/awsHandlers.js')
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const db = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('API Running')
})

app.post('/appointment/create',(req,res)=>{
    docClient.put({
        TableName: "Appointments",
        Item: {
            'appointmentId': "test2",
            'patientId': req.body.patientId,
            'doctorId': req.body.doctorId,
            'startDateTime': req.body.startDateTime,
            'endDateTime': req.body.endDateTime
        }
    },function(err, data){
        if(err)
        {
            console.log("Error", err);
            res.status(500).send('Error while creating appointment');
        }        
        else{
            console.log("Success", data);
            res.status(200).send('Appointment Created');
        }
    });
})

app.post('/appointment/cancel',(req,res)=>{
    docClient.delete({
        TableName: "Appointments",
        Key: {
            'appointmentId': req.body.appointmentId
        }
    },function(err, data){
        if(err)
        {
            console.log("Error", err);
            res.status(500).send('Error while cancelling appointment');
        }        
        else{
            console.log("Success", data);
            res.status(200).send('Appointment Cancelled');
        }
    });
})

app.post('/doctor/meeting/prescription',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set prescription = :x",
        ExpressionAttributeValues: {
            ":x": req.body.prescription
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Prescription Updated');;
        }
    });
})

app.post('/doctor/meeting/notes',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set notes = :x",
        ExpressionAttributeValues: {
            ":x": req.body.notes
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Notes Updated');;
        }
    });
})

app.post('/doctor/meeting/chat',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set chat = :x",
        ExpressionAttributeValues: {
            ":x": req.body.chat
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Chat Updated');;
        }
    });
})

app.post('/doctor/meeting/time',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set totalMeetingTime = :x",
        ExpressionAttributeValues: {
            ":x": req.body.time
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Time Updated');;
        }
    });
})

app.post('/doctor/meeting/questionnaire',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set doctorQuestionnaire = :x",
        ExpressionAttributeValues: {
            ":x": req.body.questionnaire
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Questionnaire Submitted');;
        }
    });
})

app.post('/patient/meeting/questionnaire',(req,res)=>{
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": "test2"
        },
        UpdateExpression: "set patientQuestionnaire = :x",
        ExpressionAttributeValues: {
            ":x": req.body.questionnaire
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Questionnaire Submitted');;
        }
    });
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
