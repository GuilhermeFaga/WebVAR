import { createContext } from 'react';


export const RecordingContext = createContext(-1);
export const RecordingDispatchContext = createContext(null);

// Sem dados = -1
// Parado = 0
// Gravando = 1