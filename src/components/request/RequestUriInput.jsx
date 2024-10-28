import Input from "../common/input"

const RequestUriInput = ({ initialValue, status, updateState }) => {
    const handleChange = (e) => {
        updateState('request', { uri: e.target.value })
    }

    return (
      <Input 
        placeholder="Enter a URI" 
        value={initialValue} 
        className="uriInput" 
        onChange={handleChange} 
        disabled={status === 'busy'} />
    )
}

export default RequestUriInput