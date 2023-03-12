import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { currency } = params;
	const response = await fetch(
		`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.toLowerCase()}.json`
	);

	if (response.status === 200) {
		const rates = await response.json(); //extract JSON from the http response
		return json({ rates: rates[currency.toLowerCase()] });
	}
	return json({ response });
}
