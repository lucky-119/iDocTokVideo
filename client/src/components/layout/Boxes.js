import React, { Component } from 'react';
import "./Options.css"
import "./VideoCall.css"
import "./Boxes.css"

class Boxes extends Component{

  constructor()
  {
    super();
    this.updatePrescription = this.updatePrescription.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.submitQuestionnaire = this.submitQuestionnaire.bind(this);
  }

  updatePrescription()
  {
    var prescriptionData = document.getElementById('prescriptionInput').value;
    console.log(prescriptionData);
    fetch('/doctor/meeting/prescription',{
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({prescription: prescriptionData})
    }).then(res=>res.json()).then((result)=>{
      if(result.status===200)
        console.log("Prescription Updated");
      else
        console.log('Error while updating prescription');
    });
  }

  updateNotes()
  {
    var notesData = document.getElementById('notesInput').value;
    console.log(notesData);
    fetch('/doctor/meeting/notes',{
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({notes: notesData})
    }).then(res=>res.json()).then((result)=>{
      if(result.status===200)
        console.log("Notes Updated");
      else
        console.log('Error while updating notes');
    });
  }

  submitQuestionnaire()
  {
    var allQuestions = document.getElementById('allQuestions').childNodes;
    var noOfQuestions = allQuestions.length;
    console.log(allQuestions)
    console.log(noOfQuestions)
    var questionData={}
    for(var i=0;i<(noOfQuestions-1);i++)
      questionData[allQuestions[i].firstChild.innerText]=allQuestions[i].lastChild.value;
    if(window.location.pathname==="/doctor")
    {
      fetch('/doctor/meeting/questionnaire',{
        method: 'post', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({questionnaire: questionData})
      }).then(res=>res.json()).then((result)=>{
        if(result.status===200)
          console.log("Questionnaire Submitted");
        else
          console.log('Error while submitting questionnaire');
      });
    }
    else if(window.location.pathname==="/patient")
    {
      fetch('/patient/meeting/questionnaire',{
        method: 'post', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({questionnaire: questionData})
      }).then(res=>res.json()).then((result)=>{
        if(result.status===200)
          console.log("Questionnaire Submitted");
        else
          console.log('Error while submitting questionnaire');
      });
    }
  }


  render()
  {
    return (
    <div id="boxes">

        <div id="questionnaireBox" class="rightbox" style={{display:"none"}}>
          <div class="questionnaireTopContainer">
            <span class="questionnaireText">Questionnaire</span>
          </div>
          <div id="allQuestions" class="allMessages">
            <div class="questionContainer">
              <div class="questionText">
                <p>1) When did you last see a doctor? Was it within two weeks prior? If yes, provide details. </p>
              </div>
              <select class="questionInput">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NA">Don't Know</option>
              </select>
            </div>
            <div class="questionContainer">
              <div class="questionText">
                <p>2) Have you ever had diabetes?</p>
              </div>
              <select class="questionInput">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NA">Don't Know</option>
              </select>
            </div>
            <br></br>
          </div>
          <div class="bottomSubmit">
            <button class="buttonSubmit" onClick={this.submitQuestionnaire}>SUBMIT</button>
          </div>
        </div>

        <div id="prescriptionBox" class="rightbox" style={{display:"none"}}>
        <div class="chat">
          <span class="chatText">Prescription</span>
        </div>
        <div class="insideRightBox">
        <textarea id="prescriptionInput" class="inputText" placeholder="Type your prescription here..."></textarea>
          <div class="doctorDetailsContainer">
            <div class="doctorDetails">
              <p>Mr Gonsalez</p>
              <p>MBBS</p>
              <p>25th September 2020</p>
            </div>
          </div>
        </div>
        <div class="bottomSave">
            <button class="buttonSave" onClick={this.updatePrescription}>SAVE</button>
        </div>
      </div>

      <div id="notesBox" class="rightbox" style={{display:"none"}}>
        <div class="chat">
          <span class="chatText">Notes</span>
        </div>
        <div class="insideNotesBox">
          <textarea id="notesInput" class="notesInput" placeholder="Write your notes here..."></textarea>
        </div>
        <div class="bottomSave">
          <button class="buttonSave" onClick={this.updateNotes}>SAVE</button>
        </div>
      </div>
    </div>
  );
  }
}

export default Boxes;
