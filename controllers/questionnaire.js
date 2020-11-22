const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const docClient = new AWS.DynamoDB.DocumentClient();

router.post('/addQuestion',(req,res)=>{  
    console.log('Request reached server');
    var questionId=Math.random().toString(12).replace('0.','question');
    docClient.put({
        TableName: "Questionnaire",
        Item: {
            'questionId': questionId,
            'question': req.body.question,
            'options': req.body.options,
            'userGroup': req.body.userGroup
        }
    },function(err, data){
        if(err)
        {
            console.log("Error", err);
            res.status(500).send('Error while adding question');
        }        
        else{
            console.log("Success", data);
            res.status(200).send('Question Added');
        }
    });
})

module.exports=router;