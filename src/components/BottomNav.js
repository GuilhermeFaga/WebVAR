import { PlayIcon } from "icons"
import { ForwardIcon, PauseIcon, FastForwardIcon, BackwardIcon, FastBackwardIcon, CameraIcon, StopIcon } from "../icons"
import RoundButton from "./RoundButton"
import GlobalController from "../GlobalController"
import { useContext, useEffect, useState } from "react"
import { RecordingContext, RecordingDispatchContext } from "../contexts/RecordingContext"
import ProgressBar from "./ProgressBar"


export default function BottomNav() {
  return (
    <>
      <ProgressBar />
      <div className="fixed bottom-0 left-0 z-50 grid w-full h-16 grid-cols-1 px-8 bg-white border-t border-gray-200 md:grid-cols-3 dark:bg-gray-700 dark:border-gray-600">

        <div className="w-full items-center justify-end hidden mr-auto text-gray-500 dark:text-gray-400 md:flex">
          <RecordButton />
        </div>

        <div className="flex items-center justify-center mx-auto">
          <FastBackwardButton />
          <BackwardButton />
          <PlayPauseButton />
          <ForwardButton />
          <FastForwardButton />
        </div>

        <div className="items-center justify-center hidden ml-auto md:flex">
          {/* <button data-tooltip-target="tooltip-information" type="button" class="p-2.5 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600 dark:hover:bg-gray-600">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"></path>
          </svg>
          <span class="sr-only">Show information</span>
          </button>
          <div id="tooltip-information" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          Show information
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div> */}
        </div>

      </div>
    </>
  )
}

function PlayPauseButton() {
  const [isPlaying, setIsPlaying] = useState(false)
  const recordingState = useContext(RecordingContext);

  useEffect(() => {
    const controller = GlobalController.getInstance();
    controller.setOnEnded(() => {
      setIsPlaying(false)
    })
  }, [])


  return (
    <RoundButton disabled={recordingState !== 0} onClick={() => {
      const controller = GlobalController.getInstance();
      if (!controller.isPlaying()) {
        controller.play()
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
        controller.pause()
      }
    }}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </RoundButton>
  )
}

function ForwardButton() {
  const recordingState = useContext(RecordingContext);

  return (
    <RoundButton disabled={recordingState !== 0} onClick={() => {
      const controller = GlobalController.getInstance();
      controller.forward()
    }}>
      <ForwardIcon />
    </RoundButton>
  )
}

function FastForwardButton() {
  const recordingState = useContext(RecordingContext);

  return (
    <RoundButton disabled={recordingState !== 0} onClick={() => {
      const controller = GlobalController.getInstance();
      controller.fastForward()
    }}>
      <FastForwardIcon />
    </RoundButton>
  )
}

function BackwardButton() {
  const recordingState = useContext(RecordingContext);

  return (
    <RoundButton disabled={recordingState !== 0} onClick={() => {
      const controller = GlobalController.getInstance();
      controller.backward()
    }}>
      <BackwardIcon />
    </RoundButton>
  )
}

function FastBackwardButton() {
  const recordingState = useContext(RecordingContext);

  return (
    <RoundButton disabled={recordingState !== 0} onClick={() => {
      const controller = GlobalController.getInstance();
      controller.fastBackward()
    }}>
      <FastBackwardIcon />
    </RoundButton>
  )
}

function RecordButton() {
  const recordingState = useContext(RecordingContext);
  const recordingDispatch = useContext(RecordingDispatchContext)

  return (
    <>
      {recordingState <= 0 ?
        <RoundButton className="bg-green-600 dark:bg-green-500 hover:bg-green-800 dark:hover:bg-green-700"
          onClick={() => {
            const controller = GlobalController.getInstance();
            controller.reset()
            recordingDispatch({
              type: "setState",
              value: 1
            })
          }}>
          <CameraIcon />
        </RoundButton>
        :
        <RoundButton className="bg-red-600 dark:bg-red-500 hover:bg-red-800 dark:hover:bg-red-700"
          onClick={() => {
            recordingDispatch({
              type: "setState",
              value: 0
            })
          }}>
          <StopIcon />
        </RoundButton>
      }
    </>
  )
}