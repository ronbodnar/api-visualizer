import { useEffect, useState } from 'react';
import './App.css'
import Input from './components/input'

const initialState = {
  status: 'idle',
  request: {
    method: 'GET',
    uri: ''
  }
}

const App = () => {
  const [state, setState] = useState(initialState)
  const [response, setResponse] = useState('')
  return (
    <>
    <RequestMethodDropdown state={state} setState={setState} />
    <RequestUriInput state={state} setState={setState} />
    <SendRequestButton state={state} setState={setState} setResponse={setResponse} />
    <br />
    <br />
    <ServerResponseTextarea response={response} />
    </>
  )
}

const RequestMethodDropdown = ({ state, setState }) => {
  const handleChange = (e) => {
    setState({
      ...state,
      request: {
        ...state.request,
        method: e.target.value
      }
    })
  }

  const requestMethods = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'
  ]

  return (
    <select id="methodDropdown" onChange={handleChange}>
      {requestMethods.map((o, i) => 
        <option key={i} value={o}>{o}</option>
      )}
    </select>
  )
}

const RequestUriInput = ({ state, setState }) => {
  const handleChange = (e) => {
    setState({
      ...state,
      request: {
       ...state.request,
        uri: e.target.value
      }
    })
  };

  return (
    <Input placeholder="Enter a URI" className="uriInput" onChange={handleChange} />
  )
}

const SendRequestButton = ({ state, setState, setResponse }) => {
  const handleClick = (e) => {
    console.log(state);
    setState({
      ...state,
      status: 'busy',
      request: {
       ...state.request
      }
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      if (state.status === 'busy' && state.request.uri && state.request.method) {
        const uri = state.request.uri;
        const method = state.request.method;
        const headers = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip,deflate,br',
          'Connection': 'keep-alive',
          'Authorization': 'Bearer ' + process.env.BEARER_TOKEN,
        };
  
        try {
          const response = await fetch(uri, {
            method: method,
            headers: headers,
          });

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
  
          const data = await response.json();
          setResponse(JSON.stringify(data)); // Stringify for display in the textarea
        } catch (error) {
          console.error('Fetch error:', error);
          setResponse('Error fetching data: ' + error.message);
        } finally {
          setState({
            ...state,
            status: 'idle',
            request: {
              ...state.request
            }
          });
        }
      }
    };
  
    fetchData();
  }, [state, setState, setResponse]);

  return (
    <button id="sendRequestButton" onClick={handleClick}>Send</button>
  )
}

const ServerResponseTextarea = ({ response }) => {
  return (
    <textarea id="serverResponseTextarea" cols="50" rows="10" value={response} readOnly />
  )
}

export default App
