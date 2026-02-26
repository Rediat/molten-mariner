// api/routes.js - Server-side proxy for Google Maps Routes API
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key missing' });

    try {
        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

        // Pass through custom field mask if provided from client
        const fieldMask = req.headers['x-goog-fieldmask'] || 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps,routes.travelAdvisory,routes.routeLabels';

        // Forward the browser's Referer so Google's HTTP referrer restriction is satisfied
        const referer = req.headers.referer || req.headers.origin || '';

        const fetchHeaders = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': fieldMask
        };
        if (referer) fetchHeaders['Referer'] = referer;

        const response = await fetch(url, {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Routes API request failed', details: error.message });
    }
}
