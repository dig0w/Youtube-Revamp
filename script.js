// OnLoad
var oldHref = document.location.href;
window.onload = () => {
	removeShorts();
	dislikeLoader();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

				setTimeout(() => {
					dislikeLoader();
					removeShorts();
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
};
// Observe Updates
const observer = new MutationObserver((mutationsList, observer) => {
	if (/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.test(window.location.href)) {
		for(const mutation of mutationsList) {
			if (mutation.type === "childList") {
				if (mutation.removedNodes.length) {
					dislikeLoader();
				};
			};
		};
	};
});
observer.observe(document.body, { subtree: true, childList: true });

// Dislikes
async function dislikeLoader() {
	const url = window.location.href;

	if (/^.*((youtu.be\/)|(watch\?))\??v?=?([^#&?]*).*/.test(url)) {
		var videoId = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)[7];
			if(videoId.length != 11){ videoId = false };

		console.log("video")

		const info = await VideoInfo(videoId);
			if (info == undefined) { return };

		upateDislikes(info.dislikes, 0, url);
		removeShorts();
	} else if (/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/.test(url)) {
		var videoId = url.match(/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/)[4];
			if(videoId.length != 11){ videoId = false };

		console.log("shorts")

		const info = await VideoInfo(videoId);
			if (info == undefined) { return };

		console.log(info);

		upateDislikes(info.dislikes, 1, url);
		removeShorts();
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
					var dislikeTxt = document.createElement("div");
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
			
				for (var i = 0; i < dislikeBtns.length; i++) {
					if (dislikeBtns[i].children[0] && dislikeBtns[i].children[0].children[0] && dislikeBtns[i].children[0].children[0].children[1] && dislikeBtns[i].children[0].children[0].children[1].children[0]) {
						if (dislikeBtns[i].children[0].children[0].children[0].getAttribute("aria-pressed") == "true") { dislikesInfo = dislikesInfo + 1 };

						var dislikes = await formatDislikes(dislikesInfo);
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
	var num = 0;

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
	var shortsBtn = document.querySelectorAll("ytd-guide-entry-renderer.style-scope.ytd-guide-section-renderer")[1];
	var miniShortsBtn = document.querySelectorAll("ytd-mini-guide-entry-renderer.style-scope.ytd-mini-guide-renderer")[1];

	if (shortsBtn && shortsBtn.children[0] && shortsBtn.children[0].children[0] && shortsBtn.children[0].children[0].children[2] && shortsBtn.children[0].children[0].children[2].innerHTML == "Shorts") {
		shortsBtn.remove();
	};

	if (miniShortsBtn && miniShortsBtn.children[0] && miniShortsBtn.children[0].children[1] && miniShortsBtn.children[0].children[1].innerHTML == "Shorts") {
		miniShortsBtn.remove();
	};
};