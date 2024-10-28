import { useEffect } from 'react';

const useFetch = (state, updateState) => {
    const { status, request } = state;

    const fetchData = async () => {
        if (!request || !request.uri) {
            console.log('Invalid request');
            return;
        }

        const { method, body } = request;
        const init = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Authorization': 'Bearer ' + import.meta.env.VITE_BEARER_TOKEN,
            },
        };

        if (body && Object.keys(body).length > 0 && method !== 'GET' && method !== 'HEAD') {
            init.body = JSON.stringify(body);
        }

        // Fetching doesn't support localhost URL scheme
        let uri = request.uri
        if (uri.startsWith('localhost')) {
            uri = `http://${uri}`
            updateState('request', { uri: uri })
        }

        try {
            const response = await fetch(uri, init);
            const contentType = response.headers.get('Content-Type');

            let data;
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else if (contentType.includes('text/plain') || contentType.includes('text/html')) {
                data = await response.text();
            } else {
                throw new Error(`Unsupported Content-Type: ${contentType}`);
            }

            updateState('response', {
                status: response.status,
                data: data
            });
        } catch (error) {
            updateState('response', {
                data: `Error: ${error.message}`
            });
        }
        updateState('status', 'idle');
    };

    useEffect(() => {
        if (status === 'busy') {
            fetchData();
        }
    }, [status, request]);
};

export default useFetch;