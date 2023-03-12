import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { steamId, currency } = params;

	const response = await fetch(
		`https://store.steampowered.com/api/appdetails/?appids=${steamId}&cc=${currency}&filters=price_overview`
	);
	if (response.status === 200) {
		const extractedJson = await response.json(); //extract JSON from the http response
		return json(extractedJson[`${steamId}`].data.price_overview);
	}
	return json({ response });
}
