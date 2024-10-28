const SendRequestButton = ({ state: { status, request }, updateState }) => {
    const handleClick = () => {
        updateState('status', 'busy')
    }

    const disabled = status === 'busy' || request.uri === ''
  
    return (
      <button id="sendRequestButton" onClick={handleClick} disabled={disabled}>Send</button>
    )
}

export default SendRequestButton