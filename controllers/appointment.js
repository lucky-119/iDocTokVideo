const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const docClient = new AWS.DynamoDB.DocumentClient();

router.post('/create',(req,res)=>{
    console.log('Request reached server');
    var appointmentId=Math.random().toString(12).replace('0.','ap');
    docClient.put({
        TableName: "Appointments",
        Item: {
            'appointmentId': appointmentId,
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

router.post('/cancel',(req,res)=>{
    console.log('Request reached server');
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

module.exports=router