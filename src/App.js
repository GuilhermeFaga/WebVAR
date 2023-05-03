import './App.css';
import Webcam from "react-webcam";
import ReactPlayer from 'react-player'
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import BottomNav from 'components/BottomNav';
import Card from 'components/Card';
import GlobalController from './GlobalController';
import { RecordingContext, RecordingDispatchContext } from 'contexts/RecordingContext';
import { recordingReducer } from 'contexts/RecordingReducer';
import { WebcamsContext, WebcamsDispatchContext } from 'contexts/WebcamsContext';
import { webcamsReducer } from 'contexts/WebcamsReducer';
import RoundButton from 'components/RoundButton';
import { CloseIcon } from 'icons';


export default function App() {
  const [recordingState, recordingDispatch] = useReducer(recordingReducer, -1);
  const [webcamsState, webcamsDispatch] = useReducer(webcamsReducer, []);

  const webcams = webcamsState.map((webcam) => <VideoComponent key={webcam.id} id={webcam.id} />)
  var cl = webcams.length;

  return (
    <WebcamsContext.Provider value={webcamsState}>
      <WebcamsDispatchContext.Provider value={webcamsDispatch}>
        <RecordingContext.Provider value={recordingState}>
          <RecordingDispatchContext.Provider value={recordingDispatch}>
            <div className={`video-grid bg-white dark:bg-gray-900 grid grid-flow-row grid-cols-1 md:grid-cols-${cl === 1 ? "1" : "2"} auto-rows-auto gap-2 p-2 h-full`}>
              {webcams}
            </div>
            <BottomNav />
          </RecordingDispatchContext.Provider>
        </RecordingContext.Provider>
      </WebcamsDispatchContext.Provider>
    </WebcamsContext.Provider>
  );
}


function useHookWithRefCallback(callback) {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
      callback(node)
    }

    // Save a reference to the node
    ref.current = node
  }, [callback])

  return [setRef]
}


function VideoComponent({ id }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [playerComponent, setPlayerComponent] = useState(null);

  const recordingState = useContext(RecordingContext);
  const webcamsState = useContext(WebcamsContext);
  const webcamsDispatch = useContext(WebcamsDispatchContext);

  const [playerRef] = useHookWithRefCallback((node) => {
    const controller = GlobalController.getInstance();
    controller.setRef(node, id);
  })

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  useEffect(() => {
    if (recordingState === 1) {
      handleStartCaptureClick();
    } else if (recordingState === 0 && capturing) {
      handleStopCaptureClick();
    }
  }, [recordingState, capturing, handleStartCaptureClick, handleStopCaptureClick])


  useEffect(() => {
    setPlayerComponent(
      <ReactPlayer
        className='react-player absolute h-inherit w-inherit top-0 left-0'
        ref={playerRef}
        height={webcamRef.current?.video.clientHeight}
        width={webcamRef.current?.video.clientWidth}
        url={URL.createObjectURL(new Blob(recordedChunks))}
        onEnded={() => {
          const controller = GlobalController.getInstance();
          controller.onEnded()
        }}
        onProgress={(progress) => {
          const controller = GlobalController.getInstance();
          controller.onProgress(progress.played)
        }}
        progressInterval={10} />
    )
  }, [webcamRef, recordedChunks, webcamsState, playerRef])


  return (
    <div className='w-full max-h-fit flex items-center col-span-1 overflow-hidden'>
      <div className='flex items-center w-full max-h-fit h-full'>
        <Card>

          <Webcam
            className='w-full aspect-video object-cover'
            videoConstraints={{ deviceId: id }}
            ref={webcamRef}
            audio={false} />

          {recordedChunks.length > 0 && playerComponent}
          {!capturing && (
            <RoundButton className="absolute hidden group-hover:block top-0 right-0 mt-1 mr-1 bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 text-black"
              onClick={() => {
                webcamsDispatch({ type: 'removeWebcam', value: id })
              }}>
              <CloseIcon />
            </RoundButton>
          )}
        </Card>
      </div>
    </div>
  );

}