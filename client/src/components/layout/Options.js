import React, { Component } from 'react';
import downIcon from '../../img/downIcon.svg';
import "./Options.css"

class NavBar extends Component{
  render()
  {
    return (
    <div>
        <div class="leftMenu">
          <div class="orangeMenuSmall">
              <div class="centerHeading">
                <p class="menuHeading">Back to Dashboard</p>
              </div>
          </div>
          <div class="whiteMenu">
            <div class="centerHeading">
              <p class="menuHeading">Appointment Details</p>
            </div>
            <img src={downIcon} alt="downIcon" class="downLeftIcon"></img>
          </div> 
          <div class="whiteMenuOpen">
            <div class="centerHeading">
              <p class="menuHeading">Appointment Details</p>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <img src={downIcon} alt="downIcon" class="downLeftIcon" style={{transform: "rotate(180deg)"}}></img>
            <div class="openDetailsContainer">
              <div class="detailTopic">
                <p class="detailHeading">Doctor's Name</p>
                <p class="detailValue">Dr Gonsalez</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Patient's Name</p>
                <p class="detailValue">Mr Lakshay Arora</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Date</p>
                <p class="detailValue">25th September 2020</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Timings</p>
                <p class="detailValue">3:30pm to 5:30pm</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rightMenu">
          <div class="orangeMenu">
            <div class="centerHeading">
              <p class="menuHeading">Patient Details</p>
              <p class="menuOptional">(2-3 Minutes)</p>
            </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
          <div class="whiteMenu">
              <div class="centerHeading">
                <p class="menuHeading">Prescription</p>
              </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
          <div class="whiteMenu">
              <div class="centerHeading">
                <p class="menuHeading">Notes</p>
              </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
        </div>
    </div>
  );
  }
}

export default NavBar;
