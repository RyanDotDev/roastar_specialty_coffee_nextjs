export default async function googleMapsData(req, res) {
  res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY })
};