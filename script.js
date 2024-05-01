// OnLoad
window.onload = dislikeLoader();
//OnClick
window.onclick = () => {
	console.log("click");
	dislikeLoader();
};

// OnReload
var oldHref = document.location.href;
window.onload = () => {
    var bodyList = document.querySelector("body");

    var observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

				dislikeLoader();
            };
        });
    });

    observer.observe(bodyList, {
        childList: true,
        subtree: true
    });
};

// Dislikes
async function dislikeLoader() {
	const url = window.location.href;

	if (/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.test(url)) {
		var videoId = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)[7];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);

		upateDislikes(info.dislikes, 0, url);
	} else if (/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/.test(url)) {
		var videoId = url.match(/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/)[4];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);

		upateDislikes(info.dislikes, 1, url);
	};
};

async function VideoInfo(id) {
	const endpoint = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;

	return fetch(endpoint).then((r) => r.json());
};

function upateDislikes(dislikesInfo, idx, url) {
	if (url == window.location.href) {
		var dislikes = 0;
		var num = 0;
	
		if (dislikesInfo >= 1000000000) {
			num = dislikesInfo/1000000000;
			dislikes = `${Math.round(num*10)/10}B`;
		} else if (dislikesInfo >= 1000000) {
			num = dislikesInfo/1000000;
			dislikes = `${Math.round(num*10)/10}M`;
		} else if (dislikesInfo >= 1000) {
			num = dislikesInfo/1000;
			dislikes = `${Math.round(num*10)/10}K`;
		} else {
			dislikes = dislikesInfo;
		};
	
		try {
			if (idx == 0) {
				var dislikeBtn = document.querySelectorAll("dislike-button-view-model")[0].children[0].children[0].children[0];
	
				if (dislikeBtn.children[1].classList != "yt-spec-button-shape-next__button-text-content") {
					var dislikeTxt = document.createElement("div");
					dislikeTxt.classList.add("yt-spec-button-shape-next__button-text-content");
					dislikeTxt.innerHTML = dislikes;

					dislikeBtn.children[0].style.margin = "0 6px 0 -6px";

					dislikeBtn.insertBefore(dislikeTxt, dislikeBtn.childNodes[1]);

					dislikeBtn.style.width = "auto";
				} else if (dislikeBtn.children[1].classList == "yt-spec-button-shape-next__button-text-content" && dislikeBtn.children[1].innerHTML != dislikes) {
					dislikeBtn.children[1].innerHTML = dislikes;
				};
			} else if (idx == 1) {
				var dislikeBtns = document.querySelectorAll("ytd-toggle-button-renderer#dislike-button.style-scope.ytd-like-button-renderer");
			
				for (var i = 0; i < dislikeBtns.length; i++) {
					if (dislikeBtns[i].children[0] && dislikeBtns[i].children[0].children[0] && dislikeBtns[i].children[0].children[0].children[1] && dislikeBtns[i].children[0].children[0].children[1].children[0]) {
						dislikeBtns[i].children[0].children[0].children[1].children[0].innerHTML = dislikes;
					};
				};
			};
		} catch (err) {
			setTimeout(() => { upateDislikes(dislikesInfo, idx, url) }, 100);
		};
	};
};