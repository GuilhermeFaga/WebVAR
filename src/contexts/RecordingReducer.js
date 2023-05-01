
export function recordingReducer(state, action) {
  if (action.type === 'setState') {
    return action.value;
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}