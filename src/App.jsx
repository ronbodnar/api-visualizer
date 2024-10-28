import { useState } from 'react';
import './App.css'
import RequestMethodDropdown from './components/request/RequestMethodDropdown'
import RequestUriInput from './components/request/RequestUriInput';
import SendRequestButton from './components/request/SendRequestButton'
import ResponseArea from './components/response/ResponseArea'
import useFetch from './hooks/useFetch'
import OutputFormatButton from './components/response/OutputFormatButton';

const initialState = {
  status: 'idle',
  request: {
    method: 'GET',
    uri: 'https://dummyjson.com/products',
    body: {}
  },
  response: {}
}

const App = () => {
  const [state, setState] = useState(initialState)
  const [outputFormat, setOutputFormat] = useState('Raw')

  const updateState = (key, value) => {
    if (typeof value === 'string') {
      setState((prev) => ({ ...prev, [key]: value }))
    } else if (typeof value === 'object') {
      const updatedVal = Object.assign({ ...state[key] }, value)
      setState((prev) => ({ ...prev, [key]: updatedVal}))
    } else {
      console.log('Unsupported value type for key "' + key + '": ' + typeof value)
    }
  }

  useFetch(state, updateState);

  const { status, request, response } = state

  const formatOptions = [
    "Raw", "Pretty Print", "Visualize"
  ]

  return (
    <>
      <div className="wrapper">
        <h1>API Visualizer</h1>
        <div className="request-input">
          <RequestMethodDropdown initialValue={request.method} status={status} updateState={updateState} />
          <RequestUriInput initialValue={request.uri} status={status} updateState={updateState} />
          <SendRequestButton state={state} updateState={updateState} />
        </div>

        <ResponseArea response={response} outputFormat={outputFormat} />

        <div style={{
          display: 'flex'
        }}>
          {formatOptions.map(format => (
            <OutputFormatButton 
              key={format} 
              className="" 
              text={format} 
              onClick={(e) => setOutputFormat(e.target.textContent)} />
          ))}
        </div>

        <div className="state-output">
          {Object.entries(state).map(([k, v]) => {
            return (
              <div key={k}>
                <strong>{k}:</strong> {typeof v === 'object'? JSON.stringify(v) : v}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}



export default App
