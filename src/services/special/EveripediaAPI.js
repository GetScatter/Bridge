const HOST = `https://api.everipedia.org/v2`;

const GET = route => fetch(`${HOST}/${route}`).then(x => x.json()).catch(e => console.error(e));
let cache = null;

let last = null;

export default class EveripediaAPI {

	static async getTrending(){

		if(!cache) cache = await GET('recent-activity/trending?user_agent=scatter&limit=100').then(x => x.map(y => y.slug));
		if(!cache) return;

		const random = cache[Math.floor(Math.random()*cache.length)];

		const recurse = () => {
			cache = cache.filter(x => x !== random);
			return this.getTrending();
		};

		return await GET(`wiki/slug/lang_en/${random}?cache=true`).then(x => {
			if(!x) return;
			if(!x.metadata || x.metadata.find(y => y.key === 'is_adult_content').value) return recurse();
			if(x.page_body.some(b => b.paragraphs.some(p => p.items.some(i => i.text ? i.text.indexOf('porn') > -1 : false)))) return recurse();
			if(!x.page_body[0] || !x.page_body[0].paragraphs || !x.page_body[0].paragraphs[0].items || !x.page_body[0].paragraphs[0].items[0]) return recurse();
			if(!x.page_title[0]) return recurse();
			if(!x.main_photo[0] || !x.main_photo[0].thumb) return recurse();
			if(last === random) return recurse();
			last = random;
			return {
				page_body:x.page_body[0].paragraphs[0].items[0].text,
				page_title:x.page_title[0].text,
				slug:random,
				main_photo:x.main_photo[0].thumb,
			};
		});
	}

}
