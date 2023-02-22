'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'guozhan',
		startBefore:function(){
			var playback=localStorage.getItem(lib.configprefix+'playback');
			for(var i in lib.characterPack.mode_guozhan){
				if(!get.config('onlyguozhan')&&!playback){
					if(lib.character[i.slice(3)]) continue;
				}
				lib.character[i]=lib.characterPack.mode_guozhan[i];
				if(!lib.character[i][4]){
					lib.character[i][4]=[];
				}
				if(!lib.translate[i]){
					lib.translate[i]=lib.translate[i.slice(3)];
				}
			}
			for(var i in lib.character){
				if(lib.character[i][1]=='shen'){
					if(lib.character[i][4]&&(lib.group.contains(lib.character[i][4][0])||lib.character[i][4][0]=='key')){
						lib.character[i][1]=lib.character[i][4][0];
					}
					else{
						lib.character[i][1]='qun';
					}
				}
			}
		},
		onreinit:function(){
			var pack=lib.characterPack.mode_guozhan;
			for(var i in pack){
				lib.character[i]=pack[i];
				if(!lib.character[i][4]){
					lib.character[i][4]=[];
				}
				if(!lib.translate[i]){
					lib.translate[i]=lib.translate[i.slice(3)];
				}
			}
			for(var i in lib.character){
				if(lib.character[i][1]=='shen'){
					if(lib.character[i][4]&&(lib.group.contains(lib.character[i][4][0])||lib.character[i][4][0]=='key')){
						lib.character[i][1]=lib.character[i][4][0];
					}
					else{
						lib.character[i][1]='qun';
					}
				}
			}
		},
		start:function(){
			"step 0"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
			}
			else if(_status.connectMode){
				game.waitForPlayer();
			}
			else{
				_status.mode=get.config('guozhan_mode');
				if(!['normal','yingbian','old','free'].contains(_status.mode)) _status.mode='normal';
				//决定牌堆
				switch(_status.mode){
					case 'old':lib.card.list=lib.guozhanPile_old.slice(0);break;
					case 'yingbian':
						lib.card.list=lib.guozhanPile_yingbian.slice(0);
						delete lib.translate.shuiyanqijunx_info_guozhan;
						lib.translate.gzwanyi_info='出牌阶段每项各限一次。你可以将一张带有“应变”标签的牌当做【逐近弃远】/【洞烛先机】/【水淹七军】/【出其不意】使用。';
						break;
					case 'normal':lib.card.list=lib.guozhanPile.slice(0);break;
				}
				if(_status.mode!='free') game.fixedPile=true;
				else{
					delete lib.translate.shuiyanqijunx_info_guozhan;
				}
				game.prepareArena();
				// game.delay();
				game.showChangeLog();
			}
			if(!_status.connectMode){
				_status.mode=get.config('guozhan_mode');
				if(_status.brawl&&_status.brawl.submode){
					_status.mode=_status.brawl.submode;
				}
			}
			"step 1"
			if(_status.connectMode){
				_status.mode=lib.configOL.guozhan_mode;
				if(!['normal','yingbian','old'].contains(_status.mode)) _status.mode='normal';
				//决定牌堆
				switch(_status.mode){
					case 'old':lib.card.list=lib.guozhanPile_old.slice(0);break;
					case 'yingbian':
						lib.card.list=lib.guozhanPile_yingbian.slice(0);
						delete lib.translate.shuiyanqijunx_info_guozhan;
						lib.translate.gzwanyi_info='出牌阶段每项各限一次。你可以将一张带有“应变”标签的牌当做【逐近弃远】/【洞烛先机】/【水淹七军】/【出其不意】使用。'
						break;
					default:lib.card.list=lib.guozhanPile.slice(0);break;
				}
				game.fixedPile=true;
				game.broadcastAll(function(mode){
					_status.mode=mode;
					if(mode=='yingbian'){
						delete lib.translate.shuiyanqijunx_info_guozhan;
					}
					for(var i=0;i<game.players.length;i++){
						game.players[i].node.name.hide();
						game.players[i].node.name2.hide();
					}
					var pack=lib.characterPack.mode_guozhan;
					for(var i in pack){
						lib.character[i]=pack[i];
						if(!lib.character[i][4]){
							lib.character[i][4]=[];
						}
						if(!lib.translate[i]){
							lib.translate[i]=lib.translate[i.slice(3)];
						}
					}
					for(var i in lib.character){
						if(lib.character[i][1]=='shen'){
							if(lib.character[i][4]&&(lib.group.contains(lib.character[i][4][0])||lib.character[i][4][0]=='key')){
								lib.character[i][1]=lib.character[i][4][0];
							}
							else{
								lib.character[i][1]='qun';
							}
						}
					}
					lib.characterReplace={};
				},_status.mode);
				game.randomMapOL();
			}
			else{
				lib.characterReplace={};
				for(var i=0;i<game.players.length;i++){
					game.players[i].node.name.hide();
					game.players[i].node.name2.hide();
					game.players[i].getId();
				}
				if(_status.brawl&&_status.brawl.chooseCharacterBefore){
					_status.brawl.chooseCharacterBefore();
				}
				game.chooseCharacter();
			}
			"step 2"
			//game.broadcastAll(function(){
			//	lib.inpile.removeArray(['gz_haolingtianxia','gz_kefuzhongyuan','gz_guguoanbang','gz_wenheluanwu']);
			//});
			if(ui.coin){
				_status.coinCoeff=get.coinCoeff([game.me.name1,game.me.name2]);
			}
			var player;
			if(_status.cheat_seat){
				var seat=_status.cheat_seat.link;
				if(seat==0){
					player=game.me;
				}
				else{
					player=game.players[game.players.length-seat];
				}
				if(!player) player=game.me;
				delete _status.cheat_seat;
			}
			else{
				player=game.players[Math.floor(Math.random()*game.players.length)];
			}
			event.playerx=player;
			event.trigger('gameStart');

			"step 3"
			game.gameDraw(event.playerx);
			game.broadcastAll(function(player){
				for(var i=0;i<game.players.length;i++){
					game.players[i].name='unknown'+get.distance(player,game.players[i],'absolute');
					game.players[i].node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate[game.players[i].name]),game.players[i]);
					// if(game.players[i]==game.me){
					// 	lib.translate[game.players[i].name]+='（你）';
					// }
				}
			},event.playerx);

			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:game.players[i].name,
					translate:lib.translate[game.players[i].name],
					name1:players[i].name1,
					name2:players[i].name2,
				});
			}
			_status.videoInited=true,
			game.addVideo('init',null,info);
			if(_status.mode=='mingjiang'){
				game.showIdentity(true);
			}
			else{
				for(var i=0;i<game.players.length;i++){
					game.players[i].ai.shown=0;
				}
			}
			if(_status.connectMode&&lib.configOL.change_card) game.replaceHandcards(game.players.slice(0));
			game.phaseLoop(event.playerx);
		},
		card:{
			junling1:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			junling2:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			junling3:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			junling4:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			junling5:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			junling6:{
				type:'junling',
				vanish:true,
				derivation:'guozhan',
			},
			zhulian_card:{
				cardimage:'wuzhong',
			},
		},
		aozhanRank:{
			'8':['gz_panjun'],
			'7':['gz_zhongyan','gz_yangyan'],
			'6':[],
			'5':[
				'gz_lukang','gz_caoren','gz_lvfan',
				'gz_machao','gz_ganfuren','gz_madai',
				'gz_jiling','gz_pangde','gz_huangzu',
			],
			'4':[
				'gz_re_lidian','gz_yuejin','gz_huangzhong',
				'gz_menghuo','gz_sunshangxiang','gz_lvmeng',
				'gz_lvbu','gz_xiahouba','gz_chendao',
			],
			'3':[
				'gz_simayi','gz_luxun','gz_wuguotai',
				'gz_caiwenji','gz_shibao','gz_xuyou',
				'gz_zhugeke','gz_re_nanhualaoxian','gz_zhouyi',
			],
			'2':[
				'gz_re_lusu','gz_zhangzhang',
				'gz_jin_simashi','gz_jin_zhangchunhua','gz_zhugejin',
			],
			'1':[
				'gz_caocao','gz_guojia','gz_xiahoudun',
				'gz_xunyu','gz_caopi','gz_liubei',
				'gz_fazheng','gz_dongzhuo','gz_yuji',
				'gz_liqueguosi','gz_huanggai','gz_re_xushu',
				'gz_panjun','gz_yangxiu',
			],
		},
		guozhanRank:{
			'8':[
				'gz_xunyou','gz_re_lidian','gz_caopi',
				'gz_shamoke','gz_lifeng','gz_wangping',
				'gz_xiaoqiao','gz_zhoutai','gz_lvfan',
				'gz_beimihu','gz_mateng','gz_jiaxu',
				'gz_jin_wangyuanji','gz_huaxin','gz_duyu',
				'gz_zhonghui','gz_xuyou','gz_simazhao',
			],
			'7':[
				'gz_zhanghe','gz_jianggan','gz_simayi',
				'gz_weiyan','gz_huangyueying','gz_zhugeliang',
				'gz_lingtong','gz_sunshangxiang','gz_sunce',
				'gz_re_yuanshao','gz_yuanshu','gz_hetaihou',
				'gz_jin_simashi','gz_sp_duyu','gz_shibao',
				'gz_gongsunyuan','gz_panjun','gz_re_nanhualaoxian',
			],
			'6':[
				'gz_zhenji','gz_guojia','gz_yujin',
				'gz_jiangwei','gz_zhangfei','gz_sp_zhugeliang',
				'gz_zhouyu','gz_lingcao','gz_daqiao','gz_dingfeng',
				'gz_yuji','gz_caiwenji','gz_diaochan','gz_zuoci',
				'gz_key_ushio','gz_jin_simazhao','gz_dongzhao',
				'gz_liuba','gz_zhouyi','gz_re_xunchen',
				'gz_fuwan','gz_zhugejin','gz_yangxiu',
				'gz_yangyan',
			],
			'5':[
				'gz_zhangliao','gz_caocao','gz_xuhuang',
				'gz_liushan','gz_pangtong','gz_zhaoyun',
				'gz_re_lusu','gz_sunquan','gz_ganning',
				'gz_zhangxiu','gz_liqueguosi','gz_huatuo',
				'gz_zhanghuyuechen','gz_re_xushu','gz_mifangfushiren',
				'gz_huangzu','gz_weiguan','gz_miheng',
				'gz_wenqin','gz_zumao','gz_xuangongzhu',
			],
			'4':[
				'gz_dianwei','gz_dengai','gz_xunyu',
				'gz_madai','gz_liubei','gz_mifuren',
				'gz_wuguotai','gz_luxun','gz_taishici',
				'gz_zhangjiao','gz_pangde','gz_liuqi',
				'gz_jin_zhangchunhua','gz_zongyu','gz_shixie',
				'gz_jin_yanghuiyu','gz_tangzi','gz_yanbaihu',
				'gz_wujing','gz_zhugeke','gz_sunchen',
				'gz_liaohua','gz_zhongyan','gz_xinchang',
			],
			'3':[
				'gz_xiahoudun','gz_yuejin','gz_caoren',
				'gz_machao','gz_masu','gz_fazheng',
				'gz_zhangzhang','gz_lvmeng','gz_huanggai',
				'gz_jiling','gz_lvbu','gz_dongzhuo',
				'gz_jin_xiahouhui','gz_simazhou','gz_zhanglu',
				'gz_chendao','gz_yangzhi',
			],
			'2':[
				'gz_cuimao','gz_xiahouyuan','gz_caohong',
				'gz_zhurong','gz_zhurong','gz_jiangfei',
				'gz_xusheng','gz_luyusheng','gz_sunjian',
				'gz_zhangren','gz_kongrong','gz_yanwen',
				'gz_jin_simayi','gz_mengda','gz_xiahouba',
			],
			'1':[
				'gz_zangba','gz_bianfuren','gz_xuzhu',
				'gz_menghuo','gz_ganfuren','gz_guanyu',
				'gz_lukang','gz_jiangqing','gz_chendong',
				'gz_zoushi','gz_panfeng','gz_tianfeng',
				'gz_sufei',
			],
		},
		characterSort:{
			mode_guozhan:{
				guozhan_default:["gz_caocao","gz_simayi","gz_xiahoudun","gz_zhangliao","gz_xuzhu","gz_guojia","gz_zhenji","gz_xiahouyuan","gz_zhanghe","gz_xuhuang","gz_caoren","gz_dianwei","gz_xunyu","gz_caopi","gz_yuejin","gz_liubei","gz_guanyu","gz_zhangfei","gz_zhugeliang","gz_zhaoyun","gz_machao","gz_huangyueying","gz_huangzhong","gz_weiyan","gz_pangtong","gz_sp_zhugeliang","gz_liushan","gz_menghuo","gz_zhurong","gz_ganfuren","gz_sunquan","gz_ganning","gz_lvmeng","gz_huanggai","gz_zhouyu","gz_daqiao","gz_luxun","gz_sunshangxiang","gz_sunjian","gz_xiaoqiao","gz_taishici","gz_zhoutai","gz_re_lusu","gz_zhangzhang","gz_dingfeng","gz_huatuo","gz_lvbu","gz_diaochan","gz_re_yuanshao","gz_yanwen","gz_jiaxu","gz_pangde","gz_zhangjiao","gz_caiwenji","gz_mateng","gz_kongrong","gz_jiling","gz_tianfeng","gz_panfeng","gz_zoushi",],
				guozhan_zhen:["gz_dengai","gz_caohong","gz_jiangfei","gz_jiangwei","gz_xusheng","gz_jiangqing","gz_hetaihou","gz_yuji"],
				guozhan_shi:[,"gz_re_lidian","gz_zangba","gz_madai","gz_mifuren","gz_sunce","gz_chendong","gz_sp_dongzhuo","gz_zhangren"],
				guozhan_bian:["gz_liqueguosi","gz_zuoci","gz_bianfuren","gz_xunyou","gz_lingtong","gz_lvfan","gz_masu","gz_shamoke",],
				guozhan_quan:["gz_cuimao","gz_yujin","gz_wangping","gz_fazheng","gz_wuguotai","gz_lukang","gz_yuanshu","gz_zhangxiu"],
				guozhan_jun:["gz_jun_caocao","gz_jun_sunquan","gz_jun_liubei","gz_jun_zhangjiao"],
				guozhan_jin:['gz_jin_simayi','gz_jin_simazhao','gz_jin_simashi','gz_jin_zhangchunhua','gz_jin_wangyuanji','gz_jin_xiahouhui','gz_duyu','gz_zhanghuyuechen','gz_jin_yanghuiyu','gz_simazhou','gz_shibao','gz_weiguan','gz_zhongyan','gz_yangyan','gz_zuofen','gz_xinchang','gz_xuangongzhu','gz_yangzhi'],
				guozhan_single:['gz_re_xushu','gz_yanbaihu','gz_wujing','gz_dongzhao','gz_huangzu','gz_zhugeke','gz_liuba','gz_zhuling'],
				guozhan_double:['gz_tangzi','gz_liuqi','gz_mengda','gz_mifangfushiren','gz_zhanglu','gz_shixie','gz_xuyou','gz_xiahouba','gz_panjun','gz_xf_sufei','gz_wenqin','gz_pengyang'],
				guozhan_yexinjia:['gz_zhonghui','gz_simazhao','gz_gongsunyuan','gz_sunchen'],
				guozhan_zongheng:['gz_huaxin','gz_luyusheng','gz_zongyu','gz_miheng','gz_fengxi','gz_dengzhi','gz_re_xunchen','gz_dc_yanghu'],
				guozhan_others:["gz_lingcao","gz_lifeng","gz_beimihu","gz_jianggan","gz_key_ushio","gz_sp_duyu","gz_re_nanhualaoxian","gz_zhouyi","gz_lvlingqi","gz_liaohua","gz_zhugejin","gz_yangxiu","gz_chendao","gz_fuwan","gz_zumao"],
			}
		},
		characterPack:{
			mode_guozhan:{
				gz_shibing1wei:['male','wei',0,[],['unseen']],
				gz_shibing2wei:['female','wei',0,[],['unseen']],
				gz_shibing1shu:['male','shu',0,[],['unseen']],
				gz_shibing2shu:['female','shu',0,[],['unseen']],
				gz_shibing1wu:['male','wu',0,[],['unseen']],
				gz_shibing2wu:['female','wu',0,[],['unseen']],
				gz_shibing1qun:['male','qun',0,[],['unseen']],
				gz_shibing2qun:['female','qun',0,[],['unseen']],
				gz_shibing1jin:['male','jin',0,[],['unseen']],
				gz_shibing2jin:['female','jin',0,[],['unseen']],
				gz_shibing1ye:['male','ye',0,[],['unseen']],
				gz_shibing2ye:['female','ye',0,[],['unseen']],
				gz_shibing1key:['male','key',0,[],['unseen']],
				gz_shibing2key:['female','key',0,[],['unseen']],

				gz_zhonghui:['male','ye',4,['gzquanji','gzpaiyi'],['gzskin']],
				gz_simazhao:['male','ye',3,['gzzhaoxin','gzsuzhi'],['gzskin']],
				gz_gongsunyuan:['male','ye',4,['gzhuaiyi','gzzisui'],['gzskin']],
				gz_sunchen:['male','ye',4,['gzshilu','gzxiongnve']],
				gz_tangzi:['male','wu',4,['gzxingzhao'],['doublegroup:wu:wei','gzskin']],
				gz_mengda:['male','wei',4,['qiuan','liangfan'],['doublegroup:wei:shu']],
				gz_liuqi:['male','qun',3,['gzwenji','gztunjiang'],['doublegroup:qun:shu','gzskin']],
				gz_mifangfushiren:['male','shu',4,['mffengshi'],['doublegroup:shu:wu']],
				gz_shixie:['male','qun',3,['gzbiluan','gzrelixia'],['doublegroup:qun:wu','gzskin']],
				gz_zhanglu:['male','qun',3,['gzbushi','gzmidao'],['doublegroup:qun:wei','gzskin']],
				gz_dongzhao:['male','wei',3,['quanjin','zaoyun']],
				gz_re_xushu:['male','shu',4,['gzzhuhai','gzpozhen','gzjiancai'],['gzskin']],
				gz_wujing:['male','wu',4,['donggui','fengyang'],['gzskin']],
				gz_yanbaihu:['male','qun',4,['gzzhidao','gzyjili'],['gzskin']],
				gz_xuyou:['male','wei',3,['gzchenglve','gzshicai'],['doublegroup:wei:qun','gzskin']],
				gz_xiahouba:['male','shu',4,['gzbaolie'],['doublegroup:shu:wei','gzskin']],
				gz_panjun:['male','wu',3,['gzcongcha','xinfu_gongqing'],['doublegroup:wu:shu','gzskin']],
				gz_huangzu:['male','qun',4,['gzxishe'],['gzskin']],
				gz_zhugeke:['male','wu',3,['aocai','gzduwu'],['gzskin']],
				gz_wenqin:['male','wei',4,['gzjinfa'],['doublegroup:wei:wu','gzskin']],
				gz_xf_sufei:['male','wu',4,['gzlianpian'],['doublegroup:wu:qun','gzskin']],
				gz_liuba:['male','shu',3,['gztongduo','qingyin'],['gzskin']],
				gz_pengyang:['male','shu',3,['daming','xiaoni'],['doublegroup:shu:qun','gzskin']],
				gz_zhuling:['male','wei',4,['gzjuejue','gzfangyuan'],['gzskin']],

				gz_caocao:['male','wei',4,['jianxiong']],
				gz_simayi:['male','wei',3,['fankui','guicai']],
				gz_xiahoudun:['male','wei',4,['reganglie']],
				gz_zhangliao:['male','wei',4,['new_retuxi']],
				gz_xuzhu:['male','wei',4,['gzluoyi']],
				gz_guojia:['male','wei',3,['tiandu','gzyiji'],['gzskin']],
				gz_zhenji:['female','wei',3,['luoshen','qingguo'],['gzskin']],
				gz_xiahouyuan:['male','wei',5,['gzshensu']],
				gz_zhanghe:['male','wei',4,['qiaobian']],
				gz_xuhuang:['male','wei',4,['new_duanliang']],
				gz_caoren:['male','wei',4,['gzjushou']],
				gz_dianwei:['male','wei',4,['gzqiangxi']],
				gz_xunyu:['male','wei',3,['quhu','gzjieming']],
				gz_caopi:['male','wei',3,['xingshang','gzfangzhu'],['gzskin']],
				gz_yuejin:['male','wei',4,['gzxiaoguo'],['gzskin']],

				gz_liubei:['male','shu',4,['rerende']],
				gz_guanyu:['male','shu',5,['new_rewusheng']],
				gz_zhangfei:['male','shu',4,['gzpaoxiao']],
				gz_zhugeliang:['male','shu',3,['guanxing','new_kongcheng'],['gzskin']],
				gz_zhaoyun:['male','shu',4,['new_longdan']],
				gz_machao:['male','shu',4,['mashu','new_tieji']],
				gz_huangyueying:['female','shu',3,['jizhi','qicai'],['gzskin']],
				gz_huangzhong:['male','shu',4,['gzliegong']],
				gz_weiyan:['male','shu',4,['xinkuanggu']],
				gz_pangtong:['male','shu',3,['lianhuan','oldniepan']],
				gz_sp_zhugeliang:['male','shu',3,['huoji','bazhen','kanpo'],['gzskin']],
				gz_liushan:['male','shu',3,['xiangle','fangquan']],
				gz_menghuo:['male','shu',4,['huoshou','rezaiqi']],
				gz_zhurong:['female','shu',4,['juxiang','lieren']],
				gz_ganfuren:['female','shu',3,['new_shushen','shenzhi'],['gzskin']],
				gz_yuji:['male','qun',3,['qianhuan'],['gzskin']],

				gz_sunquan:['male','wu',4,['gzzhiheng']],
				gz_ganning:['male','wu',4,['qixi']],
				gz_lvmeng:['male','wu',4,['new_keji','new_mouduan']],
				gz_huanggai:['male','wu',4,['new_kurou']],
				gz_zhouyu:['male','wu',3,['reyingzi','refanjian'],['gzskin']],
				gz_daqiao:['female','wu',3,['guose','liuli']],
				gz_luxun:['male','wu',3,['gzqianxun','duoshi'],['gzskin']],
				gz_sunshangxiang:['female','wu',3,['jieyin','gzxiaoji']],
				gz_sunjian:['male','wu',5,['yinghun']],
				gz_xiaoqiao:['female','wu',3,['gztianxiang','gzhongyan'],['gzskin']],
				gz_taishici:['male','wu',4,['tianyi']],
				gz_zhoutai:['male','wu',4,['buqu','new_fenji']],
				gz_re_lusu:['male','wu',3,['haoshi','dimeng']],
				gz_zhangzhang:['male','wu',3,['zhijian','guzheng']],
				gz_dingfeng:['male','wu',4,['reduanbing','refenxun'],['gzskin']],

				gz_huatuo:['male','qun',3,['new_chuli','jijiu']],
				gz_lvbu:['male','qun',5,['gzwushuang'],['gzskin']],
				gz_diaochan:['female','qun',3,['lijian','biyue'],['gzskin']],
				gz_re_yuanshao:['male','qun',4,['new_luanji'],['gzskin']],
				gz_yanwen:['male','qun',4,['shuangxiong']],
				gz_jiaxu:['male','qun',3,['wansha','luanwu','gzweimu'],['gzskin']],
				gz_pangde:['male','qun',4,['mashu','jianchu']],
				gz_zhangjiao:['male','qun',3,['leiji','guidao']],
				gz_caiwenji:['female','qun',3,['beige','gzduanchang']],
				gz_mateng:['male','qun',4,['mashu2','xiongyi']],
				gz_kongrong:['male','qun',3,['gzmingshi','lirang']],
				gz_jiling:['male','qun',4,['shuangren']],
				gz_tianfeng:['male','qun',3,['sijian','gzsuishi']],
				gz_panfeng:['male','qun',4,['gzkuangfu'],['gzskin']],
				gz_zoushi:['female','qun',3,['huoshui','new_qingcheng']],

				gz_dengai:['male','wei',4,['tuntian','ziliang','gzjixi'],['gzskin','die_audio']],
				gz_caohong:['male','wei',4,['gzhuyuan','heyi'],['gzskin']],
				gz_jiangfei:['male','shu',3,['reshengxi','gzshoucheng']],
				gz_jiangwei:['male','shu',4,['tiaoxin','yizhi','tianfu'],['gzskin']],
				gz_xusheng:['male','wu',4,['gzyicheng'],['gzskin']],
				gz_jiangqing:['male','wu',4,['gzshangyi','niaoxiang']],
				gz_hetaihou:['female','qun',3,['zhendu','qiluan'],['gzskin']],

				gz_re_lidian:['male','wei',3,['xunxun','wangxi']],
				gz_zangba:['male','wei',4,['rehengjiang']],
				gz_madai:['male','shu',4,['mashu2','qianxi'],['gzskin']],
				gz_mifuren:['female','shu',3,['gzguixiu','gzcunsi']],
				gz_sunce:['male','wu',4,['jiang','yingyang','baka_hunshang'],['gzskin']],
				gz_chendong:['male','wu',4,['duanxie','fenming']],
				gz_sp_dongzhuo:['male','qun',4,['hengzheng','baoling']],
				gz_zhangren:['male','qun',4,['chuanxin','fengshi']],

				gz_jun_liubei:['male','shu',4,['zhangwu','jizhao','shouyue','wuhujiangdaqi']],
				gz_jun_zhangjiao:['male','qun',4,['wuxin','hongfa','wendao','huangjintianbingfu']],
				gz_jun_sunquan:['male','wu',4,['jiahe','lianzi','jubao','yuanjiangfenghuotu']],

				gz_liqueguosi:['male','qun',4,['gzxiongsuan']],
				gz_zuoci:['male','qun',3,['yigui','jihun'],['gzskin']],
				gz_bianfuren:['female','wei',3,['wanwei','gzyuejian']],
				gz_xunyou:['male','wei',3,['gzqice','zhiyu'],['gzskin']],
				gz_lingtong:['male','wu',4,['xuanlve','yongjin'],['gzskin']],
				gz_lvfan:['male','wu',3,['xindiaodu','gzdiancai']],
				gz_masu:['male','shu',3,['sanyao','gzzhiman'],['gzskin']],
				gz_shamoke:['male','shu',4,['gzjili'],['gzskin']],
				
				gz_lingcao:['male','wu',4,['dujin']],
				gz_lifeng:['male','shu',3,['tunchu','shuliang']],
				gz_beimihu:["female","qun",3,["hmkguishu","hmkyuanyu"]],
				gz_jianggan:["male","wei",3,["weicheng","daoshu"]],
				gz_sp_duyu:['male','qun',4,['spwuku','spmiewu']],
				gz_huaxin:['male','wei',3,['wanggui','xibing']],
				gz_luyusheng:['female','wu',3,['zhente','zhiwei']],
				gz_zongyu:['male','shu',3,['zyqiao','chengshang']],
				gz_miheng:['male','qun',3,['gzrekuangcai','gzshejian'],['gzskin']],
				gz_fengxi:['male','wu',3,['gzyusui','gzboyan'],['gzskin']],
				gz_dengzhi:['male','shu',3,['gzjianliang','gzweimeng'],['gzskin']],
				gz_re_nanhualaoxian:['male','qun',4,['gzgongxiu','gzjinghe']],
				gz_zhouyi:['female','wu',3,['gzzhukou','gzduannian','gzlianyou']],
				gz_re_xunchen:['male','qun',3,['gzfenglve','gzanyong']],
				gz_lvlingqi:['female','qun',4,['guowu','gzshenwei','gzzhuangrong']],
				gz_dc_yanghu:['male','wei',3,['gzdeshao','gzmingfa']],
				
				gz_cuimao:['male','wei',3,['gzzhengbi','gzfengying'],[]],
				gz_yujin:['male','wei',4,['gzjieyue'],['gzskin']],
				gz_wangping:['male','shu',4,['jianglue'],['gzskin']],
				gz_fazheng:['male','shu',3,['gzxuanhuo','gzenyuan'],['gzskin']],
				gz_wuguotai:['female','wu',3,['gzbuyi','ganlu'],['gzskin']],
				gz_lukang:['male','wu',3,['keshou','zhuwei'],['gzskin']],
				gz_yuanshu:['male','qun',4,['gzweidi','gzyongsi'],['gzskin']],
				gz_zhangxiu:['male','qun',4,['gzfudi','gzcongjian'],['gzskin']],
				gz_jun_caocao:['male','wei',4,['jianan','huibian','gzzongyu','wuziliangjiangdao'],[]],
				
				gz_jin_zhangchunhua:['female','jin',3,['gzhuishi','gzqingleng']],
				gz_jin_simayi:['male','jin',3,['gzquanbian','smyyingshi','gzxiongzhi']],
				gz_jin_wangyuanji:['female','jin',3,['yanxi']],
				gz_jin_simazhao:['male','jin',3,['zhaoran','gzchoufa']],
				gz_jin_xiahouhui:['female','jin',3,['jyishi','shiduo']],
				gz_jin_simashi:['male','jin',5,['gzyimie','gztairan']],
				gz_duyu:['male','jin',4,['gzsanchen','gzpozhu']],
				gz_zhanghuyuechen:['male','jin',4,['xijue']],
				gz_jin_yanghuiyu:['female','jin',3,['ciwei','gzcaiyuan']],
				gz_simazhou:['male','jin',4,['recaiwang','naxiang']],
				gz_shibao:['male','jin',4,['gzzhuosheng']],
				gz_weiguan:['male','jin',3,['zhongyun','shenpin']],
				gz_zhongyan:['female','jin',3,['gzbolan','yifa']],
				gz_yangyan:['female','jin',3,['gzxuanbei','xianwan']],
				gz_zuofen:['female','jin',3,['gzzhaosong','gzlisi']],
				gz_xuangongzhu:['female','jin',3,['qimei','ybzhuiji']],
				gz_xinchang:['male','jin',3,['canmou','congjian']],
				gz_yangzhi:['female','jin',3,['gzwanyi','gzmaihuo']],

				gz_liaohua:['male','shu',4,['gzdangxian']],
				gz_zhugejin:['male','wu',3,['gzhuanshi','gzhongyuan','gzmingzhe']],
				gz_yangxiu:['male','wei',3,['gzdanlao','gzjilei']],
				gz_zumao:['male','wu',4,['yinbing','juedi']],
				gz_fuwan:['male','qun',4,['twmoukui']],
				gz_chendao:["male","shu",4,["drlt_wanglie"],[]],

				gz_key_ushio:['female','key',3,['ushio_huanxin','ushio_xilv'],['doublegroup:key:wei:shu:wu:qun:jin']],
			}
		},
		skill:{
			//杨芷
			gzwanyi:{
				audio:'wanyi',
				enable:'phaseUse',
				filter:function(event,player){
					if(player.getStorage('gzwanyi2').length>=4) return false;
					if(_status.mode=='yingbian') return player.hasCard(function(i){
						return get.is.yingbian(i);
					},'hs');
					return player.hasCard(function(card){
						return card.hasTag('lianheng');
					},'hs');
				},
				chooseButton:{
					dialog:function(event,player){
						var list=['lianjunshengyan','huoshaolianying','xietianzi','lulitongxin'];
						if(_status.mode=='yingbian') list=['zhujinqiyuan','chuqibuyi','shuiyanqijunx','dongzhuxianji'];
						list.removeArray(player.getStorage('gzwanyi2'));
						return ui.create.dialog('婉嫕',[list,'vcard'],'hidden');
					},
					filter:function(button,player){
						return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
					},
					check:function(button){
						return _status.event.player.getUseValue({name:button.link[2]});
					},
					backup:function(links){
						return {
							audio:'wanyi',
							popname:true,
							viewAs:{
								name:links[0][2],
							},
							filterCard:function(card){
								if(_status.mode=='yingbian') return get.is.yingbian(card);
								return card.hasTag('lianheng');
							},
							check:function(card){
								return 1/Math.max(1,get.value(card));
							},
							position:'hs',
							onuse:function(links,player){
								if(!player.storage.gzwanyi2) player.storage.gzwanyi2=[];
								player.storage.gzwanyi2.add(links.card.name);
								player.addTempSkill('gzwanyi2');
							},
						}
					},
					prompt:function(links){
						if(_status.mode=='yingbian') return '将一张应变牌当做'+get.translation(links[0][2])+'使用';
						return '将一张合纵牌当做'+get.translation(links[0][2])+'使用';
					},
				},
				subSkill:{backup:{}},
				ai:{order:8,result:{player:1}},
			},
			gzwanyi2:{onremove:true},
			gzmaihuo:{
				audio:'maihuo',
				limited:true,
				trigger:{global:'useCardToTarget'},
				logTarget:'player',
				filter:function(event,player){
					return event.card.name=='sha'&&event.target.isIn()&&event.target.isFriendOf(player);
				},
				preHidden:true,
				skillAnimation:true,
				animationColor:'thunder',
				check:function(event,player){
					var source=event.player,targets=event.targets,card=event.card;
					for(var target of targets){
						if(target.hasShan()||get.effect(target,card,player,player)>=0) continue;
						if(player.hp<=1||target.hp<=(event.getParent().baseDamage||1)) return true;
					}
					return false;
				},
				content:function(){
					player.awakenSkill('gzmaihuo');
					trigger.targets.length=0;
					trigger.getParent().triggeredTargets2.length=0;
					player.addSkill('gzmaihuo_effect');
					player.markAuto('gzmaihuo_effect',[trigger.player]);
					trigger.player.addMark('gzmaihuo_mark',1,false);
				},
				subSkill:{
					effect:{
						audio:'maihuo',
						trigger:{global:'phaseBegin'},
						forced:true,
						charlotte:true,
						popup:false,
						filter:function(event,player){
							return player.getStorage('gzmaihuo_effect').contains(event.player)&&event.player.canUse('sha',player,false);
						},
						content:function(){
							'step 0'
							var target=trigger.player;
							player.unmarkAuto('gzmaihuo_effect',[target]);
							target.removeMark('gzmaihuo_mark',1,false);
							target.useCard({name:'sha',isCard:true},player,'gzmaihuo_effect',false);
							'step 1'
							if(!player.getStorage('gzmaihuo_effect').length) player.removeSkill('gzmaihuo_effect');
						},
						group:'gzmaihuo_remove',
					},
					remove:{
						trigger:{player:'damageBegin2'},
						forced:true,
						filter:function(event,player){
							return event.card&&event.card.name=='sha'&&event.getParent().skill=='gzmaihuo_effect';
						},
						content:function(){
							trigger.cancel();
							player.draw(2);
							if(player.checkMainSkill('gzmaihuo',false)){
								player.removeCharacter(0);
							}
							else if(player.checkViceSkill('gzmaihuo',false)){
								player.changeVice();
							}
						},
					},
					mark:{
						marktext:'祸',
						intro:{
		 				content:'mark',
		 				onunmark:true,
						},
					},
				},
			},
			//羊徽瑜
			gzcaiyuan:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					var num1=player.countCards('h'),num2=num1;
					player.getHistory('gain',function(evt){
						num2-=evt.cards.length;
					});
					player.getHistory('lose',function(evt){
						if(evt.hs) num2+=evt.hs.length;
					});
					return num1>=num2;
				},
				content:function(){
					player.chooseDrawRecover(2,true);
				},
			},
			//左棻
			gzzhaosong:{
				audio:'zhaosong',
				enable:'phaseUse',
				preHidden:['gzzhaosong_dying','gzzhaosong_sha'],
				filter:function(event,player){
					return !player.getStorage('gzzhaosong').contains('效果②')&&game.hasPlayer((current)=>lib.skill.gzzhaosong.filterTarget(null,player,current));
				},
				filterTarget:function(card,player,target){
					return target!=player&&(target.isUnseen(2)||target.countCards('h')>0);
				},
				content:function(){
					player.markAuto('gzzhaosong',['效果②']);
					if(target.isUnseen(2)) player.viewCharacter(target,2);
					if(target.countCards('hej')>0) player.gainPlayerCard(target,'hej','visible');
				},
				ai:{
					order:11,
					result:{
						player:function(player,target){
							return get.effect(target,{name:'zhibi'},player,player)+get.effect(target,{name:'shunshou_copy'},player,player);
						},
					},
				},
				group:['gzzhaosong_dying','gzzhaosong_sha'],
				subSkill:{
					dying:{
						audio:'gzzhaosong',
						trigger:{global:'dying'},
						logTarget:'player',
						filter:function(event,player){
							return !player.getStorage('gzzhaosong').contains('效果①')&&event.player.isDying()&&event.player.hp<=0;
						},
						prompt2:'令该角色回复至2点体力并摸一张牌',
						check:function(event,player){
							return event.player.isFriendOf(player)&&get.attitude(player,event.player)>0;
						},
						content:function(){
							player.markAuto('gzzhaosong',['效果①']);
							var target=trigger.player,num=2-target.hp;
							if(num>0) target.recover(num);
							target.draw();
						},
					},
					sha:{
						audio:'gzzhaosong',
						trigger:{global:'useCard2'},
						direct:true,
						filter:function(event,player){
							if(event.card.name!='sha'||player.getStorage('gzzhaosong').contains('效果③')) return false;
							return game.hasPlayer(function(current){
								return !event.targets.contains(current)&&lib.filter.filterTarget(event.card,event.player,current);
							});
						},
						content:function(){
							'step 0'
							player.chooseTarget([1,2],get.prompt('gzzhaosong'),'为'+get.translation(trigger.card)+'增加至多两个目标',function(card,player,target){
								var event=_status.event.getTrigger();
								return !event.targets.contains(target)&&lib.filter.filterTarget(event.card,event.player,target);
							}).set('ai',function(target){
								var event=_status.event.getTrigger();
								return get.effect(target,event.card,event.player,_status.event.player);
							}).set('goon',game.countPlayer(function(current){
								return !trigger.targets.contains(current)&&lib.filter.filterTarget(trigger.card,trigger.player,current)&&get.effect(current,trigger.card,trigger.player,player)>0;
							})>=Math.min(2,game.countPlayer(function(current){
								return !trigger.targets.contains(current)&&lib.filter.filterTarget(trigger.card,trigger.player,current);
							}))).setHiddenSkill('gzzhaosong_sha');
							'step 1'
							if(result.bool){
								if(!event.isMine()&&!event.isOnline()) game.delayx();
							}
							else event.finish();
							'step 2'
							var targets=result.targets;
							player.markAuto('gzzhaosong',['效果③']);
							player.logSkill('gzzhaosong_sha',targets);
							trigger.targets.addArray(targets);
						},
					},
				},
			},
			gzlisi:{
				audio:2,
				trigger:{global:'dieAfter'},
				filter:function(event,player){
					return event.player.isFriendOf(player)&&player.getStorage('gzzhaosong').length>0;
				},
				direct:true,
				content:function(){
					'step 0'
					var list=player.getStorage('gzzhaosong').slice(0);
					list.push('cancel2');
					player.chooseControl(list).set('prompt',get.prompt('gzlisi')).set('prompt2','恢复〖诏颂〗的一个已发动的选项');
					'step 1'
					if(result.control!='cancel2'){
						player.logSkill('gzlisi');
						player.unmarkAuto('gzzhaosong',[result.control])
					}
				},
			},
			//杨艳
			gzxuanbei:{
				audio:'xuanbei',
				trigger:{player:'showCharacterAfter'},
				filter:function(event,player){
					return !player.storage.gzxuanbei&&event.toShow.contains('gz_yangyan');
				},
				forced:true,
				locked:false,
				content:function(){
					'step 0'
					player.storage.gzxuanbei=true;
					var cards=[];
					while(cards.length<2){
						var card=get.cardPile2(function(card){
							if(cards.contains(card)) return false;
							return card.hasTag('lianheng')||get.is.yingbian(card);
						});
						if(!card) break;
						else cards.push(card);
					}
					if(cards.length) player.gain(cards,'gain2');
					if(cards.length<2) player.draw(2-cards.length);
					'step 1'
					player.addTempSkill('gzxuanbei_effect');
				},
				group:'gzxuanbei_change',
				subSkill:{
					effect:{
						trigger:{player:'useCard'},
						forced:true,
						popup:false,
						charlotte:true,
						filter:function(event,player){
							return get.cardtag(event.card,'lianheng');
						},
						content:function(){
							player.draw();
						},
						ai:{forceYingbian:true},
						mark:true,
						intro:{content:'使用应变牌时直接获得强化，使用合纵牌时摸一张牌。'},
					},
					change:{
						audio:'xuanbei',
						trigger:{player:'die'},
						direct:true,
						forceDie:true,
						skillAnimation:true,
						animationColor:'thunder',
						content:function(){
							'step 0'
							player.chooseTarget(get.prompt('gzxuanbei'),'令一名其他角色变更副将',lib.filter.notMe).set('forceDie',true).set('ai',function(target){
								var player=_status.event.player;
								var rank=get.guozhanRank(target.name2,target)<=3;
								var att=get.attitude(player,target);
								if(att>0){
									return (4-rank)*att;
								}
								return -(rank-6)*att;
							});
							'step 1'
							if(result.bool){
								var target=result.targets[0];
								player.logSkill('gzxuanbei_change',target);
								game.delayx();
								target.changeVice();
							}
						},
					},
				},
			},
			//司马师
			gzyimie:{
				audio:'yimie',
				inherit:'yimie',
				round:1,
				init:function(player){
					if(player.checkMainSkill('gzyimie')){
						player.removeMaxHp(2);
					}
				},
			},
			gztairan:{
				audio:'tairan',
				trigger:{player:'phaseUseBegin'},
				check:function(event,player){
					return player.isDamaged()&&player.hasCard(function(card){
						return 5.5-get.value(card);
					},'he');
				},
				content:function(){
					'step 0'
					var list=[],num=0;
					if(player.isHealthy()||!player.hasCard(function(card){
						return lib.filter.cardDiscardable(card,player,'gztairan');
					},'he')) num=1;
					event.num=num;
					for(var i=num;i<=player.hp;i++){
						list.push(i+'点');
					}
					player.chooseControl(list).set('prompt','###请先失去任意点体力###此回合结束时，你将恢复等量的体力');
					'step 1'
					var num1=result.index+num;
					event.num1=num1;
					if(num1>0) player.loseHp(num1);
					'step 2'
					if(player.isDamaged()&&player.hasCard(function(card){
						return lib.filter.cardDiscardable(card,player,'gztairan')
					},'he')){
						var next=player.chooseToDiscard('he',[1,player.getDamagedHp()],'然后请弃置任意张牌','此回合结束时，你将摸等量的牌。').set('ai',function(card){
							return 5.5-get.value(card);
						});
						if(event.num1==0) next.set('forced',true);
					}
					'step 3'
					var num2=0;
					if(result.bool) num2=result.cards.length;
					var storage=[event.num1,num2];
					player.addTempSkill('gztairan_effect');
					player.storage.gztairan_effect=storage;
				},
				subSkill:{
					effect:{
						audio:'tairan',
						trigger:{player:'phaseEnd'},
						filter:function(event,player){
							var storage=player.storage.gztairan_effect;
							return storage&&storage.length==2&&(storage[1]>0||player.isDamaged());
						},
						forced:true,
						charlotte:true,
						onremove:true,
						content:function(){
							var storage=player.storage.gztairan_effect;
							if(storage[0]>0) player.recover(storage[0]);
							if(storage[1]>0) player.draw(storage[1]);
						},
					},
				},
			},
			//杜预
			gzsanchen:{
				audio:'sanchen',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					var stat=player.getStat('sanchen');
					return game.hasPlayer(function(current){
						return (!stat||!stat.contains(current));
					});
				},
				filterTarget:function(card,player,target){
					var stat=player.getStat('sanchen');
					return (!stat||!stat.contains(target));
				},
				content:function(){
					'step 0'
					var stat=player.getStat();
					if(!stat.sanchen) stat.sanchen=[];
					stat.sanchen.push(target);
					target.draw(3);
					'step 1'
					if(!target.countCards('he')) event.finish();
					else target.chooseToDiscard('he',true,3).set('ai',function(card){
						var list=ui.selected.cards.map(function(i){
							return get.type2(i);
						});
						if(!list.contains(get.type2(card))) return 7-get.value(card);
						return -get.value(card);
					});
					'step 2'
					if(result.bool&&result.cards&&result.cards.length){
						var list=[];
						for(var i of result.cards) list.add(get.type2(i));
						if(list.length==result.cards.length){
							target.draw();
							player.getStat('skill').gzsanchen--;
							player.addMark('gzsanchen',1);
						}
					}
					else{
						target.draw();
						player.getStat('skill').sanchen--;
						player.addMark('gzsanchen',1);
					}
				},
				ai:{
					order:9,
					threaten:1.7,
					result:{
						target:function(player,target){
							if(target.hasSkillTag('nogain')) return 0.1;
							return Math.sqrt(target.countCards('he'));
						},
					},
				},
				marktext:'陈',
				intro:{
					name2:'陈',
					content:'mark',
				},
			},
			gzpozhu:{
				audio:'pozhu',
				enable:'phaseUse',
				mainSkill:true,
				init:function(player){
					if(player.checkMainSkill('gzpozhu')){
						player.removeMaxHp();
					}
				},
				viewAsFilter:function(player){
					return !player.hasSkill('pozhu3',null,null,false)&&player.countMark('gzsanchen')>0&&player.countCards('hs')>0;
				},
				viewAs:{name:'chuqibuyi'},
				filterCard:true,
				position:'hs',
				check:function(card){
					return 7-get.value(card);
				},
				onuse:function(result,player){
					player.removeMark('gzsanchen',1);
				},
				group:'gzpozhu2',
			},
			gzpozhu2:{
				trigger:{player:'useCardAfter'},
				silent:true,
				filter:function(event,player){
					return event.skill=='gzpozhu'&&!player.getHistory('sourceDamage',function(evt){
						return evt.card==event.card;
					}).length;
				},
				content:function(){
					player.addTempSkill('pozhu3');
				},
			},
			//钟琰
			gzbolan:{
				audio:'bolan',
				global:'gzbolan_global',
				enable:'phaseUse',
				usable:1,
				content:function(){
					'step 0'
					if((event.num&&event.num>0)||!_status.characterlist.length){
						event.finish();
						return;
					}
					var character=_status.characterlist.randomGet();
					var groups,double=get.is.double(character,true);
					if(double) groups=double.slice(0);
					else groups=[lib.character[character][1]];
					event.groups=groups;
 				event.videoId=lib.status.videoId++;
 				game.broadcastAll(function(player,id,character){
 					ui.create.dialog(get.translation(player)+'发动了【博览】',[[character],'character']).videoId=id;
 				},player,event.videoId,character);
 				game.delay(3);
 				'step 1'
 				game.broadcastAll('closeDialog',event.videoId);
 				var list1=['wei','shu','wu','qun','jin'],list2=['gzqice','tiaoxin','gzzhiheng','new_chuli','gzsanchen'];
 				var skills=[];
 				for(var i=0;i<list1.length;i++){
 					if(event.groups.contains(list1[i])) skills.push(list2[i]);
 				}
 				if(!skills.length) event.finish();
 				else if(skills.length==1) event._result={control:skills[0]};
 				else player.chooseControl(skills).set('prompt','选择获得一个技能直到回合结束');
 				'step 2'
 				var skill=result.control;
 				player.addTempSkill(skill);
 				game.log(player,'获得了技能','#g【'+get.translation(skill)+'】');
				},
				derivation:['gzqice','tiaoxin','gzzhiheng','new_chuli','gzsanchen'],
				ai:{
					order:10,
					result:{player:1},
				},
				subSkill:{
					global:{
						inherit:'gzbolan',
						filter:function(event,player){
							return !player.hasSkill('gzbolan',true)&&game.hasPlayer(function(current){
								return current!=player&&current.hasSkill('gzbolan');
							});
						},
						selectTarget:-1,
						filterTarget:function(card,player,target){
							return target!=player&&target.hasSkill('gzbolan');
						},
						contentAfter:function(){
							player.loseHp();
						},
						ai:{
							order:10,
							result:{
								player:function(player,target){
									if(get.effect(player,{name:'losehp'},player,player)>0) return 3;
									if(player.isHealthy()) return 1;
									return -1;
								},
							},
						},
					},
				},
			},
			//司马昭
			gzchoufa:{
				audio:'choufa',
				inherit:'choufa',
				content:function(){
					'step 0'
					player.choosePlayerCard(target,'h',true);
					'step 1'
					player.showCards(result.cards,get.translation(player)+'对'+get.translation(target)+'发动了【筹伐】');
					var type=get.type2(result.cards[0],target),hs=target.getCards('h',function(card){
						return card!=result.cards[0]&&get.type2(card,target)!=type;
					});
					if(hs.length){
						target.addGaintag(hs,'xinchoufa');
						target.addTempSkill('xinchoufa2');
					}
				},
			},
			//张春华
			gzhuishi:{
				audio:2,
				trigger:{player:'phaseDrawBegin1'},
				filter:function(event,player){
					return ui.discardPile.childNodes.length>0;
				},
				preHidden:true,
				prompt:function(){
					return get.prompt('huishi')+'（可观看牌数：'+lib.skill.gzhuishi.getNum()+'）';
				},
				check:function(event,player){
					return lib.skill.gzhuishi.getNum()>3;
				},
				getNum:function(){
					var list=[];
					list.push(ui.discardPile.lastChild);
					if(list[0].previousSibling) list.push(list[0].previousSibling);
					var num=0;
					for(var i of list){
						var name=get.translation(i.name);
						if(name=='挟令') name='挟天子以令诸侯';
						num+=name.length;
					}
					return num;
				},
				content:function(){
					'step 0'
					trigger.changeToZero();
					var cards=game.cardsGotoOrdering(get.cards(lib.skill.gzhuishi.getNum())).cards;
					var num=Math.ceil(cards.length/2);
					var next=player.chooseToMove('慧识：将'+get.cnNumber(num)+'张牌置于牌堆底并获得其余的牌',true);
					next.set('list',[
						['牌堆顶的展示牌',cards],
						['牌堆底'],
					]);
					next.set('filterMove',function(from,to,moved){
						if(moved[0].contains(from)&&to==1) return moved[1].length<_status.event.num;
						return true;
					});
					next.set('filterOk',function(moved){
						return moved[1].length==_status.event.num;
					});
					next.set('num',num);
					next.set('processAI',function(list){
						var cards=list[0][1].slice(0).sort(function(a,b){
							return get.value(b)-get.useful(a);
						});
						return [cards,cards.splice(cards.length-_status.event.num)];
					});
					'step 1'
					if(result.bool){
						var list=result.moved;
						if(list[0].length) player.gain(list[0],'gain2');
						while(list[1].length) ui.cardPile.appendChild(list[1].shift().fix());
					}
				},
			},
			gzqingleng:{
				audio:2,
				trigger:{global:'phaseEnd'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					var target=event.player;
					return target!=player&&target.isIn()&&target.isUnseen(2)&&player.countCards('he')>0&&player.canUse({name:'sha',nature:'ice'},target,false);
				},
				content:function(){
					'step 0'
					player.chooseCard('he',get.prompt('gzqingleng',trigger.player),'将一张牌当做冰【杀】对其使用',function(card,player){
						return player.canUse(get.autoViewAs({name:'sha',nature:'ice'},[card]),_status.event.target,false);
					}).set('target',trigger.player).set('ai',function(card){
						if(get.effect(_status.event.target,get.autoViewAs({name:'sha',nature:'ice'},[card]),player)<=0) return false;
						return 6-get.value(card);
					}).setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						player.useCard(get.autoViewAs({name:'sha',nature:'ice'},result.cards),result.cards,false,trigger.player,'gzqingleng');
						if(trigger.player.isUnseen()){
							player.draw();
						}
					}
				},
			},
			//司马懿
			gzquanbian:{
				audio:'quanbian',
				preHidden:true,
				trigger:{player:['useCard','respond']},
				filter:function(event,player){
					if(player.hasSkill('gzquanbian_blocker')) return false;
					var phase=event.getParent('phaseUse');
					if(!phase||phase.player!=player) return false;
					var suit=get.suit(event.card);
					if(!lib.suit.contains(suit)||!lib.skill.quanbian.hasHand(event)) return false;
					return player.getHistory('useCard',function(evt){
						return evt!=event&&get.suit(evt.card)==suit&&lib.skill.quanbian.hasHand(evt)&&evt.getParent('phaseUse')==phase;
					}).length+player.getHistory('respond',function(evt){
						return evt!=event&&get.suit(evt.card)==suit&&lib.skill.quanbian.hasHand(evt)&&evt.getParent('phaseUse')==phase;
					}).length==0;
				},
				content:function(){
					'step 0'
					var cards=get.cards(player.maxHp);
					for(var i=cards.length-1;i>=0;i--){
						ui.cardPile.insertBefore(cards[i],ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
					player.chooseButton(['权变：选择获得一张牌',cards],true).set('ai',function(button){
						var player=_status.event.player,card=button.link;
						var suit=get.suit(card,false),val=get.value(card);
						if(player.hasHistory('useCard',function(evt){
							return get.suit(evt.card,false)==suit;
						})||player.hasHistory('respond',function(evt){
							return get.suit(evt.card,false)==suit;
						})) return val;
						return val+8;
					});
					'step 1'
					if(result.bool){
						var card=result.links[0];
						player.gain(card,'gain2');
						var suit=get.suit(card,false);
						if(player.hasHistory('useCard',function(evt){
							return get.suit(evt.card,false)==suit;
						})||player.hasHistory('respond',function(evt){
							return get.suit(evt.card,false)==suit;
						})) player.addTempSkill('gzquanbian_blocker');
					}
				},
				subSkill:{blocker:{charlotte:true}},
			},
			gzxiongzhi:{
				audio:'xiongzhi',
				enable:'phaseUse',
				limited:true,
				skillAnimation:true,
				animationColor:'thunder',
				content:function(){
					'step 0'
					player.awakenSkill('gzxiongzhi');
					event.cards=game.cardsGotoOrdering(get.cards(player.maxHp)).cards.slice(0);
					'step 1'
					var card=cards.shift();
					event.card=card;
					player.showCards(card);
					if(!player.hasUseTarget(card)){
						if(cards.length>0) event.redo();
						else event.finish();
					}
					'step 2'
					var next=player.chooseUseTarget(card,true);
					if(get.info(card).updateUsable=='phaseUse') next.addCount=false;
					'step 3'
					if(result.bool&&cards.length>0) event.goto(1);
				},
				ai:{
					order:1,
					result:{
						player:function(player){
							if(!player.hasSkill('smyyingshi')) return 1;
							var cards=[];
							for(var i=0;i<player.maxHp;i++){
								var card=ui.cardPile.childNodes[i];
								if(card){
									if(!player.hasValueTarget(card)) return 0;
								}
								else break;
							}
							return 1;
						},
					},
				},
			},
			//十周年羊祜
			gzdeshao:{
				audio:'dcdeshao',
				trigger:{target:'useCardToTargeted'},
				preHidden:true,
				countUnseen:function(player){
					var num=0;
					if(player.isUnseen(0)) num++;
					if(player.isUnseen(1)) num++;
					return num;
				},
				filter:function(event,player){
					if(player==event.player||event.targets.length!=1||get.color(event.card)!='black') return false;
					if(lib.skill.gzdeshao.countUnseen(event.player)<lib.skill.gzdeshao.countUnseen(player)||!event.player.countCards('he')) return false;
					return player.getHistory('useSkill',function(evt){
						return evt.skill=='gzdeshao';
					}).length<player.hp;
				},
				check:function(event,player){
					return get.effect(event.player,{name:'guohe_copy2'},player,player)>0;
				},
				logTarget:'player',
				content:function(){
					player.discardPlayerCard(trigger.player,true,'he');
				},
			},
			gzmingfa:{
				audio:'dcmingfa',
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return player!=target&&target.isEnemyOf(player);
				},
				content:function(){
					player.markAuto('gzmingfa',targets);
					game.delayx();
				},
				onremove:true,
				ai:{
					order:1,
					result:{target:-1},
				},
				group:'gzmingfa_effect',
				subSkill:{
					effect:{
						audio:'dcmingfa',
						trigger:{global:'phaseEnd'},
						forced:true,
						filter:function(event,player){
							return player.getStorage('gzmingfa').contains(event.player);
						},
						logTarget:'player',
						content:function(){
							var target=trigger.player;
							player.unmarkAuto('gzmingfa',[target]);
							if(target.isIn()){
								var num=player.countCards('h')-target.countCards('h');
								if(num>0){
									target.damage();
									player.gainPlayerCard(target,true,'h');
								}
								else if(num<0){
									player.draw(Math.min(5,-num));
								}
							}
						},
					},
				},
			},
			//海外服国战
			//杨修
			gzdanlao:{
				audio:'danlao',
				inherit:'danlao',
				preHidden:true,
				filter:function(event,player){
					return get.type(event.card)=='trick'&&event.targets&&event.targets.length>1;
				},
			},
			gzjilei:{
				inherit:'jilei',
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseControl('basic','trick','equip','cancel2',function(){
						var source=_status.event.source;
						if(get.attitude(_status.event.player,source)>0) return 'cancel2';
						var list=['basic','trick','equip'].filter(function(name){
							return (!source.storage.jilei2||!source.storage.jilei2.contains(name));
						});
						if(!list.length) return 'cancel2';
						if(list.contains('trick')&&source.countCards('h',function(card){
							return get.type(card,source)=='trick'&&source.hasValueTarget(card);
						})>1) return 'trick';
						return list[0];
					}).set('prompt',get.prompt2('jilei',trigger.source)).set('source',trigger.source).setHiddenSkill('gzjilei');
					'step 1'
					if(result.control!='cancel2'){
						player.logSkill('gzjilei',trigger.source);
						player.chat(get.translation(result.control)+'牌');
						game.log(player,'声明了','#y'+get.translation(result.control)+'牌');
						trigger.source.addTempSkill('jilei2');
						trigger.source.storage.jilei2.add(result.control);
						trigger.source.updateMarks('jilei2');
						game.delayx();
					}
				},
			},
			//诸葛瑾
			gzhuanshi:{
				audio:'huanshi',
				trigger:{global:'judge'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return player.countCards('hes')>0&&event.player.isFriendOf(player);
				},
				content:function(){
					"step 0"
					player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
					get.translation(trigger.player.judging[0])+'，'+get.prompt('gzhuanshi'),'hes',function(card){
						var player=_status.event.player;
						var mod2=game.checkMod(card,player,'unchanged','cardEnabled2',player);
						if(mod2!='unchanged') return mod2;
						var mod=game.checkMod(card,player,'unchanged','cardRespondable',player);
						if(mod!='unchanged') return mod;
						return true;
					}).set('ai',function(card){
						var trigger=_status.event.getTrigger();
						var player=_status.event.player;
						var judging=_status.event.judging;
						var result=trigger.judge(card)-trigger.judge(judging);
						var attitude=get.attitude(player,trigger.player);
						if(attitude==0||result==0) return 0;
						if(attitude>0){
							return result-get.value(card)/2;
						}
						else{
							return -result-get.value(card)/2;
						}
					}).set('judging',trigger.player.judging[0]).setHiddenSkill('gzhuanshi');
					"step 1"
					if(result.bool){
						player.respond(result.cards,'gzhuanshi','highlight','noOrdering');
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.bool){
						if(trigger.player.judging[0].clone){
							trigger.player.judging[0].clone.classList.remove('thrownhighlight');
							game.broadcast(function(card){
								if(card.clone){
									card.clone.classList.remove('thrownhighlight');
								}
							},trigger.player.judging[0]);
							game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[0].clone]));
						}
						game.cardsDiscard(trigger.player.judging[0]);
						trigger.player.judging[0]=result.cards[0];
						trigger.orderingCards.addArray(result.cards);
						game.log(trigger.player,'的判定牌改为',result.cards[0]);
						game.delay(2);
					}
				},
				ai:{
					rejudge:true,
					tag:{
						rejudge:1,
					}
				}
			},
			gzhongyuan:{
				audio:'hongyuan',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.hasCard(function(card){
						return lib.skill.gzhongyuan.filterCard(card);
					},'h');
				},
				filterCard:function(card){
					return !card.hasTag('lianheng')&&!card.hasGaintag('_lianheng');
				},
				position:'h',
				discard:false,
				lose:false,
				content:function(){
					cards[0].addGaintag('_lianheng');
					player.addTempSkill('gzhongyuan_clear')
				},
				check:function(card){
					return 4.5-get.value(card);
				},
				group:'gzhongyuan_draw',
				preHidden:true,
				ai:{order:2,result:{player:1}},
				subSkill:{
					clear:{
						charlotte:true,
						onremove:function(player){
							player.removeGaintag('_lianheng');
						},
					},
					draw:{
						audio:'hongyuan',
						trigger:{player:'drawBefore'},
						direct:true,
						filter:function(event,player){
							return event.getParent().name=='_lianheng'&&game.hasPlayer(function(current){
								return current!=player&&current.isFriendOf(player);
							});
						},
						content:function(){
							'step 0'
							player.chooseTarget(get.prompt('gzhongyuan'),'将摸牌（'+get.cnNumber(trigger.num)+'张）转移给一名同势力角色',function(card,player,target){
								return target!=player&&target.isFriendOf(player);
							}).setHiddenSkill('gzhongyuan').set('ai',()=>-1);
							'step 1'
							if(result.bool){
								var target=result.targets[0];
								player.logSkill('gzhongyuan',target);
								trigger.cancel();
								target.draw(trigger.num);
							}
						},
					},
				},
			},
			gzmingzhe:{
				audio:'mingzhe',
				trigger:{
					player:['loseAfter','useCard','respond'],
					global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
				},
				filter:function(event,player){
					if(player==_status.currentPhase) return false;
					if(event.name=='useCard'||event.name=='respond'){
						return get.color(event.card,false)=='red'&&player.hasHistory('lose',function(evt){
							return evt.getParent()==event&&evt.hs&&evt.hs.length>0;
						});
					}
					var evt=event.getl(player);
					if(!evt||!evt.es||!evt.es.length) return false;
					for(var i of evt.es){
						if(get.color(i,player)=='red') return true;
					}
					return false;
				},
				frequent:true,
				preHidden:true,
				content:function(){
					player.draw();
				},
			},
			//廖化
			gzdangxian:{
				trigger:{player:'phaseBegin'},
				forced:true,
				preHidden:true,
				audio:'dangxian',
				audioname:['guansuo'],
				content:function(){
					var next=player.phaseUse();
					event.next.remove(next);
					trigger.next.push(next);
				},
				group:'gzdangxian_show',
				subSkill:{
					show:{
						audio:'dangxian',
						trigger:{player:'showCharacterAfter'},
						forced:true,
						filter:function(event,player){
							return event.toShow.contains('gz_liaohua')&&!player.storage.gzdangxian_draw;
						},
						content:function(){
							player.storage.gzdangxian_draw=true;
							player.addMark('xianqu_mark',1)
						},
					},
				},
			},
			//新国标2022
			//许褚
			gzluoyi:{
				audio:'luoyi',
				trigger:{player:'phaseDrawEnd'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return player.countCards('he')>0;
				},
				content:function(){
					'step 0'
					player.chooseToDiscard('he',get.prompt2('gzluoyi')).setHiddenSkill('gzluoyi').set('ai',function(card){
						var player=_status.event.player;
						if(player.hasCard(function(cardx){
							if(cardx==card) return false;
							return (cardx.name=='sha'||cardx.name=='juedou')&&player.hasValueTarget(cardx,null,true);
						},'hs')) return 5-get.value(card);
						return -get.value(card);
					}).logSkill='gzluoyi';
					'step 1'
					if(result.bool) player.addTempSkill('gzluoyi_buff')
				},
				subSkill:{
					buff:{
						audio:'luoyi',
						charlotte:true,
						forced:true,
						trigger:{source:'damageBegin1'},
						filter:function(event,player){
							return event.card&&(event.card.name=='sha'||event.card.name=='juedou')&&event.getParent().type=='card';
						},
						content:function(){
							trigger.num++;
						},
					},
				},
			},
			//典韦
			gzqiangxi:{
				audio:'qiangxi',
				inherit:'qiangxi',
				filterTarget:function(card,player,target){
					return target!=player;
				},
			},
			//小乔
			gztianxiang:{
				audio:'tianxiang',
				audioname:['daxiaoqiao','re_xiaoqiao','ol_xiaoqiao'],
				trigger:{player:'damageBegin4'},
				direct:true,
				preHidden:true,
				usable:1,
				filter:function(event,player){
					return player.countCards('h',function(card){
						return _status.connectMode||get.suit(card,player)=='heart';
					})>0&&event.num>0;
				},
				content:function(){
					"step 0"
					player.chooseCardTarget({
						filterCard:function(card,player){
							return get.suit(card)=='heart'&&lib.filter.cardDiscardable(card,player);
						},
						filterTarget:function(card,player,target){
							return player!=target;
						},
						ai1:function(card){
							return 10-get.value(card);
						},
						ai2:function(target){
							var att=get.attitude(_status.event.player,target);
							var trigger=_status.event.getTrigger();
							var da=0;
							if(_status.event.player.hp==1){
								da=10;
							}
							var eff=get.damageEffect(target,trigger.source,target);
							if(att==0) return 0.1+da;
							if(eff>=0&&att>0){
								return att+da;
							}
							if(att>0&&target.hp>1){
								if(target.maxHp-target.hp>=3) return att*1.1+da;
								if(target.maxHp-target.hp>=2) return att*0.9+da;
							}
							return -att+da;
						},
						prompt:get.prompt('gztianxiang'),
						prompt2:lib.translate.gztianxiang_info
					}).setHiddenSkill(event.name);
					"step 1"
					if(result.bool){
						player.discard(result.cards);
						var target=result.targets[0];
						player.chooseControlList(true,function(event,player){
							var target=_status.event.target;
							var att=get.attitude(player,target);
							if(target.hasSkillTag('maihp')) att=-att;
							if(att>0){
								return 0;
							}
							else{
								return 1;
							}
						},
							['令'+get.translation(target)+'受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）',
							'令'+get.translation(target)+'失去1点体力，然后获得'+get.translation(result.cards)]).set('target',target);
						player.logSkill(event.name,target);
						trigger.cancel();
						event.target=target;
						event.card=result.cards[0];
					}
					else{
						player.storage.counttrigger.gztianxiang--;
						event.finish();
					}
					"step 2"
					if(typeof result.index=='number'){
						event.index=result.index;
						if(result.index){
							event.related=event.target.loseHp();
						}
						else{
							event.related=event.target.damage(trigger.source||'nosource','nocard');
						}
					}
					else event.finish();
					"step 3"
					//if(event.related.cancelled||target.isDead()) return;
					if(event.index&&card.isInPile()) target.gain(card,'gain2');
					else if(target.getDamagedHp()) target.draw(Math.min(5,target.getDamagedHp()));
				},
				ai:{
					maixie_defend:true,
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return;
							if(get.tag(card,'damage')&&target.countCards('he')>1) return 0.7;
						}
					},
				}
			},
			gzhongyan:{
				mod:{
					suit:function(card,suit){
						if(suit=='spade') return 'heart';
					},
					maxHandcard:function(player,num){
						if(player.hasCard(function(card){
							return get.suit(card,player)=='heart';
						},'e')) return num+1;
					},
				}
			},
			//黄忠
			gzliegong:{
				audio:'liegong',
				locked:false,
				mod:{
					targetInRange:function(card,player,target){
						if(card.name=='sha'&&target.countCards('h')<player.countCards('h')) return true;
					},
					attackRange:function(player,distance){
						if(get.zhu(player,'shouyue')) return distance+1;
					}
				},
				trigger:{player:'useCardToPlayered'},
				shaRelated:true,
				filter:function(event,player){
					return event.card.name=='sha'&&player.hp<=event.target.hp;
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					var str=get.translation(trigger.target),card=get.translation(trigger.card);
					player.chooseControl('cancel2').set('choiceList',[
						'令'+card+'对'+str+'的伤害+1',
						'令'+str+'不能响应'+card,
					]).set('prompt',get.prompt('gzliegong',trigger.target)).setHiddenSkill('gzliegong').set('ai',function(){
						var player=_status.event.player,target=_status.event.getTrigger().target;
						if(get.attitude(player,target)>0) return 2;
						return target.mayHaveShan()?1:0;
					});
					'step 1'
					if(result.control!='cancel2'){
						var target=trigger.target;
						player.logSkill('gzliegong',target);
						if(result.index==1){
							game.log(trigger.card,'不可被',target,'响应');
							trigger.directHit.add(target);
						}
						else {
							game.log(trigger.card,'对',target,'的伤害+1');
							var map=trigger.getParent().customArgs,id=target.playerid;
							if(!map[id]) map[id]={};
							if(!map[id].extraDamage) map[id].extraDamage=0;
							map[id].extraDamage++;
						}
					}
				},
			},
			//潘凤
			gzkuangfu:{
				audio:'kuangfu',
				trigger:{player:'useCardToPlayered'},
				shaRelated:true,
				preHidden:true,
				logTarget:'target',
				filter:function(event,player){
					return event.card.name=='sha'&&player.isPhaseUsing()&&!player.hasSkill('gzkuangfu_extra')&&event.target.countGainableCards(player,'e')>0;
				},
				check:function(event,player){
					if(get.attitude(player,event.target)>0||!event.target.hasCard(function(card){
						return lib.filter.canBeGained(card,player,event.target)&&get.value(card,event.target)>0;
					},'e')) return false;
					return true;
				},
				content:function(){
					trigger.getParent()._gzkuangfued=true;
					player.gainPlayerCard(trigger.target,'e',true);
					player.addTempSkill('gzkuangfu_extra','phaseUseAfter');
				},
				subSkill:{
					extra:{
						trigger:{player:'useCardAfter'},
						charlotte:true,
						forced:true,
						filter:function(event,player){
							return event._gzkuangfued&&!player.hasHistory('sourceDamage',function(evt){
								return evt.card&&event.card;
							})&&player.countCards('h')>0;
						},
						content:function(){
							player.chooseToDiscard('h',2,true);
						},
					},
				},
			},
			//吕布
			gzwushuang:{
				shaRelated:true,
				audio:'wushuang',
				audioname:['re_lvbu','shen_lvbu','lvlingqi'],
				forced:true,
				locked:true,
				group:['wushuang1','wushuang2'],
				preHidden:['wushuang1','wushuang2','gzwushuang'],
				trigger:{player:'useCard1'},
				direct:true,
				filter:function(event,player){
					if(event.card.name!='juedou'||!event.card.isCard) return false;
					if(event.targets){
						if(game.hasPlayer(function(current){
							return !event.targets.contains(current)&&lib.filter.targetEnabled2(event.card,player,current);
						})){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var num=game.countPlayer(function(current){
						return !trigger.targets.contains(current)&&lib.filter.targetEnabled2(trigger.card,player,current);
					});
					player.chooseTarget('无双：是否为'+get.translation(trigger.card)+'增加'+(num>1?'至多两个':'一个')+'目标？',[1,Math.min(2,num)],function(card,player,target){
						var trigger=_status.event.getTrigger();
						var card=trigger.card;
						return !trigger.targets.contains(target)&&lib.filter.targetEnabled2(card,player,target);
					}).set('ai',function(target){
						var player=_status.event.player;
						var card=_status.event.getTrigger().card;
						return get.effect(target,card,player,player);
					}).setHiddenSkill('gzwushuang');
					'step 1'
					if(result.bool){
						if(player!=game.me&&!player.isOnline()) game.delayx();
					}
					else event.finish();
					'step 2'
					var targets=result.targets.sortBySeat();
					player.logSkill('gzwushuang',targets);
					trigger.targets.addArray(targets);
				},
			},
			//夏侯渊
			gzshensu:{
				audio:'shensu1',
				audioname:['xiahouba','re_xiahouyuan','ol_xiahouyuan'],
				group:['shensu1','shensu2'],
				preHidden:['shensu1','shensu2','gzshensu'],
				trigger:{player:'phaseDiscardBegin'},
				direct:true,
				filter:function(event,player){
					return player.hp>0;
				},
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt('gzshensu'),'失去1点体力并跳过弃牌阶段，视为对一名其他角色使用使用一张无距离限制的【杀】',function(card,player,target){
						return player.canUse('sha',target,false);
					}).setHiddenSkill('gzshensu').set('goon',player.needsToDiscard()).set('ai',function(target){
						var player=_status.event.player;
						if(!_status.event.goon||player.hp<=target.hp) return false;
						return get.effect(target,{name:'sha',isCard:true},player,player);
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('gzshensu',target);
						player.loseHp();
						trigger.cancel();
						player.useCard({name:'sha',isCard:true},target,false);
					}
				},
			},
			//吕玲绮
			gzshenwei:{
				audio:'llqshenwei',
				mainSkill:true,
				init:function(player){
					if(player.checkMainSkill('gzshenwei')){
						player.removeMaxHp();
					}
				},
				trigger:{player:'phaseDrawBegin2'},
				forced:true,
				filter:(event)=>!event.numFixed,
				preHidden:true,
				content:function(){
					trigger.num+=2;
				},
				mod:{
					maxHandcard:(player,num)=>num+2,
				},
			},
			gzzhuangrong:{
				audio:'zhuangrong',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return !player.hasSkill('gzwushuang')&&player.hasCard(function(card){
						return get.type2(card,player)=='trick';
					},'h');
				},
				filterCard:function(card,player){
					return get.type2(card,player)=='trick';
				},
				content:function(){
					player.addTempSkill('gzwushuang','phaseUseEnd');
				},
				derivation:'gzwushuang',
			},
			//荀谌
			gzfenglve:{
				audio:'refenglve',
				derivation:'gzfenglve_zongheng',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.countCards('h')>0&&!player.hasSkillTag('noCompareSource')&&game.hasPlayer(function(current){
						return current!=player&&current.countCards('h')>0&&!current.hasSkillTag('noCompareTarget');
					});
				},
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('h')>0&&!target.hasSkillTag('noCompareTarget');
				},
				content:function(){
					'step 0'
					player.chooseToCompare(target);
					'step 1'
					if(result.bool){
						if(!target.countCards('hej')) event.goto(3);
						else{
							event.giver=target;
							event.gainner=player;
							target.choosePlayerCard(target,true,'hej',2,'交给'+get.translation(player)+'两张牌');
						}
					}
					else if(result.tie){
						event.goto(3);
					}
					else{
						if(!player.countCards('he')) event.goto(3);
						else{
							event.giver=player;
							event.gainner=target;
							player.chooseCard(true,'he','交给'+get.translation(target)+'一张牌');
						}
					}
					'step 2'
					if(result.bool) event.giver.give(result.cards,event.gainner,'giveAuto');
					'step 3'
					if(target.isIn()) player.chooseBool('纵横：是否令'+get.translation(target)+'获得【锋略】？').set('ai',function(){
						var evt=_status.event.getParent();
						return get.attitude(evt.player,evt.target)>0;
					});
					else event.finish();
					'step 4'
					if(result.bool){
						target.addTempSkill('gzfenglve_zongheng',{player:'phaseEnd'});
						game.log(player,'发起了','#y纵横','，令',target,'获得了技能','#g【锋略】');
					}
				},
				ai:{
					order:8,
					result:{
						target:function(player,target){
							if(!player.hasCard(function(card){
								if(get.position(card)!="h") return false;
								var val=get.value(card);
								if(val<0) return true;
								if(val<=5){
									return card.number>=10;
								}
								if(val<=6){
									return card.number>=13;
								}
								return false;
							})) return 0;
							return -Math.sqrt(1+target.countCards('he'))/(1+target.countCards('j'));
						},
					},
				},
			},
			gzfenglve_zongheng:{
				inherit:'gzfenglve',
				content:function(){
					'step 0'
					player.chooseToCompare(target);
					'step 1'
					if(result.bool){
						if(!target.countCards('hej')) event.finish();
						else{
							event.giver=target;
							event.gainner=player;
							target.choosePlayerCard(target,true,'hej','交给'+get.translation(player)+'一张牌');
						}
					}
					else if(result.tie){
						event.finish();
					}
					else{
						if(!player.countCards('he')) event.finish();
						else{
							event.giver=player;
							event.gainner=target;
							player.chooseCard(true,'he',2,'交给'+get.translation(target)+'两张牌');
						}
					}
					'step 2'
					if(result.bool) event.giver.give(result.cards,event.gainner,'giveAuto');
				},
				ai:{
					order:8,
					result:{
						target:function(player,target){
							if(!player.hasCard(function(card){
								if(get.position(card)!="h") return false;
								var val=get.value(card);
								if(val<0) return true;
								if(val<=5){
									return card.number>=12;
								}
								if(val<=6){
									return card.number>=13;
								}
								return false;
							})) return 0;
							return -Math.sqrt(1+target.countCards('he'))/(1+target.countCards('j'));
						},
					},
				},
			},
			gzanyong:{
				audio:'anyong',
				trigger:{global:'damageBegin1'},
				usable:1,
				filter:function(event,player){
					return event.source&&event.player!=event.source&&
					event.source.isFriendOf(player)&&event.player.isIn();
				},
				check:function(event,player){
					if(get.attitude(player,event.player)>0) return false;
					if(event.player.hasSkillTag('filterDamage',null,{
						player:event.source,
						card:event.card,
					})) return false;
					if(event.player.isUnseen()) return true;
					if(event.player.hp>event.num&&event.player.hp<=event.num*2) return player.hp>1||event.player.isUnseen(2);
					return false;
				},
				logTarget:'player',
				preHidden:true,
				content:function(){
					trigger.num*=2;
					if(!trigger.player.isUnseen(2)){
						player.loseHp();
						player.removeSkill('gzanyong');
					}
					else if(!trigger.player.isUnseen()){
						player.chooseToDiscard('h',2,true);
					}
				},
			},
			//周夷
			gzzhukou:{
				audio:'zhukou',
				trigger:{source:'damageSource'},
				preHidden:true,
				filter:function(event,player){
					if(!player.getHistory('useCard').length) return false;
					var evt=event.getParent('phaseUse');
					if(!evt||!evt.player) return false;
					return player.getHistory('sourceDamage',function(evtx){
						return evtx.getParent('phaseUse')==evt;
					}).indexOf(event)==0;
				},
				frequent:true,
				content:function(){
					player.draw(player.getHistory('useCard').length);
				},
			},
			gzduannian:{
				audio:2,
				trigger:{player:'phaseUseEnd'},
				preHidden:true,
				filter:function(event,player){
					return player.countCards('h')>0&&!player.hasCard(function(card){
						return !lib.filter.cardDiscardable(card,player,'gzduannian');
					},'h');
				},
				check:function(event,player){
					return player.countCards('h',function(card){
						return get.value(card)>=6;
					})<=Math.max(1,player.countCards('h')/2);
				},
				content:function(){
					'step 0'
					var cards=player.getCards('h',function(card){
						return lib.filter.cardDiscardable(card,player,'gzduannian');
					});
					if(cards.length){
						player.discard(cards);
					}
					else event.finish();
					'step 1'
					player.drawTo(Math.min(5,player.maxHp));
				},
			},
			gzlianyou:{
				trigger:{player:'die'},
				direct:true,
				forceDie:true,
				skillAnimation:true,
				animationColor:'fire',
				content:function(){
					'step 0'
					player.chooseTarget(lib.filter.notMe,get.prompt('gzlianyou'),'令一名其他角色获得〖兴火〗').set('forceDie',true).set('ai',function(target){
						return 10+(get.attitude(_status.event.player,target)*(target.hasSkillTag('fireAttack',null,null,true)?2:1));
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('gzlianyou',target);
						target.addSkillLog('gzxinghuo');
						game.delayx();
					}
				},
				derivation:'gzxinghuo',
			},
			gzxinghuo:{
				trigger:{source:'damageBegin1'},
				forced:true,
				filter:function(event){
					return event.nature=='fire';
				},
				content:function(){
					trigger.num++;
				},
			},
			//南华老仙
			gzgongxiu:{
				audio:'gongxiu',
				trigger:{player:'phaseDrawBegin2'},
				preHidden:true,
				filter:function(event,player){
					return !event.numFixed&&event.num>0&&player.maxHp>0;
				},
				content:function(){
					trigger.num--;
					player.addTempSkill('gzgongxiu2','phaseDrawAfter');
				},
			},
			gzgongxiu2:{
				trigger:{player:'phaseDrawEnd'},
				forced:true,
				charlotte:true,
				popup:false,
				content:function(){
					'step 0'
					var str='令至多'+get.cnNumber(player.maxHp)+'名角色';
					if(typeof player.storage.gzgongxiu!='number'){
						player.chooseControl().set('choiceList',[
							str+'各摸一张牌',
							str+'各弃置一张牌',
						]);
					}
					else event._result={index:1-player.storage.gzgongxiu};
					'step 1'
					var num=result.index;
					event.index=num;
					player.storage.gzgongxiu=num;
					player.chooseTarget(true,[1,player.maxHp],'选择至多'+get.cnNumber(player.maxHp)+'名角色各'+(num?'弃置':'摸')+'一张牌').set('goon',event.index?-1:1).set('ai',function(target){
						var evt=_status.event;
						return evt.goon*get.attitude(evt.player,target);
					});
					'step 2'
					if(result.bool){
						var targets=result.targets.sortBySeat();
						player.line(targets,'green');
						if(event.index==0) game.asyncDraw(targets);
						else{
							for(var i of targets) i.chooseToDiscard('he',true);
							event.finish();
						}
					}
					'step 3'
					game.delayx();
				},
			},
			gzjinghe:{
				audio:'jinghe',
				enable:'phaseUse',
				filter:function(event,player){
					return player.maxHp>0&&player.countCards('h')>0&&!player.hasSkill('gzjinghe_clear');
				},
				selectCard:function(){
					var max=_status.event.player.maxHp;
					if(ui.selected.targets.length) return [ui.selected.targets.length,max];
					return [1,max];
				},
				selectTarget:function(){
					return ui.selected.cards.length;
				},
				filterTarget:function(card,player,target){
					return !target.isUnseen();
				},
				filterCard:function(card){
					if(ui.selected.cards.length){
						var name=get.name(card);
						for(var i of ui.selected.cards){
							if(get.name(i)==name) return false;
						}
					}
					return true;
				},
				position:'h',
				check:function(card){
					var player=_status.event.player;
					if(game.countPlayer(function(current){
						return get.attitude(player,current)>0&&!current.isUnseen();
					})>ui.selected.cards.length) return get.position(card)=='e'?2:1;
					return 0;
				},
				complexCard:true,
				discard:false,
				lose:false,
				delay:false,
				multitarget:true,
				multiline:true,
				content:function(){
					'step 0'
					player.showCards(cards,get.translation(player)+'发动了【经合】');
					event.skills=lib.skill.gzjinghe.derivation.randomGets(targets.length);
					player.addTempSkill('gzjinghe_clear',{player:'phaseBegin'});
					event.targets.sortBySeat();
					event.num=0;
					'step 1'
					event.target=targets[num];
					event.num++;
					event.target.chooseControl(event.skills,'cancel2').set('choiceList',event.skills.map(function(i){
						return '<div class="skill">【'+get.translation(lib.translate[i+'_ab']||get.translation(i).slice(0,2))+'】</div><div>'+get.skillInfoTranslation(i,player)+'</div>';
					})).set('displayIndex',false).set('prompt','选择获得一个技能');
					'step 2'
					var skill=result.control;
					if(skill!='cancel2'){
						event.skills.remove(skill);
						target.addAdditionalSkill('gzjinghe_'+player.playerid,skill);
						target.popup(skill);
						game.log(target,'获得了技能','#g【'+get.translation(skill)+'】');
					}
					if(event.num<event.targets.length) event.goto(1);
					if(target!=game.me&&!target.isOnline2()) game.delayx();
				},
				ai:{
					threaten:3,
					order:10,
					result:{
						target:1,
					},
				},
				derivation:['releiji','nhyinbing','nhhuoqi','nhguizhu','nhxianshou','nhlundao','nhguanyue','nhyanzheng'],
				subSkill:{
					clear:{
						onremove:function(player){
							game.countPlayer(function(current){
								current.removeAdditionalSkill('gzjinghe_'+player.playerid);
							});
						},
					},
				},
			},
			//孙綝
			gzshilu:{
				audio:2,
				preHidden:true,
				trigger:{global:'dieAfter'},
				prompt2:function(event,player){
					return '将其的所有武将牌'+(player==event.source?'及武将牌库里的两张随机武将牌':'')+'置于武将牌上作为“戮”';
				},
				logTarget:'player',
				content:function(){
					var list=[],target=trigger.player;
					if(target.name1&&target.name1.indexOf('gz_shibing')!=0&&_status.characterlist.contains(target.name1)) list.push(target.name1);
					if(target.name2&&target.name2.indexOf('gz_shibing')!=0&&_status.characterlist.contains(target.name1)) list.push(target.name2);
					_status.characterlist.removeArray(list);
					if(player==trigger.source) list.addArray(_status.characterlist.randomRemove(2));
					if(list.length){
						player.markAuto('gzshilu',list);
						game.log(player,'将','#g'+get.translation(list),'置于武将牌上作为','#y“戮”');
						game.broadcastAll(function(player,list){
							var cards=[];
							for(var i=0;i<list.length;i++){
								var cardname='huashen_card_'+list[i];
								lib.card[cardname]={
									fullimage:true,
									image:'character:'+list[i]
								}
								lib.translate[cardname]=get.rawName2(list[i]);
								cards.push(game.createCard(cardname,'',''));
							}
							player.$draw(cards,'nobroadcast');
						},player,list);
					}
				},
				marktext:'戮',
				intro:{
					content:'character',
					onunmark:function(storage,player){
						if(storage&&storage.length){
							_status.characterlist.addArray(storage)
							storage.length=0;
						}
					},
					mark:function(dialog,storage,player){
						if(storage&&storage.length){
							dialog.addSmall([storage,'character']);
						}
						else{
							return '没有“戮”';
						}
					},
					content:function(storage,player){
							return '共有'+get.cnNumber(storage.length)+'张“戮”';
					},
				},
				group:'gzshilu_zhiheng',
				subSkill:{
					zhiheng:{
						audio:'gzshilu',
						trigger:{player:'phaseZhunbeiBegin'},
						filter:function(event,player){
							return player.getStorage('gzshilu').length>0&&player.countCards('he')>0;
						},
						direct:true,
						content:function(){
							'step 0'
							var num=Math.min(player.getStorage('gzshilu').length,player.countCards('he'));
							player.chooseToDiscard('he',get.prompt('gzshilu'),'弃置至多'+get.cnNumber(num)+'张牌并摸等量的牌',[1,num]).logSkill='gzshilu';
							'step 1'
							if(result.bool&&result.cards&&result.cards.length) player.draw(result.cards.length);
						},
					},
				},
			},
			gzxiongnve:{
				audio:2,
				trigger:{player:'phaseUseBegin'},
				direct:true,
				filter:function(event,player){
					return player.getStorage('gzshilu').length>0;
				},
				content:function(){
					'step 0'
					player.chooseButton([get.prompt('gzxiongnve'),[player.storage.gzshilu,'character']]).set('ai',function(button){
						if(!_status.event.goon) return 0;
						var name=button.link,group=get.is.double(name,true);
						if(!group) group=[lib.character[name][1]];
						for(var i of group){
							if(game.hasPlayer(function(current){
								return player.inRange(current)&&current.identity==i;
							})) return 1+Math.random();
						}
						return 0;
					}).set('goon',player.countCards('hs',function(card){
						return get.tag(card,'damage')&&player.hasValueTarget(card);
					})>1);
					'step 1'
					if(result.bool){
						player.logSkill('gzxiongnve');
						lib.skill.gzxiongnve.throwCharacter(player,result.links);
						game.delayx();
						var group=get.is.double(result.links[0],true);
						if(!group) group=[lib.character[result.links[0]][1]];
						event.group=group;
						var str=get.translation(group);
						player.chooseControl().set('prompt','选择获得一项效果').set('choiceList',[
							'本回合对'+str+'势力的角色造成的伤害+1',
							'本回合对'+str+'势力的角色造成伤害后，获得对方的一张牌',
							'本回合对'+str+'势力的角色使用牌没有次数限制',
						]).set('ai',function(){
							var player=_status.event.player;
							if(player.countCards('hs',function(card){
								return get.name(card)=='sha'&&player.hasValueTarget(card);
							})>player.getCardUsable('sha')) return 0;
							return get.rand(1,2);
						});
					}
					else event.finish();
					'step 2'
					var skill='gzxiongnve_effect'+result.index;
					player.markAuto(skill,event.group);
					player.addTempSkill(skill);
					game.log(player,'本回合对'+get.translation(event.group)+'势力的角色','#g'+lib.skill[skill].promptx)
				},
				group:'gzxiongnve_end',
				throwCharacter:function(player,list){
					player.unmarkAuto('gzshilu',list);
					_status.characterlist.addArray(list);
					game.log(player,'从','#y“戮”','中移去了','#g'+get.translation(list));
					game.broadcastAll(function(player,list){
						var cards=[];
						for(var i=0;i<list.length;i++){
							var cardname='huashen_card_'+list[i];
							lib.card[cardname]={
								fullimage:true,
								image:'character:'+list[i]
							}
							lib.translate[cardname]=get.rawName2(list[i]);
							cards.push(game.createCard(cardname,'',''));
						}
						player.$throw(cards,1000,'nobroadcast');
					},player,list);
				},
				subSkill:{
					effect0:{
						promptx:'造成的伤害+1',
						charlotte:true,
						onremove:true,
						audio:'gzxiongnve',
						intro:{
							content:'对$势力的角色造成的伤害+1',
						},
						trigger:{source:'damageBegin1'},
						forced:true,
						filter:function(event,player){
							return player.getStorage('gzxiongnve_effect0').contains(event.player.identity);
						},
						logTarget:'player',
						content:function(){
							trigger.num++;
						},
					},
					effect1:{
						promptx:'造成伤害后，获得对方的一张牌',
						charlotte:true,
						onremove:true,
						audio:'gzxiongnve',
						intro:{
							content:'对$势力的角色造成伤害后，获得对方的一张牌',
						},
						trigger:{source:'damageEnd'},
						forced:true,
						filter:function(event,player){
							return player.getStorage('gzxiongnve_effect1').contains(event.player.identity)&&event.player.countGainableCards(player,'he')>0;
						},
						logTarget:'player',
						content:function(){
							player.gainPlayerCard(trigger.player,true,'he');
						}
					},
					effect2:{
						promptx:'使用牌没有次数限制',
						charlotte:true,
						onremove:true,
						intro:{
							content:'对$势力的角色使用牌没有次数限制',
						},
						mod:{
							cardUsableTarget:function(card,player,target){
								if(player.getStorage('gzxiongnve_effect2').contains(target.identity)) return true;
							},
						},
					},
					effect3:{
						charlotte:true,
						audio:'gzxiongnve',
						mark:true,
						intro:{
							content:'受到的伤害-1',
						},
						trigger:{player:'damageBegin3'},
						forced:true,
						content:function(){
							trigger.num--;
						},
						ai:{
							effect:{
								target:function(card,player,target){
									if(player.hasSkillTag('jueqing',false,target)) return;
									var num=get.tag(card,'damage');
									if(num){
										if(num>1) return 0.5;
										return 0;
									}
								}
							}
						},
					},
					end:{
						trigger:{player:'phaseUseEnd'},
						direct:true,
						filter:function(event,player){
							return player.getStorage('gzshilu').length>1;
						},
						content:function(){
							'step 0'
							player.chooseButton(['是否移去两张“戮”获得减伤？',[player.storage.gzshilu,'character']],2).set('ai',function(button){
								var name=button.link,group=get.is.double(name,true);
								if(!group) group=[lib.character[name][1]];
								for(var i of group){
									if(game.hasPlayer(function(current){
										return current.identity==i;
									})) return 0;
								}
								return 1;
							});
							'step 1'
							if(result.bool){
								player.logSkill('gzxiongnve');
								lib.skill.gzxiongnve.throwCharacter(player,result.links);
								player.addTempSkill('gzxiongnve_effect3',{player:'phaseBegin'});
								game.delayx();
							}
						},
					},
				},
			},
			//邓芝
			gzjianliang:{
				audio:2,
				trigger:{player:'phaseDrawBegin2'},
				frequent:true,
				preHidden:true,
				filter:function(event,player){
					return player.isMinHandcard();
				},
				logTarget:function(event,player){
					var isFriend;
					if(player.identity=='unknown'){
						var group='shu';
						if(!player.wontYe('shu')) group=null;
						isFriend=function(current){
							return current==player||current.identity==group;
						}
					}
					else isFriend=function(target){
						return target.isFriendOf(player);
					};
					return game.filterPlayer(isFriend);
				},
				content:function(){
					'step 0'
					var list=game.filterPlayer(function(current){
						return current.isFriendOf(player);
					});
					if(list.length==1){
						list[0].draw();
						event.finish();
					}
					else game.asyncDraw(list);
					'step 1'
					game.delayx();
				},
			},
			gzweimeng:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return target!=player&&target.countGainableCards(player,'h')>0;
				},
				content:function(){
					'step 0'
					player.gainPlayerCard(target,'h',true,event.name=='gzweimeng'?[1,player.hp]:1);
					'step 1'
					if(result.bool&&target.isIn()){
						var num=result.cards.length,hs=player.getCards('he');
						if(!hs.length) event.goto(3);
						else if(hs.length<=num) event._result={bool:true,cards:hs};
						else player.chooseCard('he',true,'选择交给'+get.translation(target)+get.cnNumber(num)+'张牌',num);
					}
					else event.goto(3);
					'step 2'
					player.give(result.cards,target);
					'step 3'
					if(target.isIn()&&event.name=='gzweimeng') player.chooseBool('纵横：是否令'+get.translation(target)+'获得【危盟】？').set('ai',function(){
						var evt=_status.event.getParent();
						return get.attitude(evt.player,evt.target)>0;
					});
					else event.finish();
					'step 4'
					if(result.bool){
						target.addTempSkill('gzweimeng_zongheng',{player:'phaseEnd'});
						game.log(player,'发起了','#y纵横','，令',target,'获得了技能','#g【危盟】');
					}
				},
				derivation:'gzweimeng_zongheng',
				subSkill:{
					zongheng:{
						inherit:'gzweimeng',
						ai:{
							order:6,
							tag:{
								lose:1,
								loseCard:1,
								gain:1,
							},
							result:{
								target:-1,
							},
						},
					},
				},
				ai:{
					order:6,
					tag:{
						lose:1,
						loseCard:1,
						gain:1,
					},
					result:{
						target:function(player,target){
							return -Math.pow(Math.min(player.hp,target.countCards('h')),2)/4;
						},
					},
				},
			},
			//邹氏
			huoshui:{
				audio:2,
				forced:true,
				global:'huoshui_mingzhi',
				trigger:{player:'useCardToTargeted'},
				preHidden:true,
				filter:function(event,player){
					return (event.card.name=='sha'||event.card.name=='wanjian')&&event.target.isUnseen(2)&&event.target.isEnemyOf(player);
				},
				logTarget:'target',
				content:function(){
					var target=trigger.target;
					target.addTempSkill('huoshui_norespond');
					target.markAuto('huoshui_norespond',[trigger.card]);
				},
			},
			huoshui_norespond:{
				charlotte:true,
				trigger:{global:'useCardEnd'},
				onremove:true,
				forced:true,
				popup:false,
				silent:true,
				firstDo:true,
				filter:function(event,player){
					return player.getStorage('huoshui_norespond').contains(event.card);
				},
				content:function(){
					player.unmarkAuto('huoshui_norespond',[trigger.card]);
					if(!player.storage.huoshui_norespond.length) player.removeSkill('huoshui_norespond');
				},
				mod:{
					cardEnabled:function(card){
						if(card.name=='shan') return false;
					},
					cardRespondable:function(card){
						if(card.name=='shan') return false;
					},
				},
			},
			huoshui_mingzhi:{
				ai:{
					nomingzhi:true,
					skillTagFilter:function(player){
						if(_status.currentPhase&&_status.currentPhase!=player&&_status.currentPhase.hasSkill('huoshui')){
							return true;
						}
						return false;
					}
				}
			},
			qingcheng:{
				audio:2,
			},
			qingcheng_ai:{
				ai:{
					effect:{
						target:function(card){
							if(get.tag(card,'damage')) return 2;
						}
					}
				}
			},
			//朱灵
			gzjuejue:{
				audio:2,
				trigger:{player:'phaseDiscardBegin'},
				check:function(event,player){
					return player.hp>2&&player.needsToDiscard()>0&&game.countPlayer(function(current){
						return get.attitude(current,player)<=0;
					})>game.countPlayer()/2;
				},
				preHidden:true,
				content:function(){
					player.addTempSkill('gzjuejue_effect');
					player.loseHp();
				},
				subSkill:{
					effect:{
						trigger:{player:'phaseDiscardAfter'},
						forced:true,
						charlotte:true,
						popup:false,
						filter:function(event,player){
							return player.getHistory('lose',function(evt){
								return evt.type=='discard'&&evt.cards2&&evt.cards2.length>0&&evt.getParent('phaseDiscard')==event;
							}).length>0;
						},
						content:function(){
							'step 0'
							var num=0;
							player.getHistory('lose',function(evt){
								if(evt.type=='discard'&&evt.getParent('phaseDiscard')==trigger) num+=evt.cards2.length;
							});
							event.num=num;
							event.targets=game.filterPlayer(function(current){
								return current!=player;
							}).sortBySeat();
							player.line(event.targets,'green');
							'step 1'
							var target=targets.shift();
							event.target=target;
							if(target.isIn()){
								target.animate('target');
								target.chooseCard('h',num,'将'+get.cnNumber(num)+'张牌置入弃牌堆，或受到1点伤害').set('ai',function(card){
									var evt=_status.event.getParent();
									if(get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
									return (8/Math.sqrt(evt.num)+evt.target.getDamagedHp())-get.value(card);
								});
							}
							else if(targets.length) event.redo();
							else event.finish();
							'step 2'
							if(result.bool){
								target.lose(result.cards,ui.discardPile,'visible');
								target.$throw(result.cards,1000);
								game.log(target,'将',result.cards,'置入了弃牌堆');
							}
							else target.damage();
							'step 3'
							game.delayx();
							if(targets.length) event.goto(1);
						},
					},
				},
				ai:{
					noDieAfter2:true,
					skillTagFilter:function(player,tag,target){
						return target.isFriendOf(player);
					},
				},
			},
			gzfangyuan:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				zhenfa:'siege',
				direct:true,
				locked:true,
				filter:function(event,player){
					return game.countPlayer()>4&&game.hasPlayer(function(current){
						return player.sieged(current)&&player.canUse('sha',current,false);
					});
				},
				preHidden:true,
				content:function(){
					'step 0'
					var list=game.filterPlayer(function(current){
						return player.sieged(current)&&player.canUse('sha',current,false);
					});
					if(player.hasSkill('gzfangyuan')){
						if(list.length==1) event._result={bool:true,targets:list};
						else player.chooseTarget('方圆：视为对一名围攻你的角色使用【杀】',function(card,player,target){
							return _status.event.list.contains(target);
						},true).set('list',list).set('ai',function(target){
							var player=_status.event.player;
							return get.effect(target,{name:'sha',isCard:true},player,player);
						}).setHiddenSkill('gzfangyuan');
					}
					else{
						player.chooseTarget(get.prompt('gzfangyuan'),'视为对一名围攻你的角色使用【杀】',function(card,player,target){
							return _status.event.list.contains(target);
						}).set('list',list).set('ai',function(target){
							var player=_status.event.player;
							return get.effect(target,{name:'sha',isCard:true},player,player);
						});
					}
					'step 1'
					if(result.bool){
						player.useCard({name:'sha',isCard:true},result.targets[0],'gzfangyuan',false);
					}
				},
				global:'gzfangyuan_siege',
				subSkill:{
					siege:{
						mod:{
							maxHandcard:function(player,num){
								if(game.countPlayer()<4) return;
								var next=player.getNext(),prev=player.getPrevious(),siege=[];
								if(player.siege(next)) siege.push(next.getNext());
								if(player.siege(prev)) siege.push(prev.getPrevious());
								if(siege.length){
									siege.push(player);
									num+=siege.filter(function(source){
										return source.hasSkill('gzfangyuan');
									}).length;
								}
								if(player.sieged()){
									if(next.hasSkill('gzfangyuan')) num--;
									if(prev.hasSkill('gzfangyuan')) num--;
								}
								return num;
							},
						},
					},
				},
			},
			//彭羕
			daming:{
				audio:2,
				trigger:{global:'phaseUseBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					if(!player.isFriendOf(event.player)||!game.hasPlayer(function(current){
						return !current.isLinked();
					})) return false;
					if(_status.connectMode&&player.hasSkill('daming')) return player.countCards('h')>0;
					return player.countCards('h',function(card){
						return get.type2(card,player)=='trick';
					});
				},
				content:function(){
					'step 0'
					player.chooseCardTarget({
						prompt:get.prompt('daming'),
						prompt2:'弃置一张锦囊牌并选择要横置的角色',
						filterCard:function(card,player){
							return get.type2(card,player)=='trick'&&lib.filter.cardDiscardable(card,player,'daming');
						},
						filterTarget:function(card,player,target){
							return !target.isLinked();
						},
						goon:function(){
							var target=trigger.player;
							if(player.canUse('tao',target)&&get.effect(target,{name:'tao',isCard:true},player,player)>0) return true;
							var card={name:'sha',nature:'thunder',isCard:true};
							if(game.hasPlayer(function(current){
								return current!=player&&current!=target&&target.canUse(card,current,false)&&get.effect(current,card,target,player)>0;
							})) return true;
							return false;
						}(),
						ai1:function(card){
							if(_status.event.goon) return 7-get.value(card);
							return 0;
						},
						ai2:function(target){
							var player=_status.event.player;
							return ((target.identity!='unknown'&&!game.hasPlayer(function(current){
								return current!=target&&current.isFriendOf(target)&&current.isLinked();
							}))?3:1)*(-get.attitude(target,player,player)+1);
						},
					}).setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						event.target=target;
						player.logSkill('daming',target);
						player.discard(result.cards);
					}
					else event.finish();
					'step 2'
					if(!target.isLinked()) target.link();
					'step 3'
					var map={},sides=[],pmap=_status.connectMode?lib.playerOL:game.playerMap,player;
					for(var i of game.players){
						if(i.identity=='unknown') continue;
						var added=false;
						for(var j of sides){
							if(i.isFriendOf(pmap[j])){
								added=true;
								map[j].push(i);
								if(i==this) player=j;
								break;
							}
						}
						if(!added){
							map[i.playerid]=[i];
							sides.push(i.playerid);
							if(i==this) player=i.playerid;
						}
					}
					var num=0;
					for(var i in map){
						if(map[i].filter(function(i){
							return i.isLinked();
						}).length) num++;
					}
					if(num>0) player.draw(num);
					'step 4'
					if(trigger.player.isIn()){
						var target=trigger.player,tao=(lib.filter.cardEnabled({name:'tao',isCard:true},player,'forceEnable')&&lib.filter.targetEnabled2({name:'tao',isCard:true},player,target)),sha=game.filterPlayer(function(current){
							return current!=target&&current!=player&&target.canUse({name:'sha',nature:'thunder',isCard:true},current,false);
						});
						if(sha.length){
							var next=player.chooseTarget('请选择'+get.translation(target)+'使用雷【杀】的目标',function(card,player,target){
								return _status.event.list.contains(target);
							});
							if(tao){
								next.set('prompt2','或点「取消」并视为对其使用【桃】');
								next.set('goon',get.effect(target,{name:'tao',isCard:true},player,player));
							}
							else{
								next.set('forced',true);
								next.set('goon',0);
							}
							next.set('list',sha);
							next.set('ai',function(target){
								var player=_status.event.player;
								return get.effect(target,{name:'sha',nature:'thunder',isCard:true},_status.event.getTrigger().player,player)-_status.event.goon;
							});
						}
						else if(tao) event._result={bool:false};
						else event.finish();
					}
					else event.finish();
					'step 5'
					if(result.bool){
						var target=result.targets[0];
						if(player==trigger.player) player.line(target);
						else{
							player.line2([trigger.player,target]);
							game.delay(0.5);
						}
						trigger.player.useCard({name:'sha',nature:'thunder',isCard:true},target,false).animate=false;
					}
					else player.useCard({name:'tao',isCard:true},trigger.player);
				},
			},
			xiaoni:{
				audio:2,
				trigger:{
					player:'useCard',
					target:'useCardToTargeted',
				},
				forced:true,
				filter:function(event,player){
					var type=get.type2(event.card);
					if(type!='basic'&&type!='trick') return false;
					var list=game.filterPlayer(function(current){
						return current!=player&&current.isFriendOf(player);
					});
					if(!list.length) return false;
					var hs=player.countCards('h');
					for(var i of list){
						if(i.countCards('h')>hs) return false;
					}
					return true;
				},
				check:()=>false,
				preHidden:true,
				content:function(){
					if(trigger.name=='useCard') trigger.directHit.addArray(game.players);
					else trigger.directHit.add(player);
				},
				global:'xiaoni_ai',
				ai:{
					halfneg:true,
					directHit_ai:true,
					skillTagFilter:function(player,tag,arg){
						if(!arg.card) return false;
						var type=get.type2(arg.card);
						if(type!='basic'&&type!='trick') return false;
						var list=game.filterPlayer(function(current){
							return current!=player&&current.isFriendOf(player);
						});
						if(!list.length) return false;
						var cards=[arg.card];
						if(arg.card.cards) cards.addArray(arg.card.cards);
						cards.addArray(ui.selected.cards);
						var hhs=function(card){
							return !cards.contains(card);
						};
						var hs=player.countCards('h',hhs);
						for(var i of list){
							if(i.countCards('h',hhs)>hs) return false;
						}
						return true;
					},
				},
				subSkill:{
					ai:{
						ai:{
							directHit_ai:true,
							skillTagFilter:function(playerx,tag,arg){
								if(!arg.card) return false;
								var type=get.type2(arg.card);
								if(type!='basic'&&type!='trick') return false;
								var player;
								if(arg.target&&arg.target.hasSkill('xiaoni')) player=arg.target;
								else return false;
								var list=game.filterPlayer(function(current){
									return current!=player&&current.isFriendOf(player);
								});
								if(!list.length) return false;
								var cards=[arg.card];
								if(arg.card.cards) cards.addArray(arg.card.cards);
								cards.addArray(ui.selected.cards);
								var hhs=function(card){
									return !cards.contains(card);
								};
								var hs=player.countCards('h',hhs);
								for(var i of list){
									if(i.countCards('h',hhs)>hs) return false;
								}
								return true;
							},
						},
					},
				},
			},
			//刘巴
			gztongduo:{
				audio:2,
				trigger:{global:'phaseJieshuBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					if(player!=event.player&&!player.hasSkill('gztongduo')||!event.player.isFriendOf(player)) return false;
					return event.player.getHistory('lose',function(evt){
						return evt.type=='discard'&&evt.cards2.length>0&&evt.getParent('phaseDiscard').player==event.player;
					}).length>0;
				},
				content:function(){
					'step 0'
					var num=0;
					trigger.player.getHistory('lose',function(evt){
						if(evt.type=='discard'&&evt.getParent('phaseDiscard').player==trigger.player) num+=evt.cards2.length;
					});
					num=Math.min(3,num);
					event.num=num;
					var next=trigger.player.chooseBool('是否发动【统度】摸'+get.cnNumber(num)+'张牌？');
					if(player==trigger.player) next.setHiddenSkill('gztongduo');
					'step 1'
					if(result.bool){
						player.logSkill('gztongduo',trigger.player);
						trigger.player.draw(num);
					}
				},
			},
			qingyin:{
				audio:2,
				enable:'phaseUse',
				limited:true,
				delay:false,
				filter:function(event,player){
					var isFriend;
					if(player.identity=='unknown'){
						var group='shu';
						if(!player.wontYe('shu')) group=null;
						isFriend=function(current){
							return current==player||current.identity==group;
						}
					}
					else isFriend=function(target){
						return target.isFriendOf(player);
					};
					return game.hasPlayer(function(current){
						return isFriend(current)&&current.isDamaged();
					});
				},
				selectTarget:-1,
				filterTarget:function(card,player,target){;
					if(player==target) return true;
					if(player.identity=='unknown'){
						var group='shu';
						if(!player.wontYe('shu')) return false;
						return target.identity==group;
					}
					return target.isFriendOf(player);
				},
				selectCard:[0,1],
				filterCard:()=>false,
				multitarget:true,
				multiline:true,
				skillAnimation:true,
				animationColor:'orange',
				content:function(){
					'step 0'
					player.awakenSkill('qingyin');
					event.num=0;
					'step 1'
					if(targets[num].isDamaged()){
						targets[num].recover(targets[num].maxHp-targets[num].hp);
					}
					event.num++;
					if(event.num<targets.length) event.redo();
					'step 2'
					if(lib.character[player.name1][3].contains('qingyin')) player.removeCharacter(0);
					if(lib.character[player.name2][3].contains('qingyin')) player.removeCharacter(1);
				},
				ai:{
					order:function(item,player){
						var isFriend;
						if(player.identity=='unknown'){
							var group='shu';
							if(!player.wontYe('shu')) group=null;
							isFriend=function(current){
								return current==player||current.identity==group;
							}
						}
						else isFriend=function(target){
							return target.isFriendOf(player);
						};
						var targets=game.filterPlayer(function(current){
							return isFriend(current);
						});
						var num=0,max=0;
						for(var i of targets){
							var dam=i.maxHp-i.hp;
							num+=dam;
							max+=i.maxHp;
						}
						return (num/max)>=(1/Math.max(1.6,game.roundNumber))?1:-1;
					},
					result:{
						player:1,
					},
				},
			},
			//苏飞
			gzlianpian:{
				audio:2,
				trigger:{global:'phaseJieshuBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					if(player!=event.player&&!player.hasSkill('gzlianpian')) return false;
					var num=0;
					game.getGlobalHistory('cardMove',function(evt){
						if(evt.name=='lose'&&evt.type=='discard'&&evt.getParent(2).player==event.player) num+=evt.cards2.length;
					});
					if(num<=player.hp) return false;
					if(player==event.player) return game.hasPlayer(function(current){
						return current.isFriendOf(player)&&current.countCards('h')<current.maxHp;
					});
					return player.countDiscardableCards('he',event.player)>0||player.isDamaged();
				},
				content:function(){
					'step 0'
					if(player==trigger.player){
						player.chooseTarget(get.prompt('gzlianpian'),'令一名己方角色将手牌摸至手牌上限',function(card,player,target){
							return target.isFriendOf(player)&&target.maxHp>target.countCards('h');
						}).set('ai',function(target){
							var att=get.attitude(_status.event.player,target);
							if(target.hasSkillTag('nogain')) att/=6;
							if(att>2){
								return Math.min(5,target.maxHp)-target.countCards('h');
							}
							return att/3;
						}).setHiddenSkill(event.name);
					}
					else{
						event.goto(2);
						event.addIndex=0;
						var list=[],target=trigger.player,str=get.translation(player);
						event.target=target;
						if(player.countDiscardableCards('he',target)>0) list.push('弃置'+str+'的一张牌');
						else event.addIndex++;
						if(player.isDamaged()) list.push('令'+str+'回复1点体力');
						target.chooseControl('cancel2').set('choiceList',list).set('ai',function(){
							var evt=_status.event.getParent();
							if(get.attitude(evt.target,evt.player)>0) return 1-evt.addIndex;
							return evt.addIndex;
						}).set('prompt','是否对'+str+'发动【连翩】？');
					}
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('gzlianpian',target);
						target.draw(Math.min(5,target.maxHp-target.countCards('h')));
					}
					event.finish();
					'step 2'
					if(result.control=='cancel2'){
						event.finish();
						return;
					}
					player.logSkill('gzlianpian',target,false);
					target.line(player,'green');
					if(result.index+event.addIndex==0){
						target.discardPlayerCard('he',player,true);
						event.finish();
					}
					else player.recover();
					'step 3'
					game.delayx();
				},
			},
			//冯熙
			gzyusui:{
				audio:'yusui',
				trigger:{target:'useCardToTargeted'},
				filter:function(event,player){
					return event.player!=player&&event.player.isIn()&&event.player.isEnemyOf(player)&&get.color(event.card)=='black';
				},
				logTarget:'player',
				check:function(event,player){
					var target=event.player;
					if(player.hp<3||get.attitude(player,target)>-3) return false;
					if(player.hp<target.hp) return true;
					if(Math.min(target.maxHp,target.countCards('h'))>3) return true;
					return false;
				},
				preHidden:true,
				content:function(){
					'step 0'
					player.loseHp();
					event.target=trigger.player;
					'step 1'
					event.addIndex=0;
					var list=[];
					if(target.maxHp>0&&target.countCards('h')>0) list.push('令其弃置'+get.cnNumber(target.maxHp)+'张手牌');
					else event.addIndex++;
					if(target.hp>player.hp) list.push('令其失去'+get.cnNumber(target.hp-player.hp)+'点体力');
					if(!list.length) event.finish();
					else if(list.length==1) event._result={index:0};
					else player.chooseControl().set('choiceList',list).set('prompt','令'+get.translation(target)+'执行一项').set('ai',function(){
						var player=_status.event.player,target=_status.event.getParent().target;
						return (target.hp-player.hp)>(Math.min(target.maxHp,target.countCards('h'))/2)?1:0;
					});
					'step 2'
					if(result.index+event.addIndex==0) target.chooseToDiscard(target.maxHp,true,'h');
					else target.loseHp(target.hp-player.hp);
				},
			},
			gzboyan:{
				audio:'boyan',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return game.hasPlayer((target)=>lib.skill.gzboyan.filterTarget(null,player,target));
				},
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('h')<target.maxHp;
				},
				content:function(){
					'step 0'
					target.draw(Math.min(5,target.maxHp-target.countCards('h')));
					'step 1'
					target.addTempSkill('gzboyan_block');
					'step 2'
					if(target.isIn()) player.chooseBool('纵横：是否令'+get.translation(target)+'获得【驳言】？').set('ai',function(){
						var evt=_status.event.getParent();
						return get.attitude(evt.player,evt.target)>0;
					});
					else event.finish();
					'step 3'
					if(result.bool){
						target.addTempSkill('gzboyan_zongheng',{player:'phaseEnd'});
						game.log(player,'发起了','#y纵横','，令',target,'获得了技能','#g【驳言】');
					}
				},
				derivation:'gzboyan_zongheng',
				subSkill:{
					zongheng:{
						enable:'phaseUse',
						usable:1,
						filterTarget:lib.filter.notMe,
						content:function(){
							target.addTempSkill('gzboyan_block');
						},
						ai:{
							order:4,
							result:{
								target:function(player,target){
									if(target.countCards('h','shan')&&!target.hasSkillTag('respondShan',true,null,true)&&player.countCards('h',function(card){
										return get.tag(card,'respondShan')&&get.effect(target,card,player,player)>0&&player.getUseValue(card)>0;
									})) return -target.countCards('h');
									return -0.5;
								},
							},
						},
					},
					block:{
						mark:true,
						intro:{content:'不能使用或打出手牌'},
						charlotte:true,
						mod:{
							cardEnabled2:function(card){
								if(get.position(card)=='h') return false;
							},
						},
					},
				},
				ai:{
					order:4,
					result:{
						target:function(player,target){
							if(get.attitude(player,target)>0) return Math.min(5,target.maxHp-target.countCards('h'));
							if(target.maxHp-target.countCards('h')==1&&target.countCards('h','shan')&&!target.hasSkillTag('respondShan',true,null,true)&&player.countCards('h',function(card){
								return get.tag(card,'respondShan')&&get.effect(target,card,player,player)>0&&player.getUseValue(card,null,true)>0;
							})) return -2;
						},
					},
				},
			},
			//文钦
			gzjinfa:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.countCards('he')>0&&game.hasPlayer(function(current){
						return current!=player&&current.countCards('he')>0;
					})
				},
				filterCard:true,
				position:'he',
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('he')>0;
				},
				check:function(card){
					return 6-get.value(card);
				},
				content:function(){
					'step 0'
					target.chooseCard('he','交给'+get.translation(player)+'一张装备牌，或令其获得你的一张牌',{type:'equip'}).set('ai',function(card){
						if(_status.event.goon&&get.suit(card)=='spade') return 8-get.value(card);
						return 5-get.value(card);
					}).set('goon',target.canUse('sha',player,false)&&get.effect(player,{name:'sha'},target,target)>0);
					'step 1'
					if(!result.bool){
						player.gainPlayerCard(target,'he',true);
						event.finish();
					}
					else target.give(result.cards,player);
					'step 2'
					if(result.bool&&result.cards&&result.cards.length&&
					target.isIn()&&player.isIn()&&get.suit(result.cards[0],target)=='spade'&&target.canUse('sha',player,false)) target.useCard({name:'sha',isCard:true},false,player);
				},
				ai:{
					order:6,
					result:{
						player:function(player,target){
							if(target.countCards('e',function(card){
								return get.suit(card)=='spade'&&get.value(card)<8;
							})&&target.canUse('sha',player,false)) return get.effect(player,{name:'sha'},target,player);
							return 0;
						},
						target:function(player,target){
							var es=target.getCards('e').sort(function(a,b){
								return get.value(b,target)-get.value(a,target);
							});
							if(es.length) return -Math.min(2,get.value(es[0]))
							return -2;
						},
					},
				},
			},
			//诸葛恪
			gzduwu:{
				limited:true,
				audio:2,
				enable:'phaseUse',
				delay:false,
				filter:function(event,player){
					var isEnemy;
					if(player.identity=='unknown'){
						if(!player.wontYe('wu')) isEnemy=function(current){
							return current!=player;
						};
						else isEnemy=function(current){
							return current!=player&&current.identity!='wu';
						}
					}
					else isEnemy=function(target){
						return target.isEnemyOf(player);
					};
					return game.hasPlayer(function(current){
						return isEnemy(current)&&player.inRange(current);
					});
				},
				filterTarget:function(card,player,target){
					if(player==target||!player.inRange(target)) return false;
					if(player.identity=='unknown'){
						if(!player.wontYe('wu')) return true;
						return target.identity!='wu';
					}
					return target.isEnemyOf(player);
				},
				selectTarget:-1,
				filterCard:()=>false,
				selectCard:[0,1],
				multitarget:true,
				multiline:true,
				content:function(){
					'step 0'
					player.awakenSkill('gzduwu');
					player.addSkill('gzduwu_count');
					targets.sortBySeat();
					event.players=targets.slice(0);
					game.delayx();
					player.chooseJunlingFor(event.players[0]).set('prompt','为所有目标角色选择军令牌');
					'step 1'
					event.junling=result.junling;
					event.targets=result.targets;
					event.num=0;
					'step 2'
					if(num<event.players.length) event.current=event.players[num];
					if(event.current&&event.current.isAlive()){
						event.current.chooseJunlingControl(player,event.junling,targets).set('prompt','黩武').set('choiceList',[
							'执行该军令',
							'不执行该军令并受到1点伤害',
						]).set('ai',function(){
							var evt=_status.event.getParent(2);
							return get.junlingEffect(evt.player,evt.junling,evt.current,evt.targets,evt.current)>(get.damageEffect(evt.current,evt.player,evt.current)/get.attitude(evt.current,evt.current))?0:1;
						});
					}
					else event.goto(4);
					'step 3'
					if(result.index==0){
						event.current.carryOutJunling(player,event.junling,targets);
					}
					else{
						player.draw();
						event.current.damage();
					}
					'step 4'
					game.delayx();
					event.num++;
					if(event.num<event.players.length) event.goto(2);
					'step 5'
					var list=player.getStorage('gzduwu_count').filter(function(target){
						return target.isAlive();
					});
					if(list.length) player.loseHp();
					player.removeSkill('gzduwu_count');
				},
				animationColor:'wood',
				ai:{
					order:2,
					result:{
						player:function(player){
							if(game.countPlayer(function(current){
								return !current.isFriendOf(player)&&!player.inRange(current);
							})<=Math.min(2,Math.max(0,game.roundNumber-1))) return 1;
							if(player.hp==1) return 1;
							return 0;
						}
					},
				},
				subSkill:{
					count:{
						sub:true,
						trigger:{global:'dyingBegin'},
						silent:true,
						charlotte:true,
						filter:function(event,player){
							return event.getParent('gzduwu').player==player;
						},
						content:function(){
							player.markAuto('gzduwu_count',[trigger.player]);
						}
					}
				},
			},
			//黄祖
			gzxishe:{
				audio:2,
				trigger:{global:'phaseZhunbeiBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return event.player!=player&&event.player.isIn()&&player.countCards('e')>0&&player.canUse('sha',event.player,false);
				},
				content:function(){
					'step 0'
					player.chooseCard('e',get.prompt('gzxishe',trigger.player),'将装备区内的一张牌当做'+(player.hp>trigger.player.hp?'不可响应的':'')+'【杀】对其使用',function(card,player){
						return player.canUse({
							name:'sha',
							cards:[card],
						},_status.event.target,false);
					}).set('target',trigger.player).set('ai',function(card){
						var evt=_status.event,eff=get.effect(evt.target,{
							name:'sha',
							cards:[card],
						},evt.player,evt.player);
						if(eff<=0) return 0;
						var val=get.value(card);
						if(get.attitude(evt.player,evt.target)<-2&&evt.target.hp<=Math.min(2,evt.player.countCards('e'),evt.player.hp-1)) return 2/Math.max(1,val);
						return eff-val;
					}).setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						var next=player.useCard({name:'sha'},result.cards,'gzxishe',trigger.player,false);
						if(player.hp>trigger.player.hp) next.oncard=function(){
							_status.event.directHit.add(trigger.player);
						}
					}
					else event.finish();
					'step 2'
					if(trigger.player.isDead()){
						player.mayChangeVice(null,'hidden');
					}
					else if(lib.skill.gzxishe.filter(trigger,player)) event.goto(0);
				},
				ai:{
					directHit_ai:true,
					skillTagFilter:function(player,tag,arg){
						if(_status.event.getParent().name=='gzxishe'&&arg.card&&arg.card.name=='sha'&&
						arg.target&&arg.target==_status.event.target&&player.hp>arg.target.hp) return true;
						return false;
					},
				},
			},
			//公孙渊
			gzhuaiyi:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				delay:false,
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				content:function(){
					'step 0'
					player.showHandcards();
					'step 1'
					if(!player.countCards('h',{color:'red'})) event._result={control:'黑色'};
					else if(!player.countCards('h',{color:'black'})) event._result={control:'红色'};
					else player.chooseControl('红色','黑色').set('ai',function(){
						var player=_status.event.player,num=player.maxHp-player.getExpansions('gzhuaiyi').length;
						if(player.countCards('h',{color:'red'})<=num&&
						player.countCards('h',{color:'black'})>num) return '红色';
						return '黑色';
					});
					'step 2'
					event.control=result.control;
					var cards;
					if(event.control=='红色'){
						cards=player.getCards('h',{color:'red'});
					}
					else{
						cards=player.getCards('h',{color:'black'});
					}
					player.discard(cards);
					event.num=cards.length;
					'step 3'
					player.chooseTarget('请选择至多'+get.cnNumber(event.num)+'名有牌的其他角色，获得这些角色的各一张牌。',[1,event.num],function(card,player,target){
						return target!=player&&target.countCards('he')>0;
					}).set('ai',function(target){
						return -get.attitude(_status.event.player,target)+0.5;
					});
					'step 4'
					if(result.bool&&result.targets){
						player.line(result.targets,'green');
						event.targets=result.targets;
						event.targets.sort(lib.sort.seat);
						event.cards=[];
					}
					else{
						event.finish();
					}
					'step 5'
					if(player.isAlive()&&event.targets.length){
						player.gainPlayerCard(event.targets.shift(),'he',true);
					}
					else event.finish();
					'step 6'
					if(result.bool&&result.cards&&result.cards.length) event.cards.addArray(result.cards);
					if(event.targets.length) event.goto(5);
					'step 7'
					var hs=player.getCards('h');
					cards=cards.filter(function(card){
						return get.type(card)=='equip'&&hs.contains(card);
					});
					if(cards.length){
						player.addToExpansion(cards,player,'give').gaintag.add('gzhuaiyi');
					}
				},
				ai:{
					order:10,
					result:{
						player:function(player,target){
							var num=player.maxHp-player.getExpansions('gzhuaiyi').length;
							if(player.countCards('h',{color:'red'})<=num) return 1;
							if(player.countCards('h',{color:'black'})<=num) return 1;
							return 0;
						},
					}
				},
				marktext:'异',
				intro:{content:'expansion',markcount:'expansion'},
				onremove:function(player,skill){
					var cards=player.getExpansions(skill);
					if(cards.length) player.loseToDiscardpile(cards);
				},
			},
			gzzisui:{
				audio:2,
				trigger:{player:'phaseDrawBegin2'},
				forced:true,
				filter:function(event,player){
					return !event.numFixed&&player.getExpansions('gzhuaiyi').length>0;
				},
				content:function(){
					trigger.num+=player.getExpansions('gzhuaiyi').length;
				},
				group:'gzzisui_die',
				subSkill:{
					die:{
						audio:'gzzisui',
						trigger:{player:'phaseJieshuBegin'},
						forced:true,
						filter:function(event,player){
							return player.getExpansions('gzhuaiyi').length>player.maxHp;
						},
						content:function(){
							player.die();
						},
					},
				},
			},
			//潘濬
			gzcongcha:{
				audio:2,
				trigger:{player:'phaseZhunbeiBegin'},
				direct:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current!=player&&current.isUnseen();
					})
				},
				preHidden:'gzcongcha_draw',
				prompt2:'选择一名武将牌均暗置的其他角色',
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt2('gzcongcha'),function(card,player,target){
						return target!=player&&target.isUnseen();
					}).set('ai',function(target){
						if(get.attitude(_status.event.player,target)>0) return Math.random()+Math.sqrt(target.hp);
						return Math.random()+Math.sqrt(Math.max(1,4-target.hp));
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('gzcongcha',target);
						player.storage.gzcongcha2=target;
						player.addTempSkill('gzcongcha2',{player:'phaseBegin'});
						target.addSkill('gzcongcha_ai');
						game.delayx();
					}
				},
				subfrequent:['draw'],
				group:'gzcongcha_draw',
				subSkill:{
					draw:{
						audio:'gzcongcha',
						trigger:{player:'phaseDrawBegin2'},
						frequent:true,
						filter:function(event,player){
							return !event.numFixed&&!game.hasPlayer(function(current){
								return current.isUnseen();
							});
						},
						prompt:'是否发动【聪察】多摸两张牌？',
						content:function(){
							trigger.num+=2;
						},
					},
				},
			},
			gzcongcha_ai:{
				charlotte:true,
				ai:{
					mingzhi_yes:true,
					mingzhi_no:true,
					skillTagFilter:function(player,tag){
						if(_status.brawl) return false;
						var group=lib.character[player.name1][1];
						if(tag=='mingzhi_yes'){
							if(group!='ye'&&player.wontYe(group)&&game.hasPlayer(function(current){
								return current.storage.gzcongcha2==player&&current.identity==group;
							})) return true;
							return false;
						}
						if(group=='ye'&&!player.wontYe(group)) return true;
						return game.hasPlayer(function(current){
							return current.storage.gzcongcha2==player&&current.identity!=group;
						})
					},
				},
			},
			gzcongcha2:{
				trigger:{global:'showCharacterAfter'},
				forced:true,
				charlotte:true,
				onremove:true,
				filter:function(event,player){
					return event.player==player.storage.gzcongcha2;
				},
				logTarget:'player',
				content:function(){
					'step 0'
					player.removeSkill('gzcongcha2');
					trigger.player.removeSkill('gzcongcha_ai');
					if(player.isFriendOf(trigger.player)) game.asyncDraw([player,trigger.player].sortBySeat(_status.currentPhase),2);
					else trigger.player.loseHp();
					'step 1'
					game.delayx();
				},
				mark:'character',
				intro:{content:'已指定$为目标'},
			},
			//司马昭
			gzzhaoxin:{
				audio:2,
				trigger:{player:'damageEnd'},
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				check:()=>false,
				preHidden:true,
				content:function(){
					'step 0'
					player.showHandcards();
					'step 1'
					var hs=player.countCards('h');
					if(game.hasPlayer(function(current){
						return current!=player&&current.countCards('h')<=hs;
					})){
						player.chooseTarget(true,'请选择要交换手牌的目标角色',function(card,player,target){
							return target!=player&&target.countCards('h')<=player.countCards('h');
						})
					}
					else event.finish();
					'step 2'
					if(result.bool){
						var target=result.targets[0];
						player.line(target,'green');
						player.swapHandcards(target);
					}
				},
			},
			gzsuzhi:{
				audio:2,
				derivation:'gzfankui',
				mod:{
					targetInRange:function(card,player,target){
						if(player==_status.currentPhase&&player.countMark('gzsuzhi_count')<3&&get.type2(card)=='trick') return true;
					},
				},
				trigger:{player:'phaseJieshuBegin'},
				forced:true,
				filter:function(event,player){
					return player.countMark('gzsuzhi_count')<3;
				},
				content:function(){
					player.addTempSkill('gzfankui',{player:'phaseBegin'});
				},
				group:['gzsuzhi_damage','gzsuzhi_draw','gzsuzhi_gain'],
				preHidden:['gzsuzhi_damage','gzsuzhi_draw','gzsuzhi_gain'],
				subSkill:{
					damage:{
						audio:'gzsuzhi',
						trigger:{source:'damageBegin1'},
						forced:true,
						filter:function(event,player){
							return player==_status.currentPhase&&player.countMark('gzsuzhi_count')<3&&event.card&&
							(event.card.name=='sha'||event.card.name=='juedou')&&event.getParent().type=='card';
						},
						content:function(){
							trigger.num++;
							player.addTempSkill('gzsuzhi_count');
							player.addMark('gzsuzhi_count',1,false);
						},
					},
					draw:{
						audio:'gzsuzhi',
						trigger:{player:'useCard'},
						forced:true,
						filter:function(event,player){
							return player==_status.currentPhase&&player.countMark('gzsuzhi_count')<3&&event.card.isCard&&get.type2(event.card)=='trick';
						},
						content:function(){
							player.draw();
							player.addTempSkill('gzsuzhi_count');
							player.addMark('gzsuzhi_count',1,false);
						},
					},
					gain:{
						audio:'gzsuzhi',
						trigger:{global:'loseAfter'},
						forced:true,
						filter:function(event,player){
							if(player!=_status.currentPhase||event.type!='discard'||player==event.player||player.countMark('gzsuzhi_count')>=3) return false;
							return event.player.countGainableCards(player,'he')>0;
						},
						logTarget:'player',
						content:function(){
							'step 0'
							player.addTempSkill('gzsuzhi_count');
							player.addMark('gzsuzhi_count',1,false);
							if(trigger.delay==false) game.delay();
							'step 1'
							player.gainPlayerCard(trigger.player,'he',true);
						},
					},
					count:{
						onremove:true,
					},
				},
			},
			gzfankui:{
				audio:2,
				inherit:'fankui',
			},
			//夏侯霸
			gzbaolie:{
				audio:2,
				mod:{
					targetInRange:function(card,player,target){
						if(card.name=='sha'&&target.hp>=player.hp) return true;
					},
					cardUsableTarget:function(card,player,target){
						if(card.name=='sha'&&target.hp>=player.hp) return true;
					},
				},
				trigger:{player:'phaseUseBegin'},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&player.inRangeOf(current);
					});
				},
				logTarget:function(event,player){
					return game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&player.inRangeOf(current);
					});
				},
				check:()=>false,
				content:function(){
					'step 0'
					event.targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&player.inRangeOf(current);
					}).sortBySeat();
					'step 1'
					var target=event.targets.shift();
					if(target.isIn()){
						event.target=target;
						target.chooseToUse(function(card,player,event){
							if(get.name(card)!='sha') return false;
							return lib.filter.filterCard.apply(this,arguments);
						},'豹烈：对'+get.translation(player)+'使用一张杀，或令其弃置你的一张牌').set('targetRequired',true).set('complexSelect',true).set('filterTarget',function(card,player,target){
							if(target!=_status.event.sourcex&&!ui.selected.targets.contains(_status.event.sourcex)) return false;
							return lib.filter.filterTarget.apply(this,arguments);
						}).set('sourcex',player);
					}
					else if(targets.length) event.redo();
					else event.finish();
					'step 2'
					if(result.bool==false&&target.countCards('he')>0){
						player.discardPlayerCard(target,'he',true);
					}
					if(targets.length) event.goto(1);
				},
			},
			//许攸
			gzchenglve:{
				audio:2,
				trigger:{global:'useCardAfter'},
				filter:function(event,player){
					return event.targets.length>1&&event.player.isIn()&&event.player.isFriendOf(player);
				},
				logTarget:'player',
				check:function(event,player){
					return get.attitude(player,event.player)>0;
				},
				preHidden:true,
				content:function(){
					'step 0'
					trigger.player.draw();
					if(player.hasHistory('damage',function(evt){
						return evt.card==trigger.card;
					})&&game.hasPlayer(function(current){
						return current.isFriendOf(player)&&(!current.hasMark('yexinjia_mark')&&!current.hasMark('xianqu_mark')&&!current.hasMark('yinyang_mark')&&!current.hasMark('zhulianbihe_mark'))
					})){
						player.chooseTarget('是否令一名己方角色获得“阴阳鱼”标记？',function(card,player,current){
							return current.isFriendOf(player)&&(!current.hasMark('yexinjia_mark')&&!current.hasMark('xianqu_mark')&&!current.hasMark('yinyang_mark')&&!current.hasMark('zhulianbihe_mark'));
						}).set('ai',function(target){
							return get.attitude(_status.event.player,target)*Math.sqrt(1+target.needsToDiscard());
						});
					}
					else event.finish();
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.line(target,'green');
						target.addMark('yinyang_mark',1,false);
						game.delayx();
					}
				},
			},
			gzshicai:{
				audio:2,
				trigger:{player:'damageEnd'},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					return event.num==1||player.countCards('he')>0;
				},
				check:function(event,player){
					return event.num==1;
				},
				content:function(){
					if(trigger.num==1) player.draw();
					else player.chooseToDiscard(true,'he',2);
				},
			},
			gzzhuosheng:{
				trigger:{global:'damageEnd'},
				logTarget:'player',
				filter:function(event,player){
					return event.player.isFriendOf(player);
				},
				preHidden:true,
				content:function(){
					var target=trigger.player;
					target.addTempSkill('gzzhuosheng2',{player:'phaseJieshuBegin'});
					target.draw().gaintag=['gzzhuosheng2'];
				},
			},
			gzzhuosheng2:{
				onremove:function(player,skill){
					player.removeGaintag(skill);
				},
				mod:{
					targetInRange:function(card,player,target){
						if(!card.cards||get.type(card)!='basic') return;
						for(var i of card.cards){
							if(i.hasGaintag('gzzhuosheng2')) return (game.online?player==_status.currentPhase:player.isPhaseUsing());
						}
					},
					cardUsable:function(card,player,target){
						if(!card.cards||get.type(card)!='basic'||!(game.online?player==_status.currentPhase:player.isPhaseUsing())) return;
						for(var i of card.cards){
							if(i.hasGaintag('gzzhuosheng2')) return Infinity;
						}
					},
					aiOrder:function(player,card,num){
						if(get.itemtype(card)=='card'&&card.hasGaintag('gzzhuosheng2')&&get.type(card)=='basic') return num-0.1;
					},
				},
				trigger:{player:'useCard2'},
				direct:true,
				filterx:function(event,player){
					if(!player.isPhaseUsing()) return false;
					return player.getHistory('lose',function(evt){
						if(evt.getParent()!=event) return false;
						for(var i in evt.gaintag_map){
							if(evt.gaintag_map[i].contains('gzzhuosheng2')) return true;
						}
						return false;
					}).length>0;
				},
				filter:function(event,player){
					if(!lib.skill.gzzhuosheng2.filterx(event,player)) return false;
					if(get.type(event.card)!='trick') return false;
					if(event.targets&&event.targets.length>0) return true;
					var info=get.info(event.card);
					if(info.allowMultiple==false) return false;
					if(event.targets&&!info.multitarget){
						if(game.hasPlayer(function(current){
							return !event.targets.contains(current)&&lib.filter.targetEnabled2(event.card,player,current)&&lib.filter.targetInRange(event.card,player,current);
						})){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var prompt2='为'+get.translation(trigger.card)+'增加或减少一个目标'
					player.chooseTarget(get.prompt('gzzhuosheng2'),function(card,player,target){
						var player=_status.event.player;
						if(_status.event.targets.contains(target)) return true;
						return lib.filter.targetEnabled2(_status.event.card,player,target)&&lib.filter.targetInRange(_status.event.card,player,target);
					}).set('prompt2',prompt2).set('ai',function(target){
						var trigger=_status.event.getTrigger();
						var player=_status.event.player;
						return get.effect(target,trigger.card,player,player)*(_status.event.targets.contains(target)?-1:1);
					}).set('targets',trigger.targets).set('card',trigger.card);
					'step 1'
					if(result.bool){
						if(!event.isMine()&&!event.isOnline()) game.delayx();
						event.targets=result.targets;
					}
					else{
						event.finish();
					}
					'step 2'
					if(event.targets){
						player.logSkill('gzzhuosheng2',event.targets);
						if(trigger.targets.contains(event.targets[0])) trigger.targets.removeArray(event.targets);
						else trigger.targets.addArray(event.targets);
					}
				},
				group:['gzzhuosheng2_equip','gzzhuosheng2_silent'],
				subSkill:{
					equip:{
						audio:'gzzhuosheng2',
						trigger:{player:'useCard'},
						filter:function(event,player){
							return get.type(event.card)=='equip'&&lib.skill.gzzhuosheng2.filterx(event,player);
						},
						prompt:'是否发动【擢升】摸一张牌？',
						content:function(){
							player.draw();
						},
					},
					silent:{
						trigger:{
							player:'useCard1',
						},
						silent:true,
						firstDo:true,
						filter:function(event,player){
							return get.type(event.card)=='basic'&&lib.skill.gzzhuosheng2.filterx(event,player)&&event.addCount!==false;
						},
						content:function(){
							trigger.addCount=false;
							var stat=player.getStat();
							if(stat&&stat.card&&stat.card[trigger.card.name]) stat.card[trigger.card.name]--;
						},
					},
				},
			},
			gzzhuhai:{
				audio:'zhuhai',
				audioname:['gz_re_xushu'],
				trigger:{global:'phaseJieshuBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return event.player.isAlive()&&event.player.getStat('damage')&&
					lib.filter.targetEnabled({name:'sha'},player,event.player)&&(player.hasSha()||_status.connectMode&&player.countCards('h')>0);
				},
				content:function(){
					var next=player.chooseToUse(function(card,player,event){
						if(get.name(card)!='sha') return false;
						return lib.filter.filterCard.apply(this,arguments);
					},'诛害：是否对'+get.translation(trigger.player)+'使用一张杀？').set('logSkill','gzzhuhai').set('complexSelect',true).set('filterTarget',function(card,player,target){
						if(target!=_status.event.sourcex&&!ui.selected.targets.contains(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this,arguments);
					}).set('sourcex',trigger.player).setHiddenSkill(event.name);
					player.addTempSkill('gzzhuhai2');
					next.oncard=function(card,player){
						try{
							if(trigger.player.getHistory('sourceDamage',function(evt){
								return evt.player.isFriendOf(player);
							}).length){
								player.addTempSkill('gzzhuhai2');
								card.gzzhuhai_tag=true;
							}
						}catch(e){
							alert('发生了一个导致【诛害】无法正常触发无视防具效果的错误。请关闭十周年UI/手杀UI等扩展以解决');
						}
					}
				},
				ai:{
					unequip_ai:true,
					skillTagFilter:function(player,tag,arg){
						var evt=_status.event.getParent();
						if(evt.name!='gzzhuhai'||!arg||!arg.target) return false;
						if(!arg.target.getHistory('sourceDamage',function(evt){
							return evt.player.isFriendOf(player);
						}).length) return false;
						return true;
					},
				},
			},
			gzzhuhai2:{
				trigger:{player:'shaMiss'},
				forced:true,
				popup:false,
				filter:function(event,player){
					return event.card.gzzhuhai_tag==true&&event.target.countCards('he')>0;
				},
				content:function(){
					player.line(trigger.target);
					trigger.target.chooseToDiscard('he',true);
				},
				ai:{
					unequip:true,
					skillTagFilter:function(player,tag,arg){
						if(!arg||!arg.card||!arg.card.gzzhuhai_tag) return false;
					},
				},
			},
			quanjin:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				onChooseToUse:function(event){
					if(!game.online){
						event.set('quanjin_list',game.filterPlayer((i)=>(i!=event.player&&i.getHistory('damage').length)));
					}
				},
				filter:function(event,player){
					return event.quanjin_list&&event.quanjin_list.length>0&&player.countCards('h')>0;
				},
				filterCard:true,
				filterTarget:function(card,player,target){
					return _status.event.quanjin_list.contains(target);
				},
				discard:false,
				lose:false,
				delay:false,
				check:function(card){
					var evt=_status.event;
					if(evt.quanjin_list.filter(function(target){
						return get.attitude(evt.player,target)>0;
					}).length) return 8-get.value(card);
					return 6.5-get.value(card);
				},
				content:function(){
					'step 0'
					player.give(cards,target);
					'step 1'
					player.chooseJunlingFor(target);
					'step 2'
					event.junling=result.junling;
					event.targets=result.targets;
					var str=get.translation(player);
					target.chooseJunlingControl(player,result.junling,result.targets).set('prompt','劝进').set('choiceList',[
						'执行该军令，然后'+str+'摸一张牌',
						'不执行该军令，然后其将手牌摸至与全场最多相同',
					]).set('ai',function(){
						var evt=_status.event.getParent(2),player=evt.target,source=evt.player,junling=evt.junling,targets=evt.targets;
						var num=0;
						game.countPlayer(function(current){
							var num2=current.countCards('h');
							if(num2>num) num=num2;
						});
						num=Math.max(0,num-source.countCards('h'));
						if(num>1){
							if(get.attitude(player,target)>0) return get.junlingEffect(source,junling,player,targets,player)>num;
							return get.junlingEffect(source,junling,player,targets,player)>-num;
						}
						if(get.attitude(player,target)>0) return get.junlingEffect(source,junling,player,targets,player)>0;
						return get.junlingEffect(source,junling,player,targets,player)>1;
					});
					'step 3'
					if(result.index==0){
						target.carryOutJunling(player,event.junling,targets);
						player.draw();
					}
					else{
						var num=0;
						game.countPlayer(function(current){
							var num2=current.countCards('h');
							if(num2>num) num=num2;
						});
						num-=player.countCards('h');
						if(num>0) player.draw(Math.min(num,5));
					}
				},
				ai:{
					order:1,
					result:{
						player:function(player,target){
							if(get.attitude(player,target)>0) return 3.3;
							var num=0;
							game.countPlayer(function(current){
								var num2=current.countCards('h');
								if(player==current) num2--;
								if(target==current) num2++;
								if(num2>num) num=num2;
							});
							num=Math.max(0,num-player.countCards('h'));
							if(!num) return 0;
							if(num>1) return 2;
							if(ui.selected.cards.length&&get.value(ui.selected.cards[0])>5) return 0;
							return 1;
						},
					},
				},
			},
			zaoyun:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					var num=player.countCards('h');
					return game.hasPlayer(function(current){
						if(current.isEnemyOf(player)){
							var dist=get.distance(player,current);
							return dist>1&&dist<=num;
						}
					});
				},
				selectCard:function(){
					var list=[],player=_status.event.player;
					if(ui.selected.targets.length) return get.distance(player,ui.selected.targets[0])-1;
					game.countPlayer(function(current){
						if(current.isEnemyOf(player)){
							var dist=get.distance(player,current);
							if(dist>1) list.push(dist-1);
						}
					});
					list.sort();
					return [list[0],list[list.length-1]];
				},
				filterCard:true,
				filterTarget:function(card,player,target){
					return target.isEnemyOf(player)&&get.distance(player,target)==ui.selected.cards.length+1;
				},
				check:function(card){
					var player=_status.event.player;
					if(ui.selected.cards.length&&game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&get.distance(player,current)==(ui.selected.cards.length+1)&&get.damageEffect(current,player,player)>0;
					})) return 0;
					return (7-ui.selected.cards.length*2)-get.value(card);
				},
				content:function(){
					target.damage('nocard');
					if(!player.storage.zaoyun2) player.storage.zaoyun2=[];
					player.storage.zaoyun2.push(target);
					player.addTempSkill('zaoyun2');
				},
				ai:{
					order:5,
					result:{
						target:function(player,target){
							return get.damageEffect(target,player,target);
						},
					},
				},
			},
			zaoyun2:{
				onremove:true,
				charlotte:true,
				mod:{
					globalFrom:function(player,target){
						if(player.getStorage('zaoyun2').contains((target))) return -Infinity;
					},
				},
			},
			gzzhidao:{
				audio:2,
				trigger:{player:'phaseUseBegin'},
				forced:true,
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseTarget('请选择【雉盗】的目标','本回合内只能对自己和该角色使用牌，且第一次对其造成伤害时摸一张牌',lib.filter.notMe,true).set('ai',function(target){
						var player=_status.event.player;
						return (1-get.sgn(get.attitude(player,target)))*Math.max(1,get.distance(player,target));
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						player.line(target,'green');
						game.log(player,'选择了',target);
						player.storage.gzzhidao2=target;
						player.addTempSkill('gzzhidao2');
					}
				},
			},
			gzzhidao2:{
				mod:{
					playerEnabled:function(card,player,target){
						if(target!=player&&target!=player.storage.gzzhidao2) return false;
					},
					globalFrom:function(from,to){
						if(to==from.storage.gzzhidao2) return -Infinity;
					},
				},
				audio:'gzzhidao',
				trigger:{source:'damageSource'},
				forced:true,
				charlotte:true,
				filter:function(event,player){
					return event.player==player.storage.gzzhidao2&&player.getHistory('sourceDamage',function(evt){
						return evt.player==event.player;
					}).indexOf(event)==0&&event.player.countGainableCards(player,'hej')>0;
				},
				logTarget:'player',
				content:function(){
					player.gainPlayerCard(trigger.player,'hej',true);
				},
			},
			gzyjili:{
				audio:2,
				forced:true,
				preHidden:['gzyjili_remove'],
				trigger:{target:'useCardToTargeted'},
				filter:function(event,player){
					if(get.color(event.card)!='red'||event.targets.length!=1) return false;
					var type=get.type(event.card);
					return type=='basic'||type=='trick';
				},
				check:function(){
					return false;
				},
				content:function(){
					player.addTempSkill('gzyjili2');
					var evt=trigger.getParent();
					if(!evt.gzyjili) evt.gzyjili=[];
					evt.gzyjili.add(player);
				},
				group:'gzyjili_remove',
				subSkill:{
					remove:{
						audio:'gzyjili',
						trigger:{player:'damageBegin2'},
						forced:true,
						filter:function(event,player){
							var evt=false;
							for(var i of lib.phaseName){
								evt=event.getParent(i);
								if(evt&&evt.player) break;
							}
							return evt&&evt.player&&player.getHistory('damage',function(evtx){
								return evtx.getParent(evt.name)==evt;
							}).length==1;
						},
						content:function(){
							trigger.cancel();
							player.removeCharacter(player.name1=='gz_yanbaihu'?0:1);
						},
					},
				},
			},
			gzyjili2:{
				trigger:{global:'useCardAfter'},
				charlotte:true,
				popup:false,
				forced:true,
				filter:function(event,player){
					return event.gzyjili&&event.gzyjili.contains(player)&&!event.addedTarget&&event.player
					&&event.player.isAlive()&&event.player.canUse({
						name:event.card.name,
						nature:event.card.nature,
						isCard:true,
					},player);
				},
				content:function(){
					trigger.player.useCard({
						name:trigger.card.name,
						nature:trigger.card.nature,
						isCard:true,
					},player,false);
				},
			},
			donggui:{
				audio:2,
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return lib.skill.donggui.filterTarget(null,player,current);
					});
				},
				filterTarget:function(card,player,target){
					return target!=player&&!target.isUnseen(2)&&player.canUse('diaohulishan',target);
				},
				content:function(){
					'step 0'
					player.chooseButton(['暗置'+get.translation(target)+'的一张武将牌',[[target.name1,target.name2],'character']],true).set('filterButton',function(button){
						return !get.is.jun(button.link);
					});
					'step 1'
					var target1=target.getNext();
					var target2=target.getPrevious();
					if(target1==target2||target.inline(target1)||target.inline(target2)||target1.inline(target2)) event.finish();
					else{
						event.target1=target1;
						event.target2=target2;
					}
					target.hideCharacter(result.links[0]==target.name1?0:1);
					target.addTempSkill('donggui2');
					player.useCard({name:'diaohulishan',isCard:true},target);
					'step 2'
					if(event.target1.inline(event.target2)){
						player.draw(game.countPlayer(function(current){
							return current.inline(event.target1);
						}));
					}
				},
				ai:{
					order:2,
					result:{
						player:function(player,target){
							var target1=target.getNext();
							var target2=target.getPrevious();
							if(target1==target2||target.inline(target1)||target.inline(target2)||target1.inline(target2)||!target1.isFriendOf(target2)) return 0;
							var num=game.countPlayer(function(current){
								return current!=target1&&current!=target2&&(current.inline(target1)||current.inline(target2));
							});
							return 2+num;
						},
					},
				},
			},
			donggui2:{ai:{nomingzhi:true}},
			fengyang:{
				audio:2,
				zhenfa:'inline',
				trigger:{player:'phaseJieshuBegin'},
				filter:function(event,player){
					var bool=player.hasSkill('fengyang');
					return game.hasPlayer(function(current){
						return current!=player&&current.inline(player);
					})&&game.hasPlayer(function(current){
						return (current==player||bool)&&current.inline(player)&&current.countCards('e')>0;
					});
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					event.list=game.filterPlayer(function(current){
						return current.inline(player);
					}).sortBySeat();
					'step 1'
					var target=event.list.shift();
					if((target==player||player.hasSkill('fengyang'))&&target.countCards('e')){
						event.target=target;
						var next=target.chooseToDiscard('e',get.prompt('fengyang'),'弃置装备区内的一张牌并摸两张牌').set('ai',function(card){
							return 5.5-get.value(card);
						});
						next.logSkill='fengyang';
						if(player==target) next.setHiddenSkill('fengyang');
					}
					else event.goto(3);
					'step 2'
					if(result.bool){
						target.draw(2);
					}
					'step 3'
					if(event.list.length) event.goto(1);
				},
			},
			gzrekuangcai:{
				audio:'gzkuangcai',
				forced:true,
				preHidden:true,
				trigger:{player:'phaseDiscardBegin'},
				filter:function(event,player){
					return !player.getHistory('useCard').length||!player.getHistory('sourceDamage').length;
				},
				check:()=>false,
				content:function(){
					lib.skill.rekuangcai.change(player,player.getHistory('useCard').length?-1:1);
				},
				mod:{
					targetInRange:function(card,player){
						if(player==_status.currentPhase) return true;
					},
					cardUsable:function(card,player){
						if(player==_status.currentPhase) return Infinity;
					},
				},
			},
			gzkuangcai:{
				audio:2,
				trigger:{player:'useCard1'},
				forced:true,
				firstDo:true,
				noHidden:true,
				preHidden:['gzkuangcai_discard'],
				filter:function(event,player){
					return player==_status.currentPhase&&get.type(event.card)=='trick';
				},
				content:function(){
					trigger.nowuxie=true;
				},
				mod:{
					targetInRange:function(card,player){
						if(player==_status.currentPhase) return true;
					},
					cardUsable:function(card,player){
						if(player==_status.currentPhase) return Infinity;
					},
				},
				ai:{
					unequip:true,
					skillTagFilter:function(player){
						return player==_status.currentPhase;
					},
				},
				group:'gzkuangcai_discard',
				subSkill:{
					discard:{
						audio:'gzkuangcai',
						trigger:{player:'phaseDiscardBegin'},
						forced:true,
						filter:function(event,player){
							var use=player.getHistory('useCard').length;
							var damage=(player.getStat('damage')||0);
							if(use&&!damage) return true;
							if(damage>=use) return true;
							return false;
						},
						check:function(event,player){
							var use=player.getHistory('useCard').length;
							var damage=(player.getStat('damage')||0);
							if(use&&!damage) return false;
							return true;
						},
						content:function(){
							var use=player.getHistory('useCard').length;
							var damage=(player.getStat('damage')||0);
							if(use&&!damage) player.addTempSkill('gzkuangcai_less')
							else{
								player.drawTo(player.maxHp);
								player.addTempSkill('gzkuangcai_more');
							}
						},
					},
					more:{
						mod:{
							maxHandcard:function(player,num){
								return num+2;
							},
						},
						charlotte:true,
					},
					less:{
						mod:{
							maxHandcard:function(player,num){
								return num-2;
							},
						},
						charlotte:true,
					},
				},
			},
			gzshejian:{
				audio:2,
				preHidden:true,
				trigger:{target:'useCardToTargeted'},
				filter:function(event,player){
					if(player==event.player||event.targets.length!=1) return false;
					var hs=player.getCards('h');
					if(hs.length==0) return false;
					for(var i of hs){
						if(!lib.filter.cardDiscardable(i,player,'gzshejian')) return false;
					}
					return true;
				},
				check:function(event,player){
					var target=event.player;
					if(get.damageEffect(target,player,player)<=0) return false;
					if(target.hp<=(player.hasSkill('gzcongjian')?2:1)&&!target.getEquip('huxinjing')&&!game.hasPlayer(function(current){
						return current!=target&&!current.isFriendOf(player);
					})) return true;
					if(player.hasSkill('lirang')&&player.hasFriend()) return true;
					if((event.card.name=='guohe'||event.card.name=='shunshou'||event.card.name=='zhujinqiyuan')&&player.countCards('h')==1) return true;
					if(player.countCards('h')<3&&!player.countCards('h',function(card){
						return get.value(card,player)>5;
					})) return true;
					if(player.hp<=event.getParent().baseDamage){
						if(get.tag(event.card,'respondSha')){
							if(player.countCards('h',{name:'sha'})==0){
								return true;
							}
						}
						else if(get.tag(event.card,'respondShan')){
							if(player.countCards('h',{name:'shan'})==0){
								return true;
							}
						}
						else if(get.tag(event.card,'damage')){
							if(event.card.name=='shuiyanqijunx') return player.countCards('e')==0;
							return true;
						}
					}
					return false;
				},
				logTarget:'player',
				content:function(){
					'step 0'
					var cards=player.getCards('h');
					event.num=cards.length;
					player.discard(cards);
					'step 1'
					var target=trigger.player,str=get.translation(target);
					event.target=target;
					if(!target.isIn()) event.finish();
					else if(!target.hasCard(function(card){
						return lib.filter.canBeDiscarded(card,player,target);
					},'he')) event._result={index:1};
					else player.chooseControl().set('choiceList',[
						'弃置'+str+'的'+get.cnNumber(num)+'张牌',
						'对'+str+'造成1点伤害',
					]).set('ai',()=>1);
					'step 2'
					if(result.index==0) player.discardPlayerCard(target,num,true,'he');
					else target.damage();
				},
			},
			gzpozhen:{
				audio:2,
				trigger:{global:'phaseBegin'},
				limited:true,
				preHidden:true,
				filter:function(event,player){
					return player!=event.player;
				},
				logTarget:'player',
				skillAnimation:true,
				animationColor:'orange',
				check:function(event,player){
					var target=event.player;
					if(get.attitude(player,target)>=-3) return false;
					if(event.player.hasJudge('lebu')&&!game.hasPlayer(function(current){
						return get.attitude(current,target)>0&&current.hasWuxie();
					})) return false;
					var num=Math.min(target.getCardUsable('sha'),target.countCards('h',function(card){
						return get.name(card,target)=='sha'&&target.hasValueTarget(card);
					}))+target.countCards('h',function(card){
						return get.name(card,target)!='sha'&&target.hasValueTarget(card);
					});
					return num>=Math.max(2,target.hp);
				},
				content:function(){
					'step 0'
					player.awakenSkill('gzpozhen');
					var target=trigger.player;
					target.addTempSkill('gzpozhen2');
					var list=game.filterPlayer(function(current){
						return current!=target&&(current.inline(target)||
						(current==target.getNext().getNext()&&current.siege(target.getNext())||current==target.getPrevious().getPrevious()&&current.siege(target.getPrevious())));
					});
					if(list.length){
						list.add(target);
						list.sortBySeat(target);
						event.targets=list;
					}
					else event.finish();
					'step 1'
					var target=targets.shift();
					if(target.countDiscardableCards(player,'he')>0) player.discardPlayerCard(target,'he',true).boolline=true;
					if(targets.length) event.redo();
				},
			},
			gzpozhen2:{
				mod:{
					cardEnabled2:function(card){
						if(get.position(card)=='h') return false;
					},
					cardChongzhuable:function(card){
						if(get.position(card)=='h') return false;
					},
				},
			},
			gzjiancai:{
				audio:2,
				viceSkill:true,
				trigger:{global:'damageBegin4'},
				preHidden:true,
				init:function(player,skill){
					if(player.checkViceSkill(skill)&&!player.viceChanged) player.removeMaxHp();
				},
				filter:function(event,player){
					return event.player.isFriendOf(player)&&event.num>=event.player.hp;
				},
				check:function(event,player){
					if(get.attitude(player,event.player)<3) return false;
					if(event.num>=1||player.storage.gzpozhen) return true;
					if(player.countCards('h',function(card){
						var mod2=game.checkMod(card,player,'unchanged','cardEnabled2',player);
						if(mod2!='unchanged') return mod2;
						var mod=game.checkMod(card,player,event.player,'unchanged','cardSavable',player);
						if(mod!='unchanged') return mod;
						var savable=get.info(card).savable;
						if(typeof savable=='function') savable=savable(card,player,event.player);
						return savable;
					})>=1+event.num-event.player.hp) return false;
					return true;
				},
				logTarget:'player',
				skillAnimation:true,
				animationColor:'orange',
				content:function(){
					trigger.cancel();
					player.changeVice();
				},
				group:'gzjiancai_add',
				subSkill:{
					add:{
						trigger:{global:'changeViceBegin'},
						logTarget:'player',
						forced:true,
						locked:false,
						prompt:function(event,player){
							return get.translation(event.player)+'即将变更副将，是否发动【荐才】，令其此次变更副将时增加两张可选武将牌？';
						},
						filter:function(event,player){
							return event.player.isFriendOf(player);
						},
						content:function(){
							trigger.num+=2;
						},
					},
				},
			},
			gzxingzhao:{
				audio:2,
				getNum:function(){
					var list=[],players=game.filterPlayer();
					for(var target of players){
						if(target.isUnseen()||target.isHealthy()) continue;
						var add=true;
						for(var i of list){
							if(i.isFriendOf(target)){
								add=false;
								break;
							}
						}
						if(add) list.add(target);
					}
					return list.length;
				},
				mod:{
					maxHandcard:function(player,num){
						return num+(lib.skill.gzxingzhao.getNum()>2?4:0);
					},
				},
				group:['gzxingzhao_xunxun','gzxingzhao_use','gzxingzhao_lose'],
				preHidden:['gzxingzhao_xunxun','gzxingzhao_use','gzxingzhao_lose'],
				subfrequent:['use'],
				subSkill:{
					xunxun:{
						audio:2,
						name:'恂恂',
						description:'摸牌阶段，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。',
						trigger:{player:'phaseDrawBegin1'},
						filter:function(event,player){
							return lib.skill.gzxingzhao.getNum()>0;
						},
						content:function(){
							'step 0'
							var cards=get.cards(4);
							game.cardsGotoOrdering(cards);
							var next=player.chooseToMove('恂恂：将两张牌置于牌堆顶',true);
							next.set('list',[
								['牌堆顶',cards],
								['牌堆底'],
							]);
							next.set('filterMove',function(from,to,moved){
								if(to==1&&moved[1].length>=2) return false;
								return true;
							});
							next.set('filterOk',function(moved){
								return moved[1].length==2;
							});
							next.set('processAI',function(list){
								var cards=list[0][1].slice(0).sort(function(a,b){
									return get.value(b)-get.value(a);
								});
								return [cards,cards.splice(2)];
							})
							'step 1'
							var top=result.moved[0];
							var bottom=result.moved[1];
							top.reverse();
							for(var i=0;i<top.length;i++){
								ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
							}
							for(i=0;i<bottom.length;i++){
								ui.cardPile.appendChild(bottom[i]);
							}
							game.updateRoundNumber();
							game.delayx();
						},
					},
					use:{
						audio:'gzxingzhao',
						trigger:{
							player:['useCard','damageEnd'],
						},
						forced:true,
						filter:function(event,player){
							return (event.name=='damage'||get.type(event.card)=='equip')&&lib.skill.gzxingzhao.getNum()>1&&!player.isMaxHandcard();
						},
						frequent:true,
						content:function(){
							player.draw();
						},
					},
					draw:{
						audio:'gzxingzhao',
						trigger:{player:'damageEnd'},
						forced:true,
						filter:function(event,player){
							return lib.skill.gzxingzhao.getNum()>1&&event.source
							&&event.source.isAlive()&&event.source.countCards('h')!=player.countCards('h');
						},
						logTarget:function(event,player){
							var target=event.source;
							return target.countCards('h')>player.countCards('h')?player:target;
						},
						check:function(event,player){
							return get.attitude(player,lib.skill.gzxingzhao_draw.logTarget(event,player))>0;
						},
						content:function(){
							lib.skill.gzxingzhao_draw.logTarget(trigger,player).draw();
						},
					},
					skip:{
						audio:'gzxingzhao',
						trigger:{player:'phaseDiscardBefore'},
						forced:true,
						filter:function(){
							return lib.skill.gzxingzhao.getNum()>2;
						},
						content:function(){
							trigger.cancel();
							game.log(player,'跳过了','#y弃牌阶段');
						},
					},
					lose:{
						audio:'gzxingzhao',
						trigger:{
							player:'loseAfter',
							global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
						},
						filter:function(event,player){
							var evt=event.getl(player);
							return evt&&evt.player==player&&evt.es&&evt.es.length>0&&lib.skill.gzxingzhao.getNum()>3;
						},
						forced:true,
						content:function(){player.draw()},
					},
				},
				ai:{
					threaten:3,
					effect:{
						target:function(card,player,target,current){
							if(lib.skill.gzxingzhao.getNum()>3&&get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
						}
					},
					reverseEquip:true,
					skillTagFilter:function(){
						return lib.skill.gzxingzhao.getNum()>3;
					},
				},
			},
			qiuan:{
				audio:2,
				trigger:{player:'damageBegin2'},
				filter:function(event,player){
					return event.cards&&event.cards.filterInD().length>0&&!player.getExpansions('qiuan').length;
				},
				check:function(event,player){
					if(get.damageEffect(player,event.source||player,player,event.nature)>=0) return false;
					return true;
				},
				preHidden:true,
				content:function(){
					var cards=trigger.cards.filterInD();
					player.addToExpansion('gain2',cards).gaintag.add('qiuan');
					trigger.cancel();
				},
				intro:{
					content:'expansion',
					markcount:'expansion',
				},
				marktext:'函',
			},
			liangfan:{
				audio:2,
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				filter:function(event,player){
					return player.getExpansions('qiuan').length>0;
				},
				content:function(){
					'step 0'
					var cards=player.getExpansions('qiuan');
					player.gain(cards,'gain2').gaintag.add('liangfan');
					player.addTempSkill('liangfan2');
					'step 1'
					player.loseHp();
				},
			},
			liangfan2:{
				audio:'liangfan',
				mark:true,
				mod:{
					aiOrder:function(player,card,num){
						if(get.itemtype(card)=='card'&&card.hasGaintag('liangfan')) return num+0.1;
					},
				},
				intro:{content:'使用“量反”牌造成伤害后，可获得目标角色的一张牌'},
				trigger:{source:'damageEnd'},
				logTarget:'player',
				charlotte:true,
				onremove:function(player){
					player.removeGaintag('liangfan');
				},
				prompt:(event)=>('量反：是否获得'+get.translation(event.player)+'的一张牌？'),
				filter:function(event,player){
					var evt=event.getParent(2);
					if(evt.name!='useCard'||evt.card!=event.card) return false;
					if(!event.player.countGainableCards(player,'he')) return false;
					return player.getHistory('lose',function(evt2){
						if(evt2.getParent()!=evt) return false;
						for(var i in evt2.gaintag_map){
							if(evt2.gaintag_map[i].contains('liangfan')) return true;
						}
						return false;
					}).length>0;
				},
				marktext:'反',
				content:function(){
					player.gainPlayerCard(trigger.player,true,'he');
				},
			},
			gzwenji:{
				audio:2,
				trigger:{player:'phaseUseBegin'},
				direct:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current!=player&&current.countCards('he');
					});
				},
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt2('gzwenji'),function(card,player,target){
						return target!=player&&target.countCards('he')>0;
					}).set('ai',function(target){
						var att=get.attitude(_status.event.player,target);
						if(target.identity=='unknown'&&att<=0) return 20;
						if(att>0) return Math.sqrt(att)/10;
						return 5-att;
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						event.target=target;
						player.logSkill('gzwenji',target);
						target.chooseCard('he',true,'问计：将一张牌交给'+get.translation(player));
					}
					else{
						event.finish();
					}
					'step 2'
					if(result.bool){
						event.card=result.cards[0];
						target.give(result.cards,player).gaintag.add('gzwenji');
					}
					'step 3'
					if(target.identity=='unknown'||target.isFriendOf(player)){
						player.addTempSkill('gzwenji_respond');
						event.finish();
					}
					else if(target.isIn()&&player.countCards('he',function(card){
						return !card.hasGaintag('gzwenji');
					})){
						player.chooseCard('he','交给'+get.translation(target)+'一张其他牌，或令其摸一张牌',function(card){
							return !card.hasGaintag('gzwenji');
						}).set('ai',function(card){
							return 5-get.value(card);
						});
					}
					else event.finish();
					'step 4'
					if(result.bool){
						player.give(result.cards,target);
						player.removeGaintag('gzwenji');
					}
					else{
						target.draw();
					}
				},
				subSkill:{
					respond:{
						onremove:function(player){
							player.removeGaintag('gzwenji');
						},
						mod:{
							targetInRange:function(card,player,target){
								if(!card.cards) return;
								for(var i of card.cards){
									if(i.hasGaintag('gzwenji')) return true;
								}
							},
							cardUsable:function(card,player,target){
								if(!card.cards) return;
								for(var i of card.cards){
									if(i.hasGaintag('gzwenji')) return Infinity;
								}
							},
						},
						trigger:{player:'useCard'},
						forced:true,
						charlotte:true,
						audio:'gzwenji',
						filter:function(event,player){
							return player.getHistory('lose',function(evt){
								if(evt.getParent()!=event) return false;
								for(var i in evt.gaintag_map){
									if(evt.gaintag_map[i].contains('gzwenji')) return true;
								}
								return false;
							}).length>0;
						},
						content:function(){
							trigger.directHit.addArray(game.filterPlayer(function(current){
								return current!=player;
							}));
							if(trigger.addCount!==false){
								trigger.addCount=false;
								var stat=player.getStat();
								if(stat&&stat.card&&stat.card[trigger.card.name]) stat.card[trigger.card.name]--;
							}
						},
						ai:{
							directHit_ai:true,
							skillTagFilter:function(player,tag,arg){
								return arg.card&&arg.card.cards&&arg.card.cards.filter((card)=>card.hasGaintag('gzwenji')).length>0;
							},
						},
					}
				}
			},
			gztunjiang:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				frequent:true,
				preHidden:true,
				filter:function(event,player){
					if(!player.getHistory('useCard',function(evt){
						return evt.isPhaseUsing();
					}).length) return false;
					return player.getHistory('useCard',function(evt){
						if(evt.targets&&evt.targets.length&&evt.isPhaseUsing()){
							var targets=evt.targets.slice(0);
							while(targets.contains(player)) targets.remove(player);
							return targets.length>0;
						}
						return false;
					}).length==0;
				},
				content:function(){
					player.draw(game.countGroup());
				},
			},
			gzbushi:{
				audio:2,
				trigger:{player:'damageEnd'},
				frequent:true,
				preHidden:true,
				content:function(){
					'step 0'
					event.count=trigger.num;
					'step 1'
					event.count--;
					player.draw();
					'step 2'
					if(event.count>0){
						player.chooseBool(get.prompt2('gzbushi')).set('frequentSkill','gzbushi');
					}
					else event.finish();
					'step 3'
					if(result.bool) event.goto(1);
				},
				group:'gzbushi_draw',
				subSkill:{
					draw:{
						trigger:{source:'damageSource'},
						direct:true,
						noHidden:true,
						filter:function(event,player){
							return event.player.isEnemyOf(player)&&event.player.isIn();
						},
						content:function(){
							'step 0'
							trigger.player.chooseBool('是否对'+get.translation(player)+'发动【布施】？','你摸一张牌，然后其摸一张牌');
							'step 1'
							if(result.bool){
								player.logSkill('gzbushi',trigger.player);
								game.asyncDraw([trigger.player,player]);
							}
							else event.finish();
							'step 2'
							game.delayx();
						},
					},
				},
			},
			gzbushi_old:{
				audio:2,
				trigger:{
					player:'damageEnd',
					source:'damageSource',
				},
				forced:true,
				filter:function(event,player,name){
					if(name=='damageSource'&&player==event.player) return false;
					return game.hasPlayer(function(current){
						return current.isFriendOf(event.player);
					});
				},
				check:function(event,player){
					return player.isFriendOf(event.player);
				},
				content:function(){
					'step 0'
					event.count=trigger.num;
					if(event.triggername=='damageSource') event.count=1;
					'step 1'
					event.count--;
					var target=trigger.player;
					var list=game.filterPlayer(function(current){
						return current.isFriendOf(target);
					});
					if(list.length){
						if(list.length==1) event._result={bool:true,targets:list};
						else player.chooseTarget('布施：令一名与'+(player==target?'你':get.translation(target))+'势力相同的角色摸一张牌',true,function(card,player,target){
							return target.isFriendOf(_status.event.target)
						}).set('target',target);
					}
					else event.finish();
					'step 2'
					if(result.bool){
						var target=result.targets[0];
						player.line(target,'green');
						target.draw();
						if(event.count) event.goto(1);
					}
				},
			},
			gzmidao:{
				audio:2,
				trigger:{global:'useCardToPlayered'},
				direct:true,
				//noHidden:true,
				filter:function(event,player){
					var target=event.player;
					return event.isFirstTarget&&target.isFriendOf(player)&&
					target.isPhaseUsing()&&(target==player||player.hasSkill('gzmidao'))&&
					(['basic','trick'].contains(get.type(event.card))&&get.tag(event.card,'damage')>0)&&
					event.cards&&event.cards.length&&!target.hasSkill('gzmidao2');
				},
				preHidden:true,
				content:function(){
					'step 0'
					var next=trigger.player.chooseBool('是否对'+get.translation(player)+'发动【米道】？','令该角色修改'+get.translation(trigger.card)+'的花色和伤害属性');
					next.set('ai',()=>false);
					if(player==next.player) next.setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						player.logSkill('gzmidao');
						trigger.player.addTempSkill('gzmidao2');
						if(player!=trigger.player){
							trigger.player.line(player,'green');
							//player.gain(result.cards,trigger.player,'giveAuto');
						}
					}
					else event.finish();
					'step 2'
					if(player.isUnderControl()){
						game.swapPlayerAuto(player);
					}
					var switchToAuto=function(){
						_status.imchoosing=false;
						var listn=['普通'].concat(lib.inpile_nature);
						event._result={
							bool:true,
							suit:lib.suit.randomGet(),
							nature:listn.randomGet(),
						};
						if(event.dialog) event.dialog.close();
						if(event.control) event.control.close();
					};
					var chooseButton=function(player,card){
						var event=_status.event;
						player=player||event.player;
						if(!event._result) event._result={};
						var dialog=ui.create.dialog('米道：请修改'+card+'的花色和属性','forcebutton','hidden');
						event.dialog=dialog;
						dialog.addText('花色');
						var table=document.createElement('div');
						table.classList.add('add-setting');
						table.style.margin='0';
						table.style.width='100%';
						table.style.position='relative';
						var listi=['spade','heart','club','diamond'];
						for(var i=0;i<listi.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.link=listi[i];
							table.appendChild(td);
							td.innerHTML='<span>'+get.translation(listi[i])+'</span>';
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								_status.tempNoButton=true;
								setTimeout(function(){
									_status.tempNoButton=false;
								},500);
								var link=this.link;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								event._result.suit=link;
							});
						}
						dialog.content.appendChild(table);
						dialog.addText('属性');
						var table2=document.createElement('div');
						table2.classList.add('add-setting');
						table2.style.margin='0';
						table2.style.width='100%';
						table2.style.position='relative';
						var listn=['普通'].concat(lib.inpile_nature);
						for(var i=0;i<listn.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							var nature=listn[i];
							td.link=nature;
							table2.appendChild(td);
							td.innerHTML='<span>'+get.translation(nature)+'</span>';
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								_status.tempNoButton=true;
								setTimeout(function(){
									_status.tempNoButton=false;
								},500);
								var link=this.link;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								event._result.nature=link;
							});
						}
						dialog.content.appendChild(table2);
						dialog.add('　　');
						event.dialog.open();
						
						event.switchToAuto=function(){
							event._result={
								bool:true,
								nature:listn.randomGet(),
								suit:listi.randomGet(),
							};
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing=false;
						};
						event.control=ui.create.control('ok','cancel2',function(link){
							var result=event._result;
							if(link=='cancel2') result.bool=false;
							else{
								if(!result.nature||!result.suit) return;
								result.bool=true;
							}
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing=false;
						});
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('selectable');
						}
						game.pause();
						game.countChoose();
					};
					if(event.isMine()){
						chooseButton(player,get.translation(trigger.card));
					}
					else if(event.isOnline()){
						event.player.send(chooseButton,event.player,get.translation(trigger.card));
						event.player.wait();
						game.pause();
					}
					else{
						switchToAuto();
					}
					'step 3'
					var map=event.result||result;
					if(map.bool){
						game.log(player,'将',trigger.card,'的花色属性修改为了','#g'+get.translation(map.suit+2),'#y'+get.translation(map.nature));
						trigger.card.suit=map.suit;
						if(map.nature=='普通') delete trigger.card.nature;
						else trigger.card.nature=map.nature;
						trigger.player.storage.gzmidao2=[trigger.card,map.nature];
						player.popup(get.translation(map.suit+2)+get.translation(map.nature),'thunder');
					}
				},
			},
			gzmidao2:{
				charlotte:true,
				trigger:{global:'damageBefore'},
				forced:true,
				firstDo:true,
				popup:false,
				onremove:true,
				filter:function(event,player){
					return player.storage.gzmidao2&&event.card==player.storage.gzmidao2[0];
				},
				content:function(){
					var nature=player.storage.gzmidao2[1];
					if(nature=='普通') delete trigger.nature;
					else trigger.nature=nature;
				},
			},
			gzbiluan:{
				audio:2,
				mod:{
					globalTo:function(from,to,distance){
						return distance+to.countCards('e');
					},
				},
			},
			gzrelixia:{
				audio:'gzlixia',
				trigger:{global:'phaseZhunbeiBegin'},
				noHidden:true,
				forced:true,
				filter:function(event,player){
					return player!=event.player&&!event.player.isFriendOf(player)&&!player.inRangeOf(event.player);
				},
				logTarget:'player',
				content:function(){
					'step 0'
					var target=trigger.player;
					event.target=target;
					if(!player.countDiscardableCards(target,'e')){
						player.draw();
						event.finish();
						return;
					}
					var str=get.translation(player);
					target.chooseControl().set('prompt',str+'发动了【礼下】，请选择一项').set('choiceList',[
						'令'+str+'摸一张牌',
						'弃置'+str+'装备区内的一张牌并失去1点体力',
					]).set('ai',function(){
						var player=_status.event.player,target=_status.event.getParent().player;
						if(player.hp<=1||get.attitude(player,target)>=0) return 0;
						if(target.countCards('e',function(card){
							return get.value(card,target)>=7-player.hp;
						})>0) return 1;
						var dist=get.distance(player,target,'attack');
						if(dist>1&&dist-target.countCards('e')<=1) return true;
						return 0;
					});
					'step 1'
					if(result.index==0) player.draw();
					else{
						target.discardPlayerCard(player,'e',true);
						target.loseHp();
					}
				},
			},
			gzlixia:{
				audio:2,
				trigger:{global:'phaseZhunbeiBegin'},
				noHidden:true,
				direct:true,
				filter:function(event,player){
					return player!=event.player&&!event.player.isFriendOf(player)&&player.countDiscardableCards(event.player,'e')>0;
				},
				content:function(){
					'step 0'
					trigger.player.chooseBool('是否对'+get.translation(player)+'发动【礼下】？','弃置其装备区内的一张牌，然后选择一项：①弃置两张牌。②失去1点体力。③令其摸两张牌。').set('ai',function(){
						var player=_status.event.player;
						var target=_status.event.getParent().player;
						if(get.attitude(player,target)>0) return target.countCards('e',function(card){
							return get.value(card,target)<3;
						})>0;
						if(target.countCards('e',function(card){
							return get.value(card,target)>=7;
						})) return true;
						var dist=get.distance(player,target,'attack');
						if(dist>1&&dist-target.countCards('e')<=1) return true;
						return false;
					});
					'step 1'
					if(result.bool){
						var target=trigger.player;
						event.target=target;
						player.logSkill('gzlixia');
						target.line(player,'green');
						target.discardPlayerCard(player,'e',true);
					}
					else event.finish();
					'step 2'
					var list=['失去一点体力','令'+get.translation(player)+'摸两张牌'];
					event.addIndex=0;
					if(target.countCards('h',function(card){
						return lib.filter.cardDiscardable(card,target,'gzlixia');
					})>1) list.unshift('弃置两张牌');
					else event.addIndex++;
					target.chooseControl().set('choiceList',list).set('ai',function(){
						var num=2;
						var player=_status.event.player;
						var target=_status.event.getParent().player;
						if(get.attitude(player,target)>=0) num=2;
						else if(player.countCards('he',function(card){
							return lib.filter.cardDiscardable(card,player,'gzlixia')&&get.value(card,player)<5;
						})>1) num=0;
						else if(player.hp+player.countCards('h','tao')>3&&!player.hasJudge('lebu')) num=1;
						return num-_status.event.getParent().addIndex;
					});
					'step 3'
					switch(result.index+event.addIndex){
						case 0:
							target.chooseToDiscard(2,'h',true);
							break;
						case 1:
							target.loseHp();
							break;
						case 2:
							player.draw(2);
							break;
					}
				},
			},

			yigui:{
				audio:2,
				hiddenCard:function(player,name){
					var storage=player.storage.yigui;
					if(name=='shan'||name=='wuxie'||!storage||!storage.character.length||storage.used.contains(name)||!lib.inpile.contains(name)) return false;
					return true;
				},
				init:function(player,skill){
					if(!player.storage.skill) player.storage[skill]={
						character:[],
						used:[],
					}
				},
				enable:"chooseToUse",
				filter:function(event,player){
					if(event.type=='wuxie'||event.type=='respondShan') return false;
					var storage=player.storage.yigui;
					if(!storage||!storage.character.length) return false;
					if(event.type=='dying'){
						if((!event.filterCard({name:'tao'},player,event)||storage.used.contains('tao'))&&
						(!event.filterCard({name:'jiu'},player,event)||storage.used.contains('jiu'))) return false;
						var target=event.dying;
						if(target.identity=='unknown'||target.identity=='ye') return true;
						for(var i=0;i<storage.character.length;i++){
							var group=lib.character[storage.character[i]][1];
							if(group=='ye'||target.identity==group) return true;
							var double=get.is.double(storage.character[i],true);
							if(double&&double.contains(target.identity)) return true;
						}
						return false;
					}
					else return true;
				},
				chooseButton:{
					select:2,
					dialog:function(event,player){
						var dialog=ui.create.dialog('役鬼','hidden');
						dialog.add([player.storage.yigui.character,'character']);
						var list=lib.inpile;
						var list2=[];
						for(var i=0;i<list.length;i++){
							var name=list[i];
							if(name=='shan'||name=='wuxie') continue;
							var type=get.type(name);
							if(name=='sha'){
								list2.push(['基本','','sha']);
								list2.push(['基本','','sha','fire']);
								list2.push(['基本','','sha','thunder']);
							}
							else if(type=='basic'){
								list2.push(['基本','',list[i]]);
							}
							else if(type=='trick'){
								list2.push(['锦囊','',list[i]]);
							}
						}
						dialog.add([list2,'vcard']);
						return dialog;
					},
					check:function(button){
						if(ui.selected.buttons.length){
							var evt=_status.event.getParent('chooseToUse');
							var name=button.link[2];
							var group=lib.character[ui.selected.buttons[0].link][1];
							var double=get.is.double(ui.selected.buttons[0].link,true);
							var player=_status.event.player;
							if(evt.type=='dying'){
								if(evt.dying!=player&&get.effect(evt.dying,{name:name},player,player)<=0) return 0;
								if(name=='jiu') return 2.1;
								return 2;
							}
							if(!['tao','juedou','guohe','shunshou','wuzhong','xietianzi','yuanjiao','taoyuan','wugu','wanjian','nanman','huoshaolianying'].contains(name)) return 0;
							if(['taoyuan','wugu','wanjian','nanman','huoshaolianying'].contains(name)){
								var list=game.filterPlayer(function(current){
									return (group=='ye'||current.identity=='unknown'||current.identity=='ye'||current.identity==group||(double&&double.contains(current.identity)))&&player.canUse({name:name},current);
								});
								var num=0;
								for(var i=0;i<list.length;i++){
									num+=get.effect(list[i],{name:name},player,player);
								}
								if(num<=0) return 0;
								if(list.length>1) return (1.7+Math.random())*Math.max(num,1);
							}
						}
						return 1+Math.random();
					},
					filter:function(button,player){
						var evt=_status.event.getParent('chooseToUse');
						if(!ui.selected.buttons.length){
							if(typeof button.link!='string') return false;
							if(evt.type=='dying'){
								if(evt.dying.identity=='unknown'||evt.dying.identity=='ye') return true;
								var double=get.is.double(button.link,true);
								return evt.dying.identity==lib.character[button.link][1]||lib.character[button.link][1]=='ye'||(double&&double.contains(evt.dying.identity));
							}
							return true;
						}
						else{
							if(typeof ui.selected.buttons[0].link!='string') return false;
							if(typeof button.link!='object') return false;
							var name=button.link[2];
							if(player.storage.yigui.used.contains(name)) return false;
							var card={name:name};
							if(button.link[3]) card.nature=button.link[3];
							var info=get.info(card);
							var group=lib.character[ui.selected.buttons[0].link][1];
							var double=get.is.double(ui.selected.buttons[0].link,true);
							if(evt.type=='dying'){
								return evt.filterCard(card,player,evt);
							}
							if(!lib.filter.filterCard(card,player,evt)) return false;
							else if(evt.filterCard&&!evt.filterCard(card,player,evt)) return false;
							if(info.changeTarget){
								var list=game.filterPlayer(function(current){
									return player.canUse(card,current);
								});
								for(var i=0;i<list.length;i++){
									var giveup=false;
									var targets=[list[i]];
									info.changeTarget(player,targets);
									for(var j=0;j<targets.length;j++){
										if(group!='ye'&&targets[j].identity!='unknown'&&targets[j].identity!='ye'&&targets[j].identity!=group&&(!double||!double.contains(targets[j].identity))){
											giveup=true;
											break;
										}
									}
									if(giveup) continue;
									if(giveup==false) return true;
								}
								return false;
							}
							else return game.hasPlayer(function(current){
								return evt.filterTarget(card,player,current)&&(group=='ye'||current.identity=='unknown'||current.identity=='ye'||current.identity==group||(double&&double.contains(current.identity)));
							});
						}
					},
					backup:function(links,player){
						var name=links[1][2];
						var nature=links[1][3]||null;
						var character=links[0];
						var group=lib.character[character][1];
						var next={
							character:character,
							group:group,
							filterCard:function(){
								return false;
							},
							selectCard:-1,
							complexCard:true,
							check:function(){return 1},
							popname:true,
							audio:"yigui",
							viewAs:{
								name:name,
								nature:nature,
								isCard:true,
							},
							filterTarget:function(card,player,target){
								var xx=lib.skill.yigui_backup;
								var evt=_status.event;
								var group=xx.group;
								var double=get.is.double(xx.character,true);
								var info=get.info(card);
								if((!(info.singleCard&&ui.selected.targets.length))&&group!='ye'&&target.identity!='unknown'&&target.identity!='ye'&&target.identity!=group&&(!double||!double.contains(target.identity))) return false;
								if(info.changeTarget){
									var targets=[target];
									info.changeTarget(player,targets);
									for(var i=0;i<targets.length;i++){
										if(group!='ye'&&targets[i].identity!='unknown'&&targets[i].identity!='ye'&&targets[i].identity!=group&&(!double||!double.contains(targets[i].identity))) return false;
									}
								}
								//if(evt.type=='dying') return target==evt.dying;
								if(evt._backup&&evt._backup.filterTarget) return evt._backup.filterTarget(card,player,target);
								return lib.filter.filterTarget(card,player,target);
							},
							onuse:function(result,player){
								player.logSkill('yigui');
								var character=lib.skill.yigui_backup.character;
								player.flashAvatar('yigui',character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player,'从「魂」中移除了','#g'+get.translation(character));
								player.syncStorage('yigui');
								player.updateMarks('yigui');
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
					prompt:function(links,player){
						var name=links[1][2];
						var character=links[0];
						var nature=links[1][3];
						return '移除「'+get.translation(character)+'」并视为使用'+(get.translation(nature)||'')+get.translation(name);
					},
				},
				group:["yigui_init","yigui_refrain"],
				ai:{
					order:function(){
						return 1+10*Math.random();
					},
					result:{
						player:1,
					},
				},
				mark:true,
				marktext:'魂',
				intro:{
					onunmark:function(storage,player){
						_status.characterlist.addArray(storage.character);
						storage.character=[];
					},
					mark:function(dialog,storage,player){
						if(storage&&storage.character.length){
							if(player.isUnderControl(true)){
								dialog.addSmall([storage.character,'character']);
							}
							else{
								return '共有'+get.cnNumber(storage.character.length)+'张“魂”'
							}
						}
						else{
							return '没有魂';
						}
					},
					content:function(storage,player){
							return '共有'+get.cnNumber(storage.character.length)+'张“魂”'
					},
					markcount:function(storage,player){
						if(storage&&storage.character) return storage.character.length;
						return 0;
					},
				},
			},
			"yigui_init":{
				audio:"yigui",
				trigger:{
					player:'showCharacterAfter',
				},
				forced:true,
				filter:function(event,player){
					return event.toShow.contains('gz_zuoci')&&!player.storage.yigui_init;
				},
				content:function(){
					player.storage.yigui_init=true;
					var list=_status.characterlist.randomGets(2);
					if(list.length){
						_status.characterlist.removeArray(list);
						player.storage.yigui.character.addArray(list);
						lib.skill.gzhuashen.drawCharacter(player,list);
						player.syncStorage('yigui');
						player.updateMarks('yigui');
						game.log(player,'获得了'+get.cnNumber(list.length)+'张「魂」');
					}
				},
			},
			"yigui_refrain":{
				trigger:{global:'phaseBefore'},
				forced:true,
				silent:true,
				popup:false,
				content:function(){
					player.storage.yigui.used=[];
				},
			},
			yigui_shan:{
				enable:"chooseToUse",
				filter:function(event,player){
					if(event.type!='respondShan') return false;
					var storage=player.storage.yigui;
					if(!storage||!storage.character.length||storage.used.contains('shan')) return false;
					return event.filterCard({name:'shan'},player,event);
				},
				chooseButton:{
					dialog:function(event,player){
						var dialog=ui.create.dialog('役鬼','hidden');
						dialog.add([player.storage.yigui.character,'character']);
						return dialog;
					},
					check:function(button){
						return 1/(1+game.countPlayer(function(current){
							return current.identity==button.link;
						}));
					},
					backup:function(links,player){
						var character=links[0];
						var next={
							character:character,
							filterCard:function(){
								return false;
							},
							selectCard:-1,
							complexCard:true,
							check:function(){return 1},
							popname:true,
							audio:"yigui",
							viewAs:{
								name:'shan',
								isCard:true,
							},
							onuse:function(result,player){
								player.logSkill('yigui');
								var character=lib.skill.yigui_shan_backup.character;
								player.flashAvatar('yigui',character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player,'从「魂」中移除了','#g'+get.translation(character));
								player.syncStorage('yigui');
								player.updateMarks('yigui');
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
				},
				ai:{
					respondShan:true,
					skillTagFilter:function(player){
						var storage=player.storage.yigui;
						if(!storage||!storage.character.length||storage.used.contains('shan')) return false;
					},
					order:0.1,
					result:{
						player:1,
					},
				},
			},
			yigui_wuxie:{
				enable:"chooseToUse",
				filter:function(event,player){
					if(event.type!='wuxie') return false;
					var storage=player.storage.yigui;
					if(!storage||!storage.character.length||storage.used.contains('wuxie')) return false;
					return event.filterCard({name:'wuxie'},player,event);
				},
				chooseButton:{
					dialog:function(event,player){
						var dialog=ui.create.dialog('役鬼','hidden');
						dialog.add([player.storage.yigui.character,'character']);
						return dialog;
					},
					check:function(button){
						return 1/(1+game.countPlayer(function(current){
							return current.identity==button.link;
						}));
					},
					backup:function(links,player){
						var character=links[0];
						var next={
							character:character,
							filterCard:function(){
								return false;
							},
							selectCard:-1,
							complexCard:true,
							check:function(){return 1},
							popname:true,
							audio:"yigui",
							viewAs:{
								name:'wuxie',
								isCard:true,
							},
							onuse:function(result,player){
								player.logSkill('yigui');
								var character=lib.skill.yigui_wuxie_backup.character;
								player.flashAvatar('yigui',character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player,'从「魂」中移除了','#g'+get.translation(character));
								player.syncStorage('yigui');
								player.updateMarks('yigui');
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
				},
				ai:{
					order:0.1,
					result:{
						player:1,
					},
				},
			},
			jihun:{
				trigger:{
					player:'damageEnd',
					global:'dyingAfter',
				},
				audio:2,
				frequent:true,
				preHidden:true,
				filter:function(event,player){
					return event.name=='damage'||(event.player.isAlive()&&!event.player.isFriendOf(player))
				},
				content:function(){
					var list=_status.characterlist.randomGets(1);
					if(list.length){
						_status.characterlist.removeArray(list);
						player.storage.yigui.character.addArray(list);
						lib.skill.gzhuashen.drawCharacter(player,list);
						player.syncStorage('yigui');
						player.updateMarks('yigui');
						game.log(player,'获得了'+get.cnNumber(list.length)+'张「魂」');
					}
				},
			},
			gzbuyi:{
				trigger:{global:'dyingAfter'},
				usable:1,
				filter:function(event,player){
					if(!(event.player&&event.player.isAlive()&&event.source&&event.source.isAlive())) return false;
					return event.player.isFriendOf(player)&&event.reason&&event.reason.name=='damage';
				},
				check:function(event,player){return get.attitude(player,event.player)>0},
				logTarget:'source',
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseJunlingFor(trigger.source);
					'step 1'
					event.junling=result.junling;
					event.targets=result.targets;
					var choiceList=[];
					choiceList.push('执行该军令');
					choiceList.push('令'+get.translation(trigger.player)+(trigger.player==trigger.source?'（你）':'')+'回复一点体力');
					trigger.source.chooseJunlingControl(player,result.junling,result.targets).set('prompt','补益').set('choiceList',choiceList).set('ai',function(){
						if(get.recoverEffect(trigger.player,player,_status.event.player)>0) return 1;
						return (get.attitude(trigger.source,trigger.player)<0&&get.junlingEffect(player,result.junling,trigger.source,result.targets,trigger.source)>=-2)?1:0;
						return 0;
					});
					'step 2'
					if(result.index==0) trigger.source.carryOutJunling(player,event.junling,targets);
					else trigger.player.recover(player);
				},
				audio:['buyi',2],
			},
			keshou:{
				audio:2,
				trigger:{player:'damageBegin3'},
				filter:function(event,player){
					return event.num>0;
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					var check=(player.countCards('h',{color:'red'})>1||player.countCards('h',{color:'black'})>1);
					player.chooseCard(get.prompt('keshou'),'弃置两张颜色相同的牌，令即将受到的伤害-1','he',2,function(card){
						if(ui.selected.cards.length) return get.color(card)==get.color(ui.selected.cards[0]);
						return true;
					}).set('complexCard',true).set('ai',function(card){
						if(!_status.event.check) return 0;
						var player=_status.event.player;
						if(player.hp==1){
							if(!player.countCards('h',function(card){return get.tag(card,'save')})&&!player.hasSkillTag('save',true)) return 10-get.value(card);
							return 7-get.value(card);
						}
						return 6-get.value(card);
					}).set('check',check).setHiddenSkill(event.name);
					'step 1'
					var logged=false;
					if(result.cards){
						logged=true;
						player.logSkill('keshou');
						player.discard(result.cards);
						trigger.num--;
					}
					if(!player.isUnseen()&&!game.hasPlayer(function(current){
						return current!=player&&current.isFriendOf(player);
					})){
						if(!logged) player.logSkill('keshou');
						player.judge(function(card){
							if(get.color(card)=='red') return 1;
							return 0;
						});
					}
					else event.finish();
					'step 2'
					if(result.judge>0) player.draw();
				}
			},
			zhuwei:{
				audio:2,
				trigger:{player:'judgeEnd'},
				filter:function(event){
					if(get.owner(event.result.card)) return false;
					if(event.nogain&&event.nogain(event.result.card)) return false;
					return true;
					//return event.result.card.name=='sha'||event.result.card.name=='juedou';
				},
				frequent:true,
				preHidden:true,
				content:function(){
					'step 0'
					player.gain(trigger.result.card,'gain2');
					player.chooseBool('是否令'+get.translation(_status.currentPhase)+'本回合的手牌上限和使用【杀】的次数上限+1？').ai=function(){
						return get.attitude(player,_status.currentPhase)>0;
					};
					'step 1'
					if(result.bool){
						var target=_status.currentPhase;
						if(!target.hasSkill('zhuwei_eff')){
							target.addTempSkill('zhuwei_eff');
							target.storage.zhuwei_eff=1;
						}
						else target.storage.zhuwei_eff++;
						target.updateMarks();
					}
				},
				subSkill:{
					eff:{
						sub:true,
						mod:{
							cardUsable:function(card,player,num){
								if(card.name=='sha') return num+player.storage.zhuwei_eff;
							},
							maxHandcard:function(player,num){return num+player.storage.zhuwei_eff}
						},
						mark:true,
						charlotte:true,
						intro:{
							content:function(storage){if(storage) return '使用【杀】的次数上限+'+storage+'，手牌上限+'+storage}
						}
					}
				}
			},
			gzweidi:{
				init:function(player){player.storage.gzweidi=[]},
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.storage.gzweidi.length>0
				},
				filterTarget:function(card,player,target){return target!=player&&player.storage.gzweidi.contains(target)},
				content:function(){
					'step 0'
					player.chooseJunlingFor(target);
					'step 1'
					event.junling=result.junling;
					event.targets=result.targets;
					var choiceList=['执行该军令'];
					if(target!=player) choiceList.push('令'+get.translation(player)+'获得你所有手牌，然后交给你等量的牌');
					else choiceList.push('不执行该军令');
					target.chooseJunlingControl(player,result.junling,result.targets).set('prompt','伪帝').set('choiceList',choiceList).set('ai',function(){
						if(get.attitude(target,player)>=0) return get.junlingEffect(player,result.junling,target,result.targets,target)>=0?0:1;
						return get.junlingEffect(player,result.junling,target,result.targets,target)>=-1?0:1;
					});
					'step 2'
					if(result.index==0) target.carryOutJunling(player,event.junling,targets);
					else if(target!=player&&target.countCards('h')) {
						event.num=target.countCards('h');
						player.gain(target.getCards('h'),target,'giveAuto');
						player.chooseCard('交给'+get.translation(target)+get.cnNumber(event.num)+'张牌','he',event.num,true).set('ai',function(card){
							return -get.value(card);
						});
					}
					else event.finish();
					'step 3'
					if(result.cards){
						player.give(result.cards,target);
					}
				},
				group:['gzweidi_ft','gzweidi_ftc'],
				ai:{
					order:3,
					result:{
						player:1,
					}
				},
				subSkill:{
					ft:{
						sub:true,
						trigger:{global:'gainBefore'},
						silent:true,
						filter:function(event,player){
							if(player==event.player||player.storage.gzweidi.contains(event.player)||_status.currentPhase!=player) return false;
							if(event.cards.length){
								if(event.getParent().name=='draw') return true;
								for(var i=0;i<event.cards.length;i++) if(get.position(event.cards[i])=='c'||(!get.position(event.cards[i])&&event.cards[i].original=='c')) return true;
							}
							return false;
						},
						content:function(){player.storage.gzweidi.push(trigger.player)}
					},
					ftc:{
						sub:true,
						trigger:{global:'phaseAfter'},
						silent:true,
						filter:function(event,player){return event.player==player},
						content:function(){player.storage.gzweidi=[]},
					}
				},
				audio:['weidi',2]
			},
			gzyongsi:{
				group:['gzyongsi_eff1','gzyongsi_eff2','gzyongsi_eff3'],
				preHidden:['gzyongsi_eff3'],
				ai:{
					threaten:function(player,target){
						if(game.hasPlayer(function(current){
							return current!=target&&current.getEquip('yuxi');
						})) return 0.5;
						return 2;
					},
					forceMajor:true,
					skillTagFilter:function(){
						return !game.hasPlayer(function(current){
							return current.getEquip('yuxi');
						});
					},
				},
				subSkill:{
					eff1:{
						sub:true,
						equipSkill:true,
						noHidden:true,
						trigger:{player:'phaseDrawBegin2'},
						//priority:8,
						forced:true,
						filter:function(event,player){
							if(event.numFixed||player.isDisabled(5)) return false;
							return !game.hasPlayer(function(current){
								return current.getEquip('yuxi');
							})
						},
						content:function(){trigger.num++},
						audio:['yongsi',2]
					},
					eff2:{
						sub:true,
						trigger:{player:'phaseUseBegin'},
						//priority:8,
						forced:true,
						noHidden:true,
						equipSkill:true,
						filter:function(event,player){
							if(player.isDisabled(5)) return false;
							return game.hasPlayer(function(current){
								return player.canUse('zhibi',current);
							})&&!game.hasPlayer(function(current){
								return current.getEquip('yuxi');
							});
						},
						content:function(){
							player.chooseUseTarget('玉玺（庸肆）：选择知己知彼的目标',{name:'zhibi'});
						},
						audio:['yongsi',2]
					},
					eff3:{
						sub:true,
						trigger:{global:'useCardToTargeted'},
						//priority:16,
						forced:true,
						filter:function(event,player){
							return event.target&&event.target==player&&event.card&&event.card.name=='zhibi'
						},
						check:function(){return false},
						content:function(){
							player.showHandcards();
						}
					}
				}
			},
			gzfudi:{
				trigger:{global:'damageEnd'},
				direct:true,
				preHidden:true,
				audio:2,
				filter:function(event,player){return event.source&&event.source.isAlive()&&event.source!=player&&event.player==player&&player.countCards('h')&&event.num>0},
				content:function(){
					'step 0'
					var players=game.filterPlayer(function(current){
						return current.isFriendOf(trigger.source)&&current.hp>=player.hp&&!game.hasPlayer(function(current2){
							return current2.hp>current.hp&&current2.isFriendOf(trigger.source);
						})
					});
					var check=true;
					if(!players.length) check=false;
					else{
						if(get.attitude(player,trigger.source)>=0) check=false;
					}
					player.chooseCard(get.prompt('gzfudi',trigger.source),'交给其一张手牌，然后对其势力中体力值最大且不小于你的一名角色造成1点伤害').set('aicheck',check).set('ai',function(card){
						if(!_status.event.aicheck) return 0;
						return 9-get.value(card);
					}).setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						player.logSkill('gzfudi',trigger.source);
						player.give(result.cards,trigger.source);
					}
					else event.finish();
					'step 2'
					var list=game.filterPlayer(function(current){
						return current.hp>=player.hp&&current.isFriendOf(trigger.source)&&!game.hasPlayer(function(current2){
							return current2.hp>current.hp&&current2.isFriendOf(trigger.source);
						});
					});
					if(list.length){
						if(list.length==1) event._result={bool:true,targets:list};
						else player.chooseTarget(true,'对'+get.translation(trigger.source)+'势力中体力值最大的一名角色造成1点伤害',function(card,player,target){
							return _status.event.list.contains(target);
						}).set('list',list).set('ai',function(target){return get.damageEffect(target,player,player)});
					}
					else event.finish();
					'step 3'
					if(result.bool&&result.targets.length){
						player.line(result.targets[0]);
						result.targets[0].damage();
					}
				},
				ai:{
					maixie:true,
					maixie_defend:true,
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'damage')&&target.hp>1){
								if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
								if(!target.countCards('h')) return [1,-1];
								if(game.countPlayer(function(current){return current.isFriendOf(player)&&current.hp>=target.hp-1})) return [1,0,0,-2];
							}
						}
					}
				}
			},
			gzcongjian:{
				trigger:{
					player:'damageBegin3',
					source:'damageBegin1',
				},
				forced:true,
				preHidden:true,
				audio:'drlt_congjian',
				filter:function(event,player,name){
					if(event.num<=0) return false;
					if(name=='damageBegin1'&&_status.currentPhase!=player) return true;
					if(name=='damageBegin3'&&_status.currentPhase==player) return true;
					return false;
				},
				check:function(event,player){
					return _status.currentPhase!=player;
				},
				content:function(){trigger.num++},
			},
			jianan:{
				audio:2,
				unique:true,
				forceunique:true,
				group:'wuziliangjiangdao',
				derivation:'wuziliangjiangdao',
				global:'g_jianan',
			},
			g_jianan:{
				trigger:{
					player:['phaseZhunbeiBegin','phaseBefore','dieBegin'],
				},
				audio:'jianan',
				forceaudio:true,
				filter:function(event,player,name){
					if(name!='phaseZhunbeiBegin') return get.is.jun(player)&&player.identity=='wei';
					return this.filter2.apply(this,arguments);
				},
				filter2:function(event,player){
					if(!get.zhu(player,'jianan')) return false;
					if(!player.countCards('he')) return false;
					return !player.isUnseen();
				},
				direct:true,
				content:function(){
					'step 0'
					if(event.triggername!='phaseZhunbeiBegin'){
						event.trigger('jiananUpdate');
						event.finish();
						return;
					}
					var skills=['new_retuxi','qiaobian','gzxiaoguo','gzjieyue','new_duanliang'];
					game.countPlayer(function(current){
							if(current==player) return;
							if(current.hasSkill('new_retuxi')) skills.remove('new_retuxi');
							if(current.hasSkill('qiaobian')) skills.remove('qiaobian');
							if(current.hasSkill('gzxiaoguo')) skills.remove('gzxiaoguo');
							if(current.hasSkill('gzjieyue')) skills.remove('gzjieyue');
							if(current.hasSkill('new_duanliang')) skills.remove('new_duanliang');
					});
					if(!skills.length) event.finish();
					else{
						event.skills=skills;
						var next=player.chooseToDiscard('he');
						var str='';
						for(var i=0;i<skills.length;i++){
							str+='、【';
							str+=get.translation(skills[i]);
							str+='】';
						}
						next.set('prompt','是否发动【五子良将纛】？')
						next.set('prompt2',get.translation('弃置一张牌并暗置一张武将牌，获得以下技能中的一个直到下回合开始：'+str.slice(1)));
						next.logSkill='g_jianan';
						next.skills=skills;
						next.ai=function(card){
							var skills=_status.event.skills;
							var player=_status.event.player;
							var rank=0;
							if(skills.contains('new_retuxi')&&game.countPlayer(function(current){
								return get.attitude(player,current)<0&&current.countGainableCards(player,'h')
							})>1) rank=4;
							if(skills.contains('gzjieyue')&&player.countCards('h',function(card){
								return get.value(card)<7;
							})>1) rank=5;
							if(skills.contains('qiaobian')&&player.countCards('h')>4) rank=6;
							if((get.guozhanRank(player.name1,player)<rank&&!player.isUnseen(0))||(get.guozhanRank(player.name2,player)<rank&&!player.isUnseen(1))) return rank+1-get.value(card);
							return -1;
						};
					}
					'step 1'
					if(!result.bool) event.finish();
					else{
						var list=["主将","副将"];
						if(player.isUnseen(0)||get.is.jun(player)) list.remove("主将");
						if(player.isUnseen(1)) list.remove("副将");
						if(!list.length) event.goto(3);
						else if(list.length<2) event._result={control:list[0]};
						else{
							player.chooseControl(list).set('ai',function(){
								return get.guozhanRank(player.name1,player)<get.guozhanRank(player.name2,player)?'主将':'副将';
							}).prompt="请选择暗置一张武将牌";
						}
					}
					'step 2'
					if(!result.control) event.finish();
					else{
						var num=result.control=='主将'?0:1;
						player.hideCharacter(num);
					}
					'step 3'
					player.chooseControl(event.skills).set('ai',function(){
						var skills=event.skills;
						if(skills.contains('qiaobian')&&player.countCards('h')>3) return 'qiaobian';
						if(skills.contains('gzjieyue')&&player.countCards('h',function(card){
							return get.value(card)<7;
						})) return 'gzjieyue';
						if(skills.contains('new_retuxi')) return 'new_retuxi';
						return skills.randomGet();
					}).set("prompt","选择获得其中的一个技能直到君主的回合开始");
					'step 4'
					var link=result.control;
					player.addTempSkill(link,"jiananUpdate");
					player.addTempSkill("jianan_eff","jiananUpdate");
					game.log(player,"获得了技能","#g【"+get.translation(result.control)+"】");
				},
			},
			jianan_eff:{
				ai:{nomingzhi:true}
			},
			huibian:{
				enable:'phaseUse',
				audio:2,
				usable:1,
				filter:function(event,player){
					return game.countPlayer(function(current){
						return current.identity=='wei';
					})>1&&game.hasPlayer(function(current){
						return current.isDamaged()&&current.identity=='wei';
					});
				},
				filterTarget:function(card,player,target){
					if(ui.selected.targets.length) return target.isDamaged()&&target.identity=='wei';
					return target.identity=='wei';
				},
				selectTarget:2,
				multitarget:true,
				targetprompt:['受到伤害</br>然后摸牌','回复体力'],
				content:function(){
					'step 0'
					targets[0].damage(player);
					'step 1'
					if(targets[0].isAlive()) targets[0].draw(2);
					targets[1].recover();
				},
				ai:{
					threaten:1.2,
					order:9,
					result:{
						target:function(player,target){
							if(ui.selected.targets.length) return 1;
							if(get.damageEffect(target,player,player)>0) return 2;
							if(target.hp>2) return 1;
							if(target.hp==1) return -1;
							return 0.1;
						}
					},
				}
			},
			gzzongyu:{
				audio:2,
				unique:true,
				forceunique:true,
				group:['gzzongyu_others','gzzongyu_player'],
				ai:{
					threaten:1.2,
				},
				subSkill:{
					others:{
						trigger:{global:'equipAfter'},
						direct:true,
						filter:function(event,player){
							if(event.player==player||!player.countCards('e',{subtype:['equip3','equip4']})) return false;
							return event.card.name=='liulongcanjia';
						},
						check:function(event,player){
							if(get.attitude(player,target)<=0) return player.countCards('e',{subtype:['equip4','equip4']})<2;
							return true;
						},
						content:function(){
							'step 0'
							player.chooseBool('是否发动【总御】，与'+get.translation(trigger.player)+'交换装备区内坐骑牌？');
							'step 1'
							if(result.bool){
								player.logSkill('gzzongyu',trigger.player);
								event.cards=[player.getCards('e',{subtype:['equip3','equip4']}),trigger.player.getCards('e',{name:'liulongcanjia'})];
								player.lose(event.cards[0],ui.special);
								trigger.player.lose(event.cards[1],ui.special);
								if(event.cards[0].length) player.$give(event.cards[0],trigger.player);
								if(event.cards[1].length) trigger.player.$give(event.cards[1],player);
							}
							else event.finish();
							'step 2'
							for(var i=0;i<event.cards[1].length;i++) player.equip(event.cards[1][i]);
							for(var i=0;i<event.cards[0].length;i++) trigger.player.equip(event.cards[0][i]);
						},
					},
					player:{
						audio:'gzzongyu',
						trigger:{player:'equipAfter'},
						forced:true,
						filter:function(event,player){
							if(!['equip3','equip4'].contains(get.subtype(event.card))) return false;
							for(var i=0;i<ui.discardPile.childElementCount;i++){
								if(ui.discardPile.childNodes[i].name=='liulongcanjia') return true;
							}
							return game.hasPlayer(function(current){
								return current!=player&&current.countCards('ej','liulongcanjia');
							});
						},
						content:function(){
							var list=[];
							for(var i=0;i<ui.discardPile.childElementCount;i++){
								if(ui.discardPile.childNodes[i].name=='liulongcanjia'){
									list.add(ui.discardPile.childNodes[i]);
								}
							}
							game.countPlayer(function(current){
								if(current!=player){
									var ej=current.getCards('ej','liulongcanjia');
									if(ej.length){
										list.addArray(ej);
									}
								}
							});
							if(list.length){
								var card=list.randomGet();
								var owner=get.owner(card);
								if(owner){
									player.line(owner,'green');
									owner.$give(card,player);
								}
								else player.$gain(card,'log');
								player.equip(card);
							}
						}
					},
				}
			},
			wuziliangjiangdao:{
				nopop:true,
				unique:true,
				forceunique:true,
				mark:true,
				intro:{content:function(){return get.translation('wuziliangjiangdao_info')}},
			},
					
			gzzhengbi:{
				audio:'zhengbi',
				trigger:{player:'phaseUseBegin'},
				filter:function(event,player){
					//if(event.player!=player) return false;
					return game.hasPlayer(function(current){return current!=player&&current.identity=='unknown'})||player.countCards('h',{type:'basic'});
				},
				check:function(event,player){
					if(player.countCards('h',function(card){return get.value(card)<7})){
						if(player.isUnseen()) return Math.random()>0.7;
						return true;
					}
				},
				preHidden:true,
				content:function(){
					'step 0'
					var choices=[];
					if(game.hasPlayer(function(current){return current.isUnseen()})) choices.push('选择一名未确定势力的角色');
					if(game.hasPlayer(function(current){return current!=player&&!current.isUnseen()})&&player.countCards('h',{type:'basic'})) choices.push('将一张基本牌交给一名已确定势力的角色');
					if(choices.length==1){
						event._result={index:choices[0]=='选择一名未确定势力的角色'?0:1};
					}
					else player.chooseControl().set('ai',function(){
						if(choices.length>1){
							var player=_status.event.player;
							if(!game.hasPlayer(function(current){
								return !current.isUnseen()&&current.getEquip('yuxi')||current.hasSkill('gzyongsi')&&!game.hasPlayer(function(current){
									return current.getEquip('yuxi');
								});
							})&&game.hasPlayer(function(current){return current!=player&&current.isUnseen()})){
								var identity;
								for(var i=0;i<game.players;i++){
									if(game.players[i].isMajor()){identity=game.players[i].identity;break;}
								}
							}
							if(!player.isUnseen()&&player.identity!=identity&&get.population(player.identity)+1>=get.population(identity)) return 0;
							return 1;
						}
						return 0;
					}).set('prompt','征辟：请选择一项').set('choiceList',choices);
					'step 1'
					if(result.index==0) player.chooseTarget('请选择一名未确定势力的角色',function(card,player,target){
						return target!=player&&target.identity=='unknown'
					},true);
					else player.chooseCardTarget({
						prompt:'请将一张基本牌交给一名已确定势力的其他角色',
						position:'h',
						filterCard:function(card){return get.type(card)=='basic'},
						filterTarget:function(card,player,target){
							return target!=player&&target.identity!='unknown';
						},
						ai1:function(card){return 5-get.value(card)},
						ai2:function(target){
							var player=_status.event.player;
							var att=get.attitude(player,target);
							if(att>0) return 0;
							return -(att-1)/target.countCards('h');
						}
					}).set('forced',true);
					'step 2'
					event.target=result.targets[0];
					player.line(result.targets,'green');
					if(result.cards.length){
						event.cards=result.cards;
						player.give(result.cards,result.targets[0]);
					}
					else{
						player.storage.gzzhengbi_eff1=result.targets[0];
						player.addTempSkill('gzzhengbi_eff1','phaseUseAfter');
						event.finish();
					}
					'step 3'
					var choices=[];
					if(target.countCards('he',{type:['trick','delay','equip']})) choices.push('一张非基本牌');
					if(target.countCards('h',{type:'basic'})>1) choices.push('两张基本牌');
					if(choices.length) target.chooseControl(choices).set('ai',function(event,player){
						if(choices.length>1){
							if(player.countCards('he',{type:['trick','delay','equip']},function(card){return get.value(card)<7})) return 0;
							return 1;
						}
						return 0;
					}).set('prompt','征辟：交给'+get.translation(player)+'…</div>');
					else{
						if(target.countCards('h')){
							var cards=target.getCards('h');
							target.give(cards,player);
							event.finish();
						}
						else event.finish();
					}
					'step 4'
					var check=(result.control=='一张非基本牌');
					target.chooseCard('he',(check?1:2),{type:(check?['trick','delay','equip']:'basic')},true);
					'step 5'
					if(result.cards){
						target.give(result.cards,player);
					}
				},
				subSkill:{
					eff1:{
						audio:'zhengbi',
						sub:true,
						onremove:true,
						trigger:{player:'phaseUseEnd'},
						forced:true,
						charlotte:true,
						filter:function(event,player){
							var target=player.storage.gzzhengbi_eff1;
							return target&&!target.isUnseen()&&target.countGainableCards(player,'he')>0;
						},
						logTarget:function(event,player){
							return player.storage.gzzhengbi_eff1;
						},
						content:function(){
							var num=0;
							var target=player.storage.gzzhengbi_eff1;
							if(target.countGainableCards(player,'h')) num++;
							if(target.countGainableCards(player,'e')) num++;
							if(num){
								player.gainPlayerCard(target,num,'he',true).set('filterButton',function(button){
									for(var i=0;i<ui.selected.buttons.length;i++){
										if(get.position(button.link)==get.position(ui.selected.buttons[i].link)) return false;
									}
									return true;
								});
							}
						},
					},
				}
			},
			gzfengying:{
				audio:'fengying',
				limited:true,
				enable:'phaseUse',
				position:'h',
				filterCard:true,
				selectCard:-1,
				filter:function(event,player){
					return !player.storage.gzfengying&&player.countCards('h')>0;
				},
				filterTarget:function(card,player,target){
					return target==player;
				},
				selectTarget:-1,
				discard:false,
				lose:false,
				content:function(){
					'step 0'
					player.awakenSkill('gzfengying');
					player.storage.gzfengying=true;
					player.useCard({name:'xietianzi'},cards,target);
					'step 1'
					var list=game.filterPlayer(function(current){
						return current.isFriendOf(player)&&current.countCards('h')<current.maxHp;
					});
					list.sort(lib.sort.seat);
					player.line(list,'thunder');
					game.asyncDraw(list,function(current){
						return current.maxHp-current.countCards('h');
					});
				},
				skillAnimation:'epic',
				animationColor:'gray',
				ai:{
					order:0.1,
					result:{
						player:function(player){
							var value=0;
							var cards=player.getCards('h');
							if(cards.length>=4) return 0;
							for(var i=0;i<cards.length;i++){
								value+=Math.max(0,get.value(cards[i],player,'raw'));
							}
							var targets=game.filterPlayer(function(current){return current.isFriendOf(player)&&current!=player});
							var eff=0;
							for(var i=0;i<targets.length;i++){
								var num=targets[i].countCards('h')<targets[i].maxHp;
								if(num<=0) continue;
								eff+=num;
							}
							return 5*eff-value
						}
					}
				},
			},
			
			junling4_eff:{
				mod:{
					cardEnabled2:function(card){
						if(get.position(card)=='h') return false
					},
				},
				mark:true,
				marktext:'令',
				intro:{
					content:'不能使用或打出手牌'
				}
			},
			junling5_eff:{
				trigger:{player:"recoverBefore"},
				priority:44,
				forced:true,
				silent:true,
				popup:false,
				content:function(){trigger.cancel()},
				mark:true,
				marktext:'令',
				intro:{
					content:'不能回复体力'
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'recover')) return 'zeroplayertarget';
						},
					},
				}
			},
			
			gzjieyue:{
				trigger:{player:'phaseZhunbeiBegin'},
				filter:function(event,player){
					return player.countCards('h')&&game.hasPlayer(function(current){
						return current!=player&&current.identity!='wei';
					});
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseCardTarget({
						prompt:get.prompt2('gzjieyue'),
						position:'h',
						filterCard:true,
						filterTarget:function(card,player,target){
							return target.identity!='wei'&&target!=player;
						},
						ai1:function(card,player,target){
							if(get.attitude(player,target)>0) return 11-get.value(card);
							return 7-get.value(card);
						},
						ai2:function(card,player,target){
							var att=get.attitude(player,target);
							if(att<0) return -att;
							return 1;
						}
					}).setHiddenSkill('gzjieyue');
					'step 1'
					if(result.bool){
						event.target=result.targets[0];
						player.logSkill('gzjieyue',result.targets);
						player.give(result.cards[0],result.targets[0]);
						player.chooseJunlingFor(result.targets[0]);
					}
					else event.finish();
					'step 2'
					event.junling=result.junling;
					event.targets=result.targets;
					var choiceList=[];
					choiceList.push('执行该军令，然后'+get.translation(player)+'摸一张牌');
					choiceList.push('令'+get.translation(player)+'摸牌阶段额外摸三张牌');
					target.chooseJunlingControl(player,result.junling,result.targets).set('prompt','节钺').set('choiceList',choiceList).set('ai',function(){
						if(get.attitude(target,player)>0) return get.junlingEffect(player,result.junling,target,result.targets,target)>1?0:1;
						return get.junlingEffect(player,result.junling,target,result.targets,target)>=-1?0:1;
					});
					'step 3'
					if(result.index==0){
						target.carryOutJunling(player,event.junling,targets);
						player.draw();
					}
					else player.addTempSkill('gzjieyue_eff');
				},
				ai:{threaten:2},
				subSkill:{
					eff:{
						sub:true,
						trigger:{player:'phaseDrawBegin2'},
						filter:function(event,player){
							return !event.numFixed;
						},
						forced:true,
						popup:false,
						content:function(){
							trigger.num+=3;
						}
					}
				},
				audio:['jieyue',2],
			},
			
			jianglue:{
				limited:true,
				audio:2,
				enable:'phaseUse',
				prepare:function(cards,player){
					var targets=game.filterPlayer(function(current){
						return current.isFriendOf(player)||current.isUnseen();
					});
					player.line(targets,'fire');
				},
				content:function(){
					'step 0'
					player.awakenSkill('jianglue');
					player.addTempSkill('jianglue_count');
					player.chooseJunlingFor(player).set('prompt','选择一张军令牌，令与你势力相同的其他角色选择是否执行');
					'step 1'
					event.junling=result.junling;
					event.targets=result.targets;
					event.players=game.filterPlayer(function(current){
						if(current==player) return false;
						return current.isFriendOf(player)||(player.identity!='ye'&&current.isUnseen());
					}).sort(lib.sort.seat);
					event.num=0;
					event.filterName=function(name){
						return lib.character[name][1]==player.identity&&!get.is.double(name);
					}
					'step 2'
					if(num<event.players.length) event.current=event.players[num];
					if(event.current&&event.current.isAlive()){
						event.showCharacter=false;
						var choiceList=['执行该军令，增加一点体力上限，然后回复一点体力','不执行该军令'];
						if(event.current.isFriendOf(player)) event.current.chooseJunlingControl(player,event.junling,targets).set('prompt','将略').set('choiceList',choiceList).set('ai',function(){return 0});
						else if((event.filterName(event.current.name1)||event.filterName(event.current.name2))&&event.current.wontYe(player.identity)){
							event.showCharacter=true;
							choiceList[0]='明置一张武将牌以'+choiceList[0];
							choiceList[1]='不明置武将牌且'+choiceList[1];
							event.current.chooseJunlingControl(player,event.junling,targets).set('prompt','将略').set('choiceList',choiceList).set('ai',function(){return 0});
						}
						else event.current.chooseJunlingControl(player,event.junling,targets).set('prompt','将略').set('controls',['ok']);
					}
					else event.goto(4);
					'step 3'
					event.carry=false;
					if(result.index==0&&result.control!='ok'){
						event.carry=true;
						if(event.showCharacter){
							var list=[];
							if(event.filterName(event.current.name1)) list.push('主将');
							if(event.filterName(event.current.name2)) list.push('副将');
							if(list.length>1) event.current.chooseControl(['主将','副将']).set('ai',function(){
								if(player.name1=='gz_fazheng') return 0;
								if(player.name2=='gz_fazheng') return 1;
								return Math.random()>0.5?0:1;
							}).prompt='选择并展示一张武将牌，然后执行军令';
							else event._result={index:list[0]=='主将'?0:1};
						}
					}
					'step 4'
					if(!event.list) event.list=[player];
					if(event.carry){
						if(event.showCharacter) event.current.showCharacter(result.index);
						event.current.carryOutJunling(player,event.junling,targets);
						event.list.push(event.current);
					}
					event.num++;
					if(event.num<event.players.length) event.goto(2);
					'step 5'
					event.num=0;
					player.storage.jianglue_count=0;
					'step 6'
					if(event.list[num].isAlive()){
						event.list[num].gainMaxHp(true);
						event.list[num].recover();
					}
					event.num++;
					'step 7'
					if(event.num<event.list.length) event.goto(6);
					else if(player.storage.jianglue_count>0) player.draw(player.storage.jianglue_count);
				},
				marktext:'略',
				skillAnimation:'epic',
				animationColor:'soil',
				ai:{
					order:4,
					result:{
						player:function(player){
							if(player.isUnseen()&&player.wontYe()){
								if(get.population(player.group)>=game.players.length/4) return 1;
								return Math.random()>0.7?1:0;
							}
							else return 1;
						}
					}
				},
				subSkill:{
					count:{
						sub:true,
						trigger:{global:'recoverAfter'},
						silent:true,
						filter:function(event){return event.getParent('jianglue')},
						content:function(){player.storage.jianglue_count++}
					}
				}
			},
			gzxuanhuo:{
				global:'gzxuanhuo_others',
				derivation:['fz_new_rewusheng','fz_gzpaoxiao','fz_new_longdan','fz_new_tieji','fz_liegong','fz_xinkuanggu'],
				ai:{
					threaten:function(player,target){
						if(game.hasPlayer(function(current){
							return current!=target&&current.isFriendOf(target);
						})) return 1.5;
						return 0.5;
					},
				},
				subSkill:{
					others:{
						enable:'phaseUse',
						usable:1,
						filter:function(event,player){
							return (!player.isUnseen())&&player.countCards('h')>0&&game.hasPlayer(function(current){
								return current!=player&&current.hasSkill('gzxuanhuo')&&player.isFriendOf(current);
							});
						},
						prompt:'弃置一张手牌，然后获得以下技能中的一个：〖武圣〗〖咆哮〗〖龙胆〗〖铁骑〗〖烈弓〗〖狂骨〗',
						position:'h',
						filterCard:true,
						check:function(card){
							var player=_status.event.player;
							if(player.hasSkill('gzpaoxiao',true)||player.getEquip('zhuge')) return 0;
							if(player.countCards('h',function(cardx){
								return cardx!=card&&cardx.name=='sha'&&player.hasUseTarget(cardx);
							})<(player.getCardUsable('sha')+1)) return 0;
							return 7-get.value(card);
						},
						content:function(){
							'step 0'
							var list=['new_rewusheng','gzpaoxiao','new_longdan','new_tieji','liegong','xinkuanggu'];
							player.chooseControl(list).set('ai',function(){
								if(list.contains('gzpaoxiao')) return 'gzpaoxiao';
								return list.randomGet();
							}).set('prompt','选择并获得一项技能直到回合结束');
							'step 1'
							player.popup(result.control);
							player.addTempSkill('fz_'+result.control);
							game.log(player,'获得了技能','#g【'+get.translation(result.control)+'】');
							game.delay();
						},
						forceaudio:true,
						audio:['xuanhuo',2],
						ai:{
							order:8,
							result:{player:1},
						},
					},
					//used:{},
				},
				audio:['xuanhuo',2],
			},
			fz_gzpaoxiao:{
				audio:true,
				inherit:'gzpaoxiao',
			},
			fz_new_tieji:{
				audio:true,
				inherit:'new_tieji',
			},
			fz_new_rewusheng:{
				audio:true,
				inherit:'new_rewusheng',
			},
			fz_liegong:{
				audio:true,
				inherit:'liegong',
			},
			fz_xinkuanggu:{
				audio:true,
				inherit:'xinkuanggu',
			},
			fz_new_longdan:{
				audio:true,
				group:["fz_new_longdan_sha","fz_new_longdan_shan","fz_new_longdan_draw","fz_new_longdan_shamiss","fz_new_longdan_shanafter"],
				subSkill:{
					shanafter:{
						sub:true,
						audio:"fz_new_longdan",
						trigger:{
							player:"useCard",
						},
						//priority:1,
						filter:function(event,player){
							return event.skill=='fz_new_longdan_shan'&&event.getParent(2).name=='sha';
						},
						direct:true,
						content:function(){
							"step 0"
							player.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？",function(card,player,target){
								return target!=_status.event.source&&target!=player&&target.isDamaged();
							}).set('ai',function(target){
								return get.attitude(_status.event.player,target);
							}).set('source',trigger.getParent(2).player);
							"step 1"
							if(result.bool&&result.targets&&result.targets.length){
								player.logSkill('fz_new_longdan',result.targets[0]);
								result.targets[0].recover();
							}
						},
					},
					shamiss:{
						sub:true,
						audio:"fz_new_longdan",
						trigger:{
							player:"shaMiss",
						},
						direct:true,
						filter:function(event,player){
							return event.skill=='fz_new_longdan_sha';
						},
						content:function(){
							"step 0"
							player.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？",function(card,player,target){
								return target!=_status.event.target&&target!=player;
							}).set('ai',function(target){
								return -get.attitude(_status.event.player,target);
							}).set('target',trigger.target);
							"step 1"
							if(result.bool&&result.targets&&result.targets.length){
								player.logSkill('fz_new_longdan',result.targets[0]);
								result.targets[0].damage();
							}
						},
					},
					draw:{
						trigger:{
							player:["useCard","respond"],
						},
						audio:"fz_new_longdan",
						forced:true,
						locked:false,
						filter:function(event,player){
							if(!get.zhu(player,'shouyue')) return false;
							return event.skill=='fz_new_longdan_sha'||event.skill=='fz_new_longdan_shan';
						},
						content:function(){
							player.draw();
							//player.storage.fanghun2++;
						},
						sub:true,
					},
					sha:{
						audio:"fz_new_longdan",
						enable:["chooseToUse","chooseToRespond"],
						filterCard:{
							name:"shan",
						},
						viewAs:{
							name:"sha",
						},
						viewAsFilter:function(player){
							if(!player.countCards('hs','shan')) return false;
						},
						prompt:"将一张闪当杀使用或打出",
						position:'hs',
						check:function(){return 1},
						ai:{
							effect:{
								target:function(card,player,target,current){
									if(get.tag(card,'respondSha')&&current<0) return 0.6
								},
							},
							respondSha:true,
							skillTagFilter:function(player){
								if(!player.countCards('hs','shan')) return false;
							},
							order:function(){
								return get.order({name:'sha'})+0.1;
							},
						},
						sub:true,
					},
					shan:{
						audio:"fz_new_longdan",
						enable:['chooseToRespond','chooseToUse'],
						filterCard:{
							name:"sha",
						},
						viewAs:{
							name:"shan",
						},
						position:'hs',
						prompt:"将一张杀当闪使用或打出",
						check:function(){return 1},
						viewAsFilter:function(player){
							if(!player.countCards('hs','sha')) return false;
						},
						ai:{
							respondShan:true,
							skillTagFilter:function(player){
								if(!player.countCards('hs','sha')) return false;
							},
							effect:{
								target:function(card,player,target,current){
									if(get.tag(card,'respondShan')&&current<0) return 0.6
								},
							},
						},
						sub:true,
					},
				},
			},
			gzenyuan:{
				locked:true,
				audio:['enyuan',2],
				group:['gzenyuan_gain','gzenyuan_damage'],
				preHidden:true,
				ai:{
					maixie_defend:true,
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
							if(!target.hasFriend()) return;
							if(get.tag(card,'damage')) return [1,0,0,-0.7];
						}
					}
				},
				subSkill:{
					gain:{
						trigger:{target:'useCardToTargeted'},
						forced:true,
						filter:function(event,player){
							return event.card.name=='tao'&&event.player!=player;
						},
						logTarget:'player',
						content:function(){trigger.player.draw()},
						audio:'enyuan1',
					},
					damage:{
						trigger:{player:'damageEnd'},
						forced:true,
						filter:function(event,player){
							return event.source&&event.source!=player&&event.num>0;
						},
						content:function(){
							'step 0'
							player.logSkill('enyuan_damage',trigger.source);
							trigger.source.chooseCard('交给'+get.translation(player)+'一张手牌，或失去一点体力','h').set('ai',function(card){
								if(get.attitude(_status.event.player,_status.event.getParent().player)>0) return 11-get.value(card);
								return 7-get.value(card);
							});
							'step 1'
							if(result.bool){
								trigger.source.give(result.cards[0],player,'giveAuto');
							}
							else trigger.source.loseHp();
						},
						audio:'enyuan2',
					},
				}
			},
					
			gzjushou:{
				audio:"xinjushou",
				trigger:{
					player:"phaseJieshuBegin",
				},
				preHidden:true,
				content:function(){
					'step 0'
					var list=[],players=game.filterPlayer();
					for(var target of players){
						if(target.isUnseen()) continue;
						var add=true;
						for(var i of list){
							if(i.isFriendOf(target)){
								add=false;
								break;
							}
						}
						if(add) list.add(target);
					}
					event.num=list.length;
					player.draw(event.num);
					if(event.num>2) player.turnOver();
					'step 1'
					player.chooseCard('h',true,'弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&player.hasUseTarget(result.cards[0])){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						},
					},
				},
			},
			"new_duanliang":{
				subSkill:{
					off:{
						sub:true,
					},
				},
				mod:{
					targetInRange:function(card,player,target){
						if(card.name=='bingliang'){
							return true;
						}
					},
				},
				audio:"duanliang1",
				enable:"chooseToUse",
				filterCard:function(card){
					if(get.type(card)!='basic'&&get.type(card)!='equip') return false;
					return get.color(card)=='black';
				},
				filter:function(event,player){
					if(player.hasSkill('new_duanliang_off')) return false;
					return player.countCards('hes',{type:['basic','equip'],color:'black'})
				},
				position:"hes",
				viewAs:{
					name:"bingliang",
				},
				onuse:function(result,player){
					if(get.distance(player,result.targets[0])>2) player.addTempSkill('new_duanliang_off');
				},
				prompt:"将一黑色的基本牌或装备牌当兵粮寸断使用",
				check:function(card){return 6-get.value(card)},
				ai:{
					order:9,
					basic:{
						order:1,
						useful:1,
						value:4,
					},
					result:{
						target:function(player,target){
							if(target.hasJudge('caomu')) return 0;
							return -1.5/Math.sqrt(target.countCards('h')+1);
						},
					},
					tag:{
						skip:"phaseDraw",
					},
				},
			},
			new_shushen:{
				audio:"shushen",
				trigger:{
					player:"recoverAfter",
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					event.num=trigger.num||1;
					"step 1"
					player.chooseTarget(get.prompt2('new_shushen'),function(card,player,target){
						return target!=player;
					}).set('ai',function(target){
						return get.attitude(_status.event.player,target);
					}).setHiddenSkill('new_shushen');
					"step 2"
					if(result.bool){
						player.logSkill('new_shushen',result.targets);
						result.targets[0].draw();
						if(event.num>1){
							event.num--;
							event.goto(1);
						}
					}
				},
				ai:{
					threaten:0.8,
					expose:0.1,
				},
			},
			"new_luanji":{
				audio:"luanji",
				enable:"phaseUse",
				viewAs:{
					name:"wanjian",
				},
				filterCard:function(card,player){
					if(!player.storage.new_luanji) return true;
					return !player.storage.new_luanji.contains(get.suit(card));
				},
				selectCard:2,
				position:'hs',
				filter:function(event,player){
					return player.countCards('hs',function(card){
						return !player.storage.new_luanji||!player.storage.new_luanji.contains(get.suit(card));
					})>1;
				},
				check:function(card){
					var player=_status.event.player;
					var targets=game.filterPlayer(function(current){
						return player.canUse('wanjian',current);
					});
					var num=0;
					for(var i=0;i<targets.length;i++){
						var eff=get.sgn(get.effect(targets[i],{name:'wanjian'},player,player));
						if(targets[i].hp==1){
							eff*=1.5;
						}
						num+=eff;
					}
					if(!player.needsToDiscard(-1)){
						if(targets.length>=7){
							if(num<2) return 0;
						}
						else if(targets.length>=5){
							if(num<1.5) return 0;
						}
					}
					return 6-get.value(card);
				},
				group:["new_luanji_count","new_luanji_reset","new_luanji_respond"],
				subSkill:{
					reset:{
						trigger:{
							player:"phaseAfter",
						},
						silent:true,
						filter:function(event,player){
							return player.storage.new_luanji?true:false;
						},
						content:function(){
							delete player.storage.new_luanji;
						},
						sub:true,
						forced:true,
						popup:false,
					},
					count:{
						trigger:{
							player:"useCard",
						},
						silent:true,
						filter:function(event){
							return event.skill=='new_luanji';
						},
						content:function(){
							if(!player.storage.new_luanji){
								player.storage.new_luanji=[];
							}
							for(var i=0;i<trigger.cards.length;i++){
								player.storage.new_luanji.add(get.suit(trigger.cards[i]));
							}
						},
						sub:true,
						forced:true,
						popup:false,
					},
					respond:{
						trigger:{
							global:"respond",
						},
						silent:true,
						filter:function(event){
							if(event.player.isUnseen()) return false;
							return event.getParent(2).skill=='new_luanji'&&event.player.isFriendOf(_status.currentPhase);
						},
						content:function(){
							trigger.player.draw();
						},
						sub:true,
						forced:true,
						popup:false,
					},
				},
			},
			"new_qingcheng":{
				audio:'qingcheng',
				enable:"phaseUse",
				filter:function(event,player){
					return player.countCards('he',{color:'black'})&&game.hasPlayer(function(current){
						return current!=player&&!current.isUnseen(2);
					});
				},
				filterCard:{
					color:"black",
				},
				position:"he",
				filterTarget:function(card,player,target){
					return !target.isUnseen(2);
				},
				check:function(card){
					return 6-get.value(card,_status.event.player);
				},
				content:function(){
					'step 0'
					event.target=target;
					event.done=false;
					'step 1'
					if(get.is.jun(event.target)){
						event._result={control:'副将'};
					}
					else{
						var choice='主将';
						var skills=lib.character[event.target.name2][3];
						for(var i=0;i<skills.length;i++){
							var info=get.info(skills[i]);
							if(info&&info.ai&&info.ai.maixie){
								choice='副将';break;
							}
						}
						if(event.target.name=='gz_zhoutai'){
							choice='主将';
						}
						else if(event.target.name2=='gz_zhoutai'){
							choice='副将';
						}
						player.chooseControl('主将','副将',function(){
							return _status.event.choice;
						}).set('prompt','暗置'+get.translation(event.target)+'的一张武将牌').set('choice',choice);
					}
					'step 2'
					if(result.control=='主将'){
						event.target.hideCharacter(0);
					}
					else{
						event.target.hideCharacter(1);
					}
					event.target.addTempSkill('qingcheng_ai');
					if(get.type(cards[0])=='equip'&&!event.done){
					player.chooseTarget('是否暗置一名武将牌均为暗置的角色的一张武将牌？',function(card,player,target){
						return target!=player&&!target.isUnseen(2);
					}).set('ai',function(target){
						return -get.attitude(_status.event.player,target);
					});
					}
					else event.finish();
					'step 3'
					if(result.bool&&result.targets&&result.targets.length){
						player.line(result.targets[0],'green');
						event.done=true;
						event.target=result.targets[0];
						event.goto(1);
					}
				},
				ai:{
					order:8,
					result:{
						target:function(player,target){
							if(target.hp<=0) return -5;
							if(player.getStat().skill.new_qingcheng) return 0;
							if(!target.hasSkillTag('maixie')) return 0;
							if(get.attitude(player,target)>=0) return 0;
							if(player.hasCard(function(card){
								return get.tag(card,'damage')&&player.canUse(card,target,true,true);
							})){
								if(target.maxHp>3) return -0.5;
								return -1;
							}
							return 0;
						},
					},
				},
			},
			new_kongcheng:{
				group:["new_kongcheng_gain","new_kongcheng_got"],
				subSkill:{
					gain:{
						audio:"kongcheng",
						trigger:{
							player:"gainBefore",
						},
						filter:function(event,player){
							return event.source&&event.source!=player&&player!=_status.currentPhase&&!event.bySelf&&player.countCards('h')==0;
						},
						content:function(){
							trigger.name='addToExpansion';
							trigger.setContent('addToExpansion');
							trigger.gaintag=['new_kongcheng'];
							trigger.untrigger();
							trigger.trigger('addToExpansionBefore');
						},
						sub:true,
						forced:true,
					},
					got:{
						trigger:{
							player:"phaseDrawBegin1",
						},
						filter:function(event,player){
							return player.getExpansions('new_kongcheng').length>0;
						},
						content:function(){
							player.gain(player.getExpansions('new_kongcheng'),'draw');
						},
						sub:true,
						forced:true,
					},
				},
				audio:"kongcheng",
				trigger:{
					target:"useCardToTarget",
				},
				forced:true,
				check:function(event,player){
					return get.effect(event.target,event.card,event.player,player)<0;
				},
				filter:function(event,player){
					return player.countCards('h')==0&&(event.card.name=='sha'||event.card.name=='juedou');
				},
				content:function(){
					trigger.getParent().targets.remove(player);
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(target.countCards('h')==0&&(card.name=='sha'||card.name=='juedou')) return 'zeroplayertarget';
						},
					},
				},
				intro:{
					markcount:'expansion',
					mark:function(dialog,content,player){
						var content=player.getExpansions('new_kongcheng');
						if(content&&content.length){
							if(player==game.me||player.isUnderControl()){
								dialog.addAuto(content);
							}
							else{
								return '共有'+get.cnNumber(content.length)+'张牌';
							}
						}
					},
					content:function(content,player){
						var content=player.getExpansions('new_kongcheng');
						if(content&&content.length){
							if(player==game.me||player.isUnderControl()){
								return get.translation(content);
							}
							return '共有'+get.cnNumber(content.length)+'张牌';
						}
					},
				},
				onremove:function(player,skill){
					var cards=player.getExpansions(skill);
					if(cards.length) player.loseToDiscardpile(cards);
				},
			},
			"new_keji":{
				audio:"keji",
				forced:true,
				trigger:{
					player:"phaseDiscardBegin",
				},
				filter:function(event,player){
					var list=[];
					player.getHistory('useCard',function(evt){
						if(evt.isPhaseUsing(player)){
							var color=get.color(evt.card);
							if(color!='nocolor') list.add(color);
						}
					});
					return list.length<=1;
				},
				content:function(){
					player.addTempSkill('keji_add','phaseAfter');
				},
			},
			"keji_add":{
				mod:{
					maxHandcard:function(player,num){
						return num+4;
					},
				},
			},
			"new_mouduan":{
				trigger:{
					player:"phaseJieshuBegin",
				},
				//priority:2,
				audio:"botu",
				filter:function(event,player){
					var history=player.getHistory('useCard');
					var suits=[];
					var types=[];
					for(var i=0;i<history.length;i++){
						var suit=get.suit(history[i].card);
						if(suit) suits.add(suit);
						types.add(get.type(history[i].card))
					}
					return suits.length>=4||types.length>=3;
				},
				check:function(event,player){
					return player.canMoveCard(true);
				},
				content:function(){
					player.moveCard();
				},
			},
			"new_longdan":{
				group:["new_longdan_sha","new_longdan_shan","new_longdan_draw","new_longdan_shamiss","new_longdan_shanafter"],
				subSkill:{
					shanafter:{
						sub:true,
						audio:"longdan_sha",
						trigger:{
							player:"useCard",
						},
						//priority:1,
						filter:function(event,player){
							return event.skill=='new_longdan_shan'&&event.getParent(2).name=='sha';
						},
						direct:true,
						content:function(){
							"step 0"
							player.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？",function(card,player,target){
								return target!=_status.event.source&&target!=player&&target.isDamaged();
							}).set('ai',function(target){
								return get.attitude(_status.event.player,target);
							}).set('source',trigger.getParent(2).player);
							"step 1"
							if(result.bool&&result.targets&&result.targets.length){
								player.logSkill('new_longdan',result.targets[0]);
								result.targets[0].recover();
							}
						},
					},
					shamiss:{
						sub:true,
						audio:"longdan_sha",
						trigger:{
							player:"shaMiss",
						},
						direct:true,
						filter:function(event,player){
							return event.skill=='new_longdan_sha';
						},
						content:function(){
							"step 0"
							player.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？",function(card,player,target){
								return target!=_status.event.target&&target!=player;
							}).set('ai',function(target){
								return -get.attitude(_status.event.player,target);
							}).set('target',trigger.target);
							"step 1"
							if(result.bool&&result.targets&&result.targets.length){
								player.logSkill('new_longdan',result.targets[0]);
								result.targets[0].damage();
							}
						},
					},
					draw:{
						trigger:{
							player:["useCard","respond"],
						},
						audio:"longdan_sha",
						forced:true,
						locked:false,
						filter:function(event,player){
							if(!get.zhu(player,'shouyue')) return false;
							return event.skill=='new_longdan_sha'||event.skill=='new_longdan_shan';
						},
						content:function(){
							player.draw();
							//player.storage.fanghun2++;
						},
						sub:true,
					},
					sha:{
						audio:"longdan_sha",
						enable:["chooseToUse","chooseToRespond"],
						filterCard:{
							name:"shan",
						},
						viewAs:{
							name:"sha",
						},
						position:'hs',
						viewAsFilter:function(player){
							if(!player.countCards('hs','shan')) return false;
						},
						prompt:"将一张闪当杀使用或打出",
						check:function(){return 1},
						ai:{
							effect:{
								target:function(card,player,target,current){
									if(get.tag(card,'respondSha')&&current<0) return 0.6
								},
							},
							respondSha:true,
							skillTagFilter:function(player){
								if(!player.countCards('hs','shan')) return false;
							},
							order:function(){
								return get.order({name:'sha'})+0.1;
							},
						},
						sub:true,
					},
					shan:{
						audio:"longdan_sha",
						enable:['chooseToRespond','chooseToUse'],
						filterCard:{
							name:"sha",
						},
						viewAs:{
							name:"shan",
						},
						position:'hs',
						prompt:"将一张杀当闪使用或打出",
						check:function(){return 1},
						viewAsFilter:function(player){
							if(!player.countCards('hs','sha')) return false;
						},
						ai:{
							respondShan:true,
							skillTagFilter:function(player){
								if(!player.countCards('hs','sha')) return false;
							},
							effect:{
								target:function(card,player,target,current){
									if(get.tag(card,'respondShan')&&current<0) return 0.6
								},
							},
						},
						sub:true,
					},
				},
			},
			gzpaoxiao:{
				audio:"paoxiao",
				trigger:{
					player:"useCard",
				},
				filter:function(event,player){
					if(_status.currentPhase!=player) return false;
					if(event.card.name!='sha') return false;
					var history=player.getHistory('useCard',function(evt){
						return evt.card.name=='sha';
					});
					return history&&history.indexOf(event)==1;
				},
				forced:true,
				preHidden:true,
				content:function(){
					player.draw();
				},
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return Infinity;
					},
				},
				ai:{
					unequip:true,
					skillTagFilter:function(player,tag,arg){
						if(!get.zhu(player,'shouyue')) return false;
						if(arg&&arg.name=='sha') return true;
						return false;
					},
				},
			},
			"new_kurou":{
				audio:"rekurou",
				enable:"phaseUse",
				usable:1,
				filterCard:true,
				check:function(card){
					return 8-get.value(card);
				},
				position:"he",
				content:function(){
					player.loseHp();
					player.draw(3);
					player.addTempSkill('kurou_effect','phaseAfter');
				},
				ai:{
					order:8,
					result:{
						player:function(player){
							if(player.hp<=2) return player.countCards('h')==0?1:0;
							if(player.countCards('h',{name:'sha',color:'red'})) return 1;
							return player.countCards('h')<=player.hp?1:0;
						},
					},
				},
			},
			"kurou_effect":{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return num+1;
					},
				},
			},
			"new_chuli":{
				audio:"chulao",
				enable:"phaseUse",
				usable:1,
				filterTarget:function(card,player,target){
					if(player==target) return false;
					for(var i=0;i<ui.selected.targets.length;i++){
						if(ui.selected.targets[i].isFriendOf(target)) return false;
					}
					return target.countCards('he')>0;
				},
				filter:function(event,player){
					return player.countCards('he')>0;
				},
				filterCard:true,
				position:"he",
				selectTarget:[1,3],
				check:function(card){
					if(get.suit(card)=='spade') return 8-get.value(card);
					return 5-get.value(card);
				},
				contentBefore:function(){
					var evt=event.getParent();
					evt.draw=[];
					if(get.suit(cards[0])=='spade') evt.draw.push(player);
				},
				content:function(){
					"step 0"
					player.discardPlayerCard(target,'he',true);
					"step 1"
					if(result.bool){
						if(get.suit(result.cards[0])=='spade') event.getParent().draw.push(target);
					}
				},
				contentAfter:function(){
					'step 0'
					var list=event.getParent().draw;
					if(!list.length) event.finish();
					else game.asyncDraw(list);
					'step 1'
					game.delay();
				},
				ai:{
					result:{
						target:-1,
					},
					tag:{
						discard:1,
						lose:1,
						loseCard:1,
					},
					threaten:1.2,
					order:3,
				},
			},
			"baka_hunshang":{
				skillAnimation:true,
				animationColor:'wood',
				audio:"hunzi",
				preHidden:true,
				derivation:["baka_yingzi","baka_yinghun"],
				viceSkill:true,
				init:function(player){
					if(player.checkViceSkill('baka_hunshang')&&!player.viceChanged){
						player.removeMaxHp();
					}
				},
				trigger:{
					player:"phaseZhunbeiBegin",
				},
				filter:function(event,player){
					return player.hp<=1;
				},
				forced:true,
				//priority:3,
				content:function(){
					player.addTempSkill('baka_yingzi','phaseAfter');
					player.addTempSkill('baka_yinghun','phaseAfter');
				},
				ai:{
					threaten:function(player,target){
						if(target.hp==1) return 2;
						return 0.5;
					},
					maixie:true,
					effect:{
						target:function(card,player,target){
							if(!target.hasFriend()) return;
							if(get.tag(card,'damage')==1&&target.hp==2&&!target.isTurnedOver()&&
							_status.currentPhase!=target&&get.distance(_status.currentPhase,target,'absolute')<=3) return [0.5,1];
						},
					},
				},
			},
			baka_yinghun:{
				inherit:"yinghun",
				audio:'yinghun_sunce',
			},
			baka_yingzi:{
				mod:{
					maxHandcardBase:function(player,num){
						return player.maxHp;
					},
				},
				audio:'reyingzi_sunce',
				trigger:{
					player:"phaseDrawBegin2",
				},
				frequent:true,
				filter:function(event){return !event.numFixed},
				content:function(){
					trigger.num++;
				},
				ai:{
					threaten:1.3,
				},
			},
			gzyiji:{
				audio:"yiji",
				trigger:{
					player:"damageEnd",
				},
				frequent:true,
				preHidden:true,
				content:function(){
					'step 0'
					event.cards=game.cardsGotoOrdering(get.cards(2)).cards;
					'step 1'
					if(_status.connectMode) game.broadcastAll(function(){_status.noclearcountdown=true});
					event.given_map={};
					'step 2'
					if(event.cards.length>1){
						player.chooseCardButton('遗计：请选择要分配的牌',true,event.cards,[1,event.cards.length]).set('ai',function(button){
							if(ui.selected.buttons.length==0) return 1;
							return 0;
						});
					}
					else if(event.cards.length==1){
						event._result={links:event.cards.slice(0),bool:true};
					}
					else{
						event.finish();
					}
					'step 3'
					if(result.bool){
						event.cards.removeArray(result.links);
						event.togive=result.links.slice(0);
						player.chooseTarget('选择一名角色获得'+get.translation(result.links),true).set('ai',function(target){
							var att=get.attitude(_status.event.player,target);
							if(_status.event.enemy){
								return -att;
							}
							else if(att>0){
								return att/(1+target.countCards('h'));
							}
							else{
								return att/100;
							}
						}).set('enemy',get.value(event.togive[0],player,'raw')<0);
					}
					'step 4'
					if(result.targets.length){
						var id=result.targets[0].playerid,map=event.given_map;
						if(!map[id]) map[id]=[];
						map[id].addArray(event.togive);
					}
					if(cards.length>0) event.goto(2);
					'step 5'
					if(_status.connectMode){
						game.broadcastAll(function(){delete _status.noclearcountdown;game.stopCountChoose()});
					}
					var list=[];
					for(var i in event.given_map){
						var source=(_status.connectMode?lib.playerOL:game.playerMap)[i];
						player.line(source,'green');
						list.push([source,event.given_map[i]]);
					}
					game.loseAsync({
						gain_list:list,
						giver:player,
						animate:'draw',
					}).setContent('gaincardMultiple');
				},
				ai:{
					maixie:true,
					"maixie_hp":true,
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'damage')){
								if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
								if(!target.hasFriend()) return;
								var num=1;
								if(get.attitude(player,target)>0){
									if(player.needsToDiscard()){
										num=0.7;
									}
									else{
										num=0.5;
									}
								}
								if(target.hp>=4) return [1,num*2];
								if(target.hp==3) return [1,num*1.5];
								if(target.hp==2) return [1,num*0.5];
							}
						},
					},
				},
			},
			gzjieming:{
				audio:"jieming",
				trigger:{
					player:"damageEnd",
				},
				direct:true,
				preHidden:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('gzjieming'),'令一名角色将手牌补至X张（X为其体力上限且至多为5）',function(card,player,target){
						return target.countCards('h')<Math.min(target.maxHp,5);
					}).set('ai',function(target){
						var att=get.attitude(_status.event.player,target);
						if(att>2){
							return Math.min(5,target.maxHp)-target.countCards('h');
						}
						return att/3;
					}).setHiddenSkill('gzjieming');
					"step 1"
					if(result.bool){
						player.logSkill('gzjieming',result.targets);
						for(var i=0;i<result.targets.length;i++){
							result.targets[i].draw(Math.min(5,result.targets[i].maxHp)-result.targets[i].countCards('h'));
						}
					}
				},
				ai:{
					maixie:true,
					"maixie_hp":true,
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'damage')&&target.hp>1){
								if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
								var max=0;
								var players=game.filterPlayer();
								for(var i=0;i<players.length;i++){
									if(get.attitude(target,players[i])>0){
										max=Math.max(Math.min(5,players[i].hp)-players[i].countCards('h'),max);
									}
								}
								switch(max){
									case 0:return 2;
									case 1:return 1.5;
									case 2:return [1,2];
									default:return [0,max];
								}
							}
							if((card.name=='tao'||card.name=='caoyao')&&
								target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
						},
					},
				},
			},
			gzfangzhu:{
				audio:"fangzhu",
				trigger:{
					player:"damageEnd",
				},
				direct:true,
				preHidden:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt2('gzfangzhu'),function(card,player,target){
						return player!=target;
					}).setHiddenSkill('gzfangzhu').ai=function(target){
						if(target.hasSkillTag('noturn')) return 0;
						var player=_status.event.player,att=get.attitude(player,target);
						if(att==0) return 0;
						if(att>0){
							if(target.isTurnedOver()) return 1000-target.countCards('h');
							return -1;
						}
						else{
							if(target.isTurnedOver()) return -1;
							if(player.getDamagedHp()>=3) return -1;
							return target.countCards('h')+1;
						}
					}
					"step 1"
					if(result.bool){
						var target=result.targets[0];
						event.target=target;
						player.logSkill('gzfangzhu',target);
						var num=player.getDamagedHp();
						if(num>0) target.chooseToDiscard('he',num,'放逐：弃置'+get.cnNumber(num)+'张牌并失去1点体力','或者点击“取消”不弃牌，改为摸'+get.cnNumber(num)+'张牌并叠置').set('ai',function(card){
							var player=_status.event.player;
							if(player.isTurnedOver()) return -1;
							return (player.hp*player.hp)-Math.max(1,get.value(card));
						});
						else{
							target.turnOver();
							event.finish();
						}
					}
					else event.finish();
					"step 2"
					if(result.bool){
						target.loseHp();
					}
					else{
						target.draw(player.getDamagedHp());
						target.turnOver();
					}
				},
				ai:{
					maixie:true,
					"maixie_hp":true,
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'damage')){
								if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
								if(target.hp<=1) return;
								if(!target.hasFriend()) return;
								var hastarget=false;
								var turnfriend=false;
								var players=game.filterPlayer();
								for(var i=0;i<players.length;i++){
									if(get.attitude(target,players[i])<0&&!players[i].isTurnedOver()){
										hastarget=true;
									}
									if(get.attitude(target,players[i])>0&&players[i].isTurnedOver()){
										hastarget=true;
										turnfriend=true;
									}
								}
								if(get.attitude(player,target)>0&&!hastarget) return;
								if(turnfriend||target.hp==target.maxHp) return [0.5,1];
								if(target.hp>1) return [1,0.5];
							}
						},
					},
				},
			},
			fengyin_main:{
				init:function(player,skill){
					player.addSkillBlocker(skill);
				},
				onremove:function(player,skill){
					player.removeSkillBlocker(skill);
				},
				charlotte:true,
				skillBlocker:function(skill,player){
					return lib.character[player.name1][3].contains(skill)&&!lib.skill[skill].charlotte&&!get.is.locked(skill,player);
				},
				mark:true,
				marktext:'主',
				intro:{
					content:function(storage,player,skill){
						var list=player.getSkills(null,null,false).filter(function(i){
							return lib.skill.fengyin_main.skillBlocker(i,player);
						});
						if(list.length) return '失效技能：'+get.translation(list);
						return '无失效技能';
					}
				}
			},
			fengyin_vice:{
				init:function(player,skill){
					player.addSkillBlocker(skill);
				},
				onremove:function(player,skill){
					player.removeSkillBlocker(skill);
				},
				charlotte:true,
				skillBlocker:function(skill,player){
					return lib.character[player.name2][3].contains(skill)&&!lib.skill[skill].charlotte&&!get.is.locked(skill,player);
				},
				mark:true,
				marktext:'副',
				intro:{
					content:function(storage,player,skill){
						var list=player.getSkills(null,null,false).filter(function(i){
							return lib.skill.fengyin_vice.skillBlocker(i,player);
						});
						if(list.length) return '失效技能：'+get.translation(list);
						return '无失效技能';
					}
				}
			},
			"new_tieji":{
				audio:"retieji",
				trigger:{
					player:"useCardToPlayered",
				},
				check:function(event,player){
					return get.attitude(player,event.target)<0;
				},
				filter:function(event){
					return event.card.name=='sha';
				},
				logTarget:"target",
				content:function(){
					"step 0" 
					var target=trigger.target;
					var controls=[];
					if(get.zhu(player,'shouyue')){
						if(!target.isUnseen(0)) target.addTempSkill('fengyin_main');
						if(!target.isUnseen(1)) target.addTempSkill('fengyin_vice');
						event.goto(2);
					}
					if(!target.isUnseen(0)&&!target.hasSkill('fengyin_main')) controls.push("主将");
					if(!target.isUnseen(1)&&!target.hasSkill('fengyin_vice')) controls.push("副将");
					if(controls.length>0){
					if(controls.length==1) event._result={control:controls[0]};
					else{
						player.chooseControl(controls).set('ai',function(){
							var choice='主将';
							var skills=lib.character[target.name2][3];
							for(var i=0;i<skills.length;i++){
								var info=get.info(skills[i]);
								if(info&&info.ai&&info.ai.maixie){
									choice='副将';break;
								}
							}
							return choice;
						}).set('prompt','请选择一个武将牌，令'+get.translation(target)+'该武将牌上的非锁定技全部失效。');
					}
					}
					else event.goto(2);
					"step 1"
					if(result.control){
						player.popup(result.control,'fire');
						var target=trigger.target;
						if(result.control=="主将") target.addTempSkill("fengyin_main");
						else target.addTempSkill("fengyin_vice");
					}
					"step 2"
					player.judge(function(){return 0});
					"step 3"
					var suit=get.suit(result.card);
					var target=trigger.target;
					var num=target.countCards('h','shan');
					target.chooseToDiscard('请弃置一张'+get.translation(suit)+'牌，否则不能使用闪抵消此杀','he',function(card){
						return get.suit(card)==_status.event.suit;
					}).set('ai',function(card){
						var num=_status.event.num;
						if(num==0) return 0;
						if(card.name=='shan') return num>1?2:0;
						return 8-get.value(card);
					}).set('num',num).set('suit',suit);
					"step 4"
					if(!result.bool){
						trigger.getParent().directHit.add(trigger.target);
					}
				},
			},
			hmkyuanyu:{
				audio:'zongkui',
				trigger:{
					player:"damageBegin4",
				},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					if(event.num<=0||!event.source) return false;
					var n1=player.getNext();
					var p1=player.getPrevious();
					if(event.source!=n1&&event.source!=p1) return true;
				},
				content:function(){
					trigger.cancel();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return;
							if(player==target.getNext()||player==target.getPrevious()) return;
							var num=get.tag(card,'damage');
							if(num){
								return 0;
							}
						},
					},
				},
			},
			hmkguishu:{
				audio:'bmcanshi',
				enable:"phaseUse",
				filter:function(event,player){
					return player.countCards('hs',{suit:'spade'})>0;
				},
				init:function(player){
					if(!player.storage.hmkguishu) player.storage.hmkguishu=0;
				},
				chooseButton:{
					dialog:function(event,player){
						var list=['yuanjiao','zhibi'];
						for(var i=0;i<list.length;i++){
								list[i]=['锦囊','',list[i]];
						}
						return ui.create.dialog('鬼术',[list,'vcard']);
					},
					filter:function(button,player){
						var name=button.link[2];
						if(player.storage.hmkguishu==1&&name=='yuanjiao') return false;
						if(player.storage.hmkguishu==2&&name=='zhibi') return false;
						return lib.filter.filterCard({name:name},player,_status.event.getParent());
					},
					check:function(button){
						var player=_status.event.player;
						if(button.link=='yuanjiao'){
							return 3;
						}
						if(button.link=='zhibi'){
							if(player.countCards('hs',{suit:'spade'})>2) return 1;
							return 0;
						}
					},
					backup:function(links,player){
						return {
							audio:'bmcanshi',
							filterCard:function(card,player){
								return get.suit(card)=='spade';
							},
							position:"hs",
							selectCard:1,
							popname:true,
							ai:function(card){
								return 6-ai.get.value(card);
							},
							viewAs:{name:links[0][2]},
							onuse:function(result,player){
								player.logSkill('hmkguishu');
								if(result.card.name=='yuanjiao') player.storage.hmkguishu=1;
								else player.storage.hmkguishu=2;
							},
						}
					},
					prompt:function(links,player){
						return '将一张手牌当作'+get.translation(links[0][2])+'使用';
					},
				},
				ai:{
					order:4,
					result:{
						player:function(player){
							return 2;
						},
					},
					threaten:1.6,
				},
			},
			"_mingzhisuodingji":{
				mode:["guozhan"],
				enable:"phaseUse",
				filter:function(event,player){
					if(player.hasSkillTag('nomingzhi',false,null,true)) return false;
					var bool=false;
					var skillm=lib.character[player.name1][3];
					var skillv=lib.character[player.name2][3];
					if(player.isUnseen(0)){
						for(var i=0;i<skillm.length;i++){
							if(get.is.locked(skillm[i])){
								bool=true;
							}
						}
					}
					if(player.isUnseen(1)){
						for(var i=0;i<skillv.length;i++){
							if(get.is.locked(skillv[i])){
								bool=true;
							}
						}
					}
					return bool;
				},
				popup:false,
				content:function(){
					"step 0"
					var choice=[];
					var skillm=lib.character[player.name1][3];
					var skillv=lib.character[player.name2][3];
					if(player.isUnseen(0)){
						for(var i=0;i<skillm.length;i++){
							if(get.is.locked(skillm[i])&&!choice.contains('明置主将')){
								choice.push("明置主将");
							}
						}
					}
					if(player.isUnseen(1)){
						for(var i=0;i<skillv.length;i++){
							if(get.is.locked(skillv[i])&&!choice.contains('明置副将')){
								choice.push("明置副将");
							}
						}
					}
					if(choice.length==2) choice.push('全部明置')
					player.chooseControl(choice);
					"step 1"
					if(result.control){
						switch(result.control){
							case "取消":break;
							case "明置主将":player.showCharacter(0);break;
							case "明置副将":player.showCharacter(1);break;
							case "全部明置":player.showCharacter(2);break;
						}
					}
				},
				ai:{
					order:11,
					result:{
						player:-99,
					},
				},
			},
			/*----分界线----*/
			_viewnext:{
				trigger:{
					global:"gameDrawBefore",
				},
				silent:true,
				popup:false,
				forced:true,
				filter:function(){
					if(_status.connectMode&&!lib.configOL.viewnext) return false;
					else if(!_status.connectMode&&!get.config('viewnext')) return false;
					return game.players.length>1;
				},
				content:function(){
					var target=player.getNext();
					player.viewCharacter(target,1);
				},
			},
			_aozhan_judge:{
				trigger:{
					player:"phaseBefore",
				},
				forced:true,
				priority:22,
				filter:function(event,player){
					if(get.mode()!='guozhan') return false;
					if(_status.connectMode&&!lib.configOL.aozhan) return false;
					else if(!_status.connectMode&&!get.config('aozhan')) return false;
					if(_status._aozhan) return false;
					if(game.players.length>4) return false;
					if(game.players.length>3&&game.players.length+game.dead.length<=7) return false;
					for(var i=0;i<game.players.length;i++){
						for(var j=i+1;j<game.players.length;j++){
							if(game.players[i].isFriendOf(game.players[j])) return false;
						}
					}
					return true;
				},
				content:function(){
					var color=get.groupnature(player.group,"raw");
					if(player.isUnseen()) color='fire';
					player.$fullscreenpop('鏖战模式',color); 
					game.broadcastAll(function(){
					_status._aozhan=true;
					ui.aozhan=ui.create.div('.touchinfo.left',ui.window);
					ui.aozhan.innerHTML='鏖战模式';
					if(ui.time3) ui.time3.style.display='none';
					ui.aozhanInfo=ui.create.system('鏖战模式',null,true);
					lib.setPopped(ui.aozhanInfo,function(){
						var uiintro=ui.create.dialog('hidden');
						uiintro.add('鏖战模式');
						var list=[
							'当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。',
							'在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。',
							'进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。'
						];
						var intro='<ul style="text-align:left;margin-top:0;width:450px">';
						for(var i=0;i<list.length;i++){
							intro+='<li>'+list[i];
						}
						intro+='</ul>'
						uiintro.add('<div class="text center">'+intro+'</div>');
						var ul=uiintro.querySelector('ul');
						if(ul){
							ul.style.width='180px';
						}
						uiintro.add(ui.create.div('.placeholder'));
						return uiintro;
					},250);
					game.playBackgroundMusic();
					});
					game.countPlayer(function(current){current.addSkill('aozhan')});
				},
			},
			_guozhan_marks:{
				ruleSkill:true,
				enable:'phaseUse',
				filter:function(event,player){
					return player.hasMark('yexinjia_mark')||player.hasMark('xianqu_mark')||player.hasMark('yinyang_mark')||player.hasMark('zhulianbihe_mark');
				},
				chooseButton:{
					dialog:function(event,player){
						return ui.create.dialog('###国战标记###弃置一枚对应的标记，发动其对应的效果');
					},
					chooseControl:function(event,player){
						var list=[],bool=player.hasMark('yexinjia_mark');
						if(bool||player.hasMark('xianqu_mark')) list.push('先驱');
						if(bool||player.hasMark('zhulianbihe_mark')){
							list.push('珠联(摸牌)');
							if(event.filterCard({name:'tao',isCard:true},player,event)) list.push('珠联(桃)');
						}
						if(bool||player.hasMark('yinyang_mark')) list.push('阴阳鱼');
						list.push('cancel2');
						return list;
					},
					check:function(){
						var player=_status.event.player,bool=player.hasMark('yexinjia_mark');
						if((bool||player.hasMark('xianqu_mark'))&&(4-player.countCards('h'))>1) return '先驱';
						if(bool||player.hasMark('zhulianbihe_mark')){
							if(_status.event.getParent().filterCard({name:'tao',isCard:true},player,event)&&get.effect_use(player,{name:'tao'},player)>0) return '珠联(桃)';
							if(player.getHandcardLimit()-player.countCards('h')>1&&!game.hasPlayer(function(current){
								return current!=player&&current.isFriendOf(player)&&current.hp+current.countCards('h','shan')<=2;
							})) return '珠联(摸牌)';
						}
						if(player.hasMark('yinyang_mark')&&player.getHandcardLimit()-player.countCards('h')>0) return '阴阳鱼';
						return 'cancel2';
					},
					backup:function(result,player){
						switch(result.control){
							case '珠联(桃)': return get.copy(lib.skill._zhulianbihe_mark_tao);
							case '珠联(摸牌)': return {
								content:function(){
								 player.draw(2);
								 player.removeMark(player.hasMark('zhulianbihe_mark')?'zhulianbihe_mark':'yexinjia_mark',1);
								},
							};
							case '阴阳鱼': return {
								content:function(){
									player.draw();
									player.removeMark(player.hasMark('yinyang_mark')?'yinyang_mark':'yexinjia_mark',1);
								}
							};
							case '先驱': return {content:lib.skill.xianqu_mark.content};
						}
					},
				},
				ai:{
					order:1,
					result:{
						player:1,
					},
				},
			},
			xianqu_mark:{
				intro:{
					content:"◇出牌阶段，你可以弃置此标记，然后将手牌摸至四张并观看一名其他角色的一张武将牌。",
				},
				content:function(){
					"step 0"
					player.removeMark(player.hasMark('xianqu_mark')?'xianqu_mark':'yexinjia_mark',1);
					var num=4-player.countCards('h');
					if(num) player.draw(num);
					"step 1"
					if(game.hasPlayer(function(current){
						return current!=player&&current.isUnseen(2);
					})) player.chooseTarget('是否观看一名其他角色的一张暗置武将牌？',function(card,player,target){
						return target!=player&&target.isUnseen(2);
					}).set('ai',function(target){
						if(target.isUnseen()){
							var next=_status.event.player.getNext();
							if (target!=next) return 10;
							return 9;
						}
						return -get.attitude(_status.event.player,target);
					});
					else event.finish();
					"step 2"
					if(result.bool){
						event.target=result.targets[0];
						player.line(event.target,'green');
						var controls=[];
						if(event.target.isUnseen(0)) controls.push('主将');
						if(event.target.isUnseen(1)) controls.push('副将');
						if(controls.length>1){
							player.chooseControl(controls);
						}
						if(controls.length==0) event.finish();
					}
					else{
						player.removeSkill('xianqu_mark');
						event.finish();
					}
					"step 3"
					if(result.control){
						if(result.control=='主将'){
							player.viewCharacter(event.target,0);
						}
						else{
							player.viewCharacter(event.target,1);
						}
					}
					else if(target.isUnseen(0)){
						player.viewCharacter(event.target,0);
					}
					else{
						player.viewCharacter(event.target,1);
					}
				},
			},
			zhulianbihe_mark:{
				intro:{
					content:"◇出牌阶段，你可以弃置此标记 然后摸两张牌。<br>◇你可以将此标记当做【桃】使用。",
				},
			},
			yinyang_mark:{
				intro:{
					content:"◇出牌阶段，你可以弃置此标记，然后摸一张牌。<br>◇弃牌阶段，你可以弃置此标记，然后本回合手牌上限+2。",
				},
			},
			_zhulianbihe_mark_tao:{
				ruleSkill:true,
				enable:"chooseToUse",
				filter:function(event,player){
					return event.type!='phase'&&(player.hasMark('zhulianbihe_mark')||player.hasMark('yexinjia_mark'));
				},
				viewAsFilter:function(player){
					return player.hasMark('zhulianbihe_mark')||player.hasMark('yexinjia_mark');
				},
				viewAs:{
					name:"tao",
					isCard:true,
				},
				filterCard:function(){return false},
				selectCard:-1,
				precontent:function(){
					player.removeMark(player.hasMark('zhulianbihe_mark')?'zhulianbihe_mark':'yexinjia_mark',1);
				},
			},
			_yinyang_mark_add:{
				ruleSkill:true,
				trigger:{
					player:"phaseDiscardBegin",
				},
				filter:function(event,player){
					return (player.hasMark('yinyang_mark')||player.hasMark('yexinjia_mark'))&&player.needsToDiscard();
				},
				prompt:function(event,player){
					return '是否弃置一枚【'+(player.hasMark('yinyang_mark')?'阴阳鱼':'野心家')+'】标记，使本回合的手牌上限+2？';
				},
				content:function(){
					player.addTempSkill('yinyang_add','phaseAfter');
					player.removeMark(player.hasMark('yinyang_mark')?'yinyang_mark':'yexinjia_mark',1);
				},
			},
			yinyang_add:{
				mod:{
					maxHandcard:function(player,num){
						return num+2;
					},
				},
			},
			yexinjia_mark:{
				intro:{
					content:'◇你可以弃置此标记，并发动【先驱】标记或【珠联璧合】标记或【阴阳鱼】标记的效果。',
				},
			},
			yexinjia_friend:{
				marktext:'盟',
				intro:{
					name:'结盟',
					content:'已经与$结成联盟',
				},
			},
			/*----分界线----*/
			_lianheng:{
				mode:['guozhan'],
				enable:'phaseUse',
				usable:1,
				prompt:'将至多三张可合纵的牌交给一名与你势力不同的角色，或未确定势力的角色，若你交给与你势力不同的角色，则你摸等量的牌',
				filter:function(event,player){
					return player.hasCard(function(card){
						return card.hasTag('lianheng')||card.hasGaintag('_lianheng');
					},'h');
				},
				filterCard:function(card){
					return card.hasTag('lianheng')||card.hasGaintag('_lianheng');
				},
				filterTarget:function(card,player,target){
					if(target==player) return false;
					if(player.isUnseen()) return target.isUnseen();
					return !target.isFriendOf(player);
				},
				check:function(card){
					if(card.name=='tao') return 0;
					return 5-get.value(card);
				},
				selectCard:[1,3],
				discard:false,
				lose:false,
				delay:false,
				content:function(){
					"step 0"
					player.give(cards,target);
					"step 1"
					if(!target.isUnseen()){
						player.draw(cards.length);
					}
				},
				ai:{
					basic:{
						order:2
					},
					result:{
						player:function(player,target){
							var huoshao=false;
							for(var i=0;i<ui.selected.cards.length;i++){
								if(ui.selected.cards[i].name=='huoshaolianying'){huoshao=true;break}
							}
							if(huoshao&&player.inline(target.getNext())) return -3;
							if(target.isUnseen()) return 0;
							if(player.isMajor()) return 0;
							return 0.5;
						},
						target:function(player,target){
							if(target.isUnseen()) return 0;
							return 1;
						}
					},
				}
			},
			qianhuan:{
				group:['qianhuan_add','qianhuan_use'],
				intro:{
					content:'expansion',
					markcount:'expansion',
				},
				onremove:function(player,skill){
					var cards=player.getExpansions(skill);
					if(cards.length) player.loseToDiscardpile(cards);
				},
				ai:{
					threaten:1.8
				},
				audio:2,
				preHidden:true,
				subSkill:{
					add:{
						trigger:{global:'damageEnd'},
						filter:function(event,player){
							var suits=[],cards=player.getExpansions('qianhuan');
							for(var i=0;i<cards.length;i++){
								suits.add(get.suit(cards[i]));
							}
							if(suits.length>=lib.suit.length) return false;
							return player.isFriendOf(event.player)&&player.hasCard(function(card){
								if(_status.connectMode&&get.position(card)=='h') return true;
								return !suits.contains(get.suit(card));
							},'he');
						},
						direct:true,
						content:function(){
							'step 0'
							var suits=[],cards=player.getExpansions('qianhuan');
							for(var i=0;i<cards.length;i++){
								suits.add(get.suit(cards[i]));
							}
							player.chooseCard('he',get.prompt2('qianhuan'),function(card){
								return !_status.event.suits.contains(get.suit(card));
							}).set('ai',function(card){
								return 9-get.value(card);
							}).set('suits',suits).setHiddenSkill('qianhuan');
							'step 1'
							if(result.bool){
								player.logSkill('qianhuan');
								var card=result.cards[0];
								player.addToExpansion(card,player,'give').gaintag.add('qianhuan');
							}
						}
					},
					use:{
						trigger:{global:'useCardToTarget'},
						filter:function(event,player){
							if(!['basic','trick'].contains(get.type(event.card,'trick'))) return false;
							return event.target&&player.isFriendOf(event.target)&&event.targets.length==1&&player.getExpansions('qianhuan').length;
						},
						direct:true,
						content:function(){
							'step 0'
							var goon=get.effect(trigger.target,trigger.card,trigger.player,player)<0;
							if(goon){
								if(['tiesuo','diaohulishan','lianjunshengyan','zhibi','chiling','lulitongxin'].contains(trigger.card.name)){
									goon=false;
								}
								else if(trigger.card.name=='sha'){
									if(trigger.target.mayHaveShan()||trigger.target.hp>=3){
										goon=false;
									}
								}
								else if(trigger.card.name=='guohe'){
									if(trigger.target.countCards('he')>=3||!trigger.target.countCards('h')){
										goon=false;
									}
								}
								else if(trigger.card.name=='shuiyanqijunx'){
									if(trigger.target.countCards('e')<=1||trigger.target.hp>=3){
										goon=false;
									}
								}
								else if(get.tag(trigger.card,'damage')&&trigger.target.hp>=3){
									goon=false;
								}
							}
							player.chooseButton().set('goon',goon).set('ai',function(button){
								if(_status.event.goon) return 1;
								return 0;
							}).set('createDialog',[get.prompt('qianhuan'),'<div class="text center">移去一张“千幻”牌令'+
							get.translation(trigger.player)+'对'+get.translation(trigger.target)+'的'+get.translation(trigger.card)+'失效</div>',player.getExpansions('qianhuan')]);
							'step 1'
							if(result.bool){
								player.logSkill('qianhuan',trigger.player);
								trigger.getParent().targets.remove(trigger.target);
								var card=result.links[0];
								player.loseToDiscardpile(card);
							}
						}
					}
				}
			},
			gzsanyao:{
				audio:'sanyao',
				inherit:'sanyao',
				filterTarget:function(card,player,target){
					return target.hp>player.hp||target.countCards('h')>player.countCards('h');
				},
			},
			gzzhiman:{
				audio:'zhiman',
				inherit:'zhiman',
				preHidden:true,
				content:function(){
					'step 0'
					if(trigger.player.countGainableCards(player,'ej')){
						player.gainPlayerCard(trigger.player,'ej',true);
					}
					trigger.cancel();
					'step 1'
					if(player.isFriendOf(trigger.player)){
						trigger.player.mayChangeVice();
					}
				}
			},
			gzdiancai:{
				audio:'diancai',
				trigger:{global:'phaseUseEnd'},
				filter:function(event,player){
					if(_status.currentPhase==player) return false;
					var num=0;
					player.getHistory('lose',function(evt){
						if(evt.cards2&&evt.getParent('phaseUse')==event) num+=evt.cards2.length;
					});
					return num>=player.hp;
				},
				preHidden:true,
				content:function(){
					'step 0'
					var num=player.maxHp-player.countCards('h');
					if(num>0){
						player.draw(num);
					}
					'step 1'
					player.mayChangeVice();
				},
			},
			xuanlve:{
				trigger:{
					player:'loseAfter',
					global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
				},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					var evt=event.getl(player);
					return evt&&evt.es&&evt.es.length>0;
				},
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt('xuanlve'),'弃置一名其他角色的一张牌',function(card,player,target){
						return target!=player&&target.countDiscardableCards(player,'he');
					}).set('ai',function(target){
						var player=_status.event.player;
						return get.effect(target,{name:'guohe_copy2'},player,player);
					}).setHiddenSkill(event.name);
					'step 1'
					if(result.bool){
						player.logSkill('xuanlve',result.targets);
						player.discardPlayerCard(result.targets[0],'he',true);
					}
				},
				ai:{
					noe:true,
					reverseEquip:true,
					effect:{
						target:function(card,player,target,current){
							if(get.type(card)=='equip') return [1,1];
						}
					}
				}
			},
			lianzi:{
				enable:'phaseUse',
				usable:1,
				audio:2,
				filterCard:true,
				check:function(card){
					if(get.type(card)=='equip') return 0;
					var player=_status.event.player;
					var num=game.countPlayer(function(current){
						if(current.identity=='wu'){
							return current.countCards('e');
						}
					})+player.getExpansions('yuanjiangfenghuotu').length;
					if(num>=5){
						return 8-get.value(card);
					}
					if(num>=3){
						return 7-get.value(card);
					}
					if(num>=2){
						return 3-get.value(card);
					}
					return 0;
				},
				content:function(){
					'step 0'
					var num=game.countPlayer(function(current){
						if(current.identity=='wu'){
							return current.countCards('e');
						}
					})+player.getExpansions('yuanjiangfenghuotu').length;
					if(num){
						event.shown=get.cards(num);
						player.showCards(event.shown,get.translation('lianzi'));
					}
					else{
						event.finish();
						return;
					}
					'step 1'
					var list=[];
					var discards=[];
					var type=get.type(cards[0],'trick');
					for(var i=0;i<event.shown.length;i++){
						if(get.type(event.shown[i],'trick')==type){
							list.push(event.shown[i]);
						}
						else{
							discards.push(event.shown[i]);
						}
					}
					game.cardsDiscard(discards);
					if(list.length){
						player.gain(list,'gain2');
						if(list.length>=3&&player.hasStockSkill('lianzi')){
							player.removeSkill('lianzi');
							player.addSkill('gzzhiheng');
						}
					}
				},
				ai:{
					order:7,
					result:{
						player:1
					}
				}
			},
			jubao:{
				mod:{
					canBeGained:function(card,source,player){
						if(source!=player&&get.position(card)=='e'&&get.subtype(card)=='equip5') return false;
					}
				},
				trigger:{player:'phaseJieshuBegin'},
				audio:2,
				forced:true,
				unique:true,
				filter:function(event,player){
					if(game.hasPlayer(function(current){
						return current.countCards('ej',function(card){
							return card.name=='dinglanyemingzhu';
						});
					})){
						return true;
					}
					for(var i=0;i<ui.discardPile.childElementCount;i++){
						if(ui.discardPile.childNodes[i].name=='dinglanyemingzhu'){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					player.draw();
					'step 1'
					var target=game.findPlayer(function(current){
						return current!=player&&current.countCards('e','dinglanyemingzhu');
					});
					if(target&&target.countGainableCards(player,'he')){
						player.line(target,'green');
						player.gainPlayerCard(target,true);
					}
				},
				ai:{
					threaten:1.5
				}
			},
			jiahe:{
				unique:true,
				forceunique:true,
				audio:2,
				derivation:'yuanjiangfenghuotu',
				mark:true,
				global:['jiahe_put','jiahe_skill'],
				ai:{
					threaten:2
				},
				trigger:{player:'damageEnd'},
				forced:true,
				filter:function(event,player){
					return event.card&&(event.card.name=='sha'||get.type(event.card,'trick')=='trick')&&player.getExpansions('yuanjiangfenghuotu').length>0;
				},
				content:function(){
					'step 0'
					player.chooseCardButton('将一张“烽火”置入弃牌堆',player.getExpansions('yuanjiangfenghuotu'),true);
					'step 1'
					if(result.bool){
						var card=result.links[0];
						player.loseToDiscardpile(card);
					}
				}
			},
			jiahe_put:{
				enable:'phaseUse',
				audio:2,
				forceaudio:true,
				filter:function(event,player){
					var zhu=get.zhu(player,'jiahe');
					if(zhu){
						return player.countCards('he',{type:'equip'})>0;
					}
					return false;
				},
				filterCard:{type:'equip'},
				position:'he',
				usable:1,
				check:function(card){
					var zhu=get.zhu(_status.event.player,'jiahe');
					if(!zhu) return 0;
					var num=7-get.value(card);
					if(get.position(card)=='h'){
						if(zhu.getExpansions('huangjintianbingfu').length>=5){
							return num-3;
						}
						return num+3;
					}
					else{
						var player=_status.event.player;
						var zhu=get.zhu(player,'jiahe');
						var sub=get.subtype(card)
						if(player.countCards('h',function(card){
							return get.type(card)=='equip'&&get.subtype(card)=='sub'&&player.hasValueTarget(card);
						})) return num+4;
						if(zhu.getExpansions('yuanjiangfenghuotu').length>=5&&!player.hasSkillTag('noe')){
							return num-5;
						}
					}
					return num;
				},
				discard:false,
				lose:false,
				delay:false,
				prepare:function(cards,player){
					var zhu=get.zhu(player,'jiahe');
					player.line(zhu);
				},
				content:function(){
					var zhu=get.zhu(player,'jiahe');
					zhu.addToExpansion(cards,player,'give').gaintag.add('yuanjiangfenghuotu');
				},
				ai:{
					order:function(item,player){
						if(player.hasSkillTag('noe')||!player.countCards('h',function(card){
							return get.type(card)=='equip'&&player.getEquip(get.subtype(card))&&player.hasValueTarget(card);
						})) return 1;
						return 10;
					},
					result:{
						player:1
					}
				}
			},
			jiahe_skill:{
				trigger:{player:'phaseZhunbeiBegin'},
				direct:true,
				audio:"jiahe_put",
				forceaudio:true,
				filter:function(event,player){
					var zhu=get.zhu(player,'jiahe');
					if(zhu&&zhu.getExpansions('yuanjiangfenghuotu').length){
						return true;
					}
					return false;
				},
				content:function(){
					'step 0'
					var zhu=get.zhu(player,'jiahe');
					event.num=zhu.getExpansions('yuanjiangfenghuotu').length;
					'step 1'
					var list=[];
					if(event.num>=1&&!player.hasSkill('reyingzi')) list.push('reyingzi');
					if(event.num>=2&&!player.hasSkill('haoshi')) list.push('haoshi');
					if(event.num>=3&&!player.hasSkill('shelie')) list.push('shelie');
					if(event.num>=4&&!player.hasSkill('duoshi')) list.push('duoshi');
					if(!list.length){
						event.finish();
						return;
					}
					var prompt2='你可以获得下列一项技能直到回合结束';
					if(list.length>=5){
						if(event.done){
							prompt2+=' (2/2)';
						}
						else{
							prompt2+=' (1/2)';
						}
					}
					list.push('cancel2');
					player.chooseControl(list).set('prompt',get.translation('yuanjiangfenghuotu')).
					set('prompt2',prompt2).set('centerprompt2',true).set('ai',function(evt,player){
						var controls=_status.event.controls;
						if(controls.contains('haoshi')){
							var nh=player.countCards('h');
							if(player.hasSkill('reyingzi')){
								if(nh==0) return 'haoshi';
							}
							else{
								if(nh<=1) return 'haoshi';
							}
						}
						if(controls.contains('shelie')){
							return 'shelie';
						}
						if(controls.contains('reyingzi')){
							return 'reyingzi';
						}
						if(controls.contains('duoshi')){
							return 'duoshi';
						}
						return controls.randomGet();
					});
					'step 2'
					if(result.control!='cancel2'){
						player.addTempSkill(result.control);
						if(!event.done) player.logSkill('jiahe_put');
						game.log(player,'获得了技能','【'+get.translation(result.control)+'】');
						if(event.num>=5&&!event.done){
							event.done=true;
							event.goto(1);
						}
					}
				}
			},
			yuanjiangfenghuotu:{
				unique:true,
				forceunique:true,
				nopop:true,
				mark:true,
				onremove:function(player,skill){
					var cards=player.getExpansions(skill);
					if(cards.length) player.loseToDiscardpile(cards);
				},
				intro:{
					content:'expansion',
					markcount:'expansion',
					mark:function(dialog,content,player){
						var content=player.getExpansions('yuanjiangfenghuotu');
						if(content&&content.length){
							dialog.addSmall(content);
						}
						dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>每名吴势力角色的出牌阶段限一次，该角色可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。<li>根据“烽火”的数量，所有吴势力角色可于其准备阶段开始时选择并获得其中一个技能直到回合结束：一张以上~英姿；两张以上~好施；三张以上~涉猎；四张以上~度势；五张以上~可额外选择一项。<li>锁定技，当你受到【杀】或锦囊牌造成的伤害后，你将一张“烽火”置入弃牌堆。',false)
					}
				}
			},
			gzqice:{
				enable:'phaseUse',
				usable:1,
				audio:"qice_backup",
				filter:function(event,player){
					var hs=player.getCards('h');
					if(!hs.length) return false;
					for(var i=0;i<hs.length;i++){
						var mod2=game.checkMod(hs[i],player,'unchanged','cardEnabled2',player);
					if(mod2===false) return false;
					}
					return true;
				},
				group:'gzqice_change',
				subSkill:{
					change:{
						trigger:{player:'useCardAfter'},
						filter:function(event,player){
							return event.skill=='gzqice_backup';
						},
						silent:true,
						content:function(){
							player.mayChangeVice();
							event.skill='gzqice';
							event.trigger('skillAfter');
						}
					}
				},
				chooseButton:{
					dialog:function(){
						var list=lib.inpile;
						var list2=[];
						for(var i=0;i<list.length;i++){
							if(list[i]!='wuxie'&&get.type(list[i])=='trick') list2.push(['锦囊','',list[i]]);
						}
						return ui.create.dialog(get.translation('gzqice'),[list2,'vcard']);
					},
					filter:function(button,player){
						var card={name:button.link[2]};
						var info=get.info(card);
						var num=player.countCards('h');
						//if(get.tag(card,'multitarget')&&get.select(info.selectTarget)[1]==-1){
						if(get.select(info.selectTarget)[1]==-1){
							if(game.countPlayer(function(current){
								return player.canUse(card,current)
							})>num){
								return false;
							}
						}
						else if(info.changeTarget){
							var giveup=true;
							var list=game.filterPlayer(function(current){
								return player.canUse(card,current);
							});
							for(var i=0;i<list.length;i++){
								var targets=[list[i]];
								info.changeTarget(player,targets);
								if(targets.length<=num){
									giveup=false;break;
								}
							}
							if(giveup){
								return false;
							}
						}
						return lib.filter.filterCard(card,player,_status.event.getParent());
					},
					check:function(button){
						if(['chiling','xietianzi','tiesuo','lulitongxin','diaohulishan','jiedao'].contains(button.link[2])) return 0;
						return _status.event.player.getUseValue(button.link[2]);
					},
					backup:function(links,player){
						return {
							filterCard:true,
							audio:"qice",
							selectCard:-1,
							position:'h',
							selectTarget:function(){
								var select=get.select(get.info(get.card()).selectTarget);
								var nh=_status.event.player.countCards('h');
								if(select[1]>nh){
									select[1]=nh;
								}
								return select;
							},
							filterTarget:function(card,player,target){
								var info=get.info(card);
								if(info.changeTarget){
									var targets=[target];
									info.changeTarget(player,targets);
									if(targets.length>player.countCards('h')){
										return false;
									}
								}
								return lib.filter.filterTarget(card,player,target);
							},
							audio:'qice_backup',
							popname:true,
							viewAs:{name:links[0][2]},
							ai1:function(){
								return 1;
							}
						}
					},
					prompt:function(links,player){
						return '将全部手牌当作'+get.translation(links[0][2])+'使用';
					}
				},
				ai:{
					order:1,
					result:{
						player:function(player){
							var num=0;
							var cards=player.getCards('h');
							if(cards.length>=3&&player.hp>=3) return 0;
							for(var i=0;i<cards.length;i++){
								num+=Math.max(0,get.value(cards[i],player,'raw'));
							}
							return 16-num;
						}
					},
					threaten:1.6,
				}
			},
			gzyuejian:{
				trigger:{global:'phaseDiscardBegin'},
				audio:'yuejian',
				preHidden:true,
				filter:function(event,player){
					if(player.isFriendOf(event.player)){
						return event.player.getHistory('useCard',function(evt){
							if(evt.targets){
								var targets=evt.targets.slice(0);
								while(targets.contains(event.player)) targets.remove(event.player);
								return targets.length!=0;
							}
							return false;
						})==0;
					}
					return false;
				},
				content:function(){
					trigger.player.addTempSkill('gzyuejian_num');
				},
				logTarget:'player',
				forced:true,
				subSkill:{
					num:{
						mod:{
							maxHandcardBase:function(player,num){
								return player.maxHp;
							}
						}
					},
				}
			},
			gzxinsheng:{
				trigger:{player:'damageEnd'},
				// frequent:true,
				content:function(){
					game.log(player,'获得了一张','#g化身');
					lib.skill.gzhuashen.addCharacter(player,_status.characterlist.randomGet(),true);
					game.delayx();
				}
			},
			gzhuashen:{
				unique:true,
				group:['gzhuashen_add','gzhuashen_swap','gzhuashen_remove','gzhuashen_disallow','gzhuashen_flash'],
				init:function(player){
					player.storage.gzhuashen=[];
					player.storage.gzhuashen_removing=[];
					player.storage.gzhuashen_trigger=[];
					player.storage.gzhuashen_map={};
				},
				onremove:function(player){
					delete player.storage.gzhuashen;
					delete player.storage.gzhuashen_removing;
					delete player.storage.gzhuashen_trigger;
					delete player.storage.gzhuashen_map;
				},
				ondisable:true,
				mark:true,
				intro:{
					mark:function(dialog,storage,player){
						if(storage&&storage.length){
							if(player.isUnderControl(true)){
								dialog.addSmall([storage,'character']);
								var skills=[];
								for(var i in player.storage.gzhuashen_map){
									skills.addArray(player.storage.gzhuashen_map[i]);
								}
								dialog.addText('可用技能：'+(skills.length?get.translation(skills):'无'));
							}
							else{
								return '共有'+get.cnNumber(storage.length)+'张“化身”'
							}
						}
						else{
							return '没有化身';
						}
					},
					content:function(storage,player){
						if(player.isUnderControl(true)){
							var skills=[];
							for(var i in player.storage.gzhuashen_map){
								skills.addArray(player.storage.gzhuashen_map[i]);
							}
							return get.translation(storage)+'；可用技能：'+(skills.length?get.translation(skills):'无');
						}
						else{
							return '共有'+get.cnNumber(storage.length)+'张“化身”'
						}
					}
				},
				filterSkill:function(name){
					var skills=lib.character[name][3].slice(0);
					for(var i=0;i<skills.length;i++){
						var info=lib.skill[skills[i]];
						if(info.unique||info.limited||info.mainSkill||info.viceSkill||get.is.locked(skills[i])){
							skills.splice(i--,1);
						}
					}
					return skills;
				},
				addCharacter:function(player,name,show){
					var skills=lib.skill.gzhuashen.filterSkill(name);
					if(skills.length){
						player.storage.gzhuashen_map[name]=skills;
						for(var i=0;i<skills.length;i++){
							player.addAdditionalSkill('hidden:gzhuashen',skills[i],true);
						}
					}
					player.storage.gzhuashen.add(name);
					player.updateMarks('gzhuashen');
					_status.characterlist.remove(name);
					if(show){
						lib.skill.gzhuashen.drawCharacter(player,[name]);
					}
				},
				drawCharacter:function(player,list){
					game.broadcastAll(function(player,list){
						if(player.isUnderControl(true)){
							var cards=[];
							for(var i=0;i<list.length;i++){
								var cardname='huashen_card_'+list[i];
								lib.card[cardname]={
									fullimage:true,
									image:'character:'+list[i]
								}
								lib.translate[cardname]=get.rawName2(list[i]);
								cards.push(game.createCard(cardname,'',''));
							}
							player.$draw(cards,'nobroadcast');
						}
					},player,list);
				},
				removeCharacter:function(player,name){
					var skills=lib.skill.gzhuashen.filterSkill(name);
					if(skills.length){
						delete player.storage.gzhuashen_map[name];
						for(var i=0;i<skills.length;i++){
							var remove=true;
							for(var j in player.storage.gzhuashen_map){
								if(j!=name&&game.expandSkills(player.storage.gzhuashen_map[j].slice(0)).contains(skills[i])){
									remove=false;break;
								}
							}
							if(remove){
								player.removeAdditionalSkill('hidden:gzhuashen',skills[i]);
								player.storage.gzhuashen_removing.remove(skills[i]);
							}
						}
					}
					player.storage.gzhuashen.remove(name);
					player.updateMarks('gzhuashen');
					_status.characterlist.add(name);
				},
				getSkillSources:function(player,skill){
					if(player.getStockSkills().contains(skill)) return [];
					var sources=[];
					for(var i in player.storage.gzhuashen_map){
						if(game.expandSkills(player.storage.gzhuashen_map[i].slice(0)).contains(skill)) sources.push(i);
					}
					return sources;
				},
				subfrequent:['add'],
				subSkill:{
					add:{
						trigger:{player:'phaseBeginStart'},
						frequent:true,
						filter:function(event,player){
							return player.storage.gzhuashen.length<2;
						},
						content:function(){
							'step 0'
							var list=_status.characterlist.randomGets(5);
							if(!list.length){
								event.finish();
								return;
							}
							player.chooseButton([1,2]).set('ai',function(button){
								return get.rank(button.link,true);
							}).set('createDialog',['选择至多两张武将牌作为“化身”',[list,'character']]);
							'step 1'
							if(result.bool){
								for(var i=0;i<result.links.length;i++){
									lib.skill.gzhuashen.addCharacter(player,result.links[i]);
								}
								lib.skill.gzhuashen.drawCharacter(player,result.links.slice(0));
								game.delayx();
								player.addTempSkill('gzhuashen_triggered');
								game.log(player,'获得了'+get.cnNumber(result.links.length)+'张','#g化身');
							}
						}
					},
					swap:{
						trigger:{player:'phaseBeginStart'},
						direct:true,
						filter:function(event,player){
							if(player.hasSkill('gzhuashen_triggered')) return false;
							return player.storage.gzhuashen.length>=2;
						},
						content:function(){
							'step 0'
							var list=player.storage.gzhuashen.slice(0);
							if(!list.length){
								event.finish();
								return;
							}
							player.chooseButton().set('ai',function(){
								return Math.random()-0.3;
							}).set('createDialog',['是否替换一张“化身”？',[list,'character']]);
							'step 1'
							if(result.bool){
								player.logSkill('gzhuashen');
								game.log(player,'替换了一张','#g化身');
								lib.skill.gzhuashen.addCharacter(player,_status.characterlist.randomGet(),true);
								lib.skill.gzhuashen.removeCharacter(player,result.links[0]);
								game.delayx();
							}
						}
					},
					triggered:{},
					flash:{
						hookTrigger:{
							log:function(player,skill){
								var sources=lib.skill.gzhuashen.getSkillSources(player,skill);
								if(sources.length){
									player.flashAvatar('gzhuashen',sources.randomGet());
									player.storage.gzhuashen_removing.add(skill);
								}
							}
						},
						trigger:{player:['useSkillBegin','useCard','respond']},
						silent:true,
						filter:function(event,player){
							return event.skill&&lib.skill.gzhuashen.getSkillSources(player,event.skill).length>0;
						},
						content:function(){
							lib.skill.gzhuashen_flash.hookTrigger.log(player,trigger.skill);
						}
					},
					clear:{
						trigger:{player:'phaseAfter'},
						silent:true,
						content:function(){
							player.storage.gzhuashen_trigger.length=0;
						}
					},
					disallow:{
						hookTrigger:{
							block:function(event,player,name,skill){
								for(var i=0;i<player.storage.gzhuashen_trigger.length;i++){
									var info=player.storage.gzhuashen_trigger[i];
									if(info[0]==event&&info[1]==name&&
									lib.skill.gzhuashen.getSkillSources(player,skill).length>0){
										return true;
									}
								}
								return false;
							}
						}
					},
					remove:{
						trigger:{player:['useSkillAfter','useCardAfter','respondAfter','triggerAfter','skillAfter']},
						hookTrigger:{
							after:function(event,player){
								if(event._direct&&!player.storage.gzhuashen_removing.contains(event.skill)) return false;
								if(lib.skill[event.skill].silent) return false;
								return lib.skill.gzhuashen.getSkillSources(player,event.skill).length>0;
							}
						},
						silent:true,
						filter:function(event,player){
							return event.skill&&lib.skill.gzhuashen.getSkillSources(player,event.skill).length>0;
						},
						content:function(){
							'step 0'
							if(trigger.name=='trigger'){
								player.storage.gzhuashen_trigger.push([trigger._trigger,trigger.triggername]);
							}
							var sources=lib.skill.gzhuashen.getSkillSources(player,trigger.skill);
							if(sources.length==1){
								event.directresult=sources[0];
							}
							else{
								player.chooseButton(true).set('createDialog',['移除一张“化身”牌',[sources,'character']]);
							}
							'step 1'
							if(!event.directresult&&result&&result.links[0]){
								event.directresult=result.links[0];
							}
							var name=event.directresult;
							lib.skill.gzhuashen.removeCharacter(player,name);
							game.log(player,'移除了化身牌','#g'+get.translation(name));
						}
					}
				},
				ai:{
					nofrequent:true,
					skillTagFilter:function(player,tag,arg){
						if(arg&&player.storage.gzhuashen){
							if(lib.skill.gzhuashen.getSkillSources(player,arg).length>0){
								return true;
							}
						}
						return false;
					}
				}
			},
			gzxiongsuan:{
				limited:true,
				audio:'xiongsuan',
				enable:'phaseUse',
				filterCard:true,
				filter:function(event,player){
					return player.countCards('h');
				},
				filterTarget:function(card,player,target){
					return target.isFriendOf(player);
				},
				check:function(card){
					return 7-get.value(card);
				},
				content:function(){
					'step 0'
					player.awakenSkill('gzxiongsuan');
					target.damage('nocard');
					'step 1'
					player.draw(3);
					var list=[];
					var skills=target.getOriginalSkills();
					for(var i=0;i<skills.length;i++){
						if(lib.skill[skills[i]].limited&&target.awakenedSkills.contains(skills[i])){
							list.push(skills[i]);
						}
					}
					if(list.length==1){
						target.storage.gzxiongsuan_restore=list[0];
						target.addTempSkill('gzxiongsuan_restore');
						event.finish();
					}
					else if(list.length>1){
						player.chooseControl(list).set('prompt','选择一个限定技在回合结束后重置之');
					}
					else{
						event.finish();
					}
					'step 2'
					target.storage.gzxiongsuan_restore=result.control;
					target.addTempSkill('gzxiongsuan_restore');
				},
				subSkill:{
					restore:{
						trigger:{global:'phaseEnd'},
						forced:true,
						popup:false,
						charlotte:true,
						onremove:true,
						content:function(){
							player.restoreSkill(player.storage.gzxiongsuan_restore);
						}
					}
				},
				ai:{
					order:4,
					damage:true,
					result:{
						target:function(player,target){
							if(target.hp>1){
								var skills=target.getOriginalSkills();
								for(var i=0;i<skills.length;i++){
									if(lib.skill[skills[i]].limited&&target.awakenedSkills.contains(skills[i])){
										return 8;
									}
								}
							}
							if(target!=player) return 0;
							if(get.damageEffect(target,player,player)>=0) return 10;
							if(target.hp>=4) return 5;
							if(target.hp==3){
								if(player.countCards('h')<=2&&game.hasPlayer(function(current){
									return current.hp<=1&&get.attitude(player,current)<0;
								})){
									return 3;
								}
							}
							return 0;
						}
					}
				}
			},
			gzsuishi:{
				audio:'suishi',
				preHidden:['gzsuishi2'],
				trigger:{global:'dying'},
				forced:true,
				//priority:6.5,
				check:function(){
					return false;
				},
				filter:function(event,player){
					return event.player!=player&&event.parent.name=='damage'&&event.parent.source&&event.parent.source.isFriendOf(player);
				},
				content:function(){
					player.draw();
				},
				group:'gzsuishi2'
			},
			gzsuishi2:{
				audio:'suishi',
				trigger:{global:'dieAfter'},
				forced:true,
				check:function(){return false},
				filter:function(event,player){
					return event.player.isFriendOf(player);
				},
				content:function(){
					player.loseHp();
				}
			},
			hongfa_respond:{
				audio:'huangjintianbingfu',
				forceaudio:true,
				trigger:{player:'chooseToRespondBegin'},
				direct:true,
				filter:function(event,player){
					if(event.responded) return false;
					if(!event.filterCard({name:'sha'})) return false;
					var zhu=get.zhu(player,'hongfa');
					if(zhu&&zhu.getExpansions('huangjintianbingfu').length>0){
						return true;
					}
					return false;
				},
				content:function(){
					"step 0"
					var zhu=get.zhu(player,'hongfa');
					player.chooseCardButton(get.prompt('huangjintianbingfu'),zhu.getExpansions('huangjintianbingfu')).set('ai',function(){
						if(_status.event.goon) return 1;
						return 0;
					}).set('goon',player.countCards('h','sha')==0);
					"step 1"
					if(result.bool){
						var card=result.links[0];
						trigger.untrigger();
						trigger.responded=true;
						trigger.result={bool:true,card:{name:'sha'},cards:[card]};
						var zhu=get.zhu(player,'hongfa');
						player.logSkill('hongfa_respond',zhu);
					}
				}
			},
			hongfa_use:{
				audio:'huangjintianbingfu',
				forceaudio:true,
				enable:'chooseToUse',
				filter:function(event,player){
					if(!event.filterCard({name:'sha'},player)) return false;
					var zhu=get.zhu(player,'hongfa');
					if(zhu&&zhu.getExpansions('huangjintianbingfu').length>0){
						return true;
					}
					return false;
				},
				chooseButton:{
					dialog:function(event,player){
						var zhu=get.zhu(player,'hongfa');
						return ui.create.dialog('黄巾天兵符',zhu.getExpansions('huangjintianbingfu'),'hidden');
					},
					backup:function(links,player){
						return {
							filterCard:function(){return false},
							selectCard:-1,
							viewAs:{name:'sha',cards:links},
							cards:links,
							precontent:function(){
								var cards=lib.skill.hongfa_use_backup.cards;
								event.result.cards=cards;
								player.logSkill('hongfa_use',result.targets);
							}
						}
					},
					prompt:function(links,player){
						return '选择杀的目标';
					}
				},
				ai:{
					respondSha:true,
					skillTagFilter:function(player){
						var zhu=get.zhu(player,'hongfa');
						if(zhu&&zhu.getExpansions('huangjintianbingfu').length>0){
							return true;
						}
						return false;
					},
					order:function(){
						return get.order({name:'sha'})-0.1;
					},
					result:{
						player:function(player){
							if(player.countCards('h','sha')) return 0;
							return 1;
						}
					}
				}
			},
			hongfa:{
				audio:2,
				derivation:'huangjintianbingfu',
				unique:true,
				forceunique:true,
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				filter:function(event,player){
					return player.getExpansions('huangjintianbingfu').length==0&&get.population('qun')>0;
				},
				content:function(){
					var cards=get.cards(get.population('qun'));
					player.addToExpansion(cards,'gain2').gaintag.add('huangjintianbingfu');
				},
				ai:{
					threaten:2,
				},
				group:'hongfa_hp',
				global:['hongfa_use','hongfa_respond'],
				subSkill:{
					hp:{
						audio:true,
						trigger:{player:'loseHpBefore'},
						filter:function(event,player){
							return player.getExpansions('huangjintianbingfu').length>0;
						},
						direct:true,
						content:function(){
							'step 0'
							player.chooseCardButton(get.prompt('hongfa'),player.getExpansions('huangjintianbingfu')).set('ai',function(){
								return 1;
							});
							'step 1'
							if(result.bool){
								player.logSkill('huangjintianbingfu');
								player.loseToDiscardpile(result.links);
								trigger.cancel();
							}
						}
					}
				}
			},
			wendao:{
				audio:2,
				unique:true,
				forceunique:true,
				enable:'phaseUse',
				usable:1,
				filterCard:function(card){
					return get.name(card)!='taipingyaoshu'&&get.color(card)=='red';
				},
				position:'he',
				check:function(card){
					return 6-get.value(card);
				},
				onChooseToUse:function(event){
					if(game.online) return;
					event.set('wendao',function(){
						for(var i=0;i<ui.discardPile.childElementCount;i++){
							if(ui.discardPile.childNodes[i].name=='taipingyaoshu') return true;
						}
						return game.hasPlayer(function(current){
							return current.countCards('ej','taipingyaoshu');
						});
					}());
				},
				filter:function(event,player){
					return event.wendao==true;
				},
				content:function(){
					var list=[];
					for(var i=0;i<ui.discardPile.childElementCount;i++){
						if(ui.discardPile.childNodes[i].name=='taipingyaoshu'){
							list.add(ui.discardPile.childNodes[i]);
						}
					}
					game.countPlayer(function(current){
						var ej=current.getCards('ej','taipingyaoshu');
						if(ej.length){
							list.addArray(ej);
						}
					});
					if(list.length){
						var card=list.randomGet();
						var owner=get.owner(card);
						if(owner){
							player.gain(card,owner,'give','bySelf');
							player.line(owner,'green');
						}
						else{
							player.gain(card,'gain2');
						}
					}
				},
				ai:{
					order:8.5,
					result:{
						player:1
					}
				}
			},
			huangjintianbingfu:{
				audio:2,
				unique:true,
				forceunique:true,
				nopop:true,
				mark:true,
				onremove:function(player,skill){
					var cards=player.getExpansions(skill);
					if(cards.length) player.loseToDiscardpile(cards);
				},
				intro:{
					content:'expansion',
					markcount:'expansion',
					mark:function(dialog,content,player){
						var content=player.getExpansions('huangjintianbingfu');
						if(content&&content.length){
							dialog.addSmall(content);
						}
						dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>当你计算群势力角色数时，每一张“天兵”均可视为一名群势力角色。<li>每当你失去体力时，你可改为将一张“天兵”置入弃牌堆。<li>与你势力相同的角色可将一张“天兵”当【杀】使用或打出。',false)
					}
				}
			},
			wuxin:{
				trigger:{player:'phaseDrawBegin1'},
				audio:2,
				filter:function(event,player){
					return get.population('qun')>0;
				},
				content:function(){
					'step 0'
					var num=get.population('qun');
					if(player.hasSkill('huangjintianbingfu')){
						num+=player.getExpansions('huangjintianbingfu').length;
					}
					var cards=get.cards(num);
					game.cardsGotoOrdering(cards);
					var next=player.chooseToMove('悟心：将卡牌以任意顺序置于牌堆顶');
					next.set('list',[['牌堆顶',cards]]);
					next.set('processAI',function(list){
						var cards=list[0][1].slice(0);
						cards.sort(function(a,b){
							return get.value(b)-get.value(a);
						});
						return [cards];
					})
					'step 1'
					if(result.bool){
						var list=result.moved[0].slice(0);
						while(list.length){
							ui.cardPile.insertBefore(list.pop(),ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
				}
			},
			zhangwu:{
				audio:2,
				unique:true,
				forceunique:true,
				ai:{
					threaten:2,
				},
				trigger:{
					global:['loseAfter','cardsDiscardAfter','equipAfter'],
				},
				forced:true,
				filter:function(event,player){
					if(event.name=='equip'){
						if(player==event.player) return false;
						if(event.card.name=='feilongduofeng'&&event.player.getCards('e').contains(event.card)) return true;
						return event.player.hasHistory('lose',function(evt){
							if(evt.position!=ui.discardPile||evt.getParent().name!='equip') return false;
							for(var i of evt.cards){
								if(i.name=='feilongduofeng'&&get.position(i,true)=='d') return true;
							}
							return false;
						})
					}
					if(event.name=='lose'&&(event.position!=ui.discardPile||event.getParent().name=='equip')) return false;
					for(var i of event.cards){
						if(i.name=='feilongduofeng'&&get.position(i,true)=='d') return true;
					}
					return false;
				},
				logTarget:function(event,player){
					if(event.name=='equip'&&event.card.name=='feilongduofeng'&&event.player.getCards('e').contains(event.card)) return event.player;
					return [];
				},
				content:function(){
					game.delayx();
					var cards=[];
					if(trigger.name=='equip'){
						if(trigger.card.name=='feilongduofeng'&&trigger.player.getCards('e').contains(trigger.card)) cards.push(trigger.card);
						trigger.player.getHistory('lose',function(evt){
							if(evt.position!=ui.discardPile||evt.getParent()!=trigger) return false;
							for(var i of evt.cards){
								if(i.name=='feilongduofeng'&&get.position(i,true)=='d') cards.push(i);
							}
							return false;
						})
					};
					if(trigger.name=='lose'){
						for(var i of trigger.cards){
							if(i.name=='feilongduofeng'&&get.position(i,true)=='d') cards.push(i);
						}
					}
					var owner=get.owner(cards[0]);
					if(owner) player.gain(cards,'give',owner,'bySelf');
					else player.gain(cards,'gain2');
				},
				group:'zhangwu_draw',
				subSkill:{
					draw:{
						audio:'zhangwu',
						trigger:{
							player:'loseEnd',
							global:['equipEnd','addJudgeEnd','gainEnd','loseAsyncEnd','addToExpansionEnd'],
						},
						filter:function(event,player){
							if(event.name=='lose'&&event.getParent().name=='useCard') return false;
							var evt=event.getl(player);
							return evt&&evt.player==player&&evt.cards2.filter(function(i){
								return i.name=='feilongduofeng'&&get.owner(i)!=player;
							}).length>0;
						},
						forced:true,
						content:function(){
							'step 0'
							var cards=[],evt=trigger.getl(player);
							cards.addArray(evt.cards2.filter(function(i){
								return i.name=='feilongduofeng'&&get.owner(i)!=player;
							}));
							player.showCards(cards,get.translation(player)+'发动了【章武】');
							for(var i of cards){
								var owner=get.owner(i);
								if(owner) owner.lose(i,ui.cardPile)._triggered=null;
								else{
									i.fix();
									ui.cardPile.appendChild(i);
								}
							}
							'step 1'
							player.draw(2);
						},
					},
				},
			},
			shouyue:{
				unique:true,
				forceunique:true,
				group:'wuhujiangdaqi',
				derivation:'wuhujiangdaqi',
				mark:true,
			},
			wuhujiangdaqi:{
				unique:true,
				forceunique:true,
				nopop:true,
				mark:true,
				intro:{
					content:"@<div style=\"margin-top:-5px\"><div class=\"skill\">【武圣】</div><div class=\"skillinfo\">将“红色牌”改为“任意牌”</div><div class=\"skill\">【咆哮】</div><div class=\"skillinfo\">增加描述“你使用的【杀】无视其他角色的防具”</div><div class=\"skill\">【龙胆】</div><div class=\"skillinfo\">增加描述“你每发动一次‘龙胆’便摸一张牌”</div><div class=\"skill\">【烈弓】</div><div class=\"skillinfo\">增加描述“你的攻击范围+1”</div><div class=\"skill\">【铁骑】</div><div class=\"skillinfo\">将“一张明置的武将牌”改为“所有明置的武将牌”</div></div>",
				}
			},
			jizhao:{
				derivation:'rerende',
				unique:true,
				audio:2,
				enable:'chooseToUse',
				mark:true,
				skillAnimation:true,
				animationColor:'fire',
				init:function(player){
					player.storage.jizhao=false;
				},
				filter:function(event,player){
					if(player.storage.jizhao) return false;
					if(event.type=='dying'){
						if(player!=event.dying) return false;
						return true;
					}
					return false;
				},
				content:function(){
					'step 0'
					player.awakenSkill('jizhao');
					player.storage.jizhao=true;
					var num=player.maxHp-player.countCards('h');
					if(num>0){
						player.draw(num);
					}
					'step 1'
					if(player.hp<2){
						player.recover(2-player.hp);
					}
					'step 2'
					player.removeSkill('shouyue');
					player.removeSkill('wuhujiangdaqi');
					player.addSkill('rerende');
				},
				ai:{
					order:1,
					skillTagFilter:function(player,arg,target){
						if(player!=target||player.storage.jizhao) return false;
					},
					save:true,
					result:{
						player:10
					},
				},
				intro:{
					content:'limited'
				}
			},
			gzshoucheng:{
				inherit:'shoucheng',
				audio:'shoucheng',
				preHidden:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						if(current==_status.currentPhase||!current.isFriendOf(player)) return false;
						var evt=event.getl(current);
						return evt&&evt.hs&&evt.hs.length&&current.countCards('h')==0;
					});
				},
				content:function(){
					"step 0"
					event.list=game.filterPlayer(function(current){
						if(current==_status.currentPhase||!current.isFriendOf(player)) return false;
						var evt=trigger.getl(current);
						return evt&&evt.hs&&evt.hs.length;
					}).sortBySeat(_status.currentPhase);
					"step 1"
					var target=event.list.shift();
					event.target=target;
					if(target.isAlive()&&target.countCards('h')==0){
						player.chooseBool(get.prompt2('gzshoucheng',target)).set('ai',function(){
							return get.attitude(_status.event.player,_status.event.getParent().target)>0;
						}).setHiddenSkill(event.name);
					}
					else event.goto(3);
					"step 2"
					if(result.bool){
						player.logSkill(event.name,target);
						target.draw();
					}
					"step 3"
					if(event.list.length) event.goto(1);
				},
			},
			gzyicheng:{
				audio:'yicheng',
				trigger:{
					global:['useCardToPlayered','useCardToTargeted'],
				},
				preHidden:true,
				//frequent:true,
				direct:true,
				filter:function(event,player){
					if(event.card.name!='sha') return false;
					if(event.name=='useCardToPlayered'&&!event.isFirstTarget) return false;
					var target=lib.skill.gzyicheng.logTarget(event,player);
					if(target==player) return true;
					return target.inline(player)&&target.isAlive()&&player.hasSkill('gzyicheng');
				},
				logTarget:function(event,player){
					return event.name=='useCardToPlayered'?event.player:event.target;
				},
				content:function(){
					'step 0'
					var target=lib.skill.gzyicheng.logTarget(trigger,player);
					event.target=target;
					target.chooseBool(get.prompt('gzyicheng'),'摸一张牌，然后弃置一张牌').set('frequentSkill','gzyicheng');
					'step 1'
					if(result.bool){
						player.logSkill('gzyicheng',target);
						target.draw();
						target.chooseToDiscard('he',true);
					}
				},
			},
			yicheng:{
				audio:2,
				trigger:{global:'useCardToTargeted'},
				filter:function(event,player){
					return event.card.name=='sha'&&event.target.isFriendOf(player);
				},
				preHidden:true,
				logTarget:'target',
				content:function(){
					'step 0'
					trigger.target.draw();
					'step 1'
					trigger.target.chooseToDiscard('he',true);
				}
			},
			gzjixi:{
				inherit:'jixi',
				audio:'jixi',
				mainSkill:true,
				init:function(player){
					if(player.checkMainSkill('gzjixi')){
						player.removeMaxHp();
					}
				}
			},
			ziliang:{
				audio:2,
				trigger:{global:'damageEnd'},
				filter:function(event,player){
					return event.player.isIn()&&event.player.isFriendOf(player)&&player.getExpansions('tuntian').length;
				},
				init:function(player){
					player.checkViceSkill('ziliang');
				},
				viceSkill:true,
				direct:true,
				content:function(){
					'step 0'
					player.chooseCardButton(get.prompt('ziliang',trigger.player),player.getExpansions('tuntian')).set('ai',function(button){
						return get.value(button.link);
					});
					'step 1'
					if(result.bool){
						var card=result.links[0];
						player.logSkill('ziliang',trigger.player);
						player.give(card,trigger.player);
					}
				}
			},
			gzhuyuan:{
				audio:'huyuan',
				trigger:{player:'phaseJieshuBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return player.countCards('he')>0;
				},
				content:function(){
					'step 0'
					player.chooseCardTarget({
						filterCard:true,
						position:'he',
						filterTarget:function(card,player,target){
							if(player==target) return false;
							var card=ui.selected.cards[0];
							if(get.type(card)!='equip') return true;
							return target.isEmpty(get.subtype(card));
						},
						prompt:get.prompt2('gzhuyuan'),
						complexSelect:true,
						ai1:function(card){
							var player=_status.event.player;
							if(get.type(card)!='equip') return 0;
							return 6-get.value(card);
						},
						ai2:function(target){
							var player=_status.event.player,card=ui.selected.cards[0];
							return get.effect(target,card,player,player);
						},
					}).setHiddenSkill('gzhuyuan');
					'step 1'
					if(result.bool){
						var target=result.targets[0],card=result.cards[0];
						player.logSkill('gzhuyuan',target);
						if(get.type(card)=='equip'){
							player.$give(card,target,false);
							game.delayx();
							target.equip(card);
						}
						else{
							player.give(card,target);
							event.finish();
						}
					}
					else event.finish();
					'step 2'
					if(game.hasPlayer(function(current){
						return current.hasCard(function(card){
							return lib.filter.canBeDiscarded(card,player,current);
						},'ej');
					})){
						player.chooseTarget('是否弃置场上的一张牌？',function(card,player,target){
							return target.hasCard(function(card){
								return lib.filter.canBeDiscarded(card,player,target);
							},'ej');
						});
					}
					else event.finish();
					'step 3'
					if(result.bool){
						var target=result.targets[0];
						player.line(target,'thunder');
						player.discardPlayerCard(target,true,'ej');
					}
				},
			},
			huyuan:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				direct:true,
				preHidden:true,
				filter:function(event,player){
					return player.countCards('he',{type:'equip'})>0;
				},
				content:function(){
					"step 0"
					player.chooseCardTarget({
						filterCard:function(card){
							return get.type(card)=='equip';
						},
						position:'he',
						filterTarget:function(card,player,target){
							return target.isEmpty(get.subtype(card));
						},
						ai1:function(card){
							return 6-get.value(card);
						},
						ai2:function(target){
							return get.attitude(_status.event.player,target)-3;
						},
						prompt:get.prompt2('huyuan')
					}).setHiddenSkill('huyuan');
					"step 1"
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('huyuan',target);
						event.current=target;
						target.equip(result.cards[0]);
						if(target!=player){
							player.$give(result.cards,target,false);
							game.delay(2);
						}
						player.chooseTarget('弃置一名角色的一张牌',function(card,player,target){
							var source=_status.event.source;
							return get.distance(source,target)<=1&&source!=target&&target.countCards('he');
						}).set('ai',function(target){
							var player=_status.event.player;
						return get.effect(target,{name:'guohe_copy2'},player,player);
						}).set('source',target);
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.bool&&result.targets.length){
						event.current.line(result.targets,'green');
						player.discardPlayerCard(true,result.targets[0],'he');
					}
				},
			},
			heyi:{
				zhenfa:'inline',
				global:'heyi_distance'
			},
			heyi_distance:{
				mod:{
					globalTo:function(from,to,distance){
						if(game.hasPlayer(function(current){
							return current.hasSkill('heyi')&&current.inline(to);
						})){
							return distance+1;
						}
					}
				}
			},
			tianfu:{
				init:function(player){
					player.checkMainSkill('tianfu');
				},
				mainSkill:true,
				inherit:'kanpo',
				zhenfa:'inline',
				viewAsFilter:function(player){
					return _status.currentPhase&&_status.currentPhase.inline(player)&&!player.hasSkill('kanpo')&&player.countCards('h',{color:'black'})>0;
				},
			},
			yizhi:{
				init:function(player){
					if(player.checkViceSkill('yizhi')&&!player.viceChanged){
						player.removeMaxHp();
					}
				},
				viceSkill:true,
				inherit:'guanxing',
				filter:function(event,player){
					return !player.hasSkill('guanxing');
				}
			},
			gzshangyi:{
				audio:'shangyi',
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				filterTarget:function(card,player,target){
					return player!=target&&(target.countCards('h')||target.isUnseen(2));
				},
				content:function(){
					"step 0"
					target.viewHandcards(player);
					"step 1"
					if(!target.countCards('h')){
						event._result={index:1};
					}
					else if(!target.isUnseen(2)){
						event._result={index:0};
					}
					else{
						player.chooseControl().set('choiceList',[
							'观看'+get.translation(target)+'的手牌并可以弃置其中的一张黑色牌',
							'观看'+get.translation(target)+'的所有暗置的武将牌',
						]);
					}
					"step 2"
					if(result.index==0){
						player.discardPlayerCard(target,'h').set('filterButton',function(button){
							return get.color(button.link)=='black';
						}).set('visible',true);
					}
					else{
						player.viewCharacter(target,2);
					}
				},
				ai:{
					order:11,
					result:{
						target:function(player,target){
							return -target.countCards('h');
						}
					},
					threaten:1.1
				},
			},
			niaoxiang:{
				zhenfa:'siege',
				audio:'zniaoxiang',
				global:'niaoxiang_sha',
				preHidden:true,
				trigger:{global:'useCardToPlayered'},
				filter:function(event,player){
					if(event.card.name!='sha') return false;
					if(game.countPlayer()<4) return false;
					return player.siege(event.target)&&event.player.siege(event.target);
				},
				forced:true,
				audio:'zniaoxiang',
				forceaudio:true,
				logTarget:'target',
				content:function(){
					var id=trigger.target.playerid;
					var map=trigger.getParent().customArgs;
					if(!map[id]) map[id]={};
					if(typeof map[id].shanRequired=='number'){
						map[id].shanRequired++;
					}
					else{
						map[id].shanRequired=2;
					}
				}
			},
			fengshi:{
				audio:'zfengshi',
				zhenfa:'siege',
				trigger:{global:'useCardToPlayered'},
				filter:function(event,player){
					if(event.card.name!='sha'||game.countPlayer()<4) return false;
					return player.siege(event.target)&&event.player.siege(event.target)&&event.target.countCards('e');
				},
				logTarget:'target',
				content:function(){
					trigger.target.chooseToDiscard('e',true);
				}
			},
			gzguixiu:{
				audio:'guixiu',
				trigger:{player:['showCharacterAfter','removeCharacterBefore']},
				filter:function(event,player){
					if(event.name=='removeCharacter'||event.name=='changeVice') return event.toRemove=='gz_mifuren'&&player.isDamaged();
					return event.toShow.contains('gz_mifuren');
				},
				content:function(){
					if(trigger.name=='showCharacter'){
						player.draw(2);
					}
					else{
						player.recover();
					}
				},
			},
			gzcunsi:{
				derivation:'gzyongjue',
				enable:'phaseUse',
				audio:'cunsi',
				filter:function(event,player){
					return player.checkMainSkill('gzcunsi',false)||player.checkViceSkill('gzcunsi',false);
				},
				unique:true,
				forceunique:true,
				filterTarget:true,
				skillAnimation:true,
				animationColor:'orange',
				content:function(){
					'step 0'
					if(player.checkMainSkill('gzcunsi',false)){
						player.removeCharacter(0);
					}
					else{
						player.removeCharacter(1);
					}
					'step 1'
					target.addSkill('gzyongjue');
					if(target!=player){
						target.draw(2);
					}
				},
				ai:{
					order:9,
					result:{
						player:function(player,target){
							var num=0;
							if(player.isDamaged()&&target.isFriendOf(player)){
								num++;
								if(target.hasSkill('kanpo')) num+=0.5;
								if(target.hasSkill('liegong')) num+=0.5;
								if(target.hasSkill('tieji')) num+=0.5;
								if(target.hasSkill('gzrende')) num+=1.2;
								if(target.hasSkill('longdan')) num+=1.2;
								if(target.hasSkill('paoxiao')) num+=1.2;
								if(target.hasSkill('zhangwu')) num+=1.5;
								if(target!=player) num+=0.5;
							}
							return num;
						}
					}
				}
			},
			gzyongjue:{
				audio:'yongjue',
				trigger:{global:'useCardAfter'},
				filter:function(event,player){
					if(event==event.player.getHistory('useCard')[0]&&event.card.name=='sha'&&_status.currentPhase==event.player&&event.player.isFriendOf(player)){
						for(var i=0;i<event.cards.length;i++){
							if(get.position(event.cards[i],true)=='o'){
								return true;
							}
						}
					}
					return false;
				},
				mark:true,
				intro:{
					content:'若与你势力相同的一名角色于其回合内使用的第一张牌为【杀】，则该角色可以在此【杀】结算完成后获得之'
				},
				content:function(){
					var cards=[];
					for(var i=0;i<trigger.cards.length;i++){
						if(get.position(trigger.cards[i],true)=='o'){
							cards.push(trigger.cards[i]);
						}
					}
					trigger.player.gain(cards,'gain2');
				},
				global:'gzyongjue_ai'
			},
			gzyongjue_ai:{
				ai:{
					presha:true,
					skillTagFilter:function(player){
						if(!game.hasPlayer(function(current){
							return current.isFriendOf(player)&&current.hasSkill('gzyongjue');
						})){
							return false;
						}
					}
				}
			},
			baoling:{
				trigger:{player:'phaseUseEnd'},
				init:function(player){
					player.checkMainSkill('baoling');
				},
				mainSkill:true,
				forced:true,
				preHidden:true,
				filter:function(event,player){
					return player.hasViceCharacter();
				},
				check:function(event,player){
					return player.hp<=1||get.guozhanRank(player.name2,player)<=3;
				},
				content:function(){
					'step 0'
					player.removeCharacter(1);
					'step 1'
					player.removeSkill('baoling');
					player.gainMaxHp(3,true);
					'step 2'
					player.recover(3);
					player.addSkill('benghuai');
				},
				derivation:'benghuai'
			},
			gzmingshi:{
				audio:'mingshi',
				trigger:{player:'damageBegin3'},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					return event.num>0&&event.source&&event.source.isUnseen(2);
				},
				content:function(){
					trigger.num--;
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return;
							if(!player.isUnseen(2)) return;
							var num=get.tag(card,'damage');
							if(num){
								if(num>1) return 0.5;
								return 0;
							}
						}
					}
				},
			},
			hunshang:{
				init:function(player){
					if(player.checkViceSkill('hunshang')&&!player.viceChanged){
						player.removeMaxHp();
					}
				},
				group:['hunshang_yingzi','hunshang_yinghun'],
			},
			reyingzi_sunce:{audio:2},
			yinghun_sunce:{audio:2},
			hunshang_yingzi:{
				inherit:'yingzi',
				audio:'reyingzi_sunce',
				filter:function(event,player){
					return player.hp<=1&&!player.hasSkill('yingzi');
				}
			},
			hunshang_yinghun:{
				inherit:'yinghun',
				audio:'yinghun_sunce',
				filter:function(event,player){
					return player.hp<=1&&player.isDamaged()&&!player.hasSkill('yinghun');
				}
			},
			yingyang:{
				audio:2,
				trigger:{player:'compare',target:'compare'},
				filter:function(event){
					return !event.iwhile;
				},
				direct:true,
				preHidden:true,
				content:function(){
					'step 0'
					player.chooseControl('点数+3','点数-3','cancel2').set('prompt',get.prompt2('yingyang')).set('ai',function(){
						if(_status.event.small) return 1;
						else return 0;
					}).set('small',trigger.small);
					'step 1'
					if(result.index!=2){
						player.logSkill('yingyang');
						if(result.index==0){
							game.log(player,'拼点牌点数+3');
							if(player==trigger.player){
								trigger.num1+=3;
								if(trigger.num1>13) trigger.num1=13;
							}
							else{
								trigger.num2+=3;
								if(trigger.num2>13) trigger.num2=13;
							}
						}
						else{
							game.log(player,'拼点牌点数-3');
							if(player==trigger.player){
								trigger.num1-=3;
								if(trigger.num1<1) trigger.num1=1;
							}
							else{
								trigger.num2-=3;
								if(trigger.num2<1) trigger.num2=1;
							}
						}
					}

				}
			},
			gzqianxi:{
				audio:'qianxi',
				trigger:{player:'phaseZhunbeiBegin'},
				content:function(){
					"step 0"
					player.judge();
					"step 1"
					event.color=result.color;
					player.chooseTarget(function(card,player,target){
						return player!=target&&get.distance(player,target)<=1;
					},true).set('ai',function(target){
						return -get.attitude(_status.event.player,target);
					});
					"step 2"
					if(result.bool&&result.targets.length){
						result.targets[0].storage.qianxi2=event.color;
						result.targets[0].addSkill('qianxi2');
						player.line(result.targets,'green');
						game.addVideo('storage',result.targets[0],['qianxi2',event.color]);
					}
				},
			},
			gzduanchang:{
				audio:'duanchang',
				trigger:{player:'die'},
				forced:true,
				forceDie:true,
				filter:function(event,player){
					return event.source&&event.source.isIn()&&event.source!=player&&
					(event.source.hasMainCharacter()||event.source.hasViceCharacter());
				},
				content:function(){
					'step 0'
					if(!trigger.source.hasViceCharacter()){
						event._result={control:'主将'}
					}
					else if(!trigger.source.hasMainCharacter()){
						event._result={control:'副将'}
					}
					else{
						player.chooseControl('主将','副将',function(){
							return _status.event.choice;
						}).set('prompt','令'+get.translation(trigger.source)+'失去一张武将牌的所有技能').set('forceDie',true).set('choice',function(){
						var rank=get.guozhanRank(trigger.source.name1,trigger.source)-get.guozhanRank(trigger.source.name2,trigger.source);
						if(rank==0) rank=Math.random()>0.5?1:-1;
						return (rank*get.attitude(player,trigger.source))>0?'副将':'主将';
						}());
					}
					'step 1'
					var skills;
					if(result.control=='主将'){
						trigger.source.showCharacter(0);
						game.broadcastAll(function(player){
							player.node.avatar.classList.add('disabled');
						},trigger.source);
						skills=lib.character[trigger.source.name][3];
						game.log(trigger.source,'失去了主将技能');
					}
					else{
						trigger.source.showCharacter(1);
						game.broadcastAll(function(player){
							player.node.avatar2.classList.add('disabled');
						},trigger.source);
						skills=lib.character[trigger.source.name2][3];
						game.log(trigger.source,'失去了副将技能');
					}
					var list=[];
					for(var i=0;i<skills.length;i++){
						list.add(skills[i]);
						var info=lib.skill[skills[i]];
						if(info.charlotte){list.splice(i--);continue};
						if(typeof info.derivation=='string'){
							list.add(info.derivation);
						}
						else if(Array.isArray(info.derivation)){
							list.addArray(info.derivation);
						}
					}
					trigger.source.removeSkill(list);
					trigger.source.syncSkills();
					player.line(trigger.source,'green');
				},
				logTarget:'source',
				ai:{
					threaten:function(player,target){
						if(target.hp==1) return 0.2;
						return 1.5;
					},
					effect:{
						target:function(card,player,target,current){
							if(!target.hasFriend()) return;
							if(target.hp<=1&&get.tag(card,'damage')) return [1,0,0,-2];
						}
					}
				}
			},
			gzweimu:{
				audio:'weimu',
				trigger:{target:'useCardToTarget',player:'addJudgeBefore'},
				forced:true,
				priority:15,
				preHidden:true,
				check:function(event,player){
					return event.name=='addJudge'||(event.card.name!='chiling'&&get.effect(event.target,event.card,event.player,player)<0);
				},
				filter:function(event,player){
					if(event.name=='addJudge') return get.color(event.card)=='black';
					return get.type(event.card,null,false)=='trick'&&get.color(event.card)=='black';
				},
				content:function(){
					if(trigger.name=='addJudge'){
						trigger.cancel();
						var owner=get.owner(trigger.card);
						if(owner&&owner.getCards('hej').contains(trigger.card)) owner.lose(trigger.card,ui.discardPile);
						else game.cardsDiscard(trigger.card);
						game.log(trigger.card,'进入了弃牌堆');
					}
					else trigger.getParent().targets.remove(player);
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.type(card,'trick')=='trick'&&get.color(card)=='black') return 'zeroplayertarget';
						},
					}
				}
			},
			gzqianxun:{
				audio:'qianxun',
				trigger:{
					target:'useCardToTarget',
					player:'addJudgeBefore',
				},
				forced:true,
				preHidden:true,
				priority:15,
				check:function(event,player){
					return event.name=='addJudge'||get.effect(event.target,event.card,event.player,player)<0;
				},
				filter:function(event,player){
					return event.card.name==(event.name=='addJudge'?'lebu':'shunshou');
				},
				content:function(){
					if(trigger.name=='addJudge'){
						trigger.cancel();
						var owner=get.owner(trigger.card);
						if(owner&&owner.getCards('hej').contains(trigger.card)) owner.lose(trigger.card,ui.discardPile);
						else game.cardsDiscard(trigger.card);
						game.log(trigger.card,'进入了弃牌堆');
					}
					else trigger.getParent().targets.remove(player);
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(card.name=='shunshou'||card.name=='lebu') return 'zeroplayertarget';
						},
					}
				}
			},
			gzkongcheng:{
				audio:'kongcheng',
				trigger:{target:'useCardToTarget'},
				forced:true,
				priority:15,
				check:function(event,player){
					return get.effect(event.target,event.card,event.player,player)<0;
				},
				filter:function(event,player){
					return player.countCards('h')==0&&(event.card.name=='sha'||event.card.name=='juedou');
				},
				content:function(){
					trigger.getParent().targets.remove(player);
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(target.countCards('h')==0&&(card.name=='sha'||card.name=='juedou')) return 'zeroplayertarget';
						},
					}
				}
			},
			gzxiaoji:{
				inherit:'xiaoji',
				audio:'xiaoji',
				preHidden:true,
				content:function(){
					player.draw(player==_status.currentPhase?1:3);
				}
			},
			gzrende:{
				audio:'rende',
				group:['gzrende1'],
				enable:'phaseUse',
				filterCard:true,
				selectCard:[1,Infinity],
				discard:false,
				prepare:'give',
				filterTarget:function(card,player,target){
					return player!=target;
				},
				check:function(card){
					if(ui.selected.cards.length>2) return 0;
					if(ui.selected.cards.length&&ui.selected.cards[0].name=='du') return 0;
					if(!ui.selected.cards.length&&card.name=='du') return 20;
					var player=get.owner(card);
					if(player.hp==player.maxHp||player.storage.gzrende<0||player.countCards('h')+player.storage.gzrende<=2){
						if(ui.selected.cards.length){
							return -1;
						}
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i].hasSkill('haoshi')&&
								!players[i].isTurnedOver()&&
								!players[i].hasJudge('lebu')&&
								get.attitude(player,players[i])>=3&&
								get.attitude(players[i],player)>=3){
								return 11-get.value(card);
							}
						}
						if(player.countCards('h')>player.hp) return 10-get.value(card);
						if(player.countCards('h')>2) return 6-get.value(card);
						return -1;
					}
					return 10-get.value(card);
				},
				content:function(){
					target.gain(cards,player);
					if(typeof player.storage.gzrende!='number'){
						player.storage.gzrende=0;
					}
					if(player.storage.gzrende>=0){
						player.storage.gzrende+=cards.length;
						if(player.storage.gzrende>=3){
							player.recover();
							player.storage.gzrende=-1;
						}
					}
				},
				ai:{
					order:function(skill,player){
						if(player.hp==player.maxHp||player.storage.gzrende<0||player.countCards('h')+player.storage.gzrende<=2){
							return 1;
						}
						return 10;
					},
					result:{
						target:function(player,target){
							if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
								return -10;
							}
							if(target.hasJudge('lebu')) return 0;
							var nh=target.countCards('h');
							var np=player.countCards('h');
							if(player.hp==player.maxHp||player.storage.gzrende<0||player.countCards('h')+player.storage.gzrende<=2){
								if(nh>=np-1&&np<=player.hp&&!target.hasSkill('haoshi')) return 0;
							}
							return Math.max(1,5-nh);
						}
					},
					effect:{
						target:function(card,player,target){
							if(player==target&&get.type(card)=='equip'){
								if(player.countCards('e',{subtype:get.subtype(card)})){
									var players=game.filterPlayer();
									for(var i=0;i<players.length;i++){
										if(players[i]!=player&&get.attitude(player,players[i])>0){
											return 0;
										}
									}
								}
							}
						}
					},
					threaten:0.8
				}
			},
			gzrende1:{
				trigger:{player:'phaseUseBegin'},
				silent:true,
				content:function(){
					player.storage.gzrende=0;
				}
			},
			gzzhiheng:{
				inherit:'zhiheng',
				audio:'zhiheng',
				selectCard:function(){
					var player=_status.event.player;
					var range1=[1,player.maxHp];
					if(player.hasSkill('dinglanyemingzhu_skill')){
						for(var i=0;i<ui.selected.cards.length;i++){
							if(ui.selected.cards[i]==player.getEquip(5)) return range1;
						}
						return [1,Infinity]
					}
					return range1;
				},
				filterCard:function(card,player){
					if(ui.selected.cards.length<player.maxHp||!player.hasSkill('dinglanyemingzhu_skill')) return true;
					return card!=player.getEquip(5);
				},
				complexCard:true,
				complexSelect:true,
				prompt:function(){
					var player=_status.event.player;
					if(player.hasSkill('dinglanyemingzhu_skill')) return '出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌';
					return '出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌';
				}
			},
			duoshi:{
				enable:'chooseToUse',
				viewAs:{name:'yiyi'},
				usable:4,
				filterCard:{color:'red'},
				position:'hs',
				viewAsFilter:function(player){
					return player.countCards('hs',{color:'red'})>0;
				},
				check:function(card){
					return 5-get.value(card);
				}
			},
			gzxiaoguo:{
				inherit:'xiaoguo',
				audio:'xiaoguo',
				preHidden:true,
				content:function(){
					"step 0"
					var nono=(Math.abs(get.attitude(player,trigger.player))<3);
					if(get.damageEffect(trigger.player,player,player)<=0){
						nono=true;
					}
					var next=player.chooseToDiscard(get.prompt2('gzxiaoguo',trigger.player),{type:'basic'});
					next.set('ai',function(card){
						if(_status.event.nono) return 0;
						return 8-get.useful(card);
					});
					next.set('logSkill',['gzxiaoguo',trigger.player]);
					next.set('nono',nono);
					next.setHiddenSkill('gzxiaoguo');
					"step 1"
					if(result.bool){
						var nono=(get.damageEffect(trigger.player,player,trigger.player)>=0);
						trigger.player.chooseToDiscard('弃置一张装备牌，或受到一点伤害','he',{type:'equip'}).set('ai',function(card){
							if(_status.event.nono){
								return 0;
							}
							if(_status.event.player.hp==1) return 10-get.value(card);
							return 9-get.value(card);
						}).set('nono',nono);
					}
					else{
						event.finish();
					}
					"step 2"
					if(!result.bool){
						trigger.player.damage();
					}
				},
			},
			_mingzhi1:{
				trigger:{player:'phaseBeginStart'},
				priority:19,
				forced:true,
				popup:false,
				filter:function(event,player){
					return player.isUnseen(2)&&!player.hasSkillTag('nomingzhi',false,null,true);
				},
				content:function(){
					'step 0'
					if(player.phaseNumber==1&&player.isUnseen(0)&&(_status.connectMode?lib.configOL.junzhu:get.config('junzhu'))){
						var name=player.name1;
						if(name.indexOf('gz_')!=0||!lib.junList.contains(name.slice(3))){
							event.goto(3);
						}
						else{
							event.junzhu_name='gz_jun_'+name.slice(3);
							player.chooseBool('是否将主武将牌替换为“'+get.translation(event.junzhu_name)+'”？');
						}
					}
					else event.goto(3);
					'step 1'
					if(result.bool){
						var to=event.junzhu_name;
						event.maxHp=player.maxHp;
						player.reinit(player.name1,to,4);
						if(lib.skill[to]) game.trySkillAudio(to,player);
						player.showCharacter(0);
						var group=lib.character[to][1];
						var yelist=game.filterPlayer(function(current){
							if(current.identity!='ye') return false;
							if(current==player) return true;
							return current.group==group;
						});
						if(yelist.length>0){
							player.line(yelist,'green');
							game.log(yelist,'失去了野心家身份');
							game.broadcastAll(function(list,group){
								for(var i=0;i<list.length;i++){
									list[i].identity=group;
									list[i].group=group;
									list[i].setIdentity();
								}
							},yelist,player.group);
						}
						game.tryResult();
					}
					else event.goto(3);
					'step 2'
					if(player.maxHp>event.maxHp) player.recover(player.maxHp-event.maxHp);
					'step 3'
					var choice=1;
					for(var i=0;i<player.hiddenSkills.length;i++){
						if(lib.skill[player.hiddenSkills[i]].ai){
							var mingzhi=lib.skill[player.hiddenSkills[i]].ai.mingzhi;
							if(mingzhi==false){
								choice=0;break;
							}
							if(typeof mingzhi=='function'&&mingzhi(trigger,player)==false){
								choice=0;break;
							}
						}
					}
					if(player.isUnseen()){
						var group=lib.character[player.name1][1];
						player.chooseControl('bumingzhi','明置'+get.translation(player.name1),
							'明置'+get.translation(player.name2),'tongshimingzhi',true).ai=function(event,player){
							if(player.hasSkillTag('mingzhi_yes')) return get.rand(1,2);
							if(player.hasSkillTag('mingzhi_no')) return 0;
							var popu=get.population(lib.character[player.name1][1])
							if(popu>=2||(popu==1&&game.players.length<=4)){
								return Math.random()<0.5?3:(Math.random()<0.5?2:1);
							}
							if(choice==0) return 0;
							if(get.population(group)>0&&player.wontYe()){
								return Math.random()<0.2?(Math.random()<0.5?3:(Math.random()<0.5?2:1)):0;
							}
							var nming=0;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i]!=player&&game.players[i].identity!='unknown'){
									nming++;
								}
							}
							if(nming==game.players.length-1) return Math.random()<0.5?(Math.random()<0.5?3:(Math.random()<0.5?2:1)):0;
							return (Math.random()<0.1*nming/game.players.length)?(Math.random()<0.5?3:(Math.random()<0.5?2:1)):0;
						};
					}
					else{
						if(Math.random()<0.5) choice=0;
						if(player.isUnseen(0)){
							player.chooseControl('bumingzhi','明置'+get.translation(player.name1),true).choice=choice;
						}
						else if(player.isUnseen(1)){
							player.chooseControl('bumingzhi','明置'+get.translation(player.name2),true).choice=choice;
						}
						else{
							event.finish();
						}
					}
					'step 4'
					switch(result.control){
						case '明置'+get.translation(player.name1):player.showCharacter(0);break;
						case '明置'+get.translation(player.name2):player.showCharacter(1);break;
						case 'tongshimingzhi':player.showCharacter(2);break;
					}
				}
			},
			_mingzhi2:{
				trigger:{player:'triggerHidden'},
				forced:true,
				forceDie:true,
				popup:false,
				priority:10,
				content:function(){
					"step 0"
					if(get.info(trigger.skill).silent){
						event.finish();
					}
					else{
						event.skillHidden=true;
						var bool1=(game.expandSkills(lib.character[player.name1][3]).contains(trigger.skill));
						var bool2=(game.expandSkills(lib.character[player.name2][3]).contains(trigger.skill));
						var nai=function(){
							var player=_status.event.player;
							if(!_status.event.yes) return false;
							if(player.hasSkillTag('mingzhi_no')) return false;
							if(player.hasSkillTag('mingzhi_yes')) return true;
							if(player.identity!='unknown') return true;
							if(Math.random()<0.5) return true;
							var info=get.info(_status.event.hsskill);
							if(info&&info.ai&&info.ai.mingzhi==true) return true;
							if(info&&info.ai&&info.ai.maixie) return true;
							var group=lib.character[player.name1][1];
							var popu=get.population(lib.character[player.name1][1])
							if(popu>=2||(popu==1&&game.players.length<=4)){
								return true;
							}
							if(get.population(group)>0&&player.wontYe()){
								return Math.random()<0.2?true:false;
							}
							var nming=0;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i]!=player&&game.players[i].identity!='unknown'){
									nming++;
								}
							}
							if(nming==game.players.length-1) return Math.random()<0.5?true:false;
							return (Math.random()<0.1*nming/game.players.length)?true:false;
						}
						if(bool1&&bool2){
							event.name=player.name1;
							event.name2=player.name2;
						}
						else{
							event.name=bool1?player.name1:player.name2;
						}
						var info=get.info(trigger.skill);
						var next=player.chooseBool('是否明置'+get.translation(event.name)+'以发动【'+get.translation(trigger.skill)+'】？');
						next.set('yes',!info.check||info.check(trigger._trigger,player));
						next.set('hsskill',trigger.skill);
						next.set('ai',nai);
					}
					"step 1"
					if(result.bool){
						if(event.name==player.name1) player.showCharacter(0);
						else player.showCharacter(1);
						trigger.revealed=true;
						event.finish();
					}
					else if(event.name2){
						var info=get.info(trigger.skill);
						var next=player.chooseBool('是否明置'+get.translation(event.name2)+'以发动【'+get.translation(trigger.skill)+'】？');
						next.set('yes',!info.check||info.check(trigger._trigger,player));
						next.set('ai',function(){
							return _status.event.yes;
						});
					}
					else{
						event.finish();
						trigger.untrigger();
						trigger.cancelled=true;
					}
					"step 2"
					if(event.name2){
						if(result.bool){
							player.showCharacter(1);
							trigger.revealed=true;
						}
						else{
							trigger.untrigger();
							trigger.cancelled=true;
						}
					}
				}
			},
			gz_jun_liubei:{audio:true},
			gz_jun_caocao:{audio:true},
			gz_jun_sunquan:{audio:true},
			gz_jun_zhangjiao:{audio:true},
			_zhenfazhaohuan:{
				enable:'phaseUse',
				usable:1,
				getConfig:function(player,target){
					if(target==player||!target.isUnseen()) return false;
					var config={};
					var skills=player.getSkills();
					for(var i=0;i<skills.length;i++){
						var info=get.info(skills[i]).zhenfa;
						if(info){
							config[info]=true;
						}
					}
					if(config.inline){
						var next=target.getNext();
						var previous=target.getPrevious();
						if(next==player||previous==player||next&&next.inline(player)||previous&&previous.inline(player)) return true;
					}
					if(config.siege){
						if(target==player.getNext().getNext()||target==player.getPrevious().getPrevious()) return true;
					}
					return false;
				},
				filter:function(event,player){
					if(player.identity=='ye'||player.identity=='unknown'||!player.wontYe(player.identity)) return false;
					if(player.hasSkill('undist')) return false;
					if(game.countPlayer(function(current){
						return !current.hasSkill('undist');
					})<4) return false;
					return game.hasPlayer(function(current){
						return lib.skill._zhenfazhaohuan.getConfig(player,current);
					});
				},
				content:function(){
					'step 0'
					event.list=game.filterPlayer(function(current){
						return current.isUnseen();
					}).sortBySeat();
					'step 1'
					var target=event.list.shift();
					event.target=target;
					if(target.wontYe(player.identity)&&lib.skill._zhenfazhaohuan.getConfig(player,target)){
						player.line(target,'green');
						var list=[];
						if(target.getGuozhanGroup(0)==player.identity) list.push('明置'+get.translation(target.name1));
						if(target.getGuozhanGroup(1)==player.identity) list.push('明置'+get.translation(target.name2));
						if(list.length>0){
							target.chooseControl(list,'cancel2').set('prompt','是否响应'+get.translation(player)+'发起的阵法召唤？').set('ai',function(){
								return Math.random()<0.5?0:1;
							});
						}
						else event.goto(3);
					}
					else event.goto(3);
					'step 2'
					if(result.control!='cancel2'){
						if(result.control=='明置'+get.translation(target.name1)){
							target.showCharacter(0);
						}
						else{
							target.showCharacter(1);
						}
					}
					'step 3'
					if(event.list.length) event.goto(1);
					'step 4'
					game.delay();
				},
				ai:{
					order:5,
					result:{
						player:1
					}
				}
			},
			ushio_huanxin:{
				trigger:{
					player:['damageEnd','useCardAfter'],
					source:'damageSource',
				},
				frequent:true,
				preHidden:true,
				filter:function(event,player,name){
					if(name=='useCardAfter') return get.type(event.card)=='equip';
					if(name=='damageEnd') return true;
					return event.getParent().name=='sha';
				},
				content:function(){
					player.judge().set('callback',function(){
						var card=event.judgeResult.card;
						if(card&&get.position(card,true)=='o'){
							player.gain(card,'gain2');
							player.chooseToDiscard(true,'he');
						}
					});
				},
			},
			ushio_xilv:{
				trigger:{player:'judgeEnd'},
				forced:true,
				preHidden:true,
				content:function(){
					player.addTempSkill('ushio_xilv2',{player:'phaseJieshu'});
					player.addMark('ushio_xilv2',1,false);
				},
			},
			ushio_xilv2:{
				onremove:true,
				charlotte:true,
				mod:{
					maxHandcard:function(player,num){
						return num+player.countMark('ushio_xilv2');
					}
				},
				intro:{
					content:'手牌上限+#',
				},
			},
		},
		game:{
			showYexings:function(){
				if(_status.showYexings) return;
				_status.showYexings=true;
				var next=game.createEvent('showYexings',false);
				next.setContent(function(){
					'step 0'
					event.targets=game.filterPlayer(function(current){
						return lib.character[current.name1][1]=='ye';
					}).sortBySeat(_status.currentPhase);
					event.targets2=[];
					'step 1'
					var target=targets.shift();
					event.target=target;
					target.chooseBool('是否【暴露野心】，展示主将并继续战斗？','若选择“否”，则视为本局游戏失败');
					'step 2'
					if(result.bool){
						event.targets2.push(target);
						target.$fullscreenpop('暴露野心','thunder');
						game.log(target,'暴露了野心');
						target.showCharacter(0);
						game.delay(2);
						if(targets.length) event.goto(1);
						else if(game.players.length<3){
							delete _status.showYexings;
							event.finish();
						}
					}
					else{
						if(targets.length) event.goto(1);
						else{
							var winner=game.findPlayer(function(current){
								return lib.character[current.name1][1]!='ye';
							});
							if(winner){
								game.broadcastAll(function(id){
									game.winner_id=id;
								},winner.playerid);
								game.checkResult();
							}
							delete _status.showYexings;
							event.finish();
						}
					}
					'step 3'
					var source=event.targets2.shift();
					event.source=source;
					var targets=game.filterPlayer(function(current){
						return current.identity!='ye'&&current!=source&&!get.is.jun(current)&&!event.targets2.contains(current)&&!current.storage.yexinjia_friend;
					}).sortBySeat(source);
					if(!targets.length){
						delete _status.showYexings;
						event.finish();
					}
					else{
						event.targets=targets;
						source.chooseBool('是否发起【拉拢人心】？','令所有其他不为君主/暴露野心家的角色依次选择是否与你结盟。第一个选择加入的人将势力和胜利条件改为与你相同');
					}
					'step 4'
					if(!result.bool){
						if(event.targets2.length) event.goto(3);
						return;
					}
					'step 5'
					var target=targets.shift();
					event.target=target;
					source.line(target,'green');
					target.chooseBool('是否响应'+get.translation(source)+'发起的【拉拢人心】？','将势力改为野心家，且视为和该角色阵营相同').set('ai',function(){
						if(game.players.length<4) return true;
						if(game.players.length<5) return Math.random()<0.5;
						return Math.random()<0.3;
					});
					'step 6'
					if(result.bool){
						target.chat('加入');
						if(!_status.yexinjia_list) _status.yexinjia_list=['夏','商','周','秦','汉','隋','唐','宋','辽','金','元','明'];
						source.chooseControl(_status.yexinjia_list).set('prompt','请选择自己所属的野心家势力的标识').set('ai',()=>(_status.yexinjia_list?_status.yexinjia_list.randomGet():0));
					}
					else{
						target.chat('拒绝');
						game.delay(1.5);
						if(targets.length) event.goto(5);
						else event.goto(8);
					}
					'step 7'
					game.broadcastAll(function(player,target,text){
						player.identity='ye';
						source.setIdentity(text,'ye');
						player.setIdentity(text,'ye');
						player.storage.yexinjia_friend=target;
					},target,source,result.control);
					_status.yexinjia_list.remove(result.control);
					target.markSkill('yexinjia_friend');
					source.removeMark('yexinjia_mark',1);
					target.drawTo(4);
					target.recover();
					'step 8'
					if(event.targets2.length) event.goto(3);
					else delete _status.showYexings;
				});
			},
			getCharacterChoice:function(list,num){
				var choice=list.splice(0,num).sort(function(a,b){
					return (get.is.double(a)?1:-1)-(get.is.double(b)?1:-1);
				});
				var map={wei:[],shu:[],wu:[],qun:[],key:[],jin:[],ye:[]};
				for(var i=0;i<choice.length;i++){
					if(get.is.double(choice[i])){
						var group=get.is.double(choice[i],true);
						for(var ii of group){
							if(map[ii]&&map[ii].length){
								map[ii].push(choice[i]);
								lib.character[choice[i]][1]=ii;
								group=false;
								break;
							}
						}
						if(group) choice.splice(i--,1);
					}
					else{
						var group=lib.character[choice[i]][1];
						if(map[group]){
							map[group].push(choice[i]);
						}
					}
				}
				if(map.ye.length){
					for(var i in map){
						if(i!='ye'&&map[i].length) return choice.randomSort();
					}
					choice.remove(map.ye[0]);
					map.ye.remove(map.ye[0]);
					for(var i=0;i<list.length;i++){
						if(lib.character[list[i]][1]!='ye'){
							choice.push(list[i]);
							list.splice(i--,1);
							return choice.randomSort();
						}
					}
				}
				for(var i in map){
					if(map[i].length<2){
						if(map[i].length==1){
							choice.remove(map[i][0]);
							list.push(map[i][0]);
						}
						map[i]=false;
					}
				}
				if(choice.length==num-1){
					for(var i=0;i<list.length;i++){
						if(map[lib.character[list[i]][1]]){
							choice.push(list[i]);
							list.splice(i--,1);
							break;
						}
					}
				}
				else if(choice.length<num-1){
					var group=null;
					for(var i=0;i<list.length;i++){
						if(group){
							if(lib.character[list[i]][1]==group||lib.character[list[i]][1]=='ye'){
								choice.push(list[i]);
								list.splice(i--,1);
								if(choice.length>=num){
									break;
								}
							}
						}
						else{
							if(!map[lib.character[list[i]][1]]&&!get.is.double(list[i])){
								group=lib.character[list[i]][1];
								if(group=='ye') group=null;
								choice.push(list[i]);
								list.splice(i--,1);
								if(choice.length>=num){
									break;
								}
							}
						}
					}
				}
				return choice.randomSort();
			},
			getState:function(){
				var state={};
				for(var i in lib.playerOL){
					var player=lib.playerOL[i];
					state[i]={
						identity:player.identity,
						//group:player.group,
						shown:player.ai.shown,
					};
				}
				return state;
			},
			updateState:function(state){
				for(var i in state){
					var player=lib.playerOL[i];
					if(player){
						player.identity=state[i].identity;
						//player.group=state[i].group;
						player.ai.shown=state[i].shown;
					}
				}
			},
			getRoomInfo:function(uiintro){
				var num,last;
				if(lib.configOL.initshow_draw=='off'){
					num='关闭'
				}
				else{
					num={mark:'标记',draw:'摸牌'}[lib.configOL.initshow_draw];
				}
				uiintro.add('<div class="text chat">首亮奖励：'+num);
				uiintro.add('<div class="text chat">珠联璧合：'+(lib.configOL.zhulian?'开启':'关闭'));
				uiintro.add('<div class="text chat">出牌时限：'+lib.configOL.choose_timeout+'秒');
				uiintro.add('<div class="text chat">国战牌堆：'+(lib.configOL.guozhanpile?'开启':'关闭'));
				uiintro.add('<div class="text chat">鏖战模式：'+(lib.configOL.aozhan?'开启':'关闭'));
				last=uiintro.add('<div class="text chat">观看下家副将：'+(lib.configOL.viewnext?'开启':'关闭'));
				last.style.paddingBottom='8px';
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					var data=lib.config.gameRecord.guozhan.data;
					var identity=game.me.identity;
					if(!data[identity]){
						data[identity]=[0,0];
					}
					if(bool){
						data[identity][0]++;
					}
					else{
						data[identity][1]++;
					}
					var list=lib.group.slice(0);
					list.add('ye');
					var str='';
					for(var i=0;i<list.length;i++){
						if(list[i]!='shen'&&data[list[i]]){
							str+=lib.translate[list[i]+'2']+'：'+data[list[i]][0]+'胜'+' '+data[list[i]][1]+'负<br>';
						}
					}
					lib.config.gameRecord.guozhan.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
			getIdentityList:function(player){
				if(!player.isUnseen()) return;
				if(player==game.me) return;
				var list={
					wei:'魏',
					shu:'蜀',
					wu:'吴',
					qun:'群',
					ye:'野',
					unknown:'猜'
				}
				var num=Math.floor((game.players.length+game.dead.length)/2);
				var noye=true;
				if(get.population('wei')>=num){
					delete list.wei;
					noye=false;
				}
				if(get.population('shu')>=num){
					delete list.shu;
					noye=false;
				}
				if(get.population('wu')>=num){
					delete list.wu;
					noye=false;
				}
				if(get.population('qun')>=num){
					delete list.qun;
					noye=false;
				}
				if(noye){
					delete list.ye;
				}
				return list;
			},
			getIdentityList2:function(list){
				for(var i in list){
					switch(i){
						case 'unknown':list[i]='未知';break;
						case 'ye':list[i]='野心家';break;
						case 'qun':list[i]+='雄';break;
						case 'key':list[i]='Key';break;
						case 'jin':list[i]+='朝';break;
						default:list[i]+='国';
					}
				}
			},
			getVideoName:function(){
				var str=get.translation(game.me.name1)+'/'+get.translation(game.me.name2);
				var str2=get.cnNumber(parseInt(get.config('player_number')))+'人'+
					get.translation(lib.config.mode);
				if(game.me.identity=='ye'){
					str2+=' - 野心家';
				}
				var name=[str,str2];
				return name;
			},
			showIdentity:function(started){
				if(game.phaseNumber==0&&!started) return;
				for(var i=0;i<game.players.length;i++){
					game.players[i].showCharacter(2,false);
				}
			},
			tryResult:function(){
				var map={},sides=[],pmap=_status.connectMode?lib.playerOL:game.playerMap,hiddens=[];
				for(var i of game.players){
					if(i.identity=='unknown'){
						hiddens.push(i);
						continue;
					}
					var added=false;
					for(var j of sides){
						if(i.isFriendOf(pmap[j])){
							added=true;
							map[j].push(i);
							break;
						}
					}
					if(!added){
						map[i.playerid]=[i];
						sides.push(i.playerid);
					}
				}
				if(!sides.length) return;
				else if(sides.length>1){
					if(!hiddens.length&&sides.length==2){
						if(map[sides[0]].length==1&&!map[sides[1]].filter(function(i){
							return i.identity!='ye'&&i.isUnseen(0);
						}).length) map[sides[0]][0].showGiveup();
						if(map[sides[1]].length==1&&!map[sides[0]].filter(function(i){
							return i.identity!='ye'&&i.isUnseen(0);
						}).length) map[sides[1]][0].showGiveup();
					}
				}
				else{
					var isYe=function(player){
						return player.identity!='ye'&&lib.character[player.name1][1]=='ye';
					}
					if(!hiddens.length){
						if(map[sides[0]].length>1){
							for(var i of map[sides[0]]){
								if(isYe(i)){
									game.showYexings();
									return;
								}
							}
						}
						game.broadcastAll(function(id){
							game.winner_id=id;
						},sides[0]);
						game.checkResult();
					}
					else{
						var identity=map[sides[0]][0].identity;
						if(identity=='ye') return;
						for(var i of map[sides[0]]){
							if(isYe(i)) return;
						}
						for(var i of hiddens){
							if(isYe(i)||i.getGuozhanGroup(2)!=identity||!i.wontYe()) return;
						}
						game.broadcastAll(function(id){
							game.winner_id=id;
						},sides[0]);
						game.checkResult();
					}
				}
			},
			checkResult:function(){
				_status.overing=true;
				var me=game.me._trueMe||game.me;
				for(var i=0;i<game.players.length;i++){
					game.players[i].showCharacter(2);
				}
				var winner=(_status.connectMode?lib.playerOL:game.playerMap)[game.winner_id];
				game.over(winner&&winner.isFriendOf(me)?true:false);
				game.showIdentity();
			},
			checkOnlineResult:function(player){
				var winner=lib.playerOL[game.winner_id];
				return winner&&winner.isFriendOf(game.me);
			},
			chooseCharacter:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.addPlayer=true;
				next.ai=function(player,list,back){
					if(_status.brawl&&_status.brawl.chooseCharacterAi){
						if(_status.brawl.chooseCharacterAi(player,list,back)!==false){
							return;
						}
					}
					var filterChoice=function(name1,name2){
						if(get.is.double(name1)) return false;
						var group1=lib.character[name1][1];
						var group2=lib.character[name2][1];
						if(group1=='ye') return group2!='ye';
						var double=get.is.double(name2,true);
						if(double) return double.contains(group1);
						return group1==group2;
					};
					for(var i=0;i<list.length-1;i++){
						for(var j=i+1;j<list.length;j++){
							if(filterChoice(list[i],list[j])||filterChoice(list[j],list[i])){
								var mainx=list[i];
								var vicex=list[j];
								if(!filterChoice(mainx,vicex)||(filterChoice(vicex,mainx)&&get.guozhanReverse(mainx,vicex))){
									mainx=list[j];
									vicex=list[i];
								}
								player.init(mainx,vicex,false);
								if(back){
									list.remove(player.name1);
									list.remove(player.name2);
									for(var i=0;i<list.length;i++){
										back.push(list[i]);
									}
								}
								return;
							}
						}
					}
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var addSetting=function(dialog){
						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('table');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=1;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML='<span>'+get.cnNumber(i,true)+'</span>';
							td.link=i-1;
							seats.appendChild(td);
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(_status.cheat_seat){
									_status.cheat_seat.classList.remove('bluebg');
									if(_status.cheat_seat==this){
										delete _status.cheat_seat;
										return;
									}
								}
								this.classList.add('bluebg');
								_status.cheat_seat=this;
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;

					var chosen=lib.config.continue_name||[];
					game.saveConfig('continue_name');
					event.chosen=chosen;

					var i;
					event.list=[];
					for(i in lib.character){
						if(i.indexOf('gz_shibing')==0) continue;
						if(chosen.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						if(get.config('onlyguozhan')){
							if(!lib.characterPack.mode_guozhan[i]) continue;
							if(get.is.jun(i)) continue;
						}
						if(lib.character[i][4].contains('hiddenSkill')) continue;
						if(lib.character[i][2]==3||lib.character[i][2]==4||lib.character[i][2]==5)
						event.list.push(i);
					}
					_status.characterlist=event.list.slice(0);
					_status.yeidentity=[];
					if(_status.brawl&&_status.brawl.chooseCharacterFilter){
						event.list=_status.brawl.chooseCharacterFilter(event.list);
					}
					event.list.randomSort();
					// var list=event.list.splice(0,parseInt(get.config('choice_num')));
					var list;
					if(_status.brawl&&_status.brawl.chooseCharacter){
						list=_status.brawl.chooseCharacter(event.list,game.me);
					}
					else{
						list=game.getCharacterChoice(event.list,parseInt(get.config('choice_num')));
					}
					if(_status.auto){
						event.ai(game.me,list);
						lib.init.onfree();
					}
					else if(chosen.length){
						game.me.init(chosen[0],chosen[1],false);
						lib.init.onfree();
					}
					else{
						var dialog=ui.create.dialog('选择角色','hidden',[list,'character']);
						if(!_status.brawl||!_status.brawl.noAddSetting){
							if(get.config('change_identity')){
								addSetting(dialog);
							}
						}
						var next=game.me.chooseButton(dialog,true,2).set('onfree',true);
						next.filterButton=function(button){
							if(ui.dialog.buttons.length<=10){
								for(var i=0;i<ui.dialog.buttons.length;i++){
									if(ui.dialog.buttons[i]!=button){
										if(lib.element.player.perfectPair.call({
											name1:button.link,
											name2:ui.dialog.buttons[i].link,
										},true)){
											button.classList.add('glow2');
										}
									}
								}
							}
							if(lib.character[button.link][4].contains('hiddenSkill')) return false;
							if(ui.selected.buttons.length==0){
								if(get.is.double(button.link)) return false;
								if(lib.character[button.link][1]=='ye') return true;
								for(var i=0;i<ui.dialog.buttons.length;i++){
									var double=get.is.double(ui.dialog.buttons[i].link,true);
									if(ui.dialog.buttons[i]!=button&&(lib.character[button.link][1]==lib.character[ui.dialog.buttons[i].link][1]||double&&double.contains(lib.character[button.link][1]))){
										return true;
									}
								}
								return false;
							};
							if(!lib.character[button.link]||lib.character[button.link][1]=='ye') return false;
							if(get.is.double(ui.selected.buttons[0].link)) return false;
							if(lib.character[ui.selected.buttons[0].link][1]=='ye') return true;
							if(get.is.double(button.link)) return get.is.double(button.link,true).contains(lib.character[ui.selected.buttons[0].link][1]);
							return (lib.character[button.link][1]==lib.character[ui.selected.buttons[0].link][1]);
						};
						next.switchToAuto=function(){
							event.ai(game.me,list);
							ui.arena.classList.remove('selecting');
						};
						var createCharacterDialog=function(){
							event.dialogxx=ui.create.characterDialog('heightset',function(i){
								if(i.indexOf('gz_shibing')==0) return true;
								if(get.config('onlyguozhan')){
									if(!lib.characterPack.mode_guozhan[i]) return true;
									if(get.is.jun(i)) return true;
								}
							},get.config('onlyguozhanexpand')?'expandall':undefined,get.config('onlyguozhan')?'onlypack:mode_guozhan':undefined);
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						};
						if(lib.onfree){
							lib.onfree.push(createCharacterDialog);
						}
						else{
							createCharacterDialog();
						}
						ui.create.cheat2=function(){
							ui.cheat2=ui.create.control('自由选将',function(){
								if(this.dialog==_status.event.dialog){
									if(game.changeCoin){
										game.changeCoin(50);
									}
									this.dialog.close();
									_status.event.dialog=this.backup;
									this.backup.open();
									delete this.backup;
									game.uncheck();
									game.check();
									if(ui.cheat){
										ui.cheat.animate('controlpressdownx',500);
										ui.cheat.classList.remove('disabled');
									}
								}
								else{
									if(game.changeCoin){
										game.changeCoin(-10);
									}
									this.backup=_status.event.dialog;
									_status.event.dialog.close();
									_status.event.dialog=_status.event.parent.dialogxx;
									this.dialog=_status.event.dialog;
									this.dialog.open();
									game.uncheck();
									game.check();
									if(ui.cheat){
										ui.cheat.classList.add('disabled');
									}
								}
							});
							if(lib.onfree){
								ui.cheat2.classList.add('disabled');
							}
						}
						ui.create.cheat=function(){
							_status.createControl=ui.cheat2;
							ui.cheat=ui.create.control('更换',function(){
								if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
									return;
								}
								if(game.changeCoin){
									game.changeCoin(-3);
								}
								event.list=event.list.concat(list);
								event.list.randomSort();
								// list=event.list.splice(0,parseInt(get.config('choice_num')));
								list=game.getCharacterChoice(event.list,parseInt(get.config('choice_num')));
								var buttons=ui.create.div('.buttons');
								var node=_status.event.dialog.buttons[0].parentNode;
								_status.event.dialog.buttons=ui.create.buttons(list,'character',buttons);
								_status.event.dialog.content.insertBefore(buttons,node);
								buttons.animate('start');
								node.remove();
								game.uncheck();
								game.check();
							});
							delete _status.createControl;
						}
						if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
							if(!ui.cheat&&get.config('change_choice'))
							ui.create.cheat();
							if(!ui.cheat2&&get.config('free_choose'))
							ui.create.cheat2();
						}
					}
					"step 1"
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					if(result.buttons){
						game.me.init(result.buttons[0].link,result.buttons[1].link,false);
						game.addRecentCharacter(result.buttons[0].link,result.buttons[1].link);
					}
					// game.me.setIdentity(game.me.group);
					event.list.remove(game.me.name1);
					event.list.remove(game.me.name2);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							event.ai(game.players[i],game.getCharacterChoice(event.list,parseInt(get.config('choice_num'))),event.list);
						}
					}
					for(var i=0;i<game.players.length;i++){
						game.players[i].classList.add('unseen');
						game.players[i].classList.add('unseen2');
						_status.characterlist.remove(game.players[i].name);
						_status.characterlist.remove(game.players[i].name2);
						if(game.players[i]!=game.me){
							game.players[i].node.identity.firstChild.innerHTML='猜';
							game.players[i].node.identity.dataset.color='unknown';
							game.players[i].node.identity.classList.add('guessing');
						}
						game.players[i].hiddenSkills=lib.character[game.players[i].name1][3].slice(0);
						var hiddenSkills2=lib.character[game.players[i].name2][3];
						for(var j=0;j<hiddenSkills2.length;j++){
							game.players[i].hiddenSkills.add(hiddenSkills2[j]);
						}
						for(var j=0;j<game.players[i].hiddenSkills.length;j++){
							if(!lib.skill[game.players[i].hiddenSkills[j]]){
								game.players[i].hiddenSkills.splice(j--,1);
							}
						}
						game.players[i].group='unknown';
						game.players[i].sex='unknown';
						game.players[i].name1=game.players[i].name;
						game.players[i].name='unknown';
						game.players[i].identity='unknown';
						game.players[i].node.name.show();
						game.players[i].node.name2.show();
						for(var j=0;j<game.players[i].hiddenSkills.length;j++){
							game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j],true);
						}
					}
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
			chooseCharacterOL:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					'step 0'
					game.broadcastAll(function(){
						ui.arena.classList.add('choose-character');
					});
					var list=[];
					//if(lib.configOL.onlyguozhan){
						//list=[];
						for(var i in lib.characterPack.mode_guozhan){
							if(i.indexOf('gz_shibing')==0) continue;
							if(get.is.jun(i)) continue;
							if(lib.config.guozhan_banned&&lib.config.guozhan_banned.contains(i)) continue;
							list.push(i);
						}
					//}
					//else{
					//	list=get.charactersOL(function(i){
					//		return lib.character[i][4].contains('hiddenSkill');
					//	});
					//}
					_status.characterlist=list.slice(0);
					_status.yeidentity=[];
					event.list=list.slice(0);
					var list2=[];
					var num;
					if(lib.configOL.number*6>list.length){
						num=5;
					}
					else if(lib.configOL.number*7>list.length){
						num=6;
					}
					else{
						num=7;
					}
					var filterButton=function(button){
						if(ui.dialog){
							if(ui.dialog.buttons.length<=10){
								for(var i=0;i<ui.dialog.buttons.length;i++){
									if(ui.dialog.buttons[i]!=button){
										if(lib.element.player.perfectPair.call({
											name1:button.link,name2:ui.dialog.buttons[i].link
										},true)){
											button.classList.add('glow2');
										}
									}
								}
							}
						}
						if(ui.selected.buttons.length==0){
							if(get.is.double(button.link)) return false;
							if(lib.character[button.link][1]=='ye') return true;
							for(var i=0;i<ui.dialog.buttons.length;i++){
								var double=get.is.double(ui.dialog.buttons[i].link,true);
								if(ui.dialog.buttons[i]!=button&&(lib.character[button.link][1]==lib.character[ui.dialog.buttons[i].link][1]||double&&double.contains(lib.character[button.link][1]))){
									return true;
								}
							}
							return false;
						};
						if(!lib.character[button.link]||lib.character[button.link][1]=='ye') return false;
						if(lib.character[ui.selected.buttons[0].link][1]=='ye') return true;
						if(get.is.double(ui.selected.buttons[0].link)) return false;
						if(get.is.double(button.link)) return get.is.double(button.link,true).contains(lib.character[ui.selected.buttons[0].link][1]);
						return (lib.character[button.link][1]==lib.character[ui.selected.buttons[0].link][1]);
					};
					list.randomSort();
					for(var i=0;i<game.players.length;i++){
						list2.push([game.players[i],['选择角色',[game.getCharacterChoice(list,num),'character']],2,
						true,function(){return Math.random()},filterButton]);
					}
					game.me.chooseButtonOL(list2,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0],result.links[1],false);
					}).set('switchToAuto',function(){
						_status.event.result='ai';
					}).set('processAI',function(){
						var buttons=_status.event.dialog.buttons;
						var filterChoice=function(name1,name2){
							if(get.is.double(name1)) return false;
							var group1=lib.character[name1][1];
							var group2=lib.character[name2][1];
							if(group1=='ye') return group2!='ye';
							var double=get.is.double(name2,true);
							if(double) return double.contains(group1);
							return group1==group2;
						};
						for(var i=0;i<buttons.length-1;i++){
							for(var j=i+1;j<buttons.length;j++){
								if(filterChoice(buttons[i].link,buttons[j].link)||filterChoice(buttons[j].link,buttons[i].link)){
									var mainx=buttons[i].link;
									var vicex=buttons[j].link;
									if(!filterChoice(mainx,vicex)||(filterChoice(vicex,mainx)&&get.guozhanReverse(mainx,vicex))){
										mainx=buttons[j].link;
										vicex=buttons[i].link;
									}
									var list=[mainx,vicex];
									return {
										bool:true,
										links:list,
									}
								}
							}
						}
					});
					'step 1'
					var sort=true;
					for(var i in result){
						if(result[i]&&result[i].links){
							for(var j=0;j<result[i].links.length;j++){
								event.list.remove(result[i].links[j]);
							}
						}
					}
					for(var i in result){
						if(result[i]=='ai'||!result[i].links||result[i].links.length<1){
							if(sort){
								sort=false;
								event.list.randomSort();
							}
							result[i]=[event.list.shift()];
							var group=lib.character[result[i][0]][1];
							for(var j=0;j<event.list.length;j++){
								if(lib.character[event.list[j]][1]==group){
									result[i].push(event.list[j]);
									event.list.splice(j--,1);
									break;
								}
							}
						}
						else{
							result[i]=result[i].links
						}
						if(!lib.playerOL[i].name){
							lib.playerOL[i].init(result[i][0],result[i][1],false);
						}
					}

					for(var i=0;i<game.players.length;i++){
						_status.characterlist.remove(game.players[i].name);
						_status.characterlist.remove(game.players[i].name2);
						game.players[i].hiddenSkills=lib.character[game.players[i].name1][3].slice(0);
						var hiddenSkills2=lib.character[game.players[i].name2][3];
						for(var j=0;j<hiddenSkills2.length;j++){
							game.players[i].hiddenSkills.add(hiddenSkills2[j]);
						}
						for(var j=0;j<game.players[i].hiddenSkills.length;j++){
							if(!lib.skill[game.players[i].hiddenSkills[j]]){
								game.players[i].hiddenSkills.splice(j--,1);
							}
						}
						for(var j=0;j<game.players[i].hiddenSkills.length;j++){
							game.players[i].name1=game.players[i].name;
							game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j],true);
						}
					}
					game.broadcastAll(function(result){
						for(var i in result){
							if(!lib.playerOL[i].name){
								lib.playerOL[i].init(result[i][0],result[i][1],false);
							}
						}
						for(var i=0;i<game.players.length;i++){
							game.players[i].classList.add('unseen');
							game.players[i].classList.add('unseen2');
							if(game.players[i]!=game.me){
								game.players[i].node.identity.firstChild.innerHTML='猜';
								game.players[i].node.identity.dataset.color='unknown';
								game.players[i].node.identity.classList.add('guessing');
							}
							game.players[i].hiddenSkills=lib.character[game.players[i].name1][3].slice(0);
							var hiddenSkills2=lib.character[game.players[i].name2][3];
							for(var j=0;j<hiddenSkills2.length;j++){
								game.players[i].hiddenSkills.add(hiddenSkills2[j]);
							}
							for(var j=0;j<game.players[i].hiddenSkills.length;j++){
								if(!lib.skill[game.players[i].hiddenSkills[j]]){
									game.players[i].hiddenSkills.splice(j--,1);
								}
							}
							game.players[i].group='unknown';
							game.players[i].sex='unknown';
							game.players[i].name1=game.players[i].name;
							game.players[i].name='unknown';
							game.players[i].identity='unknown';
							game.players[i].node.name.show();
							game.players[i].node.name2.show();
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500);
					},result);
				});
			}
		},
		ui:{
			click:{
				// identity:function(){
				// 	if(this.touched) {this.touched=false;return;}
				// 	_status.clicked=true;
				// 	if(this.parentNode.isUnseen()&&this.parentNode!=game.me){
				// 		switch(this.firstChild.innerHTML){
				// 			case '魏':this.firstChild.innerHTML='蜀';this.dataset.color='shu';break;
				// 			case '蜀':this.firstChild.innerHTML='吴';this.dataset.color='wu';break;
				// 			case '吴':this.firstChild.innerHTML='群';this.dataset.color='qun';break;
				// 			case '群':this.firstChild.innerHTML='野';this.dataset.color='ye';break;
				// 			case '野':this.firstChild.innerHTML='猜';this.dataset.color='unknown';break;
				// 			default:this.firstChild.innerHTML='魏';this.dataset.color='wei';break;
				// 		}
				// 	}
				// }
			}
		},
		dynamicTranslate:{
			gzzhaosong:function(player){
				var storage=player.getStorage('gzzhaosong');
				var list1=['效果①','效果②','效果③'];
				var str='每局游戏每项限一次。';
				var list2=['①一名角色进入濒死状态时，你可以令其回复至2点体力并摸一张牌。','②出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。','③一名角色使用【杀】选择唯一目标后，你可以为此【杀】增加两个目标。'];
				for(var i=0;i<3;i++){
					var bool=storage.contains(list1[i]);
					if(bool) str+='<span style="text-decoration:line-through">';
					str+=list2[i];
					if(bool) str+='</span>';
				}
				return str;
			},
		},
		translate:{
			ye:'野',
			ye2:'野心家',
			yexinjia_mark:'野心家',

			bumingzhi:'不明置',
			mingzhizhujiang:'明置主将',
			mingzhifujiang:'明置副将',
			tongshimingzhi:'同时明置',
			mode_guozhan_character_config:'国战武将',
			_zhenfazhaohuan:'阵法召唤',
			_zhenfazhaohuan_info:'由拥有阵法技的角色发起，满足此阵法技条件的未确定势力角色均可按逆时针顺序依次明置其一张武将牌(响应阵法召唤)，以发挥阵法技的效果。',

			junling:'军令',
			junling1:'军令一',
			junling1_bg:'令',
			junling1_info:'若被执行，执行者对发起者指定的一名角色造成一点伤害。',
			junling2:'军令二',
			junling2_bg:'令',
			junling2_info:'若被执行，执行者摸一张牌，然后依次交给发起者两张牌。',
			junling3:'军令三',
			junling3_bg:'令',
			junling3_info:'若被执行，执行者失去一点体力。',
			junling4:'军令四',
			junling4_bg:'令',
			junling4_info:'若被执行，直到回合结束，执行者不能使用或打出手牌且非锁定技全部失效。',
			junling4_eff:'军令四',
			junling5:'军令五',
			junling5_bg:'令',
			junling5_info:'若被执行，执行者将武将牌叠置，且不能回复体力直到回合结束。',
			junling5_eff:'军令五',
			junling6:'军令六',
			junling6_bg:'令',
			junling6_info:'若被执行，执行者选择一张手牌和一张装备区内牌（若有），然后弃置其余的牌。',

			gz_miheng:'祢衡',
			gzshensu:'神速',
			gzshensu_info:'①判定阶段开始时，你可跳过此阶段和摸牌阶段，视为使用一张【杀】（无距离限制）。②出牌阶段开始时，你可跳过此阶段并弃置一张装备牌，视为使用一张【杀】（无距离限制）。③弃牌开始时，你可跳过此阶段并失去1点体力，视为使用一张【杀】（无距离限制）。',
			gzwushuang:'无双',
			gzwushuang_info:'锁定技。①当你使用【杀】或【决斗】指定目标后/成为【决斗】的目标后，你令此牌需要依次使用或打出两张【闪】或【杀】响应。②当你使用非转化的【决斗】选择目标后，你可为此【决斗】增加两个目标。',
			gzkuangfu:'狂斧',
			gzkuangfu_info:'出牌阶段限一次。当你使用【杀】指定目标后，你可获得目标角色装备区内的一张牌。然后若此【杀】未造成伤害，则你弃置两张手牌。',
			gzliegong:'烈弓',
			gzliegong_info:'①你对手牌数不大于你的角色使用【杀】不受距离关系的限制。②当你使用【杀】指定目标后，若其体力值不小于你，则你可以选择一项：⒈令此【杀】对其的伤害值基数+1。⒉令其不可响应此【杀】。',
			gzhongyan:'红颜',
			gzhongyan_info:'锁定技。①你区域内的黑桃牌和黑桃判定牌的花色视为红桃。②若你的装备区内有红桃牌，则你的手牌上限+1。',
			gztianxiang:'天香',
			gztianxiang_info:'每回合限一次。当你受到伤害时，你可以弃置一张红桃手牌，防止此次伤害并选择一名其他角色，然后你选择一项：1.令其受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）；2.令其失去1点体力，然后获得你弃置的牌。',
			gzluoyi:'裸衣',
			gzluoyi_info:'摸牌阶段结束时，你可弃置一张牌，然后你于本回合内造成渠道为【杀】或【决斗】的伤害+1。',
			gzqiangxi:'强袭',
			gzqiangxi_info:'出牌阶段限一次，你可以弃置一张武器牌或失去1点体力，然后对一名其他角色造成1点伤害。',
			
			gz_sp_duyu:'杜预',
			gzpozhen:'破阵',
			gzpozhen_info:'限定技，其他角色的回合开始时，你可以令其本回合不可使用、打出或重铸手牌；若其处于队列或围攻关系中，你可依次弃置此队列或参与围攻关系的其他角色的一张牌。',
			gzjiancai:'荐才',
			gzjiancai_info:'副将技，此武将牌上单独的阴阳鱼个数-1。与你势力相同的角色即将受到伤害而进入濒死状态时，你可以防止此伤害，若如此做，你须变更副将；与你势力相同的角色变更副将时，其额外获得两张备选武将牌。',
			gzzhuhai:'诛害',
			gzzhuhai_info:'其他角色的结束阶段开始时，若其本回合内造成过伤害，则你可以对其使用一张【杀】（无距离限制）。若其本回合内对与你势力相同的角色造成过伤害，则此【杀】无视防具，且当其抵消此【杀】后，其须弃置一张牌。',
			gzzhuosheng:'擢升',
			gzzhuosheng2:'擢升',
			gzzhuosheng_info:'当一名与你势力相同的角色受到伤害后，你可令其摸一张牌。然后直到其下个结束阶段前，其使用此牌根据类型执行以下效果：1. 基本牌，不计入次数且无距离限制；2. 普通锦囊牌，此牌目标可+1或-1；3. 装备牌，可摸1张牌。',

			gzzhaoxin:'昭心',
			gzzhaoxin_info:'当你受到伤害后，你可展示所有手牌，然后与一名手牌数不大于你的其他角色交换手牌。',
			gzsuzhi:'夙智',
			gzsuzhi_info:'锁定技，每回合累计限三次；①当你于回合内因执行【杀】或【决斗】造成伤害时，此伤害+1；②你于回合内使用非转化的锦囊牌时摸一张牌，且无距离限制；③当有其他角色于你的回合内弃置牌后，你获得该角色的一张牌；④结束阶段，你获得〖反馈〗直到下回合开始。',
			gzhuaiyi:'怀异',
			gzhuaiyi_info:'出牌阶段限一次，你可以展示所有手牌。若其中包含两种颜色，则你可以弃置其中一种颜色的所有牌，然后获得至多等量名角色的各一张牌。然后你将以此法获得的装备牌置于武将牌上，称为“异”',
			gzzisui:'恣睢',
			gzzisui_info:'锁定技，摸牌阶段，你多摸X张牌。结束阶段开始时，若X大于你的体力上限，你死亡（X为“异”数）。',

			gz_tangzi:'唐咨',
			gz_mengda:'孟达',
			gz_liuqi:'刘琦',
			gz_mifangfushiren:'糜芳傅士仁',
			gz_shixie:'士燮',
			gz_zhanglu:'张鲁',
			wenqin:'文钦',
			fengxi:'冯熙',
			liuba:'刘巴',
			pengyang:'彭羕',
			sunchen:'孙綝',
			gz_dengzhi:'邓芝',
			gzshenwei:'神威',
			gzshenwei_info:'主将技，此武将牌的阴阳鱼个数减0.5。摸牌阶段，你令额定摸牌数+2。你的手牌上限+2。',
			gzzhuangrong:'妆戎',
			gzzhuangrong_info:'出牌阶段限一次。你可弃置一张锦囊牌并获得〖无双〗至出牌阶段结束。',
			gzfenglve:'锋略',
			gzfenglve_info:'出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，其将区域内的两张牌交给你；若你输，你交给其一张牌。',
			gzfenglve_zongheng:'锋略·纵横',
			gzfenglve_zongheng_info:'出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，其将区域内的一张牌交给你；若你输，你交给其两张牌。',
			gzanyong:'暗涌',
			gzanyong_info:'每回合限一次。当己方角色对其他角色造成伤害时，你可令伤害值翻倍。然后若受伤角色：武将牌均明置，则你失去1点体力并失去〖暗涌〗；有一张明置的武将牌，则你弃置两张手牌。',
			gzzhukou:'逐寇',
			gzzhukou_info:'当你于一名角色的出牌阶段第一次造成伤害后，你可以摸X张牌（X为本回合你已使用的牌数且至多为5）。',
			gzduannian:'断念',
			gzduannian_info:'出牌阶段结束时，若你有手牌你可以弃置所有手牌，然后将手牌摸至体力上限。',
			gzlianyou:'莲佑',
			gzlianyou_info:'你死亡时，可以选择一名其他角色。该角色获得技能“兴火”。',
			gzxinghuo:'兴火',
			gzxinghuo_info:'锁定技，你造成的火焰伤害+1。',
			gzgongxiu:'共修',
			gzgongxiu_info:'摸牌阶段，你可以少摸一张牌，然后选择一个与上次不同的选项：①令至多X名角色各摸一张牌。②令至多X名角色各弃置一张牌。（X为你的体力上限）',
			gzjinghe:'经合',
			gzjinghe_info:'出牌阶段限一次，你可以展示至多X张牌名各不相同的手牌（X为你的体力上限），并选择等量有明置武将牌的角色。然后每名角色可以从“写满技能的天书”中选择并获得一个技能直到你的下回合开始。',
			gzshilu:'嗜戮',
			gzshilu_info:'①一名角色死亡时，你可以将其所有武将牌置于你的武将牌上，称为“戮”，若杀死其的角色是你，则你从剩余的武将牌堆随机额外获得两张“戮”。②准备阶段，你可以弃置至多X张牌，然后摸等量的牌（X为“戮”数）。',
			gzxiongnve:'凶虐',
			gzxiongnve_info:'①出牌阶段开始时，你可以将一张“戮”置入武将牌堆并选择一项：1. 本回合对“戮”对应的势力的角色造成的伤害+1；2. 本回合对“戮”对应的势力的角色造成伤害时，你获得其一张牌；3. 本回合对“戮”对应的势力的角色使用牌无次数限制。②出牌阶段结束时，你可以将两张“戮”置入武将牌堆并获得以下效果直到你的下个回合开始前：当你受到其他角色造成的伤害时,此伤害-1。',
			gzjianliang:'简亮',
			gzjianliang_info:'摸牌阶段开始时，若你的手牌数为全场最少，则你可以令所有与你势力相同的角色各摸一张牌。',
			gzweimeng:'危盟',
			gzweimeng_info:'出牌阶段限一次，你可以获得一名其他角色的至多X张手牌，然后交给其等量的牌（X为你的体力值）。',
			gzweimeng_zongheng:'危盟·纵横',
			gzweimeng_zongheng_info:'出牌阶段限一次，你可以获得一名其他角色的一张手牌，然后交给其一张牌。',
			gzjuejue:'决绝',
			gzjuejue_info:'①弃牌阶段开始时，你可失去1点体力。然后若你于此阶段内弃置过你的牌，则你令其他角色各选择一项：1.将X张手牌置入弃牌堆（X为你于此阶段内弃置过的牌数）；2.受到你造成的1点伤害。②你杀死与你势力相同的角色不执行奖惩。 ',
			gzfangyuan:'方圆',
			gzfangyuan_info:'阵法技，若你在一个围攻关系中：①是围攻角色，则所有围攻角色的手牌上限+1且被围攻角色手牌上限-1；②是被围攻角色，则结束阶段开始时，你视为对一名围攻角色使用【杀】。',
			daming:'达命',
			daming_info:'一名己方角色A的出牌阶段开始时，你可弃置一张锦囊牌，横置一名角色并摸X张牌（X为拥有横置角色的势力数）。然后你选择一项：①视为对A使用一张【桃】；②令A视为对由你选择的另一名角色使用一张雷【杀】。',
			xiaoni:'嚣逆',
			xiaoni_info:'锁定技，当你使用牌时，或成为其他角色使用牌的目标后，若场上存在其他己方角色且这些角色的手牌数均不大于你，则目标角色/你不可响应此牌。',
			gztongduo:'统度',
			gztongduo_info:'己方角色的结束阶段开始时，其可以摸X张牌（X为其本回合弃牌阶段弃置的牌数且至多为3）。 ',
			qingyin:'清隐',
			qingyin_info:'限定技，出牌阶段，你可令所有己方角色将体力值回满，然后移除此武将牌。',
			gzlianpian:'联翩',
			gzlianpian_info:'①结束阶段开始时，若你于此回合内弃置过所有角色的牌数之和大于你的体力值，你可令一名与你势力相同的角色将手牌补至X张（X为其体力上限）。②其他角色的结束阶段开始时，若其于此回合内弃置过所有角色的牌数之和大于你的体力值，其可选择：1.弃置你的一张牌；2.令你回复1点体力。',
			gzyusui:'玉碎',
			gzyusui_info:'当你成为其他势力的角色使用黑色牌的目标后，你可以失去1点体力，然后选择一项：①令其弃置X张手牌（X为其体力上限）；②令其失去Y点体力（Y为其的体力值减去你的体力值，不为正时不可选择）',
			gzboyan:'驳言',
			gzboyan_info:'出牌阶段限一次，你可令一名其他角色将手牌摸至体力上限（至多摸五张），然后其本回合不能使用或打出手牌。',
			gzboyan_zongheng:'驳言·纵横',
			gzboyan_zongheng_info:'出牌阶段限一次，你可令一名其他角色本回合不能使用或打出手牌。',
			gzjinfa:'矜伐',
			gzjinfa_info:'出牌阶段限一次，你可弃置一张牌并令一名其他角色选择一项：①交给你一张装备牌，若你以此法获得了♠牌，则其视为对你使用一张【杀】。②你获得其一张牌。',
			gzduwu:'黩武',
			gzduwu_info:'限定技，出牌阶段，你可以选择一个“军令”。你令攻击范围内所有的非己方角色选择是否执行。若有角色选择否，则你对其造成1点伤害且你摸一张牌。若有角色于此技能结算过程中进入濒死状态且存活，则你失去1点体力。',
			gzxishe:'袭射',
			gzxishe_info:'其他角色的准备阶段开始时，你可将装备区内的一张牌当做【杀】对其使用且可重复此流程。若你的体力值大于该角色，则此【杀】不可被响应。若该角色于此技能的结算流程中死亡，则你可以变更副将（不展示）。',
			gzcongcha:'聪察',
			gzcongcha2:'聪察',
			gzcongcha_info:'①准备阶段开始时，你可以选择一名未确定势力的其他角色。当其于你的下回合开始前首次明置武将牌后，若其：与你势力相同，则你与其各摸两张牌；与你势力不同，则其失去1点体力。②摸牌阶段开始时，若场上所有角色均有明置的武将牌，则你可以令额定摸牌数+2。',
			gzchenglve:'成略',
			gzchenglve_info:'己方角色使用牌结算结束后，若此牌的目标数大于1，则你可以令其摸一张牌。若你受到过渠道为此牌的伤害，则你可以令一名没有国战标记的己方角色获得一枚“阴阳鱼”。',
			gzbaolie:'豹烈',
			gzbaolie_info:'锁定技，出牌阶段开始时，你令所有攻击范围内包含你的非己方角色依次选择：①对你使用一张【杀】；②令你弃置其一张牌。锁定技，你对体力值不小于你的角色使用【杀】没有距离和次数限制。',
			gzshicai:'恃才',
			gzshicai_info:'锁定技，当你受到的伤害后，若伤害值：为1，你摸一张牌；大于1，你弃置两张牌。',
			gzxingzhao:'兴棹',
			gzxingzhao_info:'锁定技：①摸牌阶段开始时，若X不小于1，则你可以发动〖恂恂〗的效果。②当你受到伤害后或使用装备牌时，若X不小于2且你的手牌数不为全场最多，则你摸一张牌。③若X不小于3，则你的手牌上限+4。④当你失去装备区的牌后，若X不小于4，则你摸一张牌。（X为场上有受伤角色的势力数）',
			gzxingzhao_old_info:'锁定技：①摸牌阶段开始时，若X不小于1，则你可以发动〖恂恂〗的效果。②当你受到伤害后，若X不小于2且你和伤害来源的手牌数不相等，则你于伤害来源中手牌数较少的角色摸一张牌。③若X不小于3，则你的手牌上限+4。④当你失去装备区的牌后，若X不小于4，则你摸一张牌。（X为场上有受伤角色的势力数）',
			qiuan:'求安',
			qiuan_info:'当你受到伤害后，若此伤害的渠道有对应的实体牌且你的武将牌上没有“函”，则你可以防止此伤害并将这些牌置于你的武将牌上，称为“函”。',
			liangfan:'量反',
			liangfan2:'量反',
			liangfan_info:'锁定技，准备阶段开始时，若你的武将牌上有“函”，则你获得这些牌，然后失去1点体力。当你于此回合内因使用实体牌中包含“函”的牌且执行这些牌的效果而对目标角色造成伤害时，你可以获得目标角色的一张牌。',
			gzwenji:'问计',
			gzwenji_info:'出牌阶段开始时，你可令一名其他角色交给你一张牌。然后若该角色：未确定势力或势力与你相同，则你于本回合内使用实体牌包含“问计”牌的牌无距离和次数限制，且不可被其他角色响应。与你势力不同，则你交给其一张不为“问计”牌的牌或令其摸一张牌。',
			gztunjiang:'屯江',
			gztunjiang_info:'结束阶段，若你于本回合的出牌阶段内使用过牌且这些牌均未指定其他角色为目标，则你可摸X张牌（X为势力数）。',
			gzbushi:'布施',
			gzbushi_info:'当你受到1点伤害后，你可摸一张牌。当你对其他势力的角色造成伤害后，其可摸一张牌，然后你摸一张牌。',
			gzbushi_old_info:'锁定技，当你受到1点伤害后，你令一名与你势力相同的角色摸一张牌；当你对其他角色造成伤害后，你令一名与该角色势力相同的角色摸一张牌。',
			gzmidao:'米道',
			gzmidao_info:'与你势力相同的角色的出牌阶段限一次。该角色使用伤害性基本牌或普通锦囊牌指定第一个目标后，其可令你改变此牌的花色和伤害属性。',
			gzmidao_old_info:'与你势力相同的其他角色的出牌阶段限一次。该角色使用伤害性基本牌或普通锦囊牌指定第一个目标后，其可交给你一张手牌，然后你可改变此牌的花色和伤害属性。',
			gzbiluan:'避乱',
			gzbiluan_info:'锁定技。其他角色计算至你的距离时+X（X为你装备区内的牌数）。',
			gzrelixia:'礼下',
			gzrelixia_info:'锁定技。与你势力不同的角色的准备阶段开始时，若你不在其攻击范围内，则其选择一项：①弃置你装备区内的一张牌并失去1点体力。②令你摸一张牌。',
			gzlixia:'礼下',
			gzlixia_info:'与你势力不同的角色的准备阶段开始时，其可弃置你装备区内的一张牌，然后其选择一项：①弃置两张手牌。②失去1点体力。③令你摸两张牌。',
			gzrekuangcai:'狂才',
			gzrekuangcai_info:'锁定技，你于回合内使用牌无距离和次数限制；弃牌阶段开始时，若你本回合内：未使用过牌，则你本局游戏的手牌上限+1；使用过牌但未造成过伤害，则你本局游戏的手牌上限-1。',
			gzkuangcai:'狂才',
			gzkuangcai_info:'锁定技，你的回合内，你使用牌无距离和次数限制，无视防具且不能被【无懈可击】响应；弃牌阶段开始时，若你本回合使用过牌但没造成伤害，本回合你的手牌上限-2；若你本回合造成的伤害点数不小于你使用的牌数，你将手牌摸至体力上限且本回合手牌上限+2。',
			gzshejian:'舌箭',
			gzshejian_info:'当你成为其他角色使用牌的唯一目标后，你可以弃置所有手牌。若如此做，你选择一项：⒈弃置其等量的牌。⒉对其造成1点伤害。',
			gzzhidao:'雉盗',
			gzzhidao2:'雉盗',
			gzzhidao_info:'锁定技，出牌阶段开始时，你选择一名其他角色，然后直到此回合结束，你与其的距离视为1且你不能使用牌指定除你与其外的角色为目标；当你于出牌阶段内首次对其造成伤害后，你获得其区域内的一张牌。',
			gzyjili:'寄篱',
			gzyjili2:'寄篱',
			gzyjili_info:'锁定技。当你成为红色基本牌或红色普通锦囊牌的唯一目标后，你令此牌的使用者于此牌结算完成后视为对你使用一张牌名和属性相同的牌。当你于一个阶段内第二次受到伤害时，你防止此伤害并移除此武将牌。',
			wujing:'吴景',
			donggui:'调归',
			donggui_info:'出牌阶段限一次，你可以暗置武将牌均明置的一名其他角色一张武将牌，视为对其使用【调虎离山】，且其本回合不能明置此武将牌。若因此形成队列，你摸X张牌（X为该队列中的角色数）。',
			fengyang:'风扬',
			fengyang_info:'阵法技，结束阶段，你所在队列的角色可以依次弃置一张装备区里的牌，然后摸两张牌。',
			dongzhao:'董昭',
			quanjin:'劝进',
			quanjin_info:'出牌阶段限一次，你可将一张手牌交给一名本回合内受到过伤害其他角色，然后令其执行一项“军令”。若其执行，则你摸一张牌。若其不执行，则你将手牌摸至与全场最多相等（至多摸五张）。',
			zaoyun:'凿运',
			zaoyun_info:'出牌阶段限一次，你可以弃置X张牌并选择一名距离为X+1的敌方角色。你对其造成1点伤害且至其的距离视为1至回合结束。',
			gzdeshao:'德劭',
			gzdeshao_info:'每回合限X次（X为你的体力值）。其他角色使用黑色牌指定你为唯一目标后，若其暗置的武将牌数大于等于你，则你可以弃置其一张牌。',
			gzmingfa:'明伐',
			gzmingfa_info:'出牌阶段限一次，你可以选择一名敌方角色。该角色的下个回合结束时，若其手牌数：小于你，你对其造成1点伤害并获得其一张手牌；大于你，你摸X张牌（X为你与其的手牌数之差且至多为5）。',
			gzjilei_info:'当你受到有来源的伤害后，你可以声明一种牌的类别。若如此做，你令伤害来源不能使用、打出或弃置此类别的手牌直到回合结束。',
			gzdanlao_info:'当你成为普通锦囊牌的目标后，若此牌的目标数大于1，则你可以摸一张牌，令此牌对你无效。',

			gz_cuimao:'崔琰毛玠',
			gzzhengbi:'征辟',
			gzzhengbi_info:'出牌阶段开始时，你可以选择一项：选择一名未确定势力的角色，此出牌阶段结束时，若其有明置的武将牌，则你获得其每个区域内的各一张牌；或将一张基本牌交给一名有明置武将牌的角色，然后其交给你一张非基本牌或两张基本牌。',
			gzfengying:'奉迎',
			gzfengying_info:'限定技，你可以将所有手牌当【挟天子以令诸侯】使用（无视大势力限制），然后所有与你势力相同的角色将手牌补至体力上限。',
			gz_yujin:'于禁',
			gzjieyue:'节钺',
			gzjieyue_info:'准备阶段开始时，你可以将一张手牌交给一名非魏势力角色，然后选择一个“军令”并令其选择一项：执行该军令，然后你摸一张牌；或令你于此回合摸牌阶段额外摸三张牌。',
			gz_wangping:'王平',
			jianglue:'将略',
			jianglue_info:'限定技，出牌阶段，你可以选择一个“军令”，然后与你势力相同的其他角色可以执行该军令（未确定势力角色可以在此时明置一张单势力武将牌）。你与所有执行该军令的角色增加一点体力上限，然后回复一点体力，然后你摸X张牌（X为以此法回复了体力的角色数）。',
			gz_fazheng:'法正',
			gzxuanhuo:'眩惑',
			gzxuanhuo_info:'与你势力相同的其他角色的出牌阶段限一次，其可弃置一张手牌，然后选择获得以下一项技能直到回合结束：〖武圣〗、〖咆哮〗、〖龙胆〗、〖铁骑〗、〖烈弓〗、〖狂骨〗。',
			gzenyuan:'恩怨',
			gzenyuan_info:'锁定技，当其他角色对你使用【桃】时，该角色摸一张牌；当你受到伤害后，伤害来源须交给你一张手牌或失去1点体力。',
			gzbuyi:'补益',
			gzbuyi_info:'每回合限一次，当一名与你势力相同的角色脱离濒死状态后，你可以选择一个“军令”，令伤害来源选择一项：执行该军令，或令该脱离濒死状态的角色回复一点体力。',
			gz_lukang:'陆抗',
			keshou:'恪守',
			keshou_info:'当你受到伤害时，你发动此技能。你可弃置两张颜色相同的牌，若如此做，此伤害-1。你的势力已确定且场上没有与你势力相同的其他角色，则你进行判定，若结果为红色，你摸一张牌。',
			zhuwei:'筑围',
			zhuwei_info:'当你的判定牌生效后，你可以获得之。然后，你可令当前回合角色本回合内使用【杀】的次数上限和手牌上限+1。',
			gz_yuanshu:'袁术',
			gzweidi:'伪帝',
			gzweidi_info:'出牌阶段限一次，你可以指定一名本回合从牌堆获得过牌的其他角色并选择一个“军令”，令其选择一项：执行该军令；或令你获得其所有手牌，然后交给其等量的牌。',
			gzyongsi:'庸肆',
			gzyongsi_info:'锁定技，若场上没有【玉玺】，则视为你装备了【玉玺】；当你成为【知己知彼】的目标时，你展示你的所有手牌。',
			//gzyongsi_eff1:'玉玺',
			//gzyongsi_eff2:'玉玺',
			gz_zhangxiu:'张绣',
			gzfudi:'附敌',
			gzfudi_info:'当你受到伤害后，你可以交给伤害来源一张手牌。若如此做，你对其势力中体力值最大且不小于你的一名角色造成一点伤害。',
			gzcongjian:'从谏',
			gzcongjian_info:'锁定技，当你于回合外造成伤害，或于回合内受到伤害时，此伤害+1。',
			gz_jun_caocao:'君曹操',
			jianan:'建安',
			jianan_info:'君主技，只要此武将处于明置状态，你便拥有“五子良将纛”。',
			g_jianan:'五子良将纛',
			wuziliangjiangdao:'五子良将纛',
			wuziliangjiangdao_ab:'将纛',
			wuziliangjiangdao_bg:'纛',
			wuziliangjiangdao_info:'魏势力角色的准备阶段开始时，其可以弃置一张牌。若如此做，其选择一张暗置的武将牌（若没有，则选择一张暗置），然后获得下列技能中的一项（其他角色已有的技能无法选择）且不能明置选择的武将牌直到你的下个回合开始：〖突袭〗，〖巧变〗，〖骁果〗，〖节钺〗，〖断粮〗。',
			huibian:'挥鞭',
			huibian_info:'出牌阶段限一次，你可以选择一名魏势力角色和另一名已受伤的魏势力角色。若如此做，你对前者造成一点伤害，然后其摸两张牌，然后后者回复一点体力。',
			gzzongyu:'总御',
			gzzongyu_info:'当【六龙骖驾】进入其他角色的装备区后，你可以将你装备区内所有坐骑牌（至少一张）与【六龙骖驾】交换位置。锁定技，当你使用坐骑牌后，若场上或弃牌堆中有【六龙骖驾】，则将【六龙骖驾】置入你的装备区。',
			
			yigui:"役鬼",
			"yigui_info":"当你首次明置此武将牌时，你将剩余武将牌堆的两张牌扣置于游戏外，称为“魂”；你可以展示一张“魂”并将其置入剩余武将牌堆，视为使用了一张本回合内未以此法使用过的基本牌或普通锦囊牌。（此牌需指定目标，且目标须为未确定势力的角色或野心家或与此“魂”势力相同的角色）",
			"yigui_init":"役鬼",
			"yigui_init_info":"",
			"yigui_refrain":"役鬼",
			"yigui_refrain_info":"",
			yigui_shan:'役鬼',
			yigui_wuxie:'役鬼',
			jihun:"汲魂",
			jihun_info:"当你受到伤害后，或与你势力不同的角色脱离濒死状态后，你可以将剩余武将牌堆的一张牌当做“魂”扣置于游戏外。",
			
			_guozhan_marks:'标记',
			_guozhan_marks_backup:'标记',
			xianqu_mark:"先驱",
			zhulianbihe_mark:"珠联璧合",
			yinyang_mark:"阴阳鱼",
			_zhulianbihe_mark_tao:"珠联",
			_yinyang_mark_add:"阴阳鱼",
			yinyang_add:"阴阳鱼",
			
			gzjushou:"据守",
			gzjushou_info:"结束阶段，你可以摸X张牌（X为亮明势力数），然后弃置一张手牌。若以此法弃置的牌为装备牌，则改为使用此牌。若X大于2，则你将武将牌叠置。",
			"new_duanliang":"断粮",
			"new_duanliang_info":"出牌阶段，你可以将一张黑色基本牌或黑色装备牌当做【兵粮寸断】使用。你使用【兵粮寸断】没有距离限制。若你对距离超过2的角色发动了〖断粮〗，则本回合不能再发动〖断粮〗。",
			"new_shushen":"淑慎",
			"new_shushen_info":"当你回复1点体力后，你可令一名其他角色摸一张牌。",
			"new_luanji":"乱击",
			"new_luanji_info":"你可以将两张与你本回合以此法转化的花色均不相同的手牌当【万箭齐发】使用。当一名与你势力相同的角色因响应此牌而打出【闪】时，该角色摸一张牌。",
			"new_qingcheng":"倾城",
			"new_qingcheng_info":"出牌阶段，你可以弃置一张黑色牌并选择一名武将牌均明置的其他角色，然后你暗置其一张武将牌。若你以此法弃置的牌为装备牌，则你可以暗置另一名武将牌均明置的角色的一张武将牌。",
			huoshui:'祸水',
			huoshui_info:'锁定技。你的回合内，①其他角色不能明置武将牌。②当你使用【杀】或【万箭齐发】指定目标后，若目标角色与你势力不同且有暗置武将牌，则其不能使用或出【闪】直到此牌结算结束。',
			"new_kongcheng":"空城",
			"new_kongcheng_info":"锁定技，若你没有手牌，1.当你成为【杀】或【决斗】的目标时，取消之；2.你的回合外，其他角色交给你牌后，你将这些牌置于你的武将牌上。摸牌阶段开始时，你获得武将牌上的这些牌。",
			"new_keji":"克己",
			"new_keji_info":"锁定技，若你没有在出牌阶段内使用过颜色不同的牌，则你本回合的手牌上限+4。",
			"keji_add":"克己",
			"keji_add_info":"",
			"new_mouduan":"谋断",
			"new_mouduan_info":"结束阶段，若你于本回合内使用过四种花色或三种类别的牌，则你可以移动场上的一张牌。",
			"new_longdan":"龙胆",
			"new_longdan_info":"你可以将【杀】当【闪】，【闪】当【杀】使用或打出。当你发动〖龙胆〗使用的【杀】被【闪】抵消时，你可以对另一名角色造成1点伤害；当你发动〖龙胆〗使用的【闪】抵消了【杀】时，你可以令一名其他角色回复1点体力（不能是【杀】的使用者）。",
			"fz_new_longdan":"龙胆",
			"fz_new_longdan_info":"你可以将【杀】当【闪】，【闪】当【杀】使用或打出。当你发动〖龙胆〗使用的【杀】被【闪】抵消时，你可以对另一名角色造成1点伤害；当你发动〖龙胆〗使用的【闪】抵消了【杀】时，你可以令一名其他角色回复1点体力（不能是【杀】的使用者）。",
			gzpaoxiao:"咆哮",
			gzpaoxiao_info:"锁定技，你使用【杀】无数量限制；当你于一回合内使用第二张【杀】时，摸一张牌。",
			"new_kurou":"苦肉",
			"new_kurou_info":"出牌阶段限一次，你可以弃置一张牌，然后失去1点体力并摸三张牌，本回合使用【杀】的次数上限+1。",
			"kurou_effect":"苦肉",
			"kurou_effect_info":"",
			"new_chuli":"除疠",
			"new_chuli_info":"出牌阶段限一次，若你有牌，你可以选择至多三名势力各不相同或未确定势力的其他角色，你弃置你和这些角色的各一张牌。然后所有以此法弃置过黑桃牌的角色各摸一张牌。",
			"baka_hunshang":"魂殇",
			"baka_hunshang_info":"副将技，此武将牌减少半个阴阳鱼；准备阶段，若你的体力值不大于1，则你获得〖英姿〗和〖英魂〗直到回合结束。",
			"baka_yinghun":"英魂",
			"baka_yinghun_info":"准备阶段开始时，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值）",
			"baka_yingzi":"英姿",
			"baka_yingzi_info":"锁定技，摸牌阶段摸，你多摸一张牌；你的手牌上限+X（X为你已损失的体力值）。",
			gzyiji:"遗计",
			gzyiji_info:"当你受到伤害后，你可以观看牌堆顶的两张牌，并将其交给任意角色。",
			gzjieming:"节命",
			gzjieming_info:"当你受到伤害后，你可以令一名角色将手牌摸至X张（X为其体力上限且最多为5）。",
			gzfangzhu:"放逐",
			gzfangzhu_info:"当你受到伤害后，你可以令一名其他角色选择一项：⒈摸X张牌并将武将牌叠置；⒉弃置X张牌并失去1点体力（X为你已损失的体力值）。",
			"fengyin_main":"封印[主将]",
			"fengyin_main_info":"",
			"fengyin_vice":"封印[副将]",
			"fengyin_vice_info":"",
			"new_tieji":"铁骑",
			"new_tieji_info":"当你使用【杀】指定目标后，你可以令其一张明置的武将牌上的非锁定技于本回合内失效，然后你进行判定，除非该角色弃置与结果花色相同的一张牌，否则其不能使用【闪】响应此【杀】。",
			hmkyuanyu:"远域",
			"hmkyuanyu_info":"锁定技，当你受到伤害时，若伤害来源与你的座次不相邻，防止此伤害。",
			hmkguishu:"鬼术",
			"hmkguishu_info":"出牌阶段，你可以将一张黑桃手牌当作【知己知彼】或【远交近攻】使用。若你本局游戏内已经发动过了〖鬼术〗，则你必须选择与上次不同的选项。",
			"_mingzhisuodingji":"亮将",
			"_mingzhisuodingji_info":"出牌阶段，你可以明置拥有“锁定技”的武将牌。",

			gz_jun_liubei:'君刘备',
			gz_jun_zhangjiao:'君张角',
			gz_jun_sunquan:'君孙权',
			gz_liqueguosi:'李傕郭汜',
			gz_bianfuren:'卞夫人',
			gz_lvfan:'吕范',
			gz_shamoke:'沙摩柯',
			gz_masu:'马谡',
			gz_yuji:'于吉',

			gzshushen:'淑慎',
			gzshushen_info:'当你回复1点体力时，你可令与你势力相同的一名其他角色摸一张牌。',
			_lianheng:'合纵',
			lianheng_tag:'合纵',
			guo_tag:'国',
			qianhuan:'千幻',
			qianhuan_bg:'幻',
			qianhuan_info:'当与你势力相同的一名角色受到伤害后，你可以将一张与你武将牌上花色均不同的牌置于你的武将牌上。当一名与你势力相同的角色成为基本牌或锦囊牌的唯一目标时，你可以移去一张“千幻”牌，取消之。',
			gzsanyao_info:'出牌阶段限一次。你可以弃置一张牌，对一名手牌数或体力值大于你的角色造成1点伤害。',
			gzzhiman:'制蛮',
			gzzhiman_info:'当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。然后若该角色与你势力相同，该角色可以变更副将。',
			
			gzdiancai:'典财',
			gzdiancai_info:'其他角色的出牌阶段结束时，若你于此阶段失去了x张或更多的牌，则你可以将手牌摸至体力上限。若如此做，你可以变更副将（x为你的体力值）。',
			xuanlve:'旋略',
			xuanlve_info:'当你失去装备区里的牌后，你可以弃置一名其他角色的一张牌。',
			lianzi:'敛资',
			lianzi_info:'出牌阶段限一次，你可以弃置一张手牌，然后亮出牌堆顶X张牌（X为吴势力角色装备区里的牌和“烽火”的总和），获得其中所有与你弃置牌类别相同的牌，将其余的牌置入弃牌堆，若你以此法一次获得了三张或更多的牌，则你失去技能〖敛资〗并获得技能〖制衡〗。',
			gzqice:'奇策',
			gzqice_backup:'奇策',
			gzqice_info:'出牌阶段限一次，你可以将所有手牌当做任意一张普通锦囊牌使用（此牌的目标数不能超过你的手牌数）。然后，你可以变更副将。',
			gzyuejian:'约俭',
			gzyuejian_info:'锁定技，与你势力相同角色的弃牌阶段开始时，若其本回合未使用牌指定过其他势力的角色为目标，则该角色本回合手牌上限+X（X为其已损失的体力值）。',
			gzxiongsuan:'凶算',
			gzxiongsuan_info:'限定技，出牌阶段，你可以弃置一张手牌并选择与你势力相同的一名角色，对其造成1点伤害，然后你摸三张牌。若该角色有已发动的限定技，则你选择其中一个限定技，此回合结束后视为该限定技未发动过。',
			gzhuashen:'化身',
			gzhuashen_info:'准备阶段开始时，若你的“化身”不足两张，则你可以观看剩余武将牌堆中的五张牌，然后扣置其中至多两张武将牌在你的武将旁，称为“化身”；若“化身”有两张以上，则你可以用剩余武将牌堆顶的一张牌替换一张“化身”。你可以于相应的时机明置并发动“化身”的一个技能，技能结算完成后将该“化身”放回剩余武将牌堆。你每个时机只能发动一张“化身”的技能，且不能发动带有技能类型的技能（锁定技、限定技等）。',
			gzxinsheng:'新生',
			gzxinsheng_info:'当你受到伤害后，你可以从剩余武将牌堆中扣置一张牌加入到“化身”牌中。',

			jubao:'聚宝',
			jubao_info:'锁定技，你装备区里的宝物牌不能被其他角色获得。结束阶段开始时，若场上或弃牌堆有【定澜夜明珠】，则你摸一张牌，然后获得装备区里有【定澜夜明珠】角色的一张牌。',
			jiahe:'嘉禾',
			jiahe_info:'君主技，只要此武将牌处于明置状态，你便拥有“缘江烽火图”。',
			jiahe_put:'烽火',
			jiahe_put_info:'出牌阶段限一次，你可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。',
			jiahe_skill:'缘江烽火图',
			yuanjiangfenghuotu:'缘江烽火图',
			yuanjiangfenghuotu_info:'每名吴势力角色的出牌阶段限一次，该角色可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。<br>根据“烽火”的数量，所有吴势力角色可于其准备阶段开始时选择并获得其中一个技能直到回合结束：一张以上：〖英姿〗；两张以上：〖好施〗；三张以上：〖涉猎〗；四张以上：〖度势〗；五张以上：可额外选择一项。<br>锁定技，当你受到【杀】或锦囊牌造成的伤害后，你将一张“烽火”置入弃牌堆。',
			yuanjiangfenghuotu_ab:'江图',
			yuanjiangfenghuotu_bg:'图',
			wuxin:'悟心',
			wuxin_info:'摸牌阶段开始时，你可以观看牌堆顶的X张牌（X为群势力角色的数量），然后将这些牌以任意顺序置于牌堆顶',
			hongfa:'弘法',
			hongfa_use:'天兵',
			hongfa_respond:'天兵',
			hongfa_info:'君主技，锁定技，此武将牌明置时，你获得“黄巾天兵符”；准备阶段开始时，若没有“天兵”，你将牌堆顶的X张牌置于“黄巾天兵符”上，称为“天兵”（X为群势力角色的数量）',
			wendao:'问道',
			wendao_info:'出牌阶段限一次，你可以弃置一张不为【太平要术】的红色牌，然后获得弃牌堆或场上的一张【太平要术】。',
			huangjintianbingfu:'黄巾天兵符',
			huangjintianbingfu_ab:'兵符',
			huangjintianbingfu_bg:'符',
			huangjintianbingfu_info:'锁定技 ：当你计算群势力角色数时，每一张“天兵”均可视为一名群势力角色。<br>当你失去体力时，你可改为将一张“天兵”置入弃牌堆。<br>与你势力相同的角色可将一张“天兵”当作【杀】使用或打出。',
			wuhujiangdaqi:'五虎将大旗',
			wuhujiangdaqi_ab:'将旗',
			wuhujiangdaqi_bg:'旗',
			wuhujiangdaqi_info:'存活的蜀势力角色的技能按以下规则改动：<br><strong>武圣</strong>：将“红色牌”改为“任意牌”<br><strong>咆哮</strong>：增加描述“你使用的【杀】无视其他角色的防具”<br><strong>龙胆</strong>：增加描述“你发动〖龙胆〗使用或打出牌时摸一张牌”<br><strong>烈弓</strong>：增加描述“你的攻击范围+1”<br><strong>铁骑</strong>：将“一张明置的武将牌”改为“所有明置的武将牌”',
			zhangwu:'章武',
			zhangwu_info:'锁定技。当【飞龙夺凤】进入弃牌堆或其他角色的装备区后，你获得之。当你不因使用而失去【飞龙夺风】时，你展示此牌，将此牌置于牌堆底并摸两张牌',
			shouyue:'授钺',
			shouyue_info:'君主技。只要此武将牌处于明置状态，你便拥有“五虎将大旗”。',
			jizhao:'激诏',
			jizhao_bg:'诏',
			jizhao_info:'限定技。当你处于濒死状态时，你可以将手牌补至体力上限，体力回复至2点，失去技能〖授钺〗并获得技能〖仁德〗。',
			gzshoucheng:'守成',
			gzshoucheng_info:'当与你势力相同的一名角色于其回合外失去手牌时，若其没有手牌，则你可以令其摸一张牌。',
			gzmingshi:'名士',
			gzmingshi_info:'锁定技，当你受到伤害时，若伤害来源有暗置的武将牌，此伤害-1。',
			fengshi:'锋矢',
			fengshi_sha:'锋矢',
			fengshi_info:'阵法技，在一个围攻关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，可令该角色弃置装备区内的一张牌。',
			gzsuishi:'随势',
			gzsuishi2:'随势',
			gzsuishi_info:'锁定技，其他角色进入濒死状态时，若伤害来源与你势力相同，你摸一张牌；其他角色死亡时，若其与你势力相同，你失去1点体力。',
			baoling:'暴凌',
			baoling_info:'主将技，锁定技，出牌阶段结束时，若你有副将，则你移除副将，然后加3点体力上限，回复3点体力，失去技能〖暴凌〗并获得〖崩坏〗',
			yingyang:'鹰扬',
			yingyang_info:'当你的拼点牌亮出后，你可以令此牌的点数+3或-3（至多为K，至少为1）。',
			hunshang:'魂殇',
			hunshang_info:'副将技，此武将牌减少半个阴阳鱼；准备阶段，若你的体力值不大于1，则你本回合获得“英姿”和“英魂”',
			gzguixiu:'闺秀',
			gzguixiu_info:'当你明置此武将牌时，你可以摸两张牌；当你移除此武将牌时，你可以回复1点体力。',
			gzcunsi:'存嗣',
			gzcunsi_info:'出牌阶段，你可以移除此武将牌并选择一名角色，然后其获得技能〖勇决〗，若你选择的目标角色不是自己，则其摸两张牌。',
			gzyongjue:'勇决',
			gzyongjue_info:'与你势力相同的一名角色于其回合内使用【杀】结算完成后，若此牌是其本回合内使用的第一张牌，则其可以获得此牌对应的所有实体牌。',
			gzqianxi:'潜袭',
			gzqianxi_info:'准备阶段开始时，你可以进行判定，然后你选择距离为1的一名角色，直到回合结束，该角色不能使用或打出与结果颜色相同的手牌',
			gzshangyi:'尚义',
			gzshangyi_info:'出牌阶段限一次，你可以令一名其他角色观看你的手牌。若如此做，你选择一项：1.观看其手牌并可以弃置其中的一张黑色牌；2.观看其所有暗置的武将牌。',
			niaoxiang:'鸟翔',
			niaoxiang_sha:'鸟翔',
			niaoxiang_info:'阵法技，在同一个围攻关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，该角色需依次使用两张【闪】才能抵消。',
			yicheng:'疑城',
			yicheng_info:'当与你势力相同的一名角色成为【杀】的目标后，你可以令该角色摸一张牌，然后弃置一张牌。',
			gzyicheng:'疑城',
			gzyicheng_info:'阵法技。当你和你队列中的角色使用【杀】指定第一个目标后，或成为【杀】的目标后，其可以摸一张牌，然后弃置一张牌。',
			yizhi:'遗志',
			yizhi_info:'副将技，此武将牌减少半个阴阳鱼。若你的主将拥有技能〖观星〗，则将其描述中的X改为5；若你的主将没有技能〖观星〗，则你视为拥有技能〖观星〗。',
			tianfu:'天覆',
			tianfu_info:'主将技，阵法技，若当前回合角色与你处于同一队列，则你视为拥有技能〖看破〗。',
			ziliang:'资粮',
			ziliang_info:'副将技，当与你势力相同的一名角色受到伤害后，你可以将一张“田”交给该角色 ',
			gzjixi:'急袭',
			gzjixi_info:'主将技，此武将牌减少半个阴阳鱼。你可以将一张“田”当作【顺手牵羊】使用。',
			huyuan:'护援',
			huyuan_info:'结束阶段开始时，你可以将一张装备牌置入一名角色的装备区，然后你可以弃置该角色距离为1的一名角色的一张牌。',
			heyi:'鹤翼',
			heyi_info:'阵法技。与你处于同一队列的角色视为拥有技能〖飞影〗。',
			gzhuyuan:'护援',
			gzhuyuan_info:'结束阶段开始时，你可以选择一项：⒈将一张非装备牌交给一名其他角色。⒉将一张装备牌置入其他角色的装备区内，然后你可以弃置场上的一张牌。',
			gz_shibing1wei:'魏兵',
			gz_shibing2wei:'魏兵',
			gz_shibing1shu:'蜀兵',
			gz_shibing2shu:'蜀兵',
			gz_shibing1wu:'吴兵',
			gz_shibing2wu:'吴兵',
			gz_shibing1qun:'群兵',
			gz_shibing2qun:'群兵',
			gz_shibing1jin:'晋兵',
			gz_shibing2jin:'晋兵',
			gz_shibing1ye:'士兵',
			gz_shibing2ye:'士兵',
			gz_shibing1key:'键兵',
			gz_shibing2key:'键兵',
			gzduanchang:'断肠',
			gzduanchang_info:'锁定技，当你死亡时，你令杀死你的角色失去一张武将牌上的所有技能。',
			gzweimu:'帷幕',
			gzweimu_info:'锁定技，当你成为黑色普通锦囊牌的目标时，或有黑色延时锦囊牌进入你的判定区时，取消之。',
			gzqianxun:'谦逊',
			gzqianxun_info:'锁定技，当你成为【顺手牵羊】的目标时，或有【乐不思蜀】进入你的判定区时，取消之。',
			gzkongcheng:'空城',
			gzkongcheng_info:'锁定技，当你成为【杀】或【决斗】的目标时，若你没有手牌，则取消之',
			gzxiaoji:'枭姬',
			gzxiaoji_info:'当你失去装备区里的牌后，你可以摸一张牌。若你不是当前回合角色，则你改为摸三张牌。',
			gzrende:'仁德',
			gzrende_info:'出牌阶段，你可以将任意张手牌交给其他角色，然后若你于此阶段内给出第三张“仁德”牌时，你回复1点体力',
			gzzhiheng:'制衡',
			gzzhiheng_info:'出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌。',
			duoshi:'度势',
			duoshi_info:'出牌阶段限四次，你可以将一张红色手牌当做【以逸待劳】使用。',
			gzxiaoguo:'骁果',
			gzxiaoguo_info:'其他角色的结束阶段开始时，你可以弃置一张基本牌，令该角色选择一项：1.弃置一张装备牌；2.受到你对其造成的1点伤害。',

			gzdangxian:'当先',
			gzdangxian_info:'锁定技。当你首次明置此武将牌时，你获得一枚“先驱”标记。回合开始时，你获得一个额外的出牌阶段。',
			gzhuanshi:'缓释',
			gzhuanshi_info:'一名己方角色的判定牌生效前，你可打出一张牌代替之。',
			gzhongyuan:'弘援',
			gzhongyuan_info:'①出牌阶段限一次。你可以令一张没有「合纵」标签的卡牌视为拥有「合纵」标签直到本回合结束。②当你即将因合纵效果摸牌时，你可放弃摸牌，并令一名己方角色摸等量的牌。',
			gzmingzhe:'明哲',
			gzmingzhe_info:'你的回合外，当你使用或打出红色手牌，或失去装备区内的红色装备牌时，你可摸一张牌。',
			gzxiongzhi:'雄志',
			gzxiongzhi_info:'限定技。出牌阶段，你可依次展示牌堆顶的X张牌并使用之（X为你的体力上限）。',
			gzquanbian:'权变',
			gzquanbian_info:'当你于出牌阶段内使用/打出手牌时，若此牌有花色且你本回合内未使用/打出过该花色的其他手牌，则你可以观看牌堆顶X张牌，选择获得其中的一张并展示之。若你本回合使用过与获得牌花色相同的牌，则你本回合内不能再发动〖权变〗。',
			gzhuishi:'慧识',
			gzhuishi_info:'摸牌阶段，你可以放弃摸牌，改为观看牌堆顶的X张牌，获得其中的一半（向下取整），然后将其余牌置入牌堆底。（X为弃牌堆顶的两张牌的名称字数之和）',
			gzqingleng:'清冷',
			gzqingleng_info:'一名角色的回合结束时，若其有未明置的，则你可将一张牌当无距离限制的冰属性【杀】对其使用；若其所有武将牌均未明置，则你摸一张牌。',
			gzchoufa:'筹伐',
			gzchoufa_info:'出牌阶段限一次，你可展示一名其他角色的一张手牌A。你令其所有类型与A不同的手牌的牌名均视为【杀】且均视为无属性直到本回合结束。',
			gzbolan:'博览',
			gzbolan_info:'每名角色的出牌阶段限一次。其可以随机展示武将牌堆顶的一张武将牌，然后根据此武将牌包含的势力选择获得一个技能直到回合结束：魏:〖奇策〗；蜀:〖挑衅〗；吴:〖制衡〗；群:〖除疠〗；晋:〖三陈〗。若该角色不为你，则其失去1点体力。',
			gzsanchen:'三陈',
			gzsanchen_info:'出牌阶段，你可选择一名本回合内未选择过的角色。其摸三张牌，然后弃置三张牌。若其未以此法弃置牌或以此法弃置的牌的类别均不相同，则你获得一枚“陈”且其摸一张牌；否则你本阶段内不能再发动〖三陈〗。',
			gzpozhu:'破竹',
			gzpozhu_info:'主将技。此武将牌减少半个阴阳鱼。出牌阶段，你可以移去一枚“陈”并将一张手牌当做【出其不意】使用。若你未因此牌造成过伤害，则你不能再发动〖破竹〗直到回合结束。',
			gzyimie:'夷灭',
			gzyimie_info:'主将技，此武将牌减少一整个阴阳鱼。每轮限一次，当你对其他角色造成伤害时，若伤害值X小于Y，则你可失去1点体力，将伤害值改为Y。此伤害结算结束后，其回复(Y-X)点体力。（Y为其体力值）’',
			gztairan:'泰然',
			gztairan_info:'出牌阶段开始时，你可以失去任意点体力并弃置任意张牌（弃牌数不能大于你已损失的体力值）。若如此做，本回合结束时，你回复等量的体力并摸等量的牌。',
			gzxuanbei:'选备',
			gzxuanbei_info:'①当你首次明置此武将牌时，你获得两张拥有“应变”或“合纵”标签的牌（不足则摸牌），且你本回合内使用带有“应变”标签的牌时直接强化，使用带有“合纵”标签的牌时摸一张牌。②当你死亡时，你可以令一名其他角色变更副将。',
			gzzhaosong:'诏颂',
			gzzhaosong_info:'每局游戏每项限一次。①一名角色进入濒死状态时，你可以令其回复至2点体力并摸一张牌。②出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。③一名角色使用【杀】选择唯一目标后，你可以为此【杀】增加两个目标。',
			gzlisi:'离思',
			gzlisi_info:'一名己方角色死亡后，你可以选择〖诏颂〗中的一个已发动过的选项，令其视为未发动过。',
			gzcaiyuan:'才媛',
			gzcaiyuan_info:'锁定技。结束阶段开始时，若你的手牌数大于本回合开始时的手牌数，则你摸两张牌或回复1点体力。',
			gzwanyi:'婉嫕',
			gzwanyi_info:'出牌阶段每项各限一次。你可以将一张带有“合纵”标签的牌当做【联军盛宴】/【火烧连营】/【挟天子以令诸侯】/【戮力同心】使用。',
			gzmaihuo:'埋祸',
			gzmaihuo_info:'限定技。当有己方角色成为【杀】的目标时，你可以取消此【杀】的所有目标。然后此【杀】的使用者下回合开始时，其视为对你使用一张【杀】。若此【杀】对你造成伤害，则你防止此伤害，摸两张牌并移除此武将牌（若此武将牌为副将则改为变更副将）。',

			gz_key_ushio:'冈崎汐',
			ushio_huanxin:'幻心',
			ushio_huanxin_info:'当你受到伤害后/使用【杀】造成伤害后/使用装备牌后，你可进行判定。然后你获得判定牌并弃置一张牌。',
			ushio_xilv:'汐旅',
			ushio_xilv2:'汐旅',
			ushio_xilv_info:'锁定技，此武将牌可作为任意单势力武将牌的副将。当你进行判定后，你令你的手牌上限+1直至你的下个结束阶段。',

			guozhan_default:"国战标准",
			guozhan_zhen:"君临天下·阵",
			guozhan_shi:"君临天下·势",
			guozhan_bian:"君临天下·变",
			guozhan_quan:"君临天下·权",
			guozhan_jun:"君主武将",
			guozhan_jin:'文德武备',
			guozhan_single:'君临天下EX',
			guozhan_double:'双势力武将',
			guozhan_yexinjia:'野心家武将',
			guozhan_zongheng:'纵横捭阖',
			guozhan_others:"其他",
		},
		junList:['liubei','zhangjiao','sunquan','caocao'],
		guozhanPile_yingbian:[
			['spade',1,'juedou'],
			['spade',1,'shandian'],
			['spade',2,'cixiong'],
			['spade',2,'bagua'],
			['spade',2,'taigongyinfu'],
			['spade',3,'shuiyanqijunx',null,['yingbian_zhuzhan']],
			['spade',3,'zhujinqiyuan',null,['yingbian_zhuzhan']],
			['spade',4,'guohe'],
			['spade',4,'shuiyanqijunx',null,['yingbian_zhuzhan']],
			['spade',5,'sha'],
			['spade',5,'jueying'],
			['spade',6,'qinggang'],
			['spade',6,'sha','ice'],
			['spade',7,'sha'],
			['spade',7,'sha','ice'],
			['spade',8,'sha','ice'],
			['spade',8,'sha','ice'],
			['spade',9,'sha'],
			['spade',9,'jiu'],
			['spade',10,'sha',null,['yingbian_canqu']],
			['spade',10,'bingliang'],
			['spade',11,'sha',null,['yingbian_canqu']],
			['spade',11,'wuxie',null,['yingbian_kongchao']],
			['spade',12,'zhangba'],
			['spade',12,'tiesuo'],
			['spade',13,'nanman',null,['yingbian_fujia']],
			['spade',13,'wutiesuolian'],

			['heart',1,'taoyuan'],
			['heart',1,'wanjian'],
			['heart',2,'shan'],
			['heart',2,'chuqibuyi',null,['yingbian_zhuzhan']],
			['heart',3,'wugu'],
			['heart',3,'chuqibuyi',null,['yingbian_zhuzhan']],
			['heart',4,'tao'],
			['heart',4,'sha','fire',['yingbian_canqu']],
			['heart',5,'qilin'],
			['heart',5,'chitu'],
			['heart',6,'tao'],
			['heart',6,'lebu'],
			['heart',7,'tao'],
			['heart',7,'dongzhuxianji'],
			['heart',8,'tao'],
			['heart',8,'dongzhuxianji'],
			['heart',9,'tao'],
			['heart',9,'yuanjiao'],
			['heart',10,'tao'],
			['heart',10,'sha'],
			['heart',11,'shan'],
			['heart',11,'yiyi'],
			['heart',12,'tao'],
			['heart',12,'sha'],
			['heart',12,'guohe'],
			['heart',13,'shan'],
			['heart',13,'zhuahuang'],

			['diamond',1,'zhuge'],
			['diamond',1,'wuxinghelingshan'],
			['diamond',2,'shan'],
			['diamond',2,'tao'],
			['diamond',3,'shan'],
			['diamond',3,'shunshou'],
			['diamond',4,'yiyi'],
			['diamond',4,'sha','fire',['yingbian_canqu']],
			['diamond',5,'guanshi'],
			['diamond',5,'sha','fire'],
			['diamond',6,'shan'],
			['diamond',6,'wuliu'],
			['diamond',7,'shan',null,['yingbian_kongchao']],
			['diamond',7,'shan',null,['yingbian_kongchao']],
			['diamond',8,'shan',null,['yingbian_kongchao']],
			['diamond',8,'shan',null,['yingbian_kongchao']],
			['diamond',9,'shan'],
			['diamond',9,'jiu'],
			['diamond',10,'shan'],
			['diamond',10,'sha'],
			['diamond',11,'shan'],
			['diamond',11,'sha'],
			['diamond',12,'sha'],
			['diamond',12,'sanjian'],
			['diamond',12,'wuxie',null,['guo']],
			['diamond',13,'shan'],
			['diamond',13,'zixin'],

			['club',1,'juedou'],
			['club',1,'huxinjing'],
			['club',2,'sha'],
			['club',2,'tengjia'],
			['club',2,'renwang'],
			['club',3,'guohe'],
			['club',3,'zhibi'],
			['club',4,'sha',null,['yingbian_kongchao']],
			['club',4,'zhibi'],
			['club',5,'sha',null,['yingbian_kongchao']],
			['club',5,'tongque'],
			['club',6,'lebu'],
			['club',6,'sha','thunder'],
			['club',7,'nanman'],
			['club',7,'sha','thunder'],
			['club',8,'sha'],
			['club',8,'sha','thunder'],
			['club',9,'sha'],
			['club',9,'jiu'],
			['club',10,'sha'],
			['club',10,'bingliang'],
			['club',11,'sha'],
			['club',11,'sha'],
			['club',12,'zhujinqiyuan',null,['yingbian_zhuzhan']],
			['club',12,'tiesuo'],
			['club',13,'wuxie',null,['guo']],
			['club',13,'tiesuo'],
		],
		guozhanPile_old:[
			['spade',1,'juedou'],
			['spade',1,'shandian'],
			['spade',2,'cixiong'],
			['spade',2,'bagua'],
			['spade',2,'hanbing'],
			['spade',3,'guohe'],
			['spade',3,'shunshou'],
			['spade',4,'guohe'],
			['spade',4,'shunshou'],
			['spade',5,'sha'],
			['spade',5,'jueying'],
			['spade',6,'qinggang'],
			['spade',6,'sha','thunder'],
			['spade',7,'sha'],
			['spade',7,'sha','thunder'],
			['spade',8,'sha'],
			['spade',8,'sha'],
			['spade',9,'sha'],
			['spade',9,'jiu'],
			['spade',10,'sha'],
			['spade',10,'bingliang'],
			['spade',11,'sha'],
			['spade',11,'wuxie'],
			['spade',12,'zhangba'],
			['spade',12,'tiesuo'],
			['spade',13,'nanman'],
			['spade',13,'dawan'],

			['club',1,'juedou'],
			['club',1,'baiyin'],
			['club',2,'sha'],
			['club',2,'tengjia'],
			['club',2,'renwang'],
			['club',3,'sha'],
			['club',3,'zhibi'],
			['club',4,'sha'],
			['club',4,'zhibi'],
			['club',5,'sha'],
			['club',5,'dilu'],
			['club',6,'lebu'],
			['club',6,'sha','thunder'],
			['club',7,'nanman'],
			['club',7,'sha','thunder'],
			['club',8,'sha'],
			['club',8,'sha','thunder'],
			['club',9,'sha'],
			['club',9,'jiu'],
			['club',10,'sha'],
			['club',10,'bingliang'],
			['club',11,'sha'],
			['club',11,'sha'],
			['club',12,'jiedao'],
			['club',12,'tiesuo'],
			['club',13,'wuxie',null,['guo']],
			['club',13,'tiesuo'],

			['diamond',1,'zhuge'],
			['diamond',1,'zhuque'],
			['diamond',2,'shan'],
			['diamond',2,'tao'],
			['diamond',3,'shan'],
			['diamond',3,'shunshou'],
			['diamond',4,'yiyi'],
			['diamond',4,'sha','fire'],
			['diamond',5,'guanshi'],
			['diamond',5,'sha','fire'],
			['diamond',6,'shan'],
			['diamond',6,'wuliu'],
			['diamond',7,'shan'],
			['diamond',7,'shan'],
			['diamond',8,'shan'],
			['diamond',8,'shan'],
			['diamond',9,'shan'],
			['diamond',9,'jiu'],
			['diamond',10,'shan'],
			['diamond',10,'sha'],
			['diamond',11,'shan'],
			['diamond',11,'sha'],
			['diamond',12,'sha'],
			['diamond',12,'sanjian'],
			['diamond',12,'wuxie',null,['guo']],
			['diamond',13,'shan'],
			['diamond',13,'zixin'],

			['heart',1,'taoyuan'],
			['heart',1,'wanjian'],
			['heart',2,'shan'],
			['heart',2,'huogong'],
			['heart',3,'wugu'],
			['heart',3,'huogong'],
			['heart',4,'tao'],
			['heart',4,'sha','fire'],
			['heart',5,'qilin'],
			['heart',5,'chitu'],
			['heart',6,'tao'],
			['heart',6,'lebu'],
			['heart',7,'tao'],
			['heart',7,'wuzhong'],
			['heart',8,'tao'],
			['heart',8,'wuzhong'],
			['heart',9,'tao'],
			['heart',9,'yuanjiao'],
			['heart',10,'tao'],
			['heart',10,'sha'],
			['heart',11,'shan'],
			['heart',11,'yiyi'],
			['heart',12,'tao'],
			['heart',12,'sha'],
			['heart',12,'guohe'],
			['heart',13,'shan'],
			['heart',13,'zhuahuang'],
		],
		guozhanPile:[
			['spade',1,'juedou'],
			['spade',1,'shandian'],
			['spade',2,'feilongduofeng'],
			['spade',2,'bagua'],
			['spade',2,'hanbing'],
			['spade',3,'guohe'],
			['spade',3,'shunshou'],
			['spade',4,'guohe'],
			['spade',4,'shunshou'],
			['spade',5,'sha'],
			['spade',5,'jueying'],
			['spade',6,'qinggang'],
			['spade',6,'sha','thunder'],
			['spade',7,'sha'],
			['spade',7,'sha','thunder'],
			['spade',8,'sha'],
			['spade',8,'sha'],
			['spade',9,'sha'],
			['spade',9,'jiu'],
			['spade',10,'sha'],
			['spade',10,'bingliang'],
			['spade',11,'sha'],
			['spade',11,'wuxie'],
			['spade',12,'zhangba'],
			['spade',12,'tiesuo'],
			['spade',13,'nanman'],
			['spade',13,'dawan'],

			['club',1,'juedou'],
			['club',1,'baiyin'],
			['club',2,'sha'],
			['club',2,'tengjia'],
			['club',2,'renwang'],
			['club',3,'sha'],
			['club',3,'zhibi'],
			['club',4,'sha'],
			['club',4,'zhibi'],
			['club',5,'sha'],
			['club',5,'dilu'],
			['club',6,'lebu'],
			['club',6,'sha','thunder'],
			['club',7,'nanman'],
			['club',7,'sha','thunder'],
			['club',8,'sha'],
			['club',8,'sha','thunder'],
			['club',9,'sha'],
			['club',9,'jiu'],
			['club',10,'sha'],
			['club',10,'bingliang'],
			['club',11,'sha'],
			['club',11,'sha'],
			['club',12,'jiedao'],
			['club',12,'tiesuo'],
			['club',13,'wuxie',null,['guo']],
			['club',13,'tiesuo'],

			['diamond',1,'zhuge'],
			['diamond',1,'zhuque'],
			['diamond',2,'shan'],
			['diamond',2,'tao'],
			['diamond',3,'shan'],
			['diamond',3,'shunshou'],
			['diamond',4,'yiyi'],
			['diamond',4,'sha','fire'],
			['diamond',5,'guanshi'],
			['diamond',5,'sha','fire'],
			['diamond',6,'shan'],
			['diamond',6,'wuliu'],
			['diamond',7,'shan'],
			['diamond',7,'shan'],
			['diamond',8,'shan'],
			['diamond',8,'shan'],
			['diamond',9,'shan'],
			['diamond',9,'jiu'],
			['diamond',10,'shan'],
			['diamond',10,'sha'],
			['diamond',11,'shan'],
			['diamond',11,'sha'],
			['diamond',12,'sha'],
			['diamond',12,'sanjian'],
			['diamond',12,'wuxie',null,['guo']],
			['diamond',13,'shan'],
			['diamond',13,'zixin'],

			['heart',1,'taoyuan'],
			['heart',1,'wanjian'],
			['heart',2,'shan'],
			['heart',2,'huogong'],
			['heart',3,'wugu'],
			['heart',3,'taipingyaoshu'],
			['heart',3,'huogong'],
			['heart',4,'tao'],
			['heart',4,'sha','fire'],
			['heart',5,'qilin'],
			['heart',5,'chitu'],
			['heart',6,'tao'],
			['heart',6,'lebu'],
			['heart',7,'tao'],
			['heart',7,'wuzhong'],
			['heart',8,'tao'],
			['heart',8,'wuzhong'],
			['heart',9,'tao'],
			['heart',9,'yuanjiao'],
			['heart',10,'tao'],
			['heart',10,'sha'],
			['heart',11,'shan'],
			['heart',11,'yiyi'],
			['heart',12,'tao'],
			['heart',12,'sha'],
			['heart',12,'guohe'],
			['heart',13,'shan'],
			['heart',13,'zhuahuang'],

			['spade',1,'xietianzi',null,['lianheng']],
			['spade',2,'minguangkai'],
			['spade',3,'huoshaolianying',null,['lianheng']],
			['spade',4,'sha'],
			['spade',5,'qinglong'],
			['spade',6,'jiu',null,['lianheng']],
			['spade',7,'sha'],
			['spade',8,'sha'],
			['spade',9,'sha','thunder'],
			['spade',10,'sha','thunder'],
			['spade',11,'sha','thunder',['lianheng']],
			['spade',12,'lulitongxin'],
			['spade',13,'wuxie'],

			['heart',1,'lianjunshengyan'],
			['heart',2,'diaohulishan'],
			['heart',3,'jingfanma',null,['lianheng']],
			['heart',4,'shan'],
			['heart',5,'shan'],
			['heart',6,'shan'],
			['heart',7,'shan'],
			['heart',8,'tao'],
			['heart',9,'tao'],
			['heart',10,'sha'],
			['heart',11,'sha'],
			['heart',12,'huoshaolianying',null,['lianheng']],
			['heart',13,'shuiyanqijunx'],

			['club',1,'yuxi'],
			['club',2,'huxinjing',null,['lianheng']],
			['club',3,'chiling'],
			['club',4,'sha'],
			['club',5,'sha','thunder',['lianheng']],
			['club',6,'sha'],
			['club',7,'sha'],
			['club',8,'sha'],
			['club',9,'jiu'],
			['club',10,'lulitongxin'],
			['club',11,'huoshaolianying',null,['lianheng']],
			['club',12,'shuiyanqijunx'],
			['club',13,'wuxie',null,['guo']],

			['diamond',1,'xietianzi',null,['lianheng']],
			['diamond',2,'tao'],
			['diamond',3,'tao',null,['lianheng']],
			['diamond',4,'xietianzi',null,['lianheng']],
			['diamond',5,'muniu'],
			['diamond',6,'shan'],
			['diamond',7,'shan'],
			['diamond',8,'sha','fire'],
			['diamond',9,'sha','fire'],
			['diamond',10,'diaohulishan',null,['lianheng']],
			['diamond',11,'wuxie',null,['guo']],
			['diamond',12,'fangtian'],
			['diamond',13,'shan'],

			['diamond',6,'dinglanyemingzhu'],
			['heart',13,'liulongcanjia'],
			
			//['spade',12,'gz_haolingtianxia'],
			//['diamond',1,'gz_kefuzhongyuan'],
			//['heart',1,'gz_guguoanbang'],
			//['club',12,'gz_wenheluanwu'],
		],
		element:{
			content:{
				hideCharacter:function(){
					'step 0'
					event.trigger('hideCharacterEnd');
					'step 1'
					event.trigger('hideCharacterAfter');
				},
				chooseJunlingFor:function(){
					'step 0'
					var list=['junling1','junling2','junling3','junling4','junling5','junling6'];
					list=list.randomGets(2).sort();
					for(var i=0;i<list.length;i++) list[i]=['军令','',list[i]];
					var prompt=event.prompt||'选择一张军令牌';
					if(target!=undefined&&!event.prompt){
						var str=target==player?'（你）':'';
						prompt+='，令'+get.translation(target)+str+'选择是否执行';
					}
					player.chooseButton([prompt,[list,'vcard']],true).set('ai',function(button){
						return get.junlingEffect(_status.event.player,button.link[2],_status.event.getParent().target,[],_status.event.player);
					});
					'step 1'
					event.result={
						junling:result.links[0][2],
						targets:[],
					};
					if(result.links[0][2]=='junling1') player.chooseTarget('选择一名角色，做为若该军令被执行，受到伤害的角色',true).set('ai',function(_target){
						return get.damageEffect(_target,target,player);
					});
					'step 2'
					if(result.targets.length){
						player.line(result.targets,'green');
						event.result.targets=result.targets;
					}
				},
				chooseJunlingControl:function(){
					'step 0'
					var dialog=[];
					var str1=source==player?'（你）':'';
					var str2=event.targets?'（被指定的角色为'+get.translation(event.targets)+'）':'';
					if(!event.prompt) dialog.add(get.translation(event.source)+str1+'选择的军令'+str2+'为');
					else{
						dialog.add(event.prompt);
						dialog.add(get.translation(event.source)+str1+'选择的军令'+str2+'为');
					}
					dialog.add([[event.junling],'vcard']);
					var controls=[];
					if(event.choiceList){
						for(var i=0;i<event.choiceList.length;i++){
							dialog.add('<div class="popup text" style="width:calc(100% - 10px);display:inline-block">选项'+get.cnNumber(i+1,true)+'：'+event.choiceList[i]+'</div>');
							controls.push('选项'+get.cnNumber(i+1,true));
						}
					}
					else if(event.controls) controls=event.controls;
					else controls=['执行该军令','不执行该军令'];
					if(!event.ai) event.ai=function(){return Math.floor(controls.length*Math.random())};
					player.chooseControl(controls).set('dialog',dialog).set('ai',event.ai);
					'step 1'
					event.result={
						index:result.index,
						control:result.control,
					};
				},
				carryOutJunling:function(){
					'step 0'
					switch(event.junling){
						case 'junling1':{
							if(targets[0].isAlive()){
								player.line(targets,'green');
								targets[0].damage(player);
							}
							break;
						}
						case 'junling2':player.draw();event.num=1;break;
						case 'junling3':player.loseHp();break;
						case 'junling4':player.addTempSkill('junling4_eff');player.addTempSkill('fengyin_vice');player.addTempSkill('fengyin_main');break;
						case 'junling5':player.turnOver();player.addTempSkill('junling5_eff');break;
					}
					'step 1'
					if(event.junling=='junling2'&&source!=player&&player.countCards('he')>0){
						player.chooseCard('交给'+get.translation(source)+'第'+get.cnNumber(event.num)+'张牌（共两张）','he',true);
						event.ing=true;
					}
					if(event.junling=='junling6'){
						var position='',num0=0;
						if(player.countCards('h')){position+='h';num0++;}
						if(player.countCards('e')){position+='e';num0++;}
						player.chooseCard('选择一张手牌和一张装备区内牌（若有），然后弃置其余的牌',position,num0,function(card){
							if(ui.selected.cards.length) return get.position(card)!=get.position(ui.selected.cards[0]);
							return true;
						},true).set('complexCard',true).set('ai',function(card){return get.value(card)});
					}
					'step 2'
					if(event.junling=='junling2'&&source!=player){
						if(result.cards.length&&event.ing){
							player.give(result.cards,source);
						}
						event.num++;
						if(event.num<3){
							event.ing=false;
							event.goto(1);
						}
					}
					if(event.junling=='junling6'){
						var cards=player.getCards('he');
						for(var i=0;i<result.cards.length;i++) cards.remove(result.cards[i]);
						player.discard(cards);
					}
				},
				doubleDraw:function(){
					if(!player.hasMark('yinyang_mark')) player.addMark('yinyang_mark',1);
				},
				changeViceOnline:function(){
					'step 0'
					player.showCharacter(2);
					var group=lib.character[player.name1][1];
					_status.characterlist.randomSort();
					var name=false;
					for(var i=0;i<_status.characterlist.length;i++){
						var goon=false,group2=lib.character[_status.characterlist[i]][1];
						if(group=='ye'){
							if(group2!='ye') goon=true;
						}
						else{
							if(group==group2) goon=true;
							else{
								var double=get.is.double(_status.characterlist[i],true);
								if(double&&double.contains(group)) goon=true;
							}
						}
						if(goon){
							name=_status.characterlist[i];
							break;
						}
					}
					if(!name){event.finish();return;}
					_status.characterlist.remove(name);
					if(player.hasViceCharacter()){
							event.change=true;
						_status.characterlist.add(player.name2);
					}
					event.toRemove=player.name2;
					event.toChange=name;
					if(event.change) event.trigger('removeCharacterBefore');
					'step 1'
					if(event.hidden){
						if(!player.isUnseen(1)) player.hideCharacter(1);
					}
					'step 2'
					var name=event.toChange;
					if(event.hidden) game.log(player,'替换了副将','#g'+get.translation(player.name2));
					else game.log(player,'将副将从','#g'+get.translation(player.name2),'变更为','#g'+get.translation(name));
					player.viceChanged=true;
					player.reinit(player.name2,name,false);
				},
				changeVice:function(){
					'step 0'
					player.showCharacter(2);
					if(!event.num) event.num=3;
					var group=player.identity;
					if(!lib.group.contains(group)) group=lib.character[player.name1][1];
					_status.characterlist.randomSort();
					event.tochange=[]
					for(var i=0;i<_status.characterlist.length;i++){
						var goon=false,group2=lib.character[_status.characterlist[i]][1];
						if(group=='ye'){
							if(group2!='ye') goon=true;
						}
						else{
							if(group==group2) goon=true;
							else{
								var double=get.is.double(_status.characterlist[i],true);
								if(double&&double.contains(group)) goon=true;
							}
						}
						if(goon){
							event.tochange.push(_status.characterlist[i]);
							if(event.tochange.length==event.num) break;
						}
					}
					if(!event.tochange.length) event.finish();
					else{
						if(event.tochange.length==1) event._result={
							bool:true,
							links:event.tochange,
						}
						else player.chooseButton(true,['选择要变更的武将牌',[event.tochange,'character']]).ai=function(button){
							return get.guozhanRank(button.link);
						};
					}
					'step 1'
					var name=result.links[0];
					_status.characterlist.remove(name);
					if(player.hasViceCharacter()){
						event.change=true;
						_status.characterlist.add(player.name2);
					}
					event.toRemove=player.name2;
					event.toChange=name;
					if(event.change) event.trigger('removeCharacterBefore');
					if(event.hidden){
						if(!player.isUnseen(1)) player.hideCharacter(1);
					}
					'step 2'
					var name=event.toChange;
					if(event.hidden) game.log(player,'替换了副将','#g'+get.translation(player.name2));
					else game.log(player,'将副将从','#g'+get.translation(player.name2),'变更为','#g'+get.translation(name));
					player.viceChanged=true;
					player.reinit(player.name2,name,false);
				},
				/*----分界线----*/
				mayChangeVice:function(){
					'step 0'
					player.chooseBool('是否变更副将？').set('ai',function(){
						var player=_status.event.player;
						return get.guozhanRank(player.name2,player)<=3;
					});
					'step 1'
					if(result.bool){
						if(!event.repeat) _status.changedSkills.add(event.skill)
						player.changeVice(event.hidden);
					}
				},
				zhulian:function(){
					player.popup('珠联璧合');
					if(!player.hasMark('zhulianbihe_mark')) player.addMark('zhulianbihe_mark',1);
				},
			},
			player:{
				getGuozhanGroup:function(num){
					if(get.is.double(this.name2)) return lib.character[this.name1][1];
					if(num==1) return lib.character[this.name2][1];
					return lib.character[this.name1][1];
				},
				chooseJunlingFor:function(target){
						var next=game.createEvent('chooseJunlingFor');
						next.player=this;
						next.target=target;
						next.setContent('chooseJunlingFor');
						return next;
					},
					chooseJunlingControl:function(source,junling,targets){
						var next=game.createEvent('chooseJunlingControl');
						next.player=this;
						next.source=source;
						next.junling=junling;
						if(targets.length) next.targets=targets;
						next.setContent('chooseJunlingControl');
						return next;
					},
					carryOutJunling:function(source,junling,targets){
						var next=game.createEvent('carryOutJunling');
						next.source=source;
						next.player=this;
						if(targets.length) next.targets=targets;
						next.junling=junling;
						next.setContent('carryOutJunling');
						return next;
					},
				/**/
				mayChangeVice:function(repeat,hidden){
					if(!_status.changedSkills) _status.changedSkills=[];
					var skill=_status.event.name;
					if(repeat||!_status.changedSkills.contains(skill)){
						var next=game.createEvent('mayChangeVice');
						next.setContent('mayChangeVice');
						next.player=this;
						next.skill=skill;
						if(repeat||(!_status.connectMode&&get.config('changeViceType')=='online')) next.repeat=true;
						if(hidden=='hidden') next.hidden=true;
						return next;
					}
				},
				differentIdentityFrom:function(target,self){
					if(this==target) return false;
					if(this.storage.yexinjia_friend==target||target.storage.yexinjia_friend==this) return false;
					if(self){
						if(target.identity=='unknown') return false;
						if(target.identity=='ye'||this.identity=='ye') return true;
						if(this.identity=='unknown'){
							var identity=lib.character[this.name1][1];
							if(this.wontYe()) return identity!=target.identity;
							return true;
						}
					}
					else{
						if(this.identity=='unknown'||target.identity=='unknown') return false;
						if(this.identity=='ye'||target.identity=='ye') return true;
					}
					return this.identity!=target.identity;
				},
				sameIdentityAs:function(target,shown){
					if(this.storage.yexinjia_friend==target||target.storage.yexinjia_friend==this) return true;
					if(shown){
						if(this.identity=='ye'||this.identity=='unknown') return false;
					}
					else{
						if(this==target) return true;
						if(target.identity=='unknown'||target.identity=='ye'||this.identity=='ye') return false;
						if(this.identity=='unknown'){
							var identity=lib.character[this.name1][1];
							if(this.wontYe()) return identity==target.identity;
							return false;
						}
					}
					return this.identity==target.identity;
				},
				getModeState:function(){
					return {
						unseen:this.isUnseen(0),
						unseen2:this.isUnseen(1),
					}
				},
				setModeState:function(info){
					if(info.mode.unseen) this.classList.add('unseen');
					if(info.mode.unseen2) this.classList.add('unseen2');
					if(!info.name) return;
					// if(info.name.indexOf('unknown')==0){
					// 	if(this==game.me){
					// 		lib.translate[info.name]+='（你）';
					// 	}
					// }
					this.init(info.name1,info.name2,false);
					this.name1=info.name1;
					this.name=info.name;
					this.node.name_seat=ui.create.div('.name.name_seat',get.verticalStr(lib.translate[this.name].slice(0,3)),this);
					if(info.identityShown){
						this.setIdentity(info.identity);
						this.node.identity.classList.remove('guessing');
					}
					else if(this!=game.me){
						this.node.identity.firstChild.innerHTML='猜';
						this.node.identity.dataset.color='unknown';
						this.node.identity.classList.add('guessing');
					}
				},
				dieAfter2:function(source){
					var that=this;
					if(source&&source.hasSkillTag('noDieAfter2',null,this)) return;
					if(source&&source.shijun){
						source.discard(source.getCards('he'));
						delete source.shijun;
					}
					else if(source&&source.identity!='unknown'){
						if(source.identity=='ye') source.draw(3);
						else if(source.shijun2){
							delete source.shijun2;
							source.draw(1+game.countPlayer(function(current){
								return current.group==that.group
							}));
						}
						else if(this.identity=='ye') source.draw(1);
						else if(this.identity!=source.identity) source.draw(get.population(this.identity)+1);
						else source.discard(source.getCards('he'));
					}
				},
				dieAfter:function(source){
					this.showCharacter(2);
					if(get.is.jun(this.name1)){
						if(source&&source.identity==this.identity) source.shijun=true;
						else if(source&&source.identity!='ye') source.shijun2=true;
						var yelist=[];
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].identity==this.identity){
								yelist.push(game.players[i]);
							}
						}
						game.broadcastAll(function(list){
							for(var i=0;i<list.length;i++){
								list[i].identity='ye';
								list[i].setIdentity();
							}
						},yelist);
						_status.yeidentity.add(this.identity);
					}
					game.tryResult();
				},
				viewCharacter:function(target,num){
					if(num!=0&&num!=1){
						num=2;
					}
					if(!target.isUnseen(num)){
						return;
					}
					var next=game.createEvent('viewCharacter');
					next.player=this;
					next.target=target;
					next.num=num;
					next.setContent(function(){
						if(!player.storage.zhibi){
							player.storage.zhibi=[];
						}
						player.storage.zhibi.add(target);
						var content,str=get.translation(target)+'的';
						if(event.num==0||!target.isUnseen(1)){
							content=[str+'主将',[[target.name1],'character']];
							game.log(player,'观看了',target,'的主将');
						}
						else if(event.num==1||!target.isUnseen(0)){
							content=[str+'副将',[[target.name2],'character']];
							game.log(player,'观看了',target,'的副将');
						}
						else{
							content=[str+'主将和副将',[[target.name1,target.name2],'character']];
							game.log(player,'观看了',target,'的主将和副将');
						}
						player.chooseControl('ok').set('dialog',content);
					})
				},
				checkViceSkill:function(skill,disable){
					if(game.expandSkills(lib.character[this.name2][3].slice(0)).contains(skill)){
						return true;
					}
					else{
						if(disable!==false){
							this.awakenSkill(skill);
						}
						return false;
					}
				},
				checkMainSkill:function(skill,disable){
					if(game.expandSkills(lib.character[this.name1][3].slice(0)).contains(skill)){
						return true;
					}
					else{
						if(disable!==false){
							this.awakenSkill(skill);
						}
						return false;
					}
				},
				removeMaxHp:function(num){
					if(game.online) return;
					if(!num) num=1;
					while(num>0){
						num--;
						if(typeof this.singleHp=='boolean'){
							if(this.singleHp){
								this.singleHp=false;
							}
							else{
								this.singleHp=true;
								this.maxHp--;
							}
						}
						else{
							this.maxHp--;
						}
					}
					this.update();
				},
				hideCharacter:function(num,log){
					if(this.isUnseen(2)){
						return;
					}
					game.addVideo('hideCharacter',this,num);
					var toHide;
					var skills;
					switch(num){
						case 0:
						if(log!==false) game.log(this,'暗置了主将'+get.translation(this.name1));
						toHide=this.name1;
						skills=lib.character[this.name1][3];
						this.name=this.name2;
						this.sex=lib.character[this.name2][0];
						this.classList.add('unseen');
						break;
						case 1:
						if(log!==false) game.log(this,'暗置了副将'+get.translation(this.name2));
						toHide=this.name2;
						skills=lib.character[this.name2][3];
						this.classList.add('unseen2');
						break;
					}
					game.broadcast(function(player,name,sex,num,skills){
						player.name=name;
						player.sex=sex;
						switch(num){
							case 0:player.classList.add('unseen');break;
							case 1:player.classList.add('unseen2');break;
						}
						for(var i=0;i<skills.length;i++){
							if(!player.skills.contains(skills[i])) continue;
							player.hiddenSkills.add(skills[i]);
							player.skills.remove(skills[i]);
						}
					},this,this.name,this.sex,num,skills);
					for(var i=0;i<skills.length;i++){
						if(!this.skills.contains(skills[i])) continue;
						this.hiddenSkills.add(skills[i]);
						var info=get.info(skills[i]);
						if(info.ondisable&&info.onremove){
							info.onremove(this);
						}
						this.skills.remove(skills[i]);
					}
					this.checkConflict();
					var next=game.createEvent('hideCharacter',false);
					next.player=this;
					next.toHide=toHide;
					next.setContent('hideCharacter');
					return next;
				},
				removeCharacter:function(num){
					var name=this['name'+(num+1)];
					var next=game.createEvent('removeCharacter');
					next.player=this;
					next.toRemove=name;
					next.num=num;
					next.setContent('removeCharacter');
					return next;
				},
				$removeCharacter:function(num){
					var name=this['name'+(num+1)];
					var info=lib.character[name];
					if(!info) return;
					var to='gz_shibing'+(info[0]=='male'?1:2)+info[1];
					game.log(this,'移除了'+(num?'副将':'主将'),'#b'+name);
					this.reinit(name,to,false);
					this.showCharacter(num,false);
					_status.characterlist.add(name);
				},
				changeVice:function(hidden){
					var next=game.createEvent('changeVice');
					next.player=this;
					next.setContent('changeVice');
					next.num=(!_status.connectMode&&get.config('changeViceType')=='online')?1:3;
					if(hidden) next.hidden=true;
					return next;
				},
				hasMainCharacter:function(){
					return this.name1.indexOf('gz_shibing')!=0;
				},
				hasViceCharacter:function(){
					return this.name2.indexOf('gz_shibing')!=0;
				},
				$showCharacter:function(num,log){
					var showYe=false;
					if(num==0&&!this.isUnseen(0)){
						return;
					}
					if(num==1&&!this.isUnseen(1)){
						return;
					}
					if(!this.isUnseen(2)){
						return;
					}
					game.addVideo('showCharacter',this,num);
					if(this.identity=='unknown'||((num==0||num==2)&&lib.character[this.name1][1]=='ye')){
						this.group=this.getGuozhanGroup(num);
						if((num==0||num==2)&&lib.character[this.name1][1]=='ye'){
							this.identity='ye';
							if(!this._ye){
								this._ye=true;
								showYe=true;
							}
						}
						else if(get.is.jun(this.name1)&&this.isAlive()){
							this.identity=this.group;
						}
						else if(this.wontYe(this.group)){
							this.identity=this.group;
						}
						else{
							this.identity='ye';
						}
						this.setIdentity(this.identity);
						this.ai.shown=1;
						this.node.identity.classList.remove('guessing');

						if(_status.clickingidentity&&_status.clickingidentity[0]==this){
							for(var i=0;i<_status.clickingidentity[1].length;i++){
								_status.clickingidentity[1][i].delete();
								_status.clickingidentity[1][i].style.transform='';
							}
							delete _status.clickingidentity;
						}
						game.addVideo('setIdentity',this,this.identity);
					}
					var skills;
					switch(num){
						case 0:
						if(log!==false) game.log(this,'展示了主将','#b'+this.name1);
						this.name=this.name1;
						skills=lib.character[this.name][3];
						this.sex=lib.character[this.name][0];
						this.classList.remove('unseen');
						break;
						case 1:
						if(log!==false) game.log(this,'展示了副将','#b'+this.name2);
						skills=lib.character[this.name2][3];
						if(this.sex=='unknown') this.sex=lib.character[this.name2][0];
						if(this.name.indexOf('unknown')==0) this.name=this.name2;
						this.classList.remove('unseen2');
						break;
						case 2:
						if(log!==false) game.log(this,'展示了主将','#b'+this.name1,'、副将','#b'+this.name2);
						this.name=this.name1;
						skills=lib.character[this.name][3].concat(lib.character[this.name2][3]);
						this.sex=lib.character[this.name][0];
						this.classList.remove('unseen');
						this.classList.remove('unseen2');
						break;
					}
					game.broadcast(function(player,name,sex,num,identity,group){
						player.identityShown=true;
						player.group=group;
						player.name=name;
						player.sex=sex;
						player.node.identity.classList.remove('guessing');
						switch(num){
							case 0:player.classList.remove('unseen');break;
							case 1:player.classList.remove('unseen2');break;
							case 2:player.classList.remove('unseen');player.classList.remove('unseen2');break;
						}
						player.ai.shown=1;
						player.identity=identity;
						player.setIdentity(identity);
						if(_status.clickingidentity&&_status.clickingidentity[0]==player){
							for(var i=0;i<_status.clickingidentity[1].length;i++){
								_status.clickingidentity[1][i].delete();
								_status.clickingidentity[1][i].style.transform='';
							}
							delete _status.clickingidentity;
						}
					},this,this.name,this.sex,num,this.identity,this.group);
					this.identityShown=true;
					for(var i=0;i<skills.length;i++){
						this.hiddenSkills.remove(skills[i]);
						this.addSkill(skills[i]);
					}
					this.checkConflict();
					if(!this.viceChanged){
						var initdraw=get.config('initshow_draw');
						if(_status.connectMode) initdraw=lib.configOL.initshow_draw;
						if(!_status.initshown&&!_status.overing&&initdraw!='off'&&this.isAlive()&&_status.mode!='mingjiang'){
							this.popup('首亮');
							if(initdraw=='draw'){
								game.log(this,'首先明置武将，得到奖励');
								game.log(this,'摸了两张牌');
								this.draw(2).log=false;
							}
							else{
								this.addMark('xianqu_mark',1);
							}
							_status.initshown=true;
						}
						if(!this.isUnseen(2)&&!this._mingzhied){
							this._mingzhied=true;
							if(this.singleHp){
								this.doubleDraw();
							}
							if(this.perfectPair()){
								var next=game.createEvent('guozhanDraw');
								next.player=this;
								next.setContent('zhulian');
							}
						}
						if(showYe){
							this.addMark('yexinjia_mark',1);
						}
					}
					game.tryResult();
				},
				wontYe:function(group){
					if(!group) group=lib.character[this.name1][1];
					if(_status.yeidentity&&_status.yeidentity.contains(group)) return false;
					if(get.zhu(this,null,group)) return true;
					return get.totalPopulation(group)+1<=get.population()/2;
				},
				perfectPair:function(choosing){
					if(_status.connectMode){
						if(!lib.configOL.zhulian) return false;
					}
					else{
						if(!get.config('zhulian')) return false;
					}
					var name1=this.name1;
					var name2=this.name2;
					if(name1.indexOf('gz_shibing')==0) return false;
					if(name2.indexOf('gz_shibing')==0) return false;
					if(get.is.jun(this.name1)) return true;
					if(choosing&&lib.character[name1][1]!='ye'&&lib.character[name2][1]!='ye'&&lib.character[name1][1]!=lib.character[name2][1]) return false;
					var list=['re','diy','sp','jsp','shen','jg','xin','old','ol','sb','sc','gz'];
					for(var i=0;i<list.length;i++){
						if(name1.indexOf(list[i]+'_')==0){
							name1=name1.slice(list[i].length+1);
						}
						if(name2.indexOf(list[i]+'_')==0){
							name2=name2.slice(list[i].length+1);
						}
					}
					if(lib.perfectPair[name1]&&lib.perfectPair[name1].contains(name2)){
						return true;
					}
					if(lib.perfectPair[name2]&&lib.perfectPair[name2].contains(name1)){
						return true;
					}
					return false;
				},
				siege:function(player){
					if(this.identity=='unknown'||this.hasSkill('undist')) return false;
					if(!player){
						var next=this.getNext();
						if(next&&next.sieged()) return true;
						var previous=this.getPrevious();
						if(previous&&previous.sieged()) return true;
						return false;
					}
					else{
						return player.sieged()&&(player.getNext()==this||player.getPrevious()==this);
					}
				},
				sieged:function(player){
					if(this.identity=='unknown') return false;
					if(player){
						return player.siege(this);
					}
					else{
						var next=this.getNext();
						var previous=this.getPrevious();
						if(next&&previous&&next!=previous){
							if(next.identity=='unknown'||next.isFriendOf(this)) return false;
							return next.isFriendOf(previous);
						}
						return false;
					}
				},
				inline:function(){
					if(this.identity=='unknown'||this.identity=='ye'||this.hasSkill('undist')) return false;
					var next=this,previous=this;
					var list=[];
					for(var i=0;next||previous;i++){
						if(next){
							next=next.getNext();
							if(!next.isFriendOf(this)||next==this){
								next=null;
							}
							else{
								list.add(next);
							}
						}
						if(previous){
							previous=previous.getPrevious();
							if(!previous.isFriendOf(this)||previous==this){
								previous=null;
							}
							else{
								list.add(previous);
							}
						}
					}
					if(!list.length) return false;
					for(var i=0;i<arguments.length;i++){
						if(!list.contains(arguments[i])&&arguments[i]!=this) return false;
					}
					return true;
				},
				isMajor:function(){
					if(this.identity=='unknown') return false;
					var list=game.filterPlayer(function(current){
						return current.identity!='unknown'&&current.hasSkillTag('forceMajor');
					});
					if(list.length){
						for(var i of list){
							if(i.isFriendOf(this)) return true;
						}
						return false;
					}
					var map={},sides=[],pmap=_status.connectMode?lib.playerOL:game.playerMap,player;
					for(var i of game.players){
						if(i.identity=='unknown') continue;
						var added=false;
						for(var j of sides){
							if(i.isFriendOf(pmap[j])){
								added=true;
								map[j].push(i);
								if(i==this) player=j;
								break;
							}
						}
						if(!added){
							map[i.playerid]=[i];
							sides.push(i.playerid);
							if(i==this) player=i.playerid;
						}
					}
					if(!player||map[player].length<2) return false;
					for(var i in map){
						if(map[i].length>map[player].length) return false;
					}
					return true;
				},
				isNotMajor:function(){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].isMajor()){
							return !this.isMajor();
						}
					}
					return false;
				},
				isMinor:function(nomajor){
					if(this.identity=='unknown'||(!nomajor&&this.isMajor())) return false;
					if(!nomajor&&!game.hasPlayer(function(current){
						return current.isMajor();
					})){
						return false;
					}
					var map={},sides=[],pmap=_status.connectMode?lib.playerOL:game.playerMap,player;
					for(var i of game.players){
						if(i.identity=='unknown') continue;
						var added=false;
						for(var j of sides){
							if(i.isFriendOf(pmap[j])){
								added=true;
								map[j].push(i);
								if(i==this) player=j;
								break;
							}
						}
						if(!added){
							map[i.playerid]=[i];
							sides.push(i.playerid);
							if(i==this) player=i.playerid;
						}
					}
					for(var i in map){
						if(map[i].length<map[player].length) return false;
					}
					return true;
				},
				logAi:function(targets,card){
					if(this.ai.shown==1||this.isMad()) return;
					if(typeof targets=='number'){
						this.ai.shown+=targets;
					}
					else{
						var effect=0,c,shown;
						var info=get.info(card);
						if(info.ai&&info.ai.expose){
							if(_status.event.name=='_wuxie'){
								if(_status.event.source&&_status.event.source.ai.shown){
									this.ai.shown+=0.2;
								}
							}
							else{
								this.ai.shown+=info.ai.expose;
							}
						}
						if(targets.length>0){
							for(var i=0;i<targets.length;i++){
								shown=Math.abs(targets[i].ai.shown);
								if(shown<0.2||targets[i].identity=='nei') c=0;
								else if(shown<0.4) c=0.5;
								else if(shown<0.6) c=0.8;
								else c=1;
								effect+=get.effect(targets[i],card,this)*c;
							}
						}
						if(effect>0){
							if(effect<1) c=0.5;
							else c=1;
							if(targets.length==1&&targets[0]==this);
							else if(targets.length==1) this.ai.shown+=0.2*c;
							else this.ai.shown+=0.1*c;
						}
					}
					if(this.ai.shown>0.95) this.ai.shown=0.95;
					if(this.ai.shown<-0.5) this.ai.shown=-0.5;
				},
			}
		},
		get:{
			guozhanReverse:function(name1,name2){
				if(get.is.double(name2)) return false;
				if(['gz_xunyou','gz_lvfan','gz_liubei'].contains(name2)) return true;
				if(name1=='gz_re_xushu') return true;
				if(name2=='gz_dengai') return lib.character[name1][2]%2==1;
				if(['gz_sunce','gz_jiangwei'].contains(name1)) return name2=='gz_zhoutai'||lib.character[name2][2]%2==1;
				return false;
			},
			guozhanRank:function(name,player){
				if(name.indexOf('gz_shibing')==0) return -1;
				if(name.indexOf('gz_jun_')==0) return 7;
				if(player){
					var skills=lib.character[name][3].slice(0);
					for(var i=0;i<skills.length;i++){
						if(lib.skill[skills[i]].limited&&player.awakenedSkills.contains(skills[i])) return skills.length-1;
					}
				}
				if(_status._aozhan){
					for(var i in lib.aozhanRank){
						if(lib.aozhanRank[i].contains(name)) return parseInt(i);
					}
				}
				for(var i in lib.guozhanRank){
					if(lib.guozhanRank[i].contains(name)) return parseInt(i);
				}
				return 0;
			},
			junlingEffect:function(source,junling,performer,targets,viewer){
				var att1=get.attitude(viewer,source),att2=get.attitude(viewer,performer);
				var eff1=0,eff2=0;
				switch(junling){
					case 'junling1':
					if(!targets.length&&game.countPlayer(function(current){return get.damageEffect(viewer,current,viewer)>0})) eff1=2;
					else{
						if(get.damageEffect(targets[0],performer,source)>=0) eff1=2;
						else eff1=-2;
						if(get.damageEffect(targets[0],source,performer)>=0) eff2=2;
						else eff2=-2;
					}
					break;
					case 'junling2':
					if(performer.countCards('he')){eff1=1;eff2=0;}
					else{eff1=2;eff2=-1;}
					break;
					case 'junling3':
					if(performer.hp==1&&!performer.hasSkillTag('save',true)) eff2=-5;
					else{
						if(performer==viewer){
							if(performer.hasSkillTag('maihp',true)) eff2=3;
							else eff2=-2;
						}
						else{
							if(performer.hasSkillTag('maihp',false)) eff2=3;
							else eff2=-2;
						}
					}
					break;
					case 'junling4':eff1=0;eff2=-2;break;
					case 'junling5':
					var td=performer.isTurnedOver();
					if(td){
						if(performer==viewer){
							if(_status.currentPhase==performer&&performer.hasSkill('jushou')) eff2=-3;
							else eff2=3;
						}
						else eff2=3;
					}
					else{
						if(performer==viewer){
							if(performer.hasSkillTag('noturn',true)) eff2=0;
							else eff2=-3;
						}
						else{
							if(performer.hasSkillTag('noturn',false)) eff2=0;
							else eff2=-3;
						}
					}
					break;
					case 'junling6':
					if(performer.countCards('h')>1) eff2+=1-performer.countCards('h');
					if(performer.countCards('e')>1) eff2+=1-performer.countCards('e');
					break;
				}
				return Math.sign(att1)*eff1+Math.sign(att2)*eff2;
			},
			realAttitude:function(from,to,difficulty,toidentity){
				if(from.identity==toidentity&&toidentity!='ye'){
					return 4+difficulty;
				}
				if(from.identity=='unknown'&&lib.character[from.name1][1]==toidentity){
					if(from.wontYe()) return 4+difficulty;
				}
				var groups=[];
				var map={},sides=[],pmap=_status.connectMode?lib.playerOL:game.playerMap,player;
				for(var i of game.players){
					if(i.identity=='unknown') continue;
					var added=false;
					for(var j of sides){
						if(i.isFriendOf(pmap[j])){
							added=true;
							map[j].push(i);
							if(i==this) player=j;
							break;
						}
					}
					if(!added){
						map[i.playerid]=[i];
						sides.push(i.playerid);
						if(i==this) player=i.playerid;
					}
				}
				for(var i in map){
					var num=map[i].length;
					groups.push(num);
				}
				var max=Math.max.apply(this,groups);
				if(max<=1) return -3;
				var from_p;
				if(from.identity=='unknown'&&from.wontYe()) from_p=get.population(lib.character[from.name1][1]);
				else from_p=game.countPlayer(function(current){
					return current.isFriendOf(from);
				});
				var to_p=game.countPlayer(function(current){
					return current.isFriendOf(to);
				});
				if(to.identity=='ye') to_p+=1.5;

				if(to_p>=max) return -5;
				if(from_p>=max) return -2-to_p;
				if(max>=game.players.length/2){
					if(to_p<=from_p){
						return 0.5;
					}
					return 0;
				}
				if(to_p<max-1) return 0;
				return -0.5;
			},
			rawAttitude:function(from,to){
				if(to.identity=='unknown'&&game.players.length==2) return -5;
				if(_status.currentPhase==from&&from.ai.tempIgnore&&
					from.ai.tempIgnore.contains(to)&&to.identity=='unknown'&&
					(!from.storage.zhibi||!from.storage.zhibi.contains(to))) return 0;
				var difficulty=0;
				if(to==game.me) difficulty=(2-get.difficulty())*1.5;
				if(from==to) return 5+difficulty;
				if(from.isFriendOf(to)) return 5+difficulty;
				if(from.identity=='unknown'&&lib.character[from.name1][1]==to.identity){
					if(from.wontYe()) return 4+difficulty;
				}
				var toidentity=to.identity;
				if(toidentity=='unknown'){
					toidentity=lib.character[to.name1][1];
					if(!to.wontYe()){
						toidentity='ye';
					}
				}
				var att=get.realAttitude(from,to,difficulty,toidentity);
				if(from.storage.zhibi&&from.storage.zhibi.contains(to)){
					return att;
				}
				if(to.ai.shown>=0.5) return att*to.ai.shown;

				var nshown=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=from&&game.players[i].identity=='unknown'){
						nshown++;
					}
				}
				if(to.ai.shown==0){
					if(nshown>=game.players.length/2&&att>=0){
						return 0;
					}
					return Math.min(0,Math.random()-0.5)+difficulty;
				}
				if(to.ai.shown>=0.2){
					if(att>2){
						return Math.max(0,Math.random()-0.5)+difficulty;
					}
					if(att>=0){
						return 0;
					}
					return Math.min(0,Math.random()-0.7)+difficulty;
				}
				if(att>2){
					return Math.max(0,Math.random()-0.7)+difficulty;
				}
				if(att>=0){
					return Math.min(0,Math.random()-0.3)+difficulty;
				}
				return Math.min(0,Math.random()-0.5)+difficulty;
			},
		},
		help:{
			'国战模式':
			'<div style="margin:10px">声明</div><ul style="margin-top:0"><li>以下所有规则均为根据公开爆料整理，经村规改动后制定的临时规则。不代表任何官方意见。请以后续发布的官方规则作为标准。</ul>'
			+'<div style="margin:10px">双势力武将</div><ul style="margin-top:0"><li>双势力武将牌只能放在副将位置。主将可以为普通武将牌和野心家武将牌。<br><li>双势力武将牌明置时，势力按照主将的势力进行结算（无论是否明置主将）。胜负条件与正常的单势力武将相同。<br><li>变更副将时，可以选择包含原势力的双势力武将牌。左慈发动【役鬼】时，可以使用双势力武将牌同时指定两个不同势力的角色为目标。<br><li>特殊地，“冈崎汐”作为多势力武将牌，结算流程和规则与其他双势力武将相同。</ul>'
			+'<div style="margin:10px">野心家武将</div><ul style="margin-top:0"><li>野心家武将只能放在主将位置。副将可以为任意非野心家武将牌。<br><li>选择了野心家武将牌的角色（以下简称“野心家角色”）仅明置副将时，若副将为单势力武将牌，则势力暂时视为与该武将牌相同。若副将为双势力武将牌，则势力视为野心家。<br><li>野心家角色明置主将时，其势力改为野心家。若其是首次明置该武将牌，则其获得一个“野心家”标记。<br><li>“野心家”标记可以当做“先驱”标记，“阴阳鱼”标记或是“珠联璧合”标记使用。当同时拥有两种标记时，优先弃置原装标记，下次发动时才弃置“野心家”标记。<br><li>野心家角色变更副将时，若其主将未明置过，则按照副将的势力进行变更。若主将已经明置过，则可以选择所有的非野心家武将牌。左慈发动【役鬼】时，可以使用野心家武将牌同时指定所有势力的角色为目标。'
			+'<br><li>当场上触发了胜利条件时，若这些角色中存在未明置过主将的野心家角色，则这些野心家角色选择是否“暴露野心”。若无人选择“是”且场上存在非野心家角色存活，则所有非野心家角色胜利，野心家角色失败。若有人选择“是”，则这些角色明置主将。然后若场上存活角色数大于等于3，则这些角色选择是否发起“拉拢人心”<br><li>选择发起“拉拢人心”的野心家角色，令所有其他非野心家角色和非君主角色依次选择是否和该野心家角色“结盟”。若有人选择“是”，则野心家角色弃置“野心家”标记，且该角色将势力改为野心家，将手牌摸至四张并回复1点体力，且视为和发起“拉拢人心”的野心家角色势力相同，并终止对其他角色的询问。</ul>'
			+'<div style="margin:10px">纵横捭阖</div><ul style="margin-top:0"><li>当一名角色对目标角色发动具有拥有“纵横”衍生技的技能时，其可以令对方获得“纵横”衍生技直到其下回合结束。</ul>',
		},
	};
});
