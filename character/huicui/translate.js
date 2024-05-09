const translates = {
	re_panfeng: "潘凤",
	xinkuangfu: "狂斧",
	xinkuangfu_info: "出牌阶段限一次，你可选择：1，弃置装备区里的一张牌，你使用无对应实体牌的普【杀】。若此【杀】造成伤害，你摸两张牌。2，弃置一名其他角色装备区里的一张牌，你使用无对应实体牌的普【杀】。若此【杀】未造成伤害，你弃置两张手牌。（均无距离和次数限制）",
	xingdaorong: "邢道荣",
	xuxie: "虚猲",
	xuxie_info: "出牌阶段开始时，你可以减1点体力上限并选择所有距离1以内的角色，弃置这些角色的各一张牌或令这些角色各摸一张牌。出牌阶段结束时，若你的体力上限不为全场最多，则你加1点体力上限，然后回复1点体力或摸两张牌。",
	caoxing: "曹性",
	cxliushi: "流矢",
	cxliushi2: "流矢",
	cxliushi_info: "出牌阶段，你可以将一张红桃牌置于牌堆顶，视为对一名角色使用一张【杀】（无距离限制且不计入使用次数）。当此【杀】造成伤害后，受到伤害的角色获得一个“流”。有“流”的角色手牌上限-X（X为其“流”数）。",
	zhanwan: "斩腕",
	zhanwan_info: "锁定技，有“流”的角色于弃牌阶段弃牌后，你摸等量的牌，然后其移去所有的“流”。",
	re_chunyuqiong: "淳于琼",
	recangchu: "仓储",
	recangchu2: "仓储",
	recangchu3: "仓储",
	recangchu_info: "锁定技。①游戏开始时，你获得3个“粮”。你的手牌上限+X（X为“粮”数）。②每回合限一次，当你于回合外得到牌后，你获得一个“粮”。（你的“粮”数不能超过存活角色数）",
	reliangying: "粮营",
	reliangying_info: "弃牌阶段开始时，你可以摸至多X张牌，然后交给等量的角色各一张牌。（X为你的“粮”数）",
	reshishou: "失守",
	reshishou2: "失守",
	reshishou_info: "锁定技，当你使用【酒】时或受到1点火焰伤害后，你移去一个“粮”。准备阶段，若你没有“粮”，你失去1点体力。",
	xiahoujie: "夏侯杰",
	liedan: "裂胆",
	liedan_info: "锁定技，其他角色的准备阶段开始时，若X大于0，则你摸X张牌。若X等于3，则你加1点体力上限（至多加到8）。若X为0，则你失去1点体力并获得一枚“裂”（X为你的手牌数，体力值，装备区牌数中大于其的数量）。准备阶段，若“裂”数大于4，则你死亡。",
	zhuangdan: "壮胆",
	zhuangdan_mark: "壮胆",
	zhuangdan_info: "锁定技，其他角色的回合结束时，若你的手牌数为全场唯一最多，则你令〖裂胆〗失效直到你下回合结束。",
	dc_caiyang: "蔡阳",
	dcxunji: "寻嫉",
	dcxunji_info: "出牌阶段限一次，你可以选择一名其他角色。该角色的下个结束阶段开始时，若其此回合使用过黑色牌，则你视为对其使用一张【决斗】，且当此【决斗】对其造成伤害后，其对你造成等量的伤害。",
	dcjiaofeng: "交锋",
	dcjiaofeng_info: "锁定技。每回合限一次，当你造成伤害时，若你本回合内未造成过其他伤害且你已损失的体力值：大于0，则你摸一张牌；大于1，则此伤害+1；大于2，则你回复1点体力。",
	zhoushan: "周善",
	dcmiyun: "密运",
	dcmiyun_tag: "安",
	dcmiyun_info: "锁定技。①一轮游戏开始时，你依次执行：1.若你有“安”，你将包括“安”的在内的任意张手牌交给一名其他角色，然后你将手牌补至体力上限；2.你正面向上获得一名其他角色的一张牌，称为“安”。②当你不因〖密运①〗失去“安”后，你失去1点体力。",
	dcdanying: "胆迎",
	dcdanying_info: "每回合限一次。你可以展示“安”，然后视为使用或打出一张【杀】或【闪】。然后当你于本回合下一次成为牌的目标后，使用者弃置你的一张牌。",
	re_sunluyu: "孙鲁育",
	remeibu: "魅步",
	remeibu_info: "其他角色的出牌阶段开始时，若你在其攻击范围内，你可以弃置一张牌A，该角色于本阶段内拥有〖止息〗，且当其因〖止息〗弃置与牌A花色相同的牌时，你获得之。",
	rezhixi: "止息",
	rezhixi_info: "锁定技，当你使用【杀】或普通锦囊牌时，你弃置一张手牌。",
	remumu: "穆穆",
	remumu_info: "出牌阶段开始时，你可以选择一项：1.弃置一名其他角色装备区里的一张牌，然后你本回合可使用【杀】的次数+1；2.获得一名角色装备区里的一张牌，然后你本回合可使用【杀】的次数-1。",
	re_dongbai: "董白",
	relianzhu: "连诛",
	relianzhu_info: "出牌阶段限一次，你可将一张牌正面朝上交给一名其他角色。若此牌为：红色，你摸一张牌；黑色，对方弃置两张牌或令你摸两张牌。",
	rexiahui: "黠慧",
	rexiahui_info: "锁定技，①你的黑色牌不计入手牌上限。②当有其他角色获得你的黑色牌后，其于下次扣减体力前不能使用，打出，弃置这些牌。③一名其他角色的回合结束时，若其本回合失去过其所有“黠慧”牌，则其失去1点体力。",
	heyan: "何晏",
	yachai: "崖柴",
	yachai_info: "当你受到伤害后，你可令伤害来源选择一项：①其本回合不能再使用手牌，然后你摸两张牌；②其展示所有手牌，然后将其手牌中一种花色的所有牌交给你；③弃置一半数量的手牌（向上取整）。",
	qingtan: "清谈",
	qingtan_info: "出牌阶段限一次，你可令所有有手牌的角色同时选择一张手牌并同时展示。你可以获得其中一种花色的牌，然后展示此花色牌的角色各摸一张牌。若如此做，弃置其他的牌。",
	zhaoyan: "赵嫣",
	jinhui: "锦绘",
	jinhui_info: "出牌阶段限一次，你可以随机亮出牌堆中的三张不具有“伤害”标签且使用目标范围为“自己”或“一名角色”的牌，然后选择一名其他角色。该角色选择并按如下“锦绘”规则使用其中一张，然后你可以按如下“锦绘”规则使用剩余的任意张牌：若此牌的使用目标为“自己”，则对自己使用该牌，否则对对方使用该牌（无距离限制且不计入次数限制）。",
	qingman: "轻幔",
	qingman_info: "锁定技。一名角色的回合结束时，你将手牌摸至X张（X为其装备区中空栏的数量）。",
	wangtao: "王桃",
	wangyue: "王悦",
	huguan: "护关",
	huguan_info: "一名角色于出牌阶段内使用第一张牌时，若此牌为红色，则你可以声明一种花色。该花色的牌不计入其本回合的手牌上限。",
	yaopei: "摇佩",
	yaopei_info: "其他角色的弃牌阶段结束时，若你本回合内对其发动过〖护关〗，则你可以弃置一张与其于此阶段弃置的牌花色均不相同的牌。然后你选择一项：①其摸两张牌，你回复1点体力。②其回复1点体力，你摸两张牌。",
	mingluan: "鸣鸾",
	mingluan_info: "其他角色的结束阶段开始时，若有角色于本回合内回复过体力，则你可以弃置任意张牌，然后摸X张牌（X为当前角色的手牌数，且至多摸至5张）。",
	zhangxuan: "张嫙",
	tongli: "同礼",
	//tongli_info:'当你于出牌阶段内不因〖同礼〗而使用基本牌或普通锦囊牌指定第一个目标后，若你手牌中的花色数和你于本阶段内不因〖同礼〗而使用过的牌数相等，则你可以于此牌结算结束后依次视为对此牌的所有目标使用X张名称和属性相同的牌（X为你手牌中的花色数）。',
	tongli_info: "当你于出牌阶段内使用基本牌或普通锦囊牌指定第一个目标后，若你手牌中的花色数和你于本阶段内使用过的牌数相等，则你可以令此牌额外结算X次（X为你手牌中的花色数）。",
	shezang: "奢葬",
	shezang_info: "每轮限一次。当你或你回合内的其他角色进入濒死状态时，你可以从牌堆中获得每种花色的牌各一张。",
	tengyin: "滕胤",
	chenjian: "陈见",
	chenjian_info: "准备阶段，你可亮出牌堆顶的3+X张牌（X为你“陈见”标记的数量且至多为2），然后执行以下一至两项：⒈弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌。⒉使用其中剩余的一张牌。若你执行了所有选项，则你获得一枚“陈见”并重铸所有手牌。",
	xixiu: "皙秀",
	xixiu_info: "锁定技。①当你成为其他角色使用牌的目标时，若你的装备区内有和此牌花色相同的牌，则你摸一张牌。②若你装备区内的牌数为1，则其他角色不能弃置你装备区内的牌。",
	zhangyao: "张媱",
	yuanyu: "怨语",
	yuanyu_info: "出牌阶段限一次。你可以摸一张牌，然后选择一张手牌和一名其他角色。该角色获得如下效果直到你发动〖夕颜〗：{你与该角色的弃牌阶段开始时，或当该角色造成1点伤害后，其须将一张手牌作为“怨”置于你的武将牌上}。然后你将你选择的手牌作为“怨”置于你的武将牌上。",
	xiyan: "夕颜",
	xiyan_info: "当有牌作为“怨”移动到你的武将牌上后，若“怨”中的花色数达到4种，则你可以获得所有“怨”。然后若当前回合角色：是你，你本回合手牌上限+4且使用牌无次数限制且重置你的〖怨语〗于此阶段的发动次数；不是你，你可令当前回合角色本回合手牌上限-4且不能使用基本牌。",
	xiahoulingnv: "夏侯令女",
	fuping: "浮萍",
	fuping_info: "①其他角色对你使用的牌结算结束后，若你未因此技能记录过此牌的名称且你有未废除的装备栏，则你可以废除一个装备栏，记录此牌的名称。②每回合每种牌名限一次。你可以将一张非基本牌当做〖浮萍①〗记录过的基本牌或锦囊牌使用或打出。③若你的所有装备栏均已被废除，则你使用牌无距离限制。",
	weilie: "炜烈",
	weilie_info: "每局游戏限X次。出牌阶段，你可以弃置一张牌并选择一名已受伤的角色，令该角色回复1点体力。然后若其体力值小于体力上限，则其摸一张牌（X为你〖浮萍①〗中的记录数+1）。",
	dc_sunru: "孙茹",
	xiecui: "撷翠",
	xiecui_info: "当有角色于回合内第一次因执行牌的效果而造成伤害时，你可以令此伤害+1。若其势力为吴，则该角色获得此伤害牌对应的实体牌，且其本回合的手牌上限+1。",
	youxu: "忧恤",
	youxu_info: "一名角色A的回合结束时，若其手牌数大于体力值，则你可以展示A的一张牌，然后将此牌交给另一名角色B。若B的体力值为全场最少，则B回复1点体力。",
	huaxin: "华歆",
	wanggui: "望归",
	wanggui_info: "每回合限触发一次，当你造成或受到伤害后，若你：仅明置了此武将牌，则你可对与你势力不同的一名角色造成1点伤害；武将牌均明置，则你可令与你势力相同的角色各摸一张牌。",
	spwanggui: "望归",
	spwanggui_info: "①当你受到伤害后，你可以摸一张牌，或和一名势力相同的其他角色各摸一张牌；②每回合限一次，当你造成伤害后，你可以对一名与你势力不同的角色造成1点伤害。",
	xibing: "息兵",
	xibing_info: "每回合限一次，当其他角色于其出牌阶段内使用黑色【杀】或黑色普通锦囊牌指定唯一角色为目标后，你可令该角色将手牌摸至当前体力值（至多摸至五张）。若其因此摸牌，其本回合不能再使用牌。",
	luyusheng: "陆郁生",
	zhente: "贞特",
	zhente2: "贞特",
	zhente_info: "每回合限一次，当你成为其他角色使用基本牌或普通锦囊牌的目标后，你可令使用者选择一项：1.本回合不能再使用与此牌颜色相同的牌；2.此牌对你无效。",
	zhente_info_guozhan: "每回合限一次，当你成为其他角色使用黑色基本牌或黑色普通锦囊牌的目标后，你可令使用者选择一项：1.本回合不能再使用黑色牌；2.此牌对你无效。",
	zhiwei: "至微",
	zhiwei2: "至微",
	zhiwei_info: "游戏开始时/你的回合开始时，若场上没有因此法被选择过的角色存活，则你选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。",
	zhiwei_info_guozhan: "你明置此武将牌时，选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。该角色死亡时，若你的两个武将牌均明置，你暗置此武将牌。",
	zhanghu: "张虎",
	cuijian: "摧坚",
	cuijian_info: "出牌阶段限一次，你可以选择一名有手牌的其他角色。若其手牌中有【闪】，则其将所有【闪】和防具牌交给你，然后你交给其等量的牌。",
	zhtongyuan: "同援",
	zhtongyuan_info: "锁定技。①当你使用红色锦囊牌后，你于〖摧坚〗后增加“若其手牌中没有【闪】，则你摸两张牌”；②当你使用或打出红色基本牌后，你删除〖摧坚〗中的“，然后你交给其等量的牌”。③当你使用红色的普通锦囊牌/基本牌时，若你已发动过〖摧坚①〗和〖摧坚②〗，则此牌不可被响应/可额外增加一个目标。",
	lvlingqi: "吕玲绮",
	guowu: "帼舞",
	guowu_info: "出牌阶段开始时，你可以展示全部手牌，根据你展示的类型数，你获得对应效果：至少一类，从弃牌堆获得一张【杀】；至少两类，此阶段使用牌无距离限制；至少三类，此阶段使用【杀】或普通锦囊牌可以多指定至多两个目标。",
	guowu_info_guozhan: "出牌阶段开始时，你可以展示全部手牌，根据你展示的类型数，你获得对应效果：至少一类，从弃牌堆获得一张【杀】；至少两类，此阶段使用牌无距离限制；至少三类，此阶段使用【杀】可以多指定至多两个目标。",
	zhuangrong: "妆戎",
	zhuangrong_info: "觉醒技，一名角色的回合结束时，若你的体力值或手牌数为1，你减1点体力上限并回复体力至上限，将手牌摸至体力上限，然后获得〖神威〗和〖无双〗。",
	llqshenwei: "神威",
	llqshenwei_info: "锁定技，摸牌阶段开始时，你令额定摸牌数+2；你的手牌上限+2。",
	re_kanze: "阚泽",
	rekuanshi: "宽释",
	rekuanshi_info: "结束阶段，你可以选择一名角色。你获得如下效果直到你下回合开始：每回合限一次，当其于一回合内受到第2点伤害后，其回复1点体力。",
	liuyong: "刘永",
	zhuning: "诛佞",
	zhuning_info: "出牌阶段限一次。你可将任意张牌交给一名其他角色（称为“隙”），然后可视为使用一张具有伤害标签的基本牌/锦囊牌（不计入次数限制）。若你以此法使用的牌未造成伤害，则你将〖诛佞〗于本回合内改为“限两次”。",
	fengxiang: "封乡",
	fengxiang_info: "锁定技。①当你受到伤害后，若场上：存在“隙”唯一最多的角色，则其回复1点体力；不存在，则你摸一张牌。②当有角色的手牌移动后，若场上“隙”最多的角色因此发生变化，则你摸一张牌。",
	fengxiang_tag: "隙",
	re_xunchen: "荀谌",
	refenglve: "锋略",
	refenglve_info: "出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，你获得其区域里的两张牌；若平局，则你获得你的拼点牌且令此技能于本阶段内的发动次数上限+1；若你输，其获得你的拼点牌。",
	anyong: "暗涌",
	anyong_info: "当一名角色于其回合内第一次造成伤害后，若伤害值为1，则你可弃置一张牌，并对受伤角色造成1点伤害。",
	wanniangongzhu: "万年公主",
	zhenge: "枕戈",
	zhenge_info: "准备阶段，你可以选择一名角色。该角色本局游戏的攻击范围+1（至多+5）。然后若除其外的所有角色都在该角色的攻击范围内，则你可以令其视为对另一名角色使用一张【杀】。",
	xinghan: "兴汉",
	xinghan_info: "锁定技，每回合的第一张【杀】造成伤害后，若此【杀】的使用者成为过〖枕戈〗的目标，则你摸一张牌。若你的手牌数不是全场唯一最多的，则改为摸X张牌（X为该角色的攻击范围且最多为5）。",
	re_chendeng: "陈登",
	refuyuan: "扶援",
	refuyuan_info: "一名角色成为【杀】的目标后，若其本回合内没有成为过其他红色牌的目标，则你可以令其摸一张牌。",
	reyingshui: "营说",
	reyingshui_info: "出牌阶段限一次，你可将一张牌交给攻击范围内的一名其他角色，然后其选择一项：①交给你至少两张装备牌。②受到1点伤害。",
	rewangzu: "望族",
	rewangzu_info: "每回合限一次。当你受到其他角色造成的伤害时，你可随机弃置一张手牌，令此伤害-1。若你所在阵营的存活角色数是全场最多的，则你可以自行选择弃置的牌。",
	re_miheng: "祢衡",
	rekuangcai: "狂才",
	rekuangcai_info: "锁定技。①你于回合内使用牌无距离和次数限制。②弃牌阶段开始时，若你本回合内：未使用过牌，则你本局游戏的手牌上限+1；使用过牌但未造成过伤害，则你本局游戏的手牌上限-1。③结束阶段开始时，你摸X张牌（X为你本回合内造成的伤害且至多为5）。",
	reshejian: "舌剑",
	reshejian_info: "每回合限两次。当你成为其他角色使用牌的唯一目标后，你可以弃置至少两张手牌。若如此做，你选择一项：⒈弃置其等量的牌。⒉对其造成1点伤害。",
	fengxi: "冯熙",
	yusui: "玉碎",
	yusui_info: "当你成为其他角色使用黑色牌的目标后，你可以失去1点体力，然后选择一项：⒈令其将手牌数弃置至与你相同；⒉令其失去Y点体力（Y为其的体力值减去你的体力值，不为正时不可选择）。",
	boyan: "驳言",
	boyan_info: "出牌阶段限一次，你可选择一名其他角色。其将手牌摸至体力上限（至多摸至五张），然后其本回合不能使用或打出手牌。",
	re_dengzhi: "邓芝",
	jianliang: "简亮",
	jianliang_info: "摸牌阶段开始时，若你的手牌数不为全场最多，则你可以令至多两名角色各摸一张牌。",
	weimeng: "危盟",
	weimeng_info: "出牌阶段限一次，你可以获得一名其他角色的至多X张手牌，然后交给其等量的牌（X为你的体力值）。若你给出的牌点数之和：大于得到的牌，则你摸一张牌；小于得到的牌，弃置该角色区域内的一张牌。",
	mamidi: "马日磾",
	bingjie: "秉节",
	bingjie_info: "出牌阶段开始时，你可减1点体力上限，然后当你本回合使用【杀】或普通锦囊牌指定其他角色为目标后，其弃置一张牌。若其弃置的牌与你使用的牌颜色相同，其无法响应此牌。",
	zhengding: "正订",
	zhengding_info: "锁定技。当你于回合外使用或打出牌响应其他角色使用的牌时，若这两张牌颜色相同，则你加1点体力上限并回复1点体力。",
	dc_jiben: "吉本",
	xunli: "询疠",
	xunli_info: "锁定技。①当有黑色牌因弃置而进入弃牌堆后，若X大于0，则你将其中的X张牌置于武将牌上作为“疠”（X=min(这些牌的数量，9-Y)，Y=你的“疠”数）。②出牌阶段开始时，你可以用任意张黑色手牌交换等量的“疠”。",
	zhishi: "指誓",
	zhishi_info: "结束阶段，你可选择一名角色。当该角色于你的下回合开始前{成为【杀】的目标后或进入濒死状态时}，你可移去任意张“疠”，然后其摸等量的牌。",
	lieyi: "烈医",
	lieyi_info: "出牌阶段限一次。你可以展示所有“疠”并选择一名其他角色，对其使用其中的一张可对其使用的牌（无距离和次数限制）并重复此流程，并将其余的牌置于弃牌堆。然后若其存活且未于此流程中因受到伤害而进入过濒死状态，则你失去1点体力。",
	guanning: "管宁",
	dunshi: "遁世",
	dunshi_info: "每回合限一次。你可以视为使用或打出一张【杀】/【闪】/【桃】/【酒】，然后当前回合角色于本回合内下一次造成伤害时，你选择两项：⒈防止此伤害。系统从技能名中包含“仁/义/礼/智/信”字样的技能中随机选择三个其未拥有的技能，然后你令当前回合角色获得其中一个技能。⒉从〖遁世〗中删除你本次使用或打出的牌并获得一个“席”。⒊减1点体力上限并摸X张牌（X为你的“席”数）。",
	dc_gaolan: "高览",
	xizhen: "袭阵",
	xizhen_info: "出牌阶段开始时，你可选择一名其他角色，视为对其使用【杀】或【决斗】。然后当有角色于本阶段内使用或打出牌响应你时，该角色回复1点体力，你摸一张牌（若其满体力，改为两张）。",
	dc_huangchengyan: "黄承彦",
	dcjiezhen: "解阵",
	dcjiezhen_info: "出牌阶段限一次，你可选择一名其他角色。该角色获得〖八阵〗，且其所有不为{锁定技、限定技、觉醒技、主公技、带有Charlotte标签}的技能失效。你的下回合开始时，或其因〖八卦阵〗发起的判定结算结束后，你令其恢复其以此法失效的所有技能并失去以此法获得的〖八阵〗，然后获得其区域内的一张牌。",
	dczecai: "择才",
	dczecai_info: "限定技。一轮游戏开始时，若游戏轮数大于1，则你可令一名其他角色获得〖集智〗直到下一轮游戏开始；若其是上一轮内使用过锦囊牌数量唯一最多的角色，则其获得一个额外的回合。",
	dcyinshi: "隐世",
	dcyinshi_info: "锁定技。①每回合限一次，当你受到伤害时，若此伤害的渠道不为有颜色的牌，则你防止此伤害。②当有因〖八卦阵〗发起的判定的判定牌生效时，你获得此判定牌。",
	tenggongzhu: "滕公主",
	xingchong: "幸宠",
	xingchong_info: "一轮游戏开始时，你可声明两个自然数X和Y，且(X+Y)≤min(5, 你的体力上限)。你摸X张牌并展示Y张手牌。若如此做，当你于本轮内失去一张以此法展示的牌后，你摸两张牌。",
	liunian: "流年",
	liunian_info: "锁定技。一名角色的回合结束时，若本回合内进行了本次游戏的第一次洗牌，则你加1点体力上限；若本回合内进行了本次游戏的第二次洗牌，则你于本回合结束时回复1点体力，且本局游戏内的手牌上限+10。",
	caimaozhangyun: "蔡瑁张允",
	lianzhou: "连舟",
	lianzhou_info: "锁定技。准备阶段，你横置你的武将牌。然后你可横置任意名体力值等于你的角色。",
	jinglan: "惊澜",
	jinglan_info: "锁定技。当你造成伤害后，若你的手牌数：大于体力值，你弃置四张手牌；等于体力值，你弃置一张牌并回复1点体力；小于体力值，你受到1点无来源火焰伤害并摸五张牌。",
	dc_yanghu: "羊祜",
	dcdeshao: "德劭",
	dcdeshao_info: "每回合限两次。当你成为其他角色使用的黑色牌的目标后，你可以摸一张牌，然后若其手牌数不小于你，则你弃置其一张牌。",
	dcmingfa: "明伐",
	dcmingfa_info: "①出牌阶段限一次。当你使用【杀】或普通锦囊牌结算结束后，若你的武将牌上没有“明伐”牌，则你可以将此牌作为“明伐”牌置于武将牌上并选择一名其他角色，记录该角色和此牌的名称。②一名角色的回合结束时，若其是你〖明伐①〗记录的角色，则你视为对其依次使用X张〖明伐①〗记录的牌，然后移去“明伐”牌（X为其手牌数且至少为1，至多为5）。③一名角色死亡时，若其是你〖明伐①〗记录的角色，则你移去“明伐”牌。",
	dc_jiling: "纪灵",
	dcshuangren: "双刃",
	dcshuangren_info: "出牌阶段开始时，你可以和一名其他角色A进行拼点。若你赢，你选择一名角色B，或选择包含A在内的两名角色A和B（B的势力需与A相同），然后视为对被选择的角色使用一张【杀】（不计入次数限制）；若你没赢，则你本阶段内不能使用【杀】。",
	zhangxun: "张勋",
	suizheng: "随征",
	suizheng_info: "结束阶段，你可以选择一名角色Ａ，获得如下效果直到其下回合结束：①Ａ于下回合出牌阶段内使用【杀】的次数上限+1且无距离限制；②Ａ下回合的出牌阶段结束时，你可以选择一名此阶段内受到过Ａ造成的伤害的角色Ｂ，视为对Ｂ使用一张【杀】。",
	dc_liuba: "刘巴",
	dczhubi: "铸币",
	dczhubi_info: "当有♦牌因弃置而进入弃牌堆后，你可以令系统从牌堆/弃牌堆中检索一张【无中生有】，并将此牌置于牌堆顶。",
	dcliuzhuan: "流转",
	dcliuzhuan_tag: "转",
	dcliuzhuan_info: "锁定技。①其他角色于其回合内不于摸牌阶段而得到的牌称为“转”。②你不能成为实体牌中包含“转”的牌的目标。③当有“转”直接进入弃牌堆或经由处理区进入弃牌堆后，你获得之。",
	huzhao: "胡昭",
	midu: "弥笃",
	midu_info: "出牌阶段限一次。你可以选择一项：⒈废除任意个装备栏或判定区，并令一名角色摸等量的牌。⒉恢复一个已经被废除的装备栏或判定区，然后你获得〖活墨〗直到下回合开始。",
	xianwang: "贤望",
	xianwang_info: "锁定技。若你有被废除的装备栏，则其他角色至你的距离+1，你至其他角色的距离-1；若废除的装备栏数大于2，则改为距离+2/-2。",
	guanhai: "管亥",
	suoliang: "索粮",
	suoliang_info: "每回合限一次。当你对其他角色造成伤害后，你可以选择并展示其的至多X张牌（X为其体力上限且至多为5）。若这些牌中有♥或♣牌，则你获得这些牌；否则你弃置这些牌。",
	qinbao: "侵暴",
	qinbao_info: "锁定技。当你使用【杀】或普通锦囊牌时，你令所有手牌数不小于你的角色不能响应此牌。",
	dc_lvkuanglvxiang: "吕旷吕翔",
	dcshuhe: "数合",
	dcshuhe_info: "出牌阶段限一次，你可以展示一张手牌并获得一枚“爵”。若场上有与此牌点数相同的牌，则你获得这些牌；否则你将此牌交给一名其他角色。",
	dcliehou: "列侯",
	dcliehou_info: "锁定技。摸牌阶段开始时，你令额定摸牌数+X；然后此摸牌阶段结束时，你选择一项：⒈弃置X张牌。⒉失去1点体力（X为你的“爵”数+1且至多为5）。",
	yinfuren: "尹夫人",
	dcyingyu: "媵予",
	dcyingyu_info: "准备阶段开始时，你可以展示两名角色的各一张手牌。若这两张牌的花色不同，则你可以令一名角色获得另一名角色的展示牌。",
	dcyongbi: "拥嬖",
	dcyongbi_info: "限定技。出牌阶段，你可以将所有手牌交给一名其他男性角色。你将〖媵予〗的发动时机改为“准备阶段和结束阶段开始时”。然后若这些牌中包含的花色数：大于1，则你与其本局游戏的手牌上限+2；大于2，则当你或其于本局游戏内受到大于1的伤害时，此伤害-1。",
	dc_huangquan: "黄权",
	dcquanjian: "劝谏",
	dcquanjian_info: "出牌阶段每项各限一次。你可以选择一项流程并选择一名其他角色A：⒈令A对其攻击范围内的另一名角色B造成1点伤害。⒉令A将手牌数调整至手牌上限（至多摸至五张），且其本回合内不能使用手牌。然后A选择一项：⒈执行此流程。⒉本回合下次受到的伤害+1。",
	dctujue: "途绝",
	dctujue_info: "限定技。当你进入濒死状态时，你可以将所有牌交给一名其他角色。然后你回复等量的体力并摸等量的牌。",
	chengui: "陈珪",
	dcyingtu: "营图",
	dcyingtu_info: "每回合限一次。当你的上家/下家于摸牌阶段外得到牌后，你可以获得其一张牌，然后将一张牌交给你的下家/上家。若你给出的牌为装备牌，则其使用之。",
	dccongshi: "从势",
	dccongshi_info: "锁定技。一名角色使用的装备牌结算结束后，若其装备区内的牌数为全场最多，则你摸一张牌。",
	wanglie: "王烈",
	dcchongwang: "崇望",
	dcchongwang_info: "其他角色使用基本牌或普通锦囊牌时，若你是本局游戏内上一张被使用的牌的使用者，则你可以选择一项：⒈令其于此牌结算结束后收回此牌对应的所有实体牌；⒉取消此牌的所有目标。",
	dchuagui: "化归",
	dchuagui_info: "出牌阶段开始时，你可以选择至多X名有牌的其他角色（X为场上每个阵营中最大阵营的人数，且你的选择结果不展示）。这些角色同时选择一项：⒈交给你一张牌，⒉展示一张牌。若这些角色均选择选项二，则你获得所有展示牌。",
	gongsundu: "公孙度",
	dczhenze: "震泽",
	dczhenze_info: "弃牌阶段开始时，你可以选择一项：1.令所有手牌数与体力值大小关系与你不同的角色失去1点体力；2.令所有手牌数和体力值关系与你相同的角色回复1点体力。",
	dcanliao: "安辽",
	dcanliao_info: "出牌阶段限X次（X为群势力角色数）。你可以重铸一名角色的一张牌。",
	dc_yuejiu: "乐就",
	dccuijin: "催进",
	dccuijin_info: "当你或你攻击范围内的角色使用【杀】或【决斗】时，你可以弃置一张牌，令此牌的伤害基数+1。然后当此牌被目标角色抵消或无效或防止伤害后，你摸两张牌并对使用者造成1点伤害。",
	panghui: "庞会",
	dcyiyong: "异勇",
	dcyiyong_info: "当你对其他角色造成伤害时，若你有牌，你可以与其同时弃置至少一张牌。若你以此法弃置的牌的点数之和：不大于其，你摸X张牌；不小于其，此伤害+1（X为其以此法弃置的牌数）。",
	chenjiao: "陈矫",
	dcxieshoux: "协守/清严",
	dcxieshou: "协守",
	dcxieshou_info: "每回合限一次。当一名角色受到伤害后，若你至其的距离不大于2，你可以令你的手牌上限-1，然后其选择一项：1.回复1点体力；2.复原，摸两张牌。",
	dcqingyan: "清严",
	dcqingyan_info: "每回合限两次。当你成为其他角色使用黑色牌的目标后，若你的手牌数：小于体力值，你可以将手牌补至体力上限；不小于体力值，你可以弃置一张牌令你的手牌上限+1。",
	dcqizi: "弃子",
	dcqizi_info: "锁定技。你不能对至其的距离大于2且正在进行濒死流程的角色使用【桃】。",
	leibo: "雷薄",
	dcsilve: "私掠",
	dcsilve_info: "游戏开始时，你选择一名其他角色（对其他角色不可见），称为“私掠”角色。然后你获得以下效果：①当“私掠”角色造成伤害后，若你本回合未因此效果得到过受伤角色的牌，你可以获得受伤角色一张牌；②当“私掠”角色受到其他角色造成的伤害后，若伤害来源存活，你须对伤害来源使用一张【杀】（无距离限制），否则你弃置一张手牌。",
	dcshuaijie: "衰劫",
	dcshuaijie_info: "限定技。出牌阶段，若你的体力值与装备区里的牌数均大于“私掠”角色，或没有角色有“私掠”，你可以减1点体力上限，然后选择一项：1.获得“私掠”角色至多三张牌；2.从牌堆随机获得三张类型各不同的牌。最后将你的“私掠”角色改为你。",
	dc_sp_jiaxu: "新杀SP贾诩",
	dc_sp_jiaxu_prefix: "新杀SP",
	dcjianshu: "间书",
	dcjianshu_info: "出牌阶段限一次。你可以将一张黑色手牌交给一名其他角色，并选择另一名其他角色，你令前者与后者拼点。赢的角色随机弃置一张牌，没赢的角色失去1点体力。若有角色因此死亡，你令你〖间书〗于此阶段发动的次数上限+1。",
	dcyongdi: "拥嫡",
	dcyongdi_info: "限定技。出牌阶段，你可以选择一名男性角色，若其：体力上限最少，其加1点体力上限；体力值最少，其回复1点体力；手牌数最少，其摸X张牌（X为其体力上限且至多为5）。",
	liupi: "新杀刘辟",
	liupi_prefix: "新杀",
	dcjuying: "踞营",
	dcjuying_info: "出牌阶段结束时，若你于此阶段内使用【杀】的次数未达到上限，你可以选择任意项：1.下回合使用【杀】的次数上限+1；2.本回合手牌上限+2；3.摸三张牌。若你选择的项数超过了你的体力值，你弃置一张牌。",
	dc_huanghao: "新杀黄皓",
	dc_huanghao_prefix: "新杀",
	dcqinqing: "寝情",
	dcqinqing_info: "结束阶段，你可以弃置一名攻击范围内包含一号位的其他角色一张牌。然后若其手牌数大于一号位，你摸一张牌。",
	dccunwei: "存畏",
	dccunwei_info: "锁定技。当你成为其他角色使用的锦囊牌的目标后，若你是唯一目标，你摸一张牌；否则你弃置一张牌。",
	dc_zhaotongzhaoguang: "赵统赵广",
	dcqingren: "青刃",
	dcqingren_info: "结束阶段，你可以摸X张牌（X为你本回合发动〖翊赞〗的次数）。",
	dclongyuan: "龙渊",
	dclongyuan_info: "锁定技。一名角色的回合结束时，若你本局游戏已发动过至少三次〖翊赞〗，你摸两张牌并回复1点体力，修改〖翊赞〗。",
	zhenghun: "郑浑",
	dcqiangzhi: "强峙",
	dcqiangzhi_info: "出牌阶段限一次。你可以弃置你和一名其他角色的共计三张牌。然后若你与其之中有角色因此失去了三张牌，该角色对另一名角色造成1点伤害。",
	dcpitian: "辟田",
	dcpitian_info: "①当你的牌被弃置后，或当你受到伤害后，你的手牌上限+1。②结束阶段，若你的手牌数小于手牌上限，你可以摸至手牌上限（至多摸五张），然后重置因〖辟田①〗增加的手牌上限。",
	furongfuqian: "傅肜傅佥",
	dcxuewei: "血卫",
	dcxuewei_info: "结束阶段，你可以选择一名体力值不大于你的角色，然后你获得如下效果直到你的下回合开始时：当其受到伤害时，防止此伤害，然后你失去1点体力，你与其各摸一张牌（若该角色为你，则改为你摸一张牌）。",
	dcyuguan: "御关",
	dcyuguan_info: "一名角色的回合结束时，若你已损失的体力值为全场最多，你可以减1点体力上限，然后令至多X名角色将手牌摸至体力上限（X为你已损失的体力值）。",
	qinlang: "秦朗",
	dchaochong: "昊宠",
	dchaochong_info: "当你使用牌后，你可以将手牌摸至或弃置至你的手牌上限数（至多摸五张）。然后若你以此法：得到牌，你的手牌上限-1；失去牌，你的手牌上限+1。",
	dcjinjin: "矜谨",
	dcjinjin_info: "每回合限两次。当你造成或受到伤害后，你可以重置因〖昊宠〗增加或减少的手牌上限，令伤害来源弃置至多X张牌，然后你摸Y张牌（X为你以此法变化的手牌上限且至少为1，Y为X减其以此法弃置的牌数）。",
	xianglang: "向朗",
	dckanji: "勘集",
	dckanji_info: "出牌阶段限两次。你可以展示所有手牌，若花色均不同，你摸两张牌。然后若你的手牌因此包含了四种花色，你跳过下一个弃牌阶段。",
	dcqianzheng: "愆正",
	dcqianzheng_info: "每回合限两次。当你成为其他角色使用【杀】或普通锦囊牌的目标后，你可以重铸两张牌。若你以此法重铸的牌中没有与指定你为目标的牌类别相同的牌，你于此牌对应的实体牌进入弃牌堆后获得此牌对应的所有实体牌。",
	qiaorui: "桥蕤",
	dcaishou: "隘守",
	dcaishou_tag: "隘",
	dcaishou_info: "①结束阶段，你可以摸X张牌，称为“隘”（X为你的体力上限）。②准备阶段，你弃置所有“隘”，若你以此法弃置的牌数大于体力值且你的体力上限小于9，你加1点体力上限。③当你于回合外失去最后一张“隘”后，你减1点体力上限。",
	dcsaowei: "扫围",
	dcsaowei_info: "当一名其他角色使用【杀】结算结束后，若此牌的目标角色不包含你且均在你的攻击范围内，你可以将一张“隘”当做【杀】对所有目标角色使用。以此法转化的【杀】结算完毕后，若此【杀】造成过伤害，你获得此【杀】对应的实体牌。",
	yuantanyuanxiyuanshang: "袁谭袁尚袁熙",
	dcneifa: "内伐",
	dcneifa_info: "出牌阶段开始时，你可以摸三张牌，然后弃置一张牌。若你弃置的牌类型为：基本牌，本阶段你不能使用锦囊牌，且【杀】的使用次数上限+X且可以额外指定一名目标；锦囊牌，本阶段你不能使用基本牌，且使用普通锦囊牌选择目标时可以增加或减少一个目标（X为你发动〖内伐〗弃牌后手牌中因〖内伐〗而不能使用的牌的数量且最多为5。你以此法选择的额外目标均无距离限制）。",
	dc_sunziliufang: "新杀孙资刘放",
	dc_sunziliufang_prefix: "新杀",
	dcqinshen: "勤慎",
	dcqinshen_info: "弃牌阶段结束时，你可以摸X张牌（X为本回合未进入过弃牌堆的花色数）。",
	dcweidang: "伪谠",
	dcweidang_info: "其他角色的结束阶段，你可以将一张字数为X的牌置于牌堆底，然后获得牌堆里一张字数为X的牌（X为本回合未进入过弃牌堆的花色数）。若你能使用此牌，你使用之。",
	mengjie: "孟节",
	dcyinlu: "引路",
	dcyinlu_info: "①游戏开始时，你令三名角色依次分别获得“乐泉”、“藿溪”、“瘴气”标记（若场上角色数为2则改为令一名其他角色获得其中2枚，你获得剩余标记），然后你获得“芸香”标记并获得1点“芸香”值。②准备阶段/有〖引路〗标记的角色死亡时，你可以移动一名角色的1枚/其的所有〖引路〗标记。",
	dcyinlu_lequan: "乐泉",
	dcyinlu_lequan_info: "结束阶段，你可以弃置一张♦牌并回复1点体力。",
	dcyinlu_huoxi: "藿溪",
	dcyinlu_huoxi_info: "结束阶段，你可以弃置一张♥牌并摸两张牌。",
	dcyinlu_zhangqi: "瘴气",
	dcyinlu_zhangqi_info: "锁定技。结束阶段，你须弃置一张♠牌，否则失去1点体力。",
	dcyinlu_yunxiang: "芸香",
	dcyinlu_yunxiang_info: "①结束阶段，你可以弃置一张♣牌，获得1点“芸香”值。②当你受到伤害时，你可以扣减所有“芸香”值，减少等量的伤害。",
	dcyouqi: "幽栖",
	dcyouqi_info: "锁定技。当其他角色因〖引路〗标记弃置牌后，你有一定概率获得此牌。",
	dcyouqi_faq: "〖幽栖〗概率<br>",
	dcyouqi_faq_info: "当满足〖幽栖〗条件时，系统生成一个随机数X∈[0,1)。若X小于(1.25-0.25Y)，或幸运星模式已开启，你获得此牌（Y为你至该角色的距离）。",
	dc_sunhanhua: "孙寒华",
	dchuiling: "汇灵",
	dchuiling_info: "锁定技。当你使用牌时，若此牌颜色为弃牌堆中数量较少的颜色，你获得1枚“灵”标记。若弃牌堆中：红色牌数大于黑色牌数，你回复1点体力；黑色牌数大于红色牌数，你可以弃置一名其他角色的一张牌。",
	dcchongxu: "冲虚",
	dcchongxu_info: "限定技。出牌阶段，若“灵”数不小于4，你可以失去〖汇灵〗，增加等同于“灵”数的体力上限（至多增加场上人数的体力上限），然后获得〖踏寂〗和〖清荒〗。",
	dctaji: "踏寂",
	dctaji_info: "当你失去手牌后，根据你失去牌的原因执行以下效果：1.使用：你弃置其他角色一张牌；2.打出：你摸一张牌；3.弃置：你回复1点体力；4.其他：你下一次对其他角色造成伤害时，此伤害+1。",
	dcqinghuang: "清荒",
	dcqinghuang_info: "出牌阶段开始时，你可以减1点体力上限，然后你于本回合发动〖踏寂〗时额外随机执行一种效果。",
	dc_huojun: "霍峻",
	dcgue: "孤扼",
	dcgue_info: "每回合限一次。当你需要于回合外使用或打出【杀】或【闪】时，你可以发动此技能：你展示所有手牌，若其中【杀】和【闪】的数量之和不超过1，你视为使用或打出此牌。",
	dcsigong: "伺攻",
	dcsigong_info: "其他角色的回合结束时，若其于本回合内使用牌被响应过，你可以将手牌摸至或弃置至1，视为对其使用一张需使用X张【闪】抵消的【杀】，且此【杀】的伤害基数+1（X为你以此法弃置的牌数且至少为1）。当你以此法造成伤害后，该技能于本轮失效。",
	peiyuanshao: "裴元绍",
	oldmoyu: "没欲",
	oldmoyu_info: "出牌阶段每名角色限一次。你可以获得一名其他角色区域里的一张牌，然后其可以对你使用一张无距离限制的【杀】，且此【杀】伤害基数为X（X为你于本回合发动此技能的次数）。若此【杀】对你造成了伤害，你令此技能于本回合失效。",
	dcmoyu: "没欲",
	dcmoyu_info: "出牌阶段每名角色限一次。你可以获得一名其他角色区域里的一张牌，然后其可以对你使用一张无距离限制的【杀】。若此【杀】：未对你造成过伤害，你将此技能于此阶段下次获得的牌数改为两张；对你造成过伤害，你令此技能于本回合失效。",
	zhangchu: "张楚",
	dcjizhong: "集众",
	dcjizhong_info: "出牌阶段限一次。你可以令一名其他角色摸两张牌，然后其选择一项：1.若其没有“信众”标记，其获得“信众”标记；2.交给你三张手牌。",
	dcrihui: "日彗",
	dcrihui_info: "每回合限一次。当你使用普通锦囊牌或黑色基本牌结算结束后，若此牌的目标数为1且目标不为你，且其：没有“信众”，则所有有“信众”的角色依次视为对其使用一张与此牌牌名和属性相同的牌；有“信众”，则你可以获得其区域里的一张牌。",
	dcguangshi: "光噬",
	dcguangshi_info: "锁定技。准备阶段，若所有其他角色均有“信众”，你摸两张牌并失去1点体力。",
	dongwan: "董绾",
	dcshengdu: "生妒",
	dcshengdu_info: "回合开始时，你可以选择一名其他角色，令其获得1枚“生妒”标记。有“生妒”标记的角色于摸牌阶段得到牌后，你摸X张牌，然后其移去所有“生妒”标记（X为摸牌数乘以其拥有的“生妒”标记数）。",
	dcjieling: "介绫",
	dcjieling_info: "出牌阶段每种花色限一次，你可以将两张花色不同的手牌当无距离限制且无任何次数限制的【杀】使用。然后若此【杀】：造成了伤害，所有目标角色失去1点体力；未造成伤害，所有目标角色依次获得1枚“生妒”标记。",
	yuanyin: "袁胤",
	dcmoshou: "墨守",
	dcmoshou_info: "当你成为其他角色使用的黑色牌的目标后，你可以摸X张牌（X为你本局游戏此前发动过此技能的次数÷3的余数+1）。",
	dcyunjiu: "运柩",
	dcyunjiu_info: "一名角色死亡后，你可以弃置等同于其因死亡事件的规则而弃置的牌数，将其此次弃置的牌交给一名其他角色。然后你加1点体力上限并回复1点体力。",
	gaoxiang: "高翔",
	dcchiying: "驰应",
	dcchiying_info: "出牌阶段限一次。你可以选择一名体力不大于你的角色，令其攻击范围内的其他角色依次弃置一张牌。然后若你选择的角色不为你，其获得以此法弃置的牌中所有的基本牌。",
	zhangkai: "张闿",
	dcxiangshu: "相鼠",
	dcxiangshu_info: "其他角色的出牌阶段开始时，若其手牌数不小于其体力值，你可以选择一个不大于5的非负整数，然后你弃置一张牌或声明此数字。若如此做，此阶段结束时，若其手牌数与你选择的数字：差值不大于1，你获得其一张牌；相等，你对其造成1点伤害。",
	mengyou: "孟优",
	dcmanzhi: "蛮智",
	dcmanzhi_info: "①准备阶段，你可以选择一名其他角色并选择一项：1.令其交给你两张牌，然后其视为使用一张无距离限制的【杀】；2.获得其区域内至多两张牌，然后交给其等量的牌并摸一张牌。②结束阶段，若你的体力值与本回合准备阶段时的体力值相等，你可以执行你未于本回合执行过的〖蛮智①〗的分支。",
	dc_sunchen: "孙綝",
	dczigu: "自固",
	dczigu_info: "出牌阶段限一次。你可以弃置一张牌，然后获得场上的一张装备牌。若你没有因此获得其他角色的牌，你摸一张牌。",
	dczuowei: "作威",
	dczuowei_info: "当你于回合内使用牌时，你可以根据你的手牌数执行对应效果：大于X，令此牌不可被响应；等于X，对一名其他角色造成1点伤害；小于X，摸两张牌且不能于本回合再触发该选项（X为你装备区里牌的数量且至少为1）。",
	liuchongluojun: "刘宠骆俊",
	dcminze: "悯泽",
	dcminze_info: "①出牌阶段每名角色限一次。你可以将至多两张牌名不同的牌交给一名手牌数小于你的角色。②结束阶段，你将手牌摸至X张（X为你本回合因〖悯泽①〗失去过的牌的牌名数且至多为5）。",
	dcjini: "击逆",
	dcjini_info: "当你受到伤害后，你可以重铸至多Y张手牌（Y为你的体力上限减本回合你以此法重铸过的牌数）。若你以此法获得了【杀】，你可以对伤害来源使用一张无视距离且不可被响应的【杀】。",
	yuechen: "乐綝",
	dcporui: "破锐",
	dcporui_info: "每轮限一次。其他角色的结束阶段，你可以弃置一张牌并选择另一名于此回合内失去过牌的其他角色，你视为对其依次使用X+1张【杀】，然后你交给其X张手牌（X为其本回合失去的牌数且至多为5）。",
	dcgonghu: "共护",
	dcgonghu_info: "锁定技。①当你于回合外失去基本牌后，若你本回合内失去基本牌的数量大于1，你将〖破锐〗改为每轮限两次。②当你造成或受到伤害后，若你本回合内造成或受到的总伤害大于1，你删除〖破锐〗中的“，然后你交给其X张手牌”。③当你使用红色基本牌/红色普通锦囊牌时，若你已发动过〖共护①〗和〖共护②〗，则此牌不可被响应/可额外增加一个目标。",
	yue_caiwenji: "乐蔡琰",
	yue_caiwenji_prefix: "乐",
	dcshuangjia: "霜笳",
	dcshuangjia_tag: "胡笳",
	dcshuangjia_info: "锁定技。①游戏开始，你将你的手牌标记为“胡笳”。②你的“胡笳”牌不计入手牌上限。③其他角色至你的距离+X（X为你的“胡笳”数且至多为5）。",
	dcbeifen: "悲愤",
	dcbeifen_info: "锁定技。①当你失去牌后，若这些牌中有“胡笳”牌，你获得与你手牌中“胡笳”牌花色均不同的每种花色的牌各一张。②若你手牌中“胡笳”牌数小于不为“胡笳”牌的牌数，你使用牌无距离和次数限制。",
	dc_wuban: "吴班",
	dcyouzhan: "诱战",
	dcyouzhan_info: "锁定技。当其他角色于你的回合内失去一张牌后，你摸一张牌（不计入本回合的手牌上限），且其获得如下效果：1.其于此回合下一次受到的伤害+1；2.结束阶段，若其于此回合未受到过伤害，其摸X张牌（X为其此回合失去过牌的次数且至多为3）。",
	yue_zhoufei: "乐周妃",
	yue_zhoufei_prefix: "乐",
	dclingkong: "灵箜",
	dclingkong_tag: "箜篌",
	dclingkong_info: "锁定技。①游戏开始时，你将所有手牌标记为“箜篌”。②你的“箜篌”牌不计入手牌上限。③当你于一回合内首次于摸牌阶段外得到牌后，你将这些牌标记为“箜篌”。",
	dcxianshu: "贤淑",
	dcxianshu_info: "出牌阶段，你可以将一张“箜篌”正面向上交给一名其他角色，然后你摸X张牌（X为你与其的体力值之差且至多为5）。若此牌为红色，且该角色的体力值不大于你，则其回复1点体力；若此牌为黑色，且该角色的体力值不小于你，则其失去1点体力。",
	dc_zhangmancheng: "张曼成",
	dclvecheng: "掠城",
	dclvecheng_info: "出牌阶段限一次。你可以选择一名其他角色，你于本回合对其使用当前手牌中的【杀】无任何次数限制。然后回合结束时，其展示所有手牌，若其中有【杀】，其可以选择对你依次使用其中所有的【杀】。",
	dczhongji: "螽集",
	dczhongji_info: "当你使用牌时，若此牌无花色或你手牌区里没有与此牌花色相同的手牌，你可以将手牌摸至体力上限并弃置X张牌（X为本回合发动〖螽集〗的次数）。",
	dc_jiachong: "贾充",
	dcbeini: "悖逆",
	dcbeini_info: "出牌阶段限一次。你可以将手牌调整至体力上限，然后令一名角色视为对另一名角色使用一张【杀】，且这些角色的非锁定技失效直到回合结束。",
	dcshizong: "恃纵",
	dcshizong_info: "当你需要使用一张基本牌时，你可以交给一名其他角色X张牌，然后其可以将一张牌置于牌堆底，视为你使用之。若其不为当前回合角色，此技能失效直到回合结束（X为你本回合发动〖恃纵〗的次数）。",
	pangshanmin: "庞山民",
	dccaisi: "才思",
	dccaisi_info: "当你于回合内/回合外使用基本牌结算结束后，你可以从牌堆/弃牌堆随机获得一张非基本牌，然后若你本回合发动此技能的次数：小于你的体力上限，本回合你发动此技能获得的牌数+1；大于等于你的体力上限，本回合此技能失效。",
	dczhuoli: "擢吏",
	dczhuoli_info: "锁定技。一名角色的回合结束时，若你本回合使用或获得的牌数大于体力值，你加1点体力上限（不能超过游戏人数），回复1点体力。",
	yue_caiyong: "乐蔡邕",
	yue_caiyong_prefix: "乐",
	dcjiaowei: "焦尾",
	dcjiaowei_tag: "弦",
	dcjiaowei_info: "锁定技。①游戏开始时，你将所有手牌标记为“弦”。②你的“弦”牌不计入手牌上限。③当你受到伤害时，若来源的手牌数不大于你的“弦”牌数，防止此伤害。",
	dcfeibai: "飞白",
	dcfeibai_info: "每回合限一次。当你使用牌结算结束后，若你本回合使用过至少两张牌，你可以随机获得一张字数为X的牌。若你的“弦”数不大于X，你重置〖飞白〗（X为此牌与你使用的上一张牌的字数之和）。",
	kuaiqi: "蒯祺",
	dcliangxiu: "良秀",
	dcliangxiu_info: "出牌阶段，你可以弃置两张不同类型的牌，然后从两张与你弃置的牌类型均不同的牌中选择一张获得之（每阶段每种类型限一次）。",
	dcxunjie: "殉节",
	dcxunjie_info: "每轮每项限一次。一名角色的回合结束时，若你本回合于摸牌阶段外得到过牌，你可以选择一项：1.令一名角色将手牌数摸或弃置至与其体力值相同；2.令一名角色将体力回复或失去至与其手牌数相同。",
	dc_dongzhao: "董昭",
	dcyijia: "移驾",
	dcyijia_info: "一名角色受到伤害后，若你至其的距离不大于1，你可以将场上一张装备牌移动至其对应装备栏（替换原装备）。若其因此脱离了一名角色的攻击范围，你摸一张牌。",
	dcdingji: "定基",
	dcdingji_info: "准备阶段，你可以令一名角色将手牌摸或弃置至五张，然后其展示手牌。若牌名均不同，则其可以视为使用其中一张基本或普通锦囊牌。",
	yue_xiaoqiao: "乐小乔",
	yue_xiaoqiao_prefix: "乐",
	dcqiqin: "绮琴",
	dcqiqin_tag: "琴",
	dcqiqin_info: "锁定技。①游戏开始时，你将所有手牌标记为“琴”。②你的“琴”牌不计入手牌上限。③准备阶段，你获得位于弃牌堆的所有“琴”。",
	dcweiwan: "媦婉",
	dcweiwan_info: "出牌阶段限一次，你可以弃置一张“琴”并随机获得一名其他角色区域内花色与此牌不相同的牌各一张，若你获得了：一张牌，其失去1点体力；两张牌，本回合你对其使用牌无距离和次数限制；三张牌，本回合你不能对其使用牌。",
	dc_lingcao: "新杀凌操",
	dc_lingcao_prefix: "新杀",
	dcdufeng: "独锋",
	dcdufeng_info: "锁定技。出牌阶段开始时，你失去1点体力或废除一个装备栏，摸X张牌，然后你的攻击范围与使用【杀】的次数上限均为X直到回合结束（X为你已废除的装备栏数与损失的体力值之和，至多为你的体力上限）。",
	dc_sp_menghuo: "群孟获",
	dc_sp_menghuo_prefix: "群",
	dcmanwang: "蛮王",
	dcmanwang_info: "出牌阶段，你可以弃置任意张牌。然后你依次执行以下选项中的前X项：⒈获得〖叛侵〗。⒉摸一张牌。⒊回复1点体力。⒋摸两张牌并失去〖叛侵〗。",
	dcpanqin: "叛侵",
	dcpanqin_info: "出牌阶段或弃牌阶段结束时，你可将你于本阶段内弃置且位于弃牌堆的所有牌当做【南蛮入侵】使用。然后若此牌被使用时对应的实体牌数不大于此牌的目标数，则你执行并移除〖蛮王〗中的最后一个选项，然后加1点体力上限并回复1点体力。",
	dc_kongrong: "孔融",
	dckrmingshi: "名士",
	dckrmingshi_info: "锁定技，当你受到其他角色造成的伤害时，若其手牌数大于你，则其需弃置一张手牌，否则此伤害-1。",
	yue_daqiao: "乐大乔",
	yue_daqiao_prefix: "乐",
	dczixi: "姊希",
	dczixi_info: "①出牌阶段开始和结束时，你可以将一张“琴”当作一张无效果的【乐不思蜀】、【兵粮寸断】或【闪电】置于一名角色的判定区。②当你使用基本牌或普通锦囊牌指定唯一目标后，你可根据其判定区内的牌数执行对应项：1.令此牌对其额外结算一次；2.摸两张牌；3.弃置其判定区所有牌，对其造成3点伤害。",
	jiangfei: "蒋琬费祎",
	dcshengxi: "生息",
	dcshengxi_info: "弃牌阶段结束时，若你本回合未造成过伤害，你可以摸两张牌。",
	dcshoucheng: "守成",
	dcshoucheng_info: "每回合限一次，当一名角色于其回合外失去手牌后，若其没有手牌，你可令其摸两张牌。",
	dc_liuli: "刘理",
	dcfuli: "抚黎",
	dcfuli_info: "出牌阶段限一次，你可以展示手牌并弃置一种类别的所有手牌，然后摸X张牌（X为这些牌的牌名字数和且X至多为场上手牌数最多的角色的手牌数）。若你因此弃置了伤害类卡牌，则你可以选择一名角色，令其攻击范围-1直到你的下个回合开始。",
	dcdehua: "德化",
	dcdehua_info: "锁定技。①一轮游戏开始时，若有你可以使用的非延时类伤害类牌的牌名，你选择其中一个并视为使用之，然后你不能从手牌中使用此牌名的牌，然后若你已选择过所有的伤害类牌牌名，你失去〖德化〗。②你的手牌上限+Y（Y为你〖德化①〗选择过的牌名数）。",
	gongsunxiu: "公孙修",
	dcgangu: "干蛊",
	dcgangu_info: "锁定技。每回合限一次。当其他角色失去体力后，你摸两张牌，然后失去1点体力。",
	dckuizhen: "溃阵",
	dckuizhen_info: "出牌阶段限一次。你可以令一名手牌数或体力值大于你的角色视为对你使用一张【决斗】。若你：受到渠道为此牌的伤害，你观看其手牌并获得其中所有的【杀】（你使用以此法得到的牌无任何次数限制）；未受到渠道为此牌的伤害，其失去1点体力。",
	dc_jiangji: "蒋济",
	dcshiju: "势举",
	dcshiju_info: "其他角色的出牌阶段限一次。其可以交给你一张牌，若此牌为装备牌，你可以使用之，然后其本回合攻击范围+X（X为你装备区里的牌数）。若你以此法替换了装备，你与其各摸两张牌。",
	dcyingshi: "应时",
	dcyingshi_info: "每回合每项各限一次。当你使用普通锦囊牌指定目标后，你可令其中一个目标选择一项：⒈令你于此牌结算结束后视为对其使用一张与此牌牌名相同的牌；⒉弃置X张牌，此牌对其无效（X为你装备区里的牌数）。",
	dc_wangling: "王淩",
	dcjichou: "集筹",
	dcjichou_info: "出牌阶段结束时，若你于此阶段使用过牌且这些牌的牌名均不同，你可以观看位于弃牌堆中的这些牌，选择任意张牌并选择等量角色，将这些牌交给这些角色各一张，然后你摸X张牌（X为你本局游戏首次发动〖集筹〗给出的牌数）。",
	dcmouli: "谋立",
	dcmouli_info: "觉醒技。回合结束时，若你因〖集筹〗给出的牌的牌名总数大于5，你加1点体力上限并回复1点体力，然后获得〖自缚〗。",
	dczifu: "自缚",
	dczifu_info: "锁定技。出牌阶段开始时，你将手牌摸至体力上限（至多摸至五张）。若你以此法得到牌，你须选择手牌中不同牌名的牌各一张，然后弃置其余的手牌。",
	dc_simashi: "司马师",
	dcsanshi: "散士",
	dcsanshi_tag: "死士",
	dcsanshi_info: "锁定技。①第一轮游戏开始时，你令系统将牌堆中每个点数的随机一张牌永久标记为“死士”（“死士”对你可见）。②一名角色的回合结束时，若本回合有“死士”不因你使用或打出而进入弃牌堆，你于弃牌堆中获得这些牌。③你使用“死士”不能被响应。",
	dczhenrao: "震扰",
	dczhenrao_info: "每回合每名角色限一次。当你使用牌指定第一个目标后，若目标角色包含其他角色，或当其他角色使用牌指定你为目标后，你可以选择手牌数大于你的其中一个目标或此牌的使用者，然后对其造成1点伤害。",
	dcchenlve: "沉略",
	dcchenlve_info: "限定技。出牌阶段，你可以将牌堆、弃牌堆、场上及其他角色的手牌区里的所有“死士”置入处理区，然后你获得这些牌。若如此做，你获得如下效果：1.此回合结束时，你将这些牌移出游戏；2.当你死亡时，你将所有以此法移出游戏的“死士”置入弃牌堆。",
	dc_caoshuang: "新杀曹爽",
	dc_caoshuang_prefix: "新杀",
	dcjianzhuan: "渐专",
	dcjianzhuan_info: "锁定技。①当你于出牌阶段使用牌时，你选择此阶段未执行过的一项执行：⒈令一名角色弃置X张牌；⒉摸X张牌；⒊重铸X张牌；⒋弃置X张牌（X为此技能于本阶段的发动次数）。②出牌阶段结束时，若你本阶段执行过〖渐专①〗的所有选项，则你随机移除〖渐专①〗的一项。",
	dcjianzhuan_faq: "渐专概率",
	dcjianzhuan_faq_info: "<br>当系统随机选择要删除的选项时，“弃置X张牌”的选项概率固定为90%；剩余选项平分剩余的的10%概率。<br>如第一次删除时，删除弃牌选项概率为90%，其余三个选项被删除的概率均为3.33%，若删除了非弃牌选项，第二次删除时，删除弃牌选项的概率依旧是90%，其余两个选项被删除的概率均为5%。",
	dcfanshi: "返势",
	dcfanshi_info: "觉醒技，结束阶段，若〖渐专①〗剩余选项数小于2，则你执行三次X视为1的剩余选项，然后增加2点体力上限并回复2点体力，失去技能〖渐专〗并获得技能〖覆斗〗。",
	dcfudou: "覆斗",
	dcfudou_info: "当你使用黑色牌/红色牌指定唯一目标后，若该角色不为你，且其于本局游戏对你/未对你造成过伤害，则你可以与其各失去1点体力/各摸一张牌。",
	wupu: "吴普",
	dcduanti: "锻体",
	dcduanti_info: "锁定技。当你使用或打出牌结算结束后，若此牌是你本局游戏使用或打出过的牌中的第5X张牌（X∈N⁺），你回复1点体力，然后若你以此法增加的上限小于5，你加1点体力上限。",
	dcshicao: "识草",
	dcshicao_info: "出牌阶段，你可以声明一种类型，然后选择从牌堆顶或牌堆底摸一张牌。若此牌类型与你声明的类型不同，你观看牌堆另一端的两张牌，此技能本回合失效。",
	dc_lifeng: "李丰",
	dctunchu: "囤储",
	//dctunchu_info: "锁定技。①你的起始手牌数为游戏人数的四倍。②你的手牌不能被弃置。③准备阶段，若你的手牌数大于你的体力上限，则你本回合至多使用三张牌。",
	dctunchu_info: "锁定技。①游戏开始时，你将手牌数摸至游戏人数的四倍。②你的手牌不能被弃置。③准备阶段，若你的手牌数大于你的体力上限，则你本回合至多使用三张牌。",
	dcshuliang: "输粮",
	dcshuliang_info: "一名角色的回合结束时，你可以将任意张手牌交给任意名没有手牌的角色各一张，然后本次获得可以指定自己为目标的牌的角色可以依次选择是否选择本次获得的牌。",
};

export default translates;
