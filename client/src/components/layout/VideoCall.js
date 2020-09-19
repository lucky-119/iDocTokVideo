import React, {Component} from 'react';
import './VideoCall.css';
import ringingLogo from '../../img/ringingImage.png';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';

class VideoCall extends Component{

  constructor()
  {
    super()
    this.joinMeeting = this.joinMeeting.bind(this);
    this.createMeetingSession = this.createMeetingSession.bind(this);
    this.addAudioVideoChangeObserver = this.addAudioVideoChangeObserver.bind(this);
    this.addAudioStartObserver = this.addAudioStartObserver.bind(this);
    this.addVideoStartObserver = this.addVideoStartObserver.bind(this);
    this.endMeeting = this.endMeeting.bind(this);
    this.muteCall = this.muteCall.bind(this);
    this.selectAudioDevices = this.selectAudioDevices.bind(this);
    this.audioRef = React.createRef();
    this.meetingSession="";
  }

  componentWillMount(){
    console.log('HHH')
  }

  joinMeeting()
  {
    if(window.location.pathname==="/doctor")
    fetch('/doctor/meeting/Prod/join?title="test2"&name="lakshay"&region="us-east-1"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("Join done");
      this.createMeetingSession(result);
    });
    else if(window.location.pathname==="/patient")
    fetch('/doctor/meeting/Prod/join?title="test2"&name="lakshay2"&region="us-east-1"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("Join done");
      this.createMeetingSession(result);
    });
  }
  
  async createMeetingSession(result)
  {
    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    
    // You need responses from server-side Chime API. See below for details.
    const meetingResponse = result.JoinInfo.Meeting;
    const attendeeResponse = result.JoinInfo.Attendee;
    const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
  
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );

    this.selectAudioDevices();
    this.addAudioVideoChangeObserver();
    this.addAudioStartObserver();
    this.addVideoStartObserver();
    this.startVideo();
  }

  async selectAudioDevices()
  {
    const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();

    console.log(audioInputDevices[0]);
    console.log(audioOutputDevices[0]);
    await this.meetingSession.audioVideo.chooseAudioInputDevice(audioInputDevices[0].deviceId);
    await this.meetingSession.audioVideo.chooseAudioOutputDevice(audioOutputDevices[0].deviceId);
    console.log('DDone');
  }

  addAudioVideoChangeObserver()
  {
    const audioVideoChangeObserver = {
      audioInputsChanged: freshAudioInputDeviceList => {
        this.meetingSession.audioVideo.chooseAudioInputDevice(freshAudioInputDeviceList[0].deviceId);
        console.log('Audio inputs updated: ', freshAudioInputDeviceList[0]);
      },
      audioOutputsChanged: freshAudioOutputDeviceList => {
        this.meetingSession.audioVideo.chooseAudioOutputDevice(freshAudioOutputDeviceList[0].deviceId);
        console.log('Audio outputs updated: ', freshAudioOutputDeviceList[0]);
      },
      videoInputsChanged: freshVideoInputDeviceList => {
        this.meetingSession.audioVideo.chooseVideoInputDevice(freshVideoInputDeviceList[0].deviceId);
        console.log('Video inputs updated: ', freshVideoInputDeviceList[0]);
      }
    };
    this.meetingSession.audioVideo.addDeviceChangeObserver(audioVideoChangeObserver);
  }

  addAudioStartObserver()
  {
    const audioElement = document.getElementById('audioElement');
    console.log(audioElement);
    this.meetingSession.audioVideo.bindAudioElement(audioElement);

    const addAudioStartObserver = {
      audioVideoDidStart: () => {
        console.log('Audio Started');
      }
    };

    this.meetingSession.audioVideo.addObserver(addAudioStartObserver);

    this.meetingSession.audioVideo.start();
  }

  addVideoStartObserver()
  {
    const addVideoStartObserver = {
      audioVideoDidStart: () => {
        console.log('Video Started');
      },
      audioVideoDidStop: sessionStatus => {
        // See the "Stopping a session" section for details.
        console.log('Stopped with a session status code: ', sessionStatus.statusCode());
      },
      audioVideoDidStartConnecting: reconnecting => {
        if (reconnecting) {
          // e.g. the WiFi connection is dropped.
          console.log('Attempting to reconnect');
        }
      }
    };
    
    this.meetingSession.audioVideo.addObserver(addVideoStartObserver);
  }

  endMeeting()
  {
    fetch('/doctor/meeting/Prod/end?title="test2"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("End done");
    })
  }

  muteCall()
  {
    const muted = this.meetingSession.audioVideo.realtimeIsLocalAudioMuted();
    if (muted) {
      const unmuted = this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      if (unmuted) {
        console.log('Unmuted');
      } else {
        console.log('You cannot unmute yourself');
      }
    } else {
      this.meetingSession.audioVideo.realtimeMuteLocalAudio();
      console.log('Muted');
    }
  }

  async startVideo()
  {
    const videoElement = document.getElementById('ownVideo');

    // Make sure you have chosen your camera. In this use case, you will choose the first device.
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();

    // The camera LED light will turn on indicating that it is now capturing.
    // See the "Device" section for details.
    await this.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

    this.meetingSession.audioVideo.startLocalVideoTile();
  }
  
  async seeVideo()
  {
    const videoElement = document.getElementById('viewVideo');

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID, a local tile (your video), and a content share.
        if (!tileState.boundAttendeeId || tileState.localTile || tileState.isContent) {
          return;
        }

        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);
  }

  render(){
    return (
      <div>
        <video id="viewVideo" class="viewVideo"></video>
        <video id="ownVideo" class="ownVideo"></video>
        <div class="ringing">
          <div style={{textAlign:"center"}}>
            <img class="ringingIcon" alt="ringingicon" src={ringingLogo} onClick={this.joinMeeting}></img>
          </div>
          <p class="ringingText">Ringing...</p>
        </div>
        <audio id="audioElement" style={{display:"none"}} ref={this.audioRef}></audio>
        <div>
          <button class="muteCallIcon" onClick={this.muteCall}>mute</button>
          <button class="endMeetingIcon" onClick={this.endMeeting}>end</button>
        </div>
      </div>
    );
  }
}

export default VideoCall;
