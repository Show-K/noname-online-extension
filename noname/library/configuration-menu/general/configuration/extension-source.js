import { configuration } from "../../../configuration.js";

export const EXTENSION_SOURCE = {
	name: "获取扩展地址",
	init: "GitHub Proxy",
	unfrequent: true,
	get item() {
		return configuration.extension_sources;
	},
	intro() {
		const introduction = document.createElement("body");
		introduction.append("获取在线扩展时的地址。当前地址：", document.createElement("br"));
		introduction.append(configuration.extension_sources[configuration.extension_source]);
		return introduction.innerHTML;
	}
};
