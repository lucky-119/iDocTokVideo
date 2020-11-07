import React, { Component } from 'react';
import { Document, Page } from "react-pdf";
import viewIcon from '../../img/viewIcon.svg';
import shareIcon from '../../img/shareIcon.svg';
import downloadIcon from '../../img/downloadIcon.svg';
import "./CallEnded.css"

class CallEnded extends Component{

  render()
  {
    return (
    <div class="endData">
        <span class="backToDashboardEnd">Back To Dashboard</span>
        <div class="whiteEndBox" style={{left:"87px",top:"74px"}}>
          <p class="endBoxHeading">PRESCRIPTION</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={shareIcon} alt="shareicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
        <div class="orangeEndBox" style={{right:"87px",top:"74px"}}>
          <p class="endBoxHeading">APPOINTMENT AND PATIENT DETAILS</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={shareIcon} alt="shareicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
        <div class="whiteEndBox" style={{left:"50%",top:"523px",marginLeft:"-189.5px"}}>
          <p class="endBoxHeading">NOTES</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={shareIcon} alt="shareicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
        <div class="orangeEndBox" style={{left:"87px",top:"648px"}}>
          <p class="endBoxHeading">CHAT</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={shareIcon} alt="shareicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
        <div class="whiteEndBox" style={{right:"87px",top:"648px"}}>
          <p class="endBoxHeading">INVOICE</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={shareIcon} alt="shareicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
    </div>
  );
  }
}

export default CallEnded;
