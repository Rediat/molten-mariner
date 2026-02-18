// api/maps.js - Server-side only
// export default function handler(req, res) {
//     if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

//     // const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Secure, server-only access
//     const apiKey = process.env.GOOGLE_API_KEY; // Secure, server-only access
//     if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

//     // Example: Proxy Places API or init data
//     const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${encodeURIComponent('places')}`;

//     // Or fetch specific data, e.g., autocomplete:
//     // const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&key=${apiKey}`);

//     res.status(200).json({ libraries: ['places'], scriptUrl: url });
// }

// api/maps.js

// api/maps.js - Server-side proxy for secure Places Autocomplete
export default async function handler(req, res) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key missing' });

    const { input, sessiontoken } = req.query;

    // Option 1: Return Maps JS script URL for client-side autocomplete
    if (!input) {
        const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
        return res.json({
            scriptUrl,
            libraries: ['places'],
            status: 'ready'
        });
    }

    // Option 2: Server-side autocomplete predictions (extra secure)
    try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Autocomplete failed' });
    }
}

