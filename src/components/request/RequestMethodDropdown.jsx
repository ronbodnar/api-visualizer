const RequestMethodDropdown = ({ initialValue, status, updateState }) => {
    const requestMethods = [
      'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'
    ]

    const handleChange = (e) => {
        updateState('request', { method: e.target.value })
    }
  
    return (
      <select id="methodDropdown" onChange={handleChange} value={initialValue} disabled={status === 'busy'}>
        {requestMethods.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  }

  export default RequestMethodDropdown;