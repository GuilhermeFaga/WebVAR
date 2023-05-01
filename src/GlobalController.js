
const SKIP_TIME = 2
const FAST_SKIP_TIME = 10

export default class GlobalController {
  static #instance = null;
  static ref = null;
  static onEnded = null
  static onProgress = null

  constructor() {
    this.ref = {};
    this.onEnded = () => { };
    this.onProgress = () => { };
  }

  static getInstance(ref, id) {
    if (GlobalController.#instance == null) {
      GlobalController.#instance = new GlobalController();
    }
    return GlobalController.#instance;
  }

  setOnEnded(onEnded) {
    this.onEnded = onEnded;
  }

  setOnProgress(onProgress) {
    this.onProgress = onProgress;
  }

  setRef(ref, id) {
    this.ref[id] = ref;
  }

  getRef() {
    console.log(this.ref)
  }

  reset() {
    this.onProgress(0);
    this.onEnded();
  }

  isPlaying() {
    for (const player of Object.values(this.ref)) {
      if (player.getInternalPlayer().paused) {
        return false;
      }
    }
    return true;
  }

  play() {
    for (const player of Object.values(this.ref)) {
      player.getInternalPlayer().play();
    }
  }

  pause() {
    for (const player of Object.values(this.ref)) {
      player.getInternalPlayer().pause();
    }
  }

  forward() {
    for (const player of Object.values(this.ref)) {
      let currentTime = player.getCurrentTime();
      if (currentTime === Infinity)
        currentTime = 0;
      player.seekTo(player.getCurrentTime() + SKIP_TIME);
    }
  }

  backward() {
    for (const player of Object.values(this.ref)) {
      let currentTime = player.getCurrentTime();
      if (currentTime === Infinity)
        currentTime = 0;
      player.seekTo(player.getCurrentTime() - SKIP_TIME);
    }
  }

  fastForward() {
    for (const player of Object.values(this.ref)) {
      let currentTime = player.getCurrentTime();
      if (currentTime === Infinity)
        currentTime = 0;
      player.seekTo(player.getCurrentTime() + FAST_SKIP_TIME);
    }
  }

  fastBackward() {
    for (const player of Object.values(this.ref)) {
      let currentTime = player.getCurrentTime();
      if (currentTime === Infinity)
        currentTime = 0;
      player.seekTo(player.getCurrentTime() - FAST_SKIP_TIME);
    }
  }

}