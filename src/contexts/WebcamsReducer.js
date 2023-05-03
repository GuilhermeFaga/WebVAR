
/*
webcam object:
{
  id: string,
  deviceId: string,
}
*/


export function webcamsReducer(state, action) {
  if (action.type === 'addWebcam') {
    return [...state, action.value];
  } else if (action.type === 'editWebcam') {
    let webcamIndex = state.findIndex((webcam) => webcam.id === action.value.id);
    const newState = [...state];
    newState[webcamIndex] = action.value;
    return newState;
  } else if (action.type === 'removeWebcam') {
    return state.filter((webcam) => webcam.id !== action.value);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}