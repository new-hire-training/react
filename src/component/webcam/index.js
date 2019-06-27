export default class Webcam {
  constructor(videoId, successCallback, errorCallback) {
    this.videoId = videoId;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.video = document.getElementById(this.videoId);
    this.constraints = this.getConstraint();
    this.init();
  };
  getConstraint = () => {
    return {
      audio: false,
      video: {width: {exact: 1920}, height: {exact: 1080}}
    };
  };
  init = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.gotStream).catch(this.gotError);
    }
  };
  gotStream = (stream) => {
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', this.constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.onremovetrack = this.streamOnRemoveTrack;
    this.stream = stream;
    this.video.srcObject = stream;
    this.successCallback && this.successCallback();
  };
  streamOnRemoveTrack = () => {
    console.log('Stream ended');
  };
  gotError = (error) => {
    if (error.name === 'ConstraintNotSatisfiedError') {
      console.log('The resolution ' + this.constraints.video.width.exact + 'x' +
        this.constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
      console.log('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    console.log('getUserMedia error: ' + error.name, error);
    this.errorCallback && this.errorCallback('getUserMedia error: ' + error.name, error);
  };
  release = () => {
    console.log('[webcam] release webcam!!');
    const stream = this.video.srcObject;
    if (!stream)
      return;
    const tracks = stream.getTracks();
    tracks.map(track => track.stop());
    this.stream = null;
    this.video.srcObject = null;
  };
  create = () => {
    console.log('[webcam] create webcam!!');
    this.init();
  };
}