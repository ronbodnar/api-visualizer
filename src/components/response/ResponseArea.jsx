import { useState } from "react";

const ResponseArea = ({ response, outputFormat }) => {
    const [path, setPath] = useState([]);

    // Get the data at the current path level
    const getCurrentData = () => {
        let data = response?.data || {};
        path.forEach(segment => {
            console.log(`Navigating to key: ${segment}`);
            data = data[segment];
        });
        return data;
    };

    const currentData = getCurrentData();
    const isArray = Array.isArray(currentData) || (typeof currentData === 'object' && currentData !== null && Object.keys(currentData).every(key => !isNaN(key))); // Check if current data is an array or an indexed object

    // Collect headers based on currentData structure
    const headers = new Set();
    if (isArray) {
        Object.values(currentData).forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(key => headers.add(key));
            }
        });
    } else if (typeof currentData === 'object' && currentData !== null) {
        Object.keys(currentData).forEach(key => headers.add(key));
    }

    // Handle cell click to navigate into nested objects
    const handleCellClick = (key) => {
        const newData = currentData[key];
        console.log(`Clicked on key: ${key}, New data:`, newData);
        if (typeof newData === 'object' && newData !== null) {
            setPath([...path, key]);
        } else {
            console.log('Cannot navigate into nested object');
        }
    };

    // Handle back navigation by removing last path segment
    const handleBack = () => {
        setPath(path.slice(0, -1));
    };

    switch (outputFormat) {
        case 'Raw':
        case 'Pretty Print': {
            let value = response?.data || {};
            if (typeof value === 'object') {
                value = JSON.stringify(value, null, outputFormat === 'Pretty Print' ? "\t" : undefined);
            }

            return (
                <textarea
                    style={{
                        width: '750px',
                        height: '400px',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#f8f8f8',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                    }}
                    value={value}
                    readOnly
                />
            );
        }

        case 'Visualize': {
            if (typeof currentData !== 'object' || currentData === null) {
                return <p>Invalid response format</p>;
            }

            return (
                <>
                    {path.length > 0 && (
                        <button onClick={handleBack}>Back</button>
                    )}
                    <table border="1">
                        <thead>
                            <tr>
                                {Array.from(headers).map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isArray
                                ? Object.entries(currentData).map(([index, item]) => (
                                      <tr key={index}>
                                          {Array.from(headers).map(header => (
                                              <td key={header} onClick={() => handleCellClick(header)}>
                                                  {typeof item[header] === 'object' && item[header] !== null
                                                      ? 'Object'
                                                      : item[header] ?? 'N/A'}
                                              </td>
                                          ))}
                                      </tr>
                                  ))
                                : (
                                      <tr>
                                          {Array.from(headers).map(header => (
                                              <td key={header} onClick={() => handleCellClick(header)}>
                                                  {typeof currentData[header] === 'object' && currentData[header] !== null
                                                      ? 'Object'
                                                      : currentData[header] ?? 'N/A'}
                                              </td>
                                          ))}
                                      </tr>
                                  )}
                        </tbody>
                    </table>
                </>
            );
        }

        default:
            return null;
    }
};

export default ResponseArea;
