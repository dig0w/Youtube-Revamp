// OnLoad
var oldHref = document.location.href;
window.onload = () => {
	dislikeLoader();
	removeShorts();
	removeBanners();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

				setTimeout(() => {
					dislikeLoader();
					removeShorts();
					removeBanners();
				}, 1000);
            };
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });
};
// OnClick
window.onclick = () => {
	dislikeLoader();
	removeShorts();
	removeBanners();
};
// Observe Updates
const observer = new MutationObserver((mutationsList, observer) => {
	for(const mutation of mutationsList) {
		if (mutation.type === "childList") {
			if (mutation.removedNodes.length > 0) {
				dislikeLoader();
			} else if (mutation.addedNodes.length > 0) {
				removeShorts();
				removeBanners();
			};
		};
	};
});
observer.observe(document.body, { subtree: true, childList: true });

// Dislikes
async function dislikeLoader() {
	const url = window.location.href;

	if (/^.*((youtu.be\/)|(watch\?))\??v?=?([^#&?]*).*/.test(url)) {
		let videoId = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)[7];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);
			if (info == undefined) { return };

		upateDislikes(info.dislikes, 0, url);
		removeShorts();
		downloadBtn();
		removeBanners();
	} else if (/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/.test(url)) {
		let videoId = url.match(/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/)[4];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);
			if (info == undefined) { return };

		console.log(info);

		upateDislikes(info.dislikes, 1, url);
		removeShorts();
		removeBanners();
	};
};

async function VideoInfo(id) {
	const endpoint = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;

	return fetch(endpoint).then((r) => r.json());
};

async function upateDislikes(dislikesInfo, idx, url) {
	if (url == window.location.href) {
		try {
			if (idx == 0) {
				const dislikeBtn = document.querySelectorAll("dislike-button-view-model")[0].children[0].children[0].children[0];

				if (dislikeBtn.getAttribute("aria-pressed") == "true") { dislikesInfo = dislikesInfo + 1 };

				const dislikes = await formatDislikes(dislikesInfo);
					if (dislikes == undefined) return;

				if (!dislikeBtn.children[2]) {
					const dislikeTxt = document.createElement("div");
					dislikeTxt.classList.add("yt-spec-button-shape-next__button-text-content");
					dislikeTxt.innerHTML = dislikes;

					dislikeBtn.children[0].style.margin = "0 6px 0 -6px";

					dislikeBtn.insertBefore(dislikeTxt, null);

					dislikeBtn.style.width = "auto";
				} else if (dislikeBtn.children[2] && dislikeBtn.children[2].classList == "yt-spec-button-shape-next__button-text-content" && dislikeBtn.children[2].innerHTML != dislikes) {
					dislikeBtn.children[2].innerHTML = dislikes;
				};
			} else if (idx == 1) {
				const dislikeBtns = document.querySelectorAll("ytd-toggle-button-renderer#dislike-button.style-scope.ytd-like-button-renderer");
			
				for (let i = 0; i < dislikeBtns.length; i++) {
					if (dislikeBtns[i].children[0] && dislikeBtns[i].children[0].children[0] && dislikeBtns[i].children[0].children[0].children[1] && dislikeBtns[i].children[0].children[0].children[1].children[0]) {
						if (dislikeBtns[i].children[0].children[0].children[0].getAttribute("aria-pressed") == "true") { dislikesInfo = dislikesInfo + 1 };

						let dislikes = await formatDislikes(dislikesInfo);
							if (dislikes == 0) { dislikes = "Dislike" };

						dislikeBtns[i].children[0].children[0].children[1].children[0].innerHTML = dislikes;
					};
				};
			};
		} catch (err) {
			setTimeout(() => { upateDislikes(dislikesInfo, idx, url) }, 100);
		};
	};
};

function formatDislikes(dislikesCount) {
	let num = 0;

	if (dislikesCount >= 1000000000) {
		num = dislikesCount/1000000000;
		return `${Math.round(num*10)/10}B`;
	} else if (dislikesCount >= 1000000) {
		num = dislikesCount/1000000;
		return `${Math.round(num*10)/10}M`;
	} else if (dislikesCount >= 1000) {
		num = dislikesCount/1000;
		return `${Math.round(num*10)/10}K`;
	} else {
		return dislikesCount;
	};
};

// Remove Shorts
function removeShorts() {
	const shortsBtn = document.querySelectorAll("ytd-guide-entry-renderer.style-scope.ytd-guide-section-renderer")[1];
	const miniShortsBtn = document.querySelectorAll("ytd-mini-guide-entry-renderer.style-scope.ytd-mini-guide-renderer")[1];

	if (shortsBtn && shortsBtn.children[0] && shortsBtn.children[0].children[0] && shortsBtn.children[0].children[0].children[2] && shortsBtn.children[0].children[0].children[2].innerHTML == "Shorts") {
		shortsBtn.remove();
	} else if (shortsBtn && shortsBtn.children[0] && shortsBtn.children[0].children[0] && shortsBtn.children[0].children[0].children[2] && shortsBtn.children[0].children[0].children[2].children[0] && shortsBtn.children[0].children[0].children[2].children[0].innerHTML == "Shorts") {
		shortsBtn.remove();
	};

	if (miniShortsBtn && miniShortsBtn.children[0] && miniShortsBtn.children[0].children[1] && miniShortsBtn.children[0].children[1].innerHTML == "Shorts") {
		miniShortsBtn.remove();
	};

	const shortsFeed = document.querySelectorAll("div#content.style-scope.ytd-rich-section-renderer");
	if (shortsFeed) {
		for (let i = 0; i < shortsFeed.length; i++) {
			shortsFeed[i].remove();
		};
	};

	const shortsSearch = document.querySelectorAll("ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer");
	if (shortsSearch) {
		for (let i = 0; i < shortsSearch.length; i++) {
			shortsSearch[i].remove();
		};
	};
};

// Download Videos
function downloadBtn() {
	let redirect = window.location.href.split(".");
	redirect[1] = "ssyoutube";

	const btns = document.querySelectorAll("button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading");

	for (let i = 0; i < btns.length; i++) {
		if (btns[i].getAttribute("aria-label") == "Download") {

			btns[i].onclick = () => {
				window.open(redirect.join("."), "_blank").focus();
			};
		};
	};

	const btnMenu = document.querySelector("ytd-menu-service-item-download-renderer.style-scope.ytd-menu-popup-renderer.iron-selected");
		if (btnMenu) {
			btnMenu.onclick = () => {
				window.open(redirect.join("."), "_blank").focus();
			};
		};
};

// Remove Banners
function removeBanners() {
	const banners = document.querySelectorAll("div#masthead-ad.style-scope.ytd-rich-grid-renderer");
	if (banners) {
		for (let i = 0; i < shortsFeed.length; i++) {
			banners[i].remove();
		};
	};
};