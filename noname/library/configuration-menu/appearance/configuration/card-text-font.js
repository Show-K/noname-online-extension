import { ITEM } from "./card-text-font/item.js";

export const CARD_TEXT_FONT = {
	name: "卡牌字体",
	init: "default",
	unfrequent: true,
	item: ITEM,
	textMenu(node, link) {
		if (link != "default") {
			node.style.fontFamily = link;
		}
		node.style.fontSize = "20px";
	},
	onclick(font) {
		game.saveConfig("cardtext_font", font);
		lib.init.cssstyles();
	}
};
