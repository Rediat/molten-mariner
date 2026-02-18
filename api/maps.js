// api/maps.js - Server-side only
export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Secure, server-only access
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    // Example: Proxy Places API or init data
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${encodeURIComponent('places')}`;

    // Or fetch specific data, e.g., autocomplete:
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&key=${apiKey}`);

    res.status(200).json({ libraries: ['places'], scriptUrl: url });
}
