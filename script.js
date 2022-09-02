const delay = ms => new Promise(res => setTimeout(res, ms));

// OnLoad
window.onload = dislikeLoader();

// OnReload
var oldHref = document.location.href;
window.onload = function() {
    var bodyList = document.querySelector("body");

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

				dislikeLoader();
				skipAd();
				// downloadVideo();
            };
        });
    });

    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};

// Dislikes
async function dislikeLoader() {
	const url = window.location.href;

	if(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.test(url)){
		var videoId = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)[7];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);

		dislike(info.dislikes, 0);
	} else if(/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/.test(url)){
		var videoId = url.match(/^.*((youtu.be\/)|(shorts\/))([^#&?]*).*/)[4];
			if(videoId.length != 11){ videoId = false };

		const info = await VideoInfo(videoId);

		dislike(info.dislikes, 1);
	};
};

async function VideoInfo(id) {
	const endpoint = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;

	return fetch(endpoint).then((r) => r.json());
};

function dislike(dislikesInfo, idx) {
	var dislikes = 0;
	var num = 0;

	if(dislikesInfo >= 1000000000){
		num = dislikesInfo/1000000000;
		dislikes = `${Math.round(num*10)/10}B`;
	} else if(dislikesInfo >= 1000000){
		num = dislikesInfo/1000000;
		dislikes = `${Math.round(num*10)/10}M`;
	} else if(dislikesInfo >= 1000){
		num = dislikesInfo/1000;
		dislikes = `${Math.round(num*10)/10}K`;
	} else{
		dislikes = dislikesInfo;
	};

	try{
		if(idx == 0){
			var dislikebtns = document.querySelectorAll("ytd-menu-renderer.style-scope.ytd-watch-metadata")[0].children[0].children[1].children[0].children[0].children[1].children[0];

			dislikebtns.innerHTML = dislikes;
		} else if(idx == 1){
			var dislikebtn = document.querySelectorAll("ytd-toggle-button-renderer#dislike-button.style-scope.ytd-like-button-renderer");

			dislikebtn[0].children[0];
		
			for(var i = 0; i < dislikebtn.length; i++){
				dislikebtn[i].children[0].children[0].children[1].children[0].innerHTML = dislikes;	
			};
		};
	} catch(err){
		setTimeout(function() { dislike(dislikesInfo, idx) }, 100);
	};
};