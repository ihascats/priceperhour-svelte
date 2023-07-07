import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { title } = params;

	const response = await fetch('https://howlongtobeat.com/api/search', {
		headers: {
			accept: '*/*',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json',
			Referer: 'https://howlongtobeat.com/',
			'Referrer-Policy': 'no-referrer'
		},
		body: `{"searchType":"games","searchTerms":["${title}"],"searchPage":1,"size":20,"searchOptions":{"games":{"userId":0,"platform":"","sortCategory":"popular","rangeCategory":"main","rangeTime":{"min":null,"max":null},"gameplay":{"perspective":"","flow":"","genre":""},"rangeYear":{"min":"","max":""},"modifier":""},"users":{"sortCategory":"postcount"},"lists":{"sortCategory":"follows"},"filter":"","sort":0,"randomizer":0}}`,
		method: 'POST'
	});
	if (response.status === 200) {
		const extractedJson = await response.json(); //extract JSON from the http response
		return json({ game_info: extractedJson.data });
	}
	return json({ response });
}
