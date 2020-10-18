import React, { Component } from 'react';
import "./Options.css"
import "./VideoCall.css"
import "./Boxes.css"

class Boxes extends Component{

  render()
  {
    return (
    <div id="boxes">

        <div id="questionnaireBox" class="rightbox" style={{display:"none"}}>
          <div class="questionnaireTopContainer">
            <span class="questionnaireText">Questionnaire</span>
          </div>
          <div class="allMessages">
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
            <br></br>
          </div>
          <div class="bottomSubmit">
            <button class="buttonSubmit">SUBMIT</button>
          </div>
        </div>

        <div id="prescriptionBox" class="rightbox" style={{display:"none"}}>
        <div class="chat">
          <span class="chatText">Prescription</span>
        </div>
        <div class="insideRightBox">
        <textarea class="inputText" placeholder="Type your prescription here..."></textarea>
          <div class="doctorDetailsContainer">
            <div class="doctorDetails">
              <p>Mr Gonsalez</p>
              <p>MBBS</p>
              <p>25th September 2020</p>
            </div>
          </div>
        </div>
        <div class="bottomSave">
            <button class="buttonSave">SAVE</button>
        </div>
      </div>

      <div id="notesBox" class="rightbox" style={{display:"none"}}>
        <div class="chat">
          <span class="chatText">Notes</span>
        </div>
        <div class="insideNotesBox">
          <textarea class="notesInput" placeholder="Write your notes here..."></textarea>
        </div>
        <div class="bottomSave">
          <button class="buttonSave">SAVE</button>
        </div>
      </div>
    </div>
  );
  }
}

export default Boxes;
