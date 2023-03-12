import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const response = await fetch(
		`https://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json`
	);
	const { title } = params;
	if (response.status === 200) {
		const extractedJson = await response.json(); //extract JSON from the http response
		const arrayAllGames = extractedJson.applist.apps;

		// Filter the Steam games array to find matches for the search term
		const steamGameFilter = arrayAllGames.filter((obj) => {
			return obj.name.toLowerCase().includes(title);
		});

		if (steamGameFilter.length === 0) {
			return json({ arrayGames: [] });
		} else {
			// Sort the filtered Steam games alphabetically by game title
			steamGameFilter.sort((a, b) => a.name.length - b.name.length);
			return json({ arrayGames: steamGameFilter });
		}
	}
	return json({ response });
}
