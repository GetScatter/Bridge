const THEMES = {
	FLUORESCENT:'Fluorescent',
	BLUE_STEEL:'Blue Steel',
}

export const setMobileBrowserThemeColor = theme => {
	const metaThemeColor = document.querySelector("meta[name=theme-color]");
	const color = (() => {
		switch (theme) {
			case THEMES.FLUORESCENT: return '#fff';
			case THEMES.BLUE_STEEL: return '#031c2f';
		}
	})();
	metaThemeColor.setAttribute("content", color);
};

export default THEMES;