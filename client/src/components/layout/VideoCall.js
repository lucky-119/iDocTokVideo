import React, {Component} from 'react';
import './VideoCall.css';
import ringingLogo from '../../img/ringingImage.png';
import audioCallLogo from '../../img/audioCall.png';
import audioOnLogo from '../../img/audioon.svg';
import audioOffLogo from '../../img/audiooff.svg';
import videoCallOffLogo from '../../img/videooff.svg';
import videoCallOnLogo from '../../img/videoon.svg';
import endMeetingLogo from '../../img/exit.svg';
import shareScreenOffLogo from '../../img/sharescreenoff.svg';
import shareScreenOnLogo from '../../img/sharescreenon.svg';
import messageLogo from '../../img/message.svg';
import messageUnreadLogo from '../../img/messageunread.svg';
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
    this.selectVideoDevice = this.selectVideoDevice.bind(this);
    this.startVideo = this.startVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.seeVideo = this.seeVideo.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.removeRinging = this.removeRinging.bind(this);
    this.showAudioCall = this.showAudioCall.bind(this);
    this.removeAudioCall = this.removeAudioCall.bind(this);
    this.audioRef = React.createRef();
    this.meetingSession="";
    this.videoOn=false;
    this.attendee=""
  }

  //Run when component opens up/is mounted
  componentWillMount(){
    console.log('HHH')
    if(window.location.pathname==="/doctor")
      this.attendee="patient";
    else if(window.location.pathname==="/patient")
      this.attendee="doctor"
  }

  //Send API calls to create/join meeting
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
  
  //Create Meeting Session from meeting and attendee info received from API
  async createMeetingSession(result)
  {
    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    
    const meetingResponse = result.JoinInfo.Meeting;
    const attendeeResponse = result.JoinInfo.Attendee;
    const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
  
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController 
    );

    this.addAudioVideoChangeObserver();
    this.addAudioStartObserver();
    this.addVideoStartObserver();
    this.startVideo();
  }

  //Select Local Audio Devices
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

  //Observer to change audio/video when input changes
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

  //Observer when audio starts
  addAudioStartObserver()
  {
    const audioElement = document.getElementById('audioElement');
    console.log(audioElement);
    this.meetingSession.audioVideo.bindAudioElement(audioElement);

    const addAudioStartObserver = {
      audioVideoDidStart: () => {
        console.log('Audio Started');
        this.selectAudioDevices();
      }
    };

    this.meetingSession.audioVideo.addObserver(addAudioStartObserver);

    this.meetingSession.audioVideo.start();
  }

  removeRinging()
  {
    document.getElementById("ringing").style.display = "none";
  }

  showAudioCall()
  {
    document.getElementById("audiocall").style.display = "block";
  }

  removeAudioCall()
  {
    document.getElementById("audiocall").style.display = "none";
  }

  //Observer when video starts
  addVideoStartObserver()
  {
    const addVideoStartObserver = {
      videoDidStart: () => {
        console.log('Video Started');
        this.selectVideoDevice();
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

    this.seeVideo();
  }

  //Stops Video and calls API to end meeting
  endMeeting()
  {
    this.stopVideo();
    fetch('/doctor/meeting/Prod/end?title="test2"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("End done");
    })
  }

  //Mute/unmute call
  async muteCall()
  {
    const muted = await this.meetingSession.audioVideo.realtimeIsLocalAudioMuted();
    if (muted) {
      document.getElementById('audioOff').style.display="none";
      document.getElementById('audioOn').style.display="block";
      const unmuted = await this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      if (unmuted) {
        console.log('Unmuted');
      } else {
        console.log('You cannot unmute yourself');
      }
    } else {
      document.getElementById('audioOff').style.display="block";
      document.getElementById('audioOn').style.display="none";
      await this.meetingSession.audioVideo.realtimeMuteLocalAudio();
      console.log('Muted');
    }
  }

  //Select Video Device
  async selectVideoDevice()
  {
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
    await this.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
  }

  //Start Sharing video 
  async startVideo()
  {
    const videoElement = document.getElementById('ownVideo');

    this.selectVideoDevice();

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }
        this.selectVideoDevice();

        console.log('titlestate');
        console.log(tileState.active);
        this.videoOn=tileState.active;
        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

    this.meetingSession.audioVideo.startLocalVideoTile();
  }

  //Stop Sharing Video
  async stopVideo()
  {
    const videoElement = document.getElementById('ownVideo');

    let localTileId = null;
    const observer = {
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        console.log('titlestate');
        console.log(tileState.active);
        this.videoOn=tileState.active;
        // videoTileDidUpdate is also invoked when you call startLocalVideoTile or tileState changes.
        console.log(`If you called stopLocalVideoTile, ${tileState.active} is false.`);
        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        localTileId = tileState.tileId;
      },
      videoTileWasRemoved: tileId => {
        if (localTileId === tileId) {
          console.log(`You called removeLocalVideoTile. videoElement can be bound to another tile.`);
          localTileId = null;
        }
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

    this.meetingSession.audioVideo.stopLocalVideoTile();
    console.log('video stopped');
  }

  //See other attendees video
  async seeVideo()
  {
    const videoElements = [document.getElementById('viewVideo')];

    // index-tileId pairs
    const indexMap = {};

    const acquireVideoElement = tileId => {
      // Return the same video element if already bound.
      for (let i = 0; i < 16; i += 1) {
        if (indexMap[i] === tileId) {
          return videoElements[i];
        }
      }
      // Return the next available video element.
      for (let i = 0; i < 16; i += 1) {
        if (!indexMap.hasOwnProperty(i)) {
          indexMap[i] = tileId;
          return videoElements[i];
        }
      }
      throw new Error('no video element is available');
    };

    const releaseVideoElement = tileId => {
      for (let i = 0; i < 16; i += 1) {
        if (indexMap[i] === tileId) {
          delete indexMap[i];
          return;
        }
      }
    };

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID, a local tile (your video), and a content share.
        if (!tileState.boundAttendeeId || tileState.localTile || tileState.isContent) {
          return;
        }
        this.removeRinging();
        this.removeAudioCall();
        this.meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          acquireVideoElement(tileState.tileId)
        );

      },
      videoTileWasRemoved: tileId => {
        releaseVideoElement(tileId);
        this.showAudioCall();
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);
  }

  toggleVideo()
  {
    if(this.videoOn===true)
    {
      document.getElementById('videoOff').style.display="block";
      document.getElementById('videoOn').style.display="none";
      this.stopVideo();
    }
    else if(this.videoOn===false)
    {
      document.getElementById('videoOff').style.display="none";
      document.getElementById('videoOn').style.display="block";
      this.startVideo();
    }
  }

  render(){
    return (
      <div class="videoCallBack">
        <video id="viewVideo" class="viewVideo"></video>
        <video id="ownVideo" class="ownVideo"></video>
        <div id="ringing" class="middlepopup">
          <p class="popupText">Connecting to your {this.attendee} in just a few moments</p>
          <div style={{textAlign:"center"}}>
            <img class="popupImageIcon" alt="ringingIcon" src={ringingLogo} onClick={this.joinMeeting}></img>
          </div>
          <p class="ringingText">Ringing...</p>
        </div>
        <div id="audiocall" class="middlepopup" style={{top:"50%", display:"none"}}>
          <div style={{textAlign:"center"}}>
            <img class="popupImageIcon" alt="audioCallIcon" src={audioCallLogo}></img>
          </div>
          <p class="popupText">Audio Call In Progress</p>
        </div>
        <audio id="audioElement" style={{display:"none"}} ref={this.audioRef}></audio>
        <div class="videoOptions">
          <img id="audioOn" style={{left:"25px"}} alt="muteCallIcon" src={audioOnLogo} onClick={this.muteCall}></img>
          <img id="audioOff" style={{left:"25px", display:"none"}} alt="muteCallIcon" src={audioOffLogo} onClick={this.muteCall}></img>
          <img id="videoOff" style={{left:"90px", display:"none"}} alt="videoIcon" src={videoCallOffLogo} onClick={this.toggleVideo}></img>
          <img id="videoOn" style={{left:"90px"}} alt="videoIcon" src={videoCallOnLogo} onClick={this.toggleVideo}></img>
          <img id="screenshareoff" style={{left:"155px"}} alt="videoIcon" src={shareScreenOffLogo}></img>
          <img id="screenshareon" style={{left:"155px", display:"none"}} alt="videoIcon" src={shareScreenOnLogo}></img>
          <img id="messageLogo" style={{left:"220px"}} alt="messageIcon" src={messageLogo}></img>
          <img id="messageUnreadLogo" style={{left:"220px", display:"none"}} alt="messageIcon" src={messageUnreadLogo}></img>
          <img id="exit" style={{right:"25px"}} alt="endMeetingIcon" src={endMeetingLogo} onClick={this.endMeeting}></img>
        </div>
      </div>
    );
  }
}

export default VideoCall;
