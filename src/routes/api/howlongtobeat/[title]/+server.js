import { json } from '@sveltejs/kit';
import { HowLongToBeatService } from 'howlongtobeat';
const hltbService = new HowLongToBeatService();

export async function GET({ params }) {
	const { title } = params;

	const response = await hltbService.search(title);
	if (response.status === 200) {
		const extractedJson = await response.json(); //extract JSON from the http response
		return json({ game_info: extractedJson });
	}
	return json({ response });
}
