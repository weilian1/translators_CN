{
	"translatorID": "f306107f-dabb-41ac-8fa2-f7f858feb11f",
	"label": "Wenjin",
	"creator": "Xingzhong Lin",
	"target": "https?://find.nlc.cn/search",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2020-07-22 09:31:02"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2020 Xingzhong Lin, https://github.com/Zotero-CN/translators_CN
	
	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	// TODO: adjust the logic here
	if (url.includes('/search/showDocDetails')) {
		return detectType(doc);
	}
	else if (url.includes("/doSearch?query")) {
		return "multiple";
	}
	return false;
}

function detectType(doc) {
	var itemType = {
		普通古籍: "book",
		善本: "book",
		学位论文: "theis",
		特藏古籍: "book",
		期刊论文:"journalArticle",
		期刊: "journalArticle",
		报纸: "newspaperArticle",
		专著: "",
		报告: "report"
	};
	var type = ZU.xpath(doc, "//span[@class='book_val']");
	if (type.length) {
		Z.debug(type[0].textContent);
		return itemType[type[0].textContent];
	} else {
		return false;
	}
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	// TODO: adjust the CSS selector
	var rows = doc.querySelectorAll('h2>a.title[href*="/article/"]');
	for (let row of rows) {
		// TODO: check and maybe adjust
		let href = row.href;
		// TODO: check and maybe adjust
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (items) ZU.processDocuments(Object.keys(items), scrape);
		});
	}
	else {
		scrape(doc, url);
	}
}
