'use strict';
const placeholdImg = '/images/loading.png';
const sourceImgKey = 'data-original';
const imgRegExp = /<img(\s*?)src="(.*?)"(.*?)>/gi;

hexo.extend.filter.register('after_render:html', function (data) {
	let matchedImages = data.match(imgRegExp);
	if (matchedImages) {
		matchedImages.map(function (imgElStr) {
			if(imgElStr.indexOf(sourceImgKey) > -1)
				return;
			let matchedSourceImgSrc = imgElStr.match(/src="(.*?)"/gi);
			if (matchedSourceImgSrc) {
				let newImgSrc = matchedSourceImgSrc[0].replace('src', sourceImgKey);
				let newImgStr = 'src="' + placeholdImg + '" ' + newImgSrc;
				let newImgElStr = imgElStr.replace(matchedSourceImgSrc[0], newImgStr);
				data = data.replace(imgElStr, newImgElStr);
			}
		})
	}
	return data;
});