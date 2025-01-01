import { isSafari } from "react-device-detect";

interface AudioRecorder {
  audioBlobs: Blob[];
  mediaRecorder: MediaRecorder | null;
  streamBeingCaptured: MediaStream | null;
  start(): Promise<void>;
  stop(): Promise<Blob>;
  cancel(): void;
  stopStream(): void;
  resetRecordingProperties(): void;
}

export const audioRecorder: AudioRecorder = {
  audioBlobs: [],
  mediaRecorder: null,
  streamBeingCaptured: null,

  start() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error(
          "mediaDevices API or getUserMedia method is not supported in this browser."
        )
      );
    }

    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.streamBeingCaptured = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioBlobs = [];

        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          this.audioBlobs.push(event.data);
        });

        if (isSafari) {
          this.mediaRecorder.start(1000);
        } else {
          this.mediaRecorder.start();
        }
      });
  },

  stop() {
    return new Promise<Blob>((resolve) => {
      if (!this.mediaRecorder) return;

      const mimeType = this.mediaRecorder.mimeType;

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioBlobs, { type: mimeType });
        resolve(audioBlob);
      });

      this.cancel();
    });
  },

  cancel() {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.stopStream();
    this.resetRecordingProperties();
  },

  stopStream() {
    if (!this.streamBeingCaptured) return;
    this.streamBeingCaptured.getTracks().forEach((track) => track.stop());
  },

  resetRecordingProperties() {
    this.mediaRecorder = null;
    this.streamBeingCaptured = null;
  },
};
