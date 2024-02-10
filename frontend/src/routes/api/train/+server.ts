import type { RequestHandler } from './$types';

export const POST: RequestHandler = (async ({request}) => {
    const inputs = await request.json();

    const response = await fetch('http://127.0.0.1:8000/train/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify( inputs ),
    });

    if (!response.ok) {
        throw new Error(`Error: ${await response.text()}`)
    }

    const responseJSON = await response.json();
    
    const body = JSON.stringify(responseJSON);
    const headers = {
        'Content-Type': 'application/json',
    };
    return new Response(body, { headers });
    
}) satisfies RequestHandler;
