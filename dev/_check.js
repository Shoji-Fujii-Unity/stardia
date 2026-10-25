"use strict";/* ================= helpers ================= */
const $=s=>document.querySelector(s);
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function ri(a,b){return Math.floor(a+Math.random()*(b-a+1));}
function fmt(t,p){return String(t).replace(/\{(\w+)\}/g,(m,k)=>(p&&p[k]!==undefined)?p[k]:m);}
/* ================= i18n ================= */
const LANGS=['ja','en','zh'];
const LANGNAME={ja:'日本語',en:'English',zh:'中文'};
function detectLang(){const n=(navigator.language||'en').toLowerCase();if(n.indexOf('ja')===0)return 'ja';if(n.indexOf('zh')===0)return 'zh';return 'en';}
let SET={lang:detectLang(),sound:true};
if(LANGS.indexOf(SET.lang)<0)SET.lang='en';
const EN={
app:'Stardia',
tag:'Raise a star-born creature through 60 days of adventure!',
menu_title:'Title',menu_new:'New Journey',menu_cont:'Continue ▶',menu_del:'✕',menu_slots:'Select a Save',menu_slots_sub:'Choose a slot to begin',
menu_start:'Start',menu_delq:'Delete this save data?',menu_yes:'Yes',menu_no:'Cancel',menu_back:'Back',
m_save:'Save',m_title:'Title',m_help:'Help',
help_text:'Drag the view to rotate • Tap the creature to pet it ♥\n2 actions each day, then "End Day" to rest.\nEvolutions happen around day 20 and day 45 — the branch is decided by how you raise it.\n21 endings • 30 forms. Mood changes how much you grow.\nAuto-saves every action (local storage, 3 slots).',
new_title:'Choose your partner',new_sub:'Pick a starter, then give it a name.',starter_t1:'Lively flame child • likes training and adventures',starter_t2:'Calm sprout child • likes studying and hobbies',starter_t3:'Cheerful wave child • likes play and grooming',name_label:'Nickname',start_btn:'Hatch the egg ✦',replace:'Replace this save?',n_extra:'Tip: stat gains scale with Mood, and illness slows growth.',
d:'Day {d}/{max}',ph1:'Morning',ph2:'Daytime',ph3:'Evening',stage_l:'Stage',
st_pw:'Power',st_br:'Brains',st_ch:'Charm',st_st:'Stamina',st_sp:'Spirit',mood:'Mood',energy:'Energy',coins:'Coins',total:'Total',
a_end:'End the Day ✦',
a_train:'Train',a_study:'Study',a_work:'Work',a_adventure:'Adventure',a_rest:'Rest',a_play:'Play',a_hobby:'Hobby',a_shop:'Shop',a_groom:'Groom',a_medicine:'Medicine',a_social:'Visit Town',a_clean:'Clean',
a_tip_train:'Run & lift weights. Power↑ Stamina↑',a_tip_study:'Books & puzzles. Brains↑',a_tip_work:'Earn coins. Stamina↑ a little Charm',a_tip_adventure:'Explore outside. Luck decides the spoils',a_tip_rest:'Sleep. Energy♥ cures tired & illness',a_tip_play:'Play together. Mood↑♥ Charm↑',a_tip_hobby:'Make & create. Spirit↑ Brains↑ Mood↑',a_tip_shop:'Fresh outfit. Charm↑ Mood↑ (coins)',a_tip_groom:'Brush & polish. Charm↑ Mood↑',a_tip_medicine:'Take medicine. Cures illness (free)',a_tip_social:'Meet friends in town. Mood↑♥ Brains↑',a_tip_clean:'Tidy up the hut. Mood↑ Stamina↑',
e_train:'Training montage!',e_study:'Deep in a book…',e_work:'Off to work!',e_adventure:'The adventure begins!',e_rest:'A cozy nap.',e_play:'Play-play-play!',e_hobby:'Lost in a hobby…',e_shop:'Shopping trip!',e_groom:'Brush, brush, polish!',e_medicine:'Yikes, medicine time…',e_social:'A stroll into town.',e_clean:'Cleaning time!',
no_energy:'Too tired for that…',no_coins:'Not enough coins…',no_medicine:'Not sick right now.',tired_now:'You\'re exhausted! Only easy activities until you rest.',
ad_pre:'Too worn out for a real adventure — rest or train first!',ad_great_tre:'You found an ancient artifact!',ad_bad:'Rain, mud and grumbles…',ad_wonder:'You glimpse a wonder of nature…',saved_ok:'Saved!',save_failed:'Save failed. Check browser storage settings.',
g_pw:'Power',g_br:'Brains',g_ch:'Charm',g_st:'Stamina',g_sp:'Spirit',g_mood:'Mood',g_coins:'coins',g_energy:'Energy',
daysep:'— Day {d} —',day60:'Day 60. The final day…',
evo_l1:'{n} evolved into {f}!',evo_l2:'{n} has changed…',evolve_title:'EVOLUTION!',
log_pet:'You pet your {n}. It leans into you ♥',
w_ill:'Your {n} looks pale…',w_heal:'You\'re all better!',w_tired:'Dead tired… rest is a must!',w_food:'Meals cost {c} coins.',
f_market_t:'Market day!',f_market_m:'Coins jingle in the square. Where to?',f_b1:'A safe fund',f_b2:'A dice stall',f_b3:'Just window-shop',f_market_r1:'Steady savings: +{c} coins.',f_market_r2:'You won big! +{c} coins!',f_market_r3:'You lost… -{c} coins.',f_market_r4:'Window-shopping is free. Mood +{a}.',
f_rival_t:'A rival appears!',f_rival_m:'A flashy sprite smirks: "Think you can beat me?"',f_b4:'Raise the white flag',f_b5:'Pretend not to notice',f_b6:'Wave friendly',f_rival_r1:'A rivalry begins! Power +{a}, Stamina +{a2}.',f_rival_r2:'It vanishes. Spirit +{a}.',f_rival_r3:'You swap numbers. Charm +{a}, Mood +{a2}!',
f_cup_t:'Tournament day!',f_cup_m:'All eyes on your {n} in the arena…',f_cup_b1:'Fight!',f_cup_b2:'Cheer from the stands',f_cup_r1:'CHAMPION!! +{c} coins, Power +{a}, Mood +{a2}!',f_cup_r2:'So close… but it learned a lot. Stamina +{a}, Mood +{a2}.',f_cup_r3:'You cheered hard. Mood +{a}.',
f_sick_t:'Cough… sniffle…',f_sick_m:'Your {n} caught a cold! Growth slows. Medicine?',f_sick_m2:'Your {n} is still under the weather.',f_sick_b1:'Take medicine (free)',f_sick_b2:'Power through it',f_sick_r1:'Medicine works! Right as rain.',f_sick_r2:'You toughed it out… barely.',
f_dream_t:'A vivid dream',f_dream_m:'Your {n} hums a melody in its sleep.',f_dream_b1:'Sit by its side',f_dream_b2:'Let it sleep',f_dream_r1:'You shared a dream. Spirits soared!',f_dream_r2:'A quiet, peaceful night.',
f_tre_t:'Sparkle in the dirt',f_tre_m:"What's this glinting in the dirt?",f_tre_b1:'Take it to a shop',f_tre_b2:'Polish it as a treasure',f_tre_r1:'Sold for {c} coins!',f_tre_r2:'A precious keepsake. Mood soared!',
f_friend_t:'A shy visitor',f_friend_m:'A wild sprite peeks in and waves.',f_friend_b1:'Chat together',f_friend_b2:'Share a snack (4 coins)',f_friend_b3:'A polite wave goodbye',f_friend_r1:'You traded stories. Charm +{a}!',f_friend_r2:'It nibbled happily. Mood +{a}!',f_friend_r3:'It left a tiny gift: {c} coins.',
f_insp_t:'A spark of genius',f_insp_m:'Suddenly — Eureka! The idea won\'t leave you alone.',f_insp_b1:'Follow the idea',f_insp_b2:'Scribble it in a notebook',f_insp_r1:'Genius unlocked! Brains +{a}!',f_insp_r2:'A modest insight. Brains +{a}.',
f_storm_t:'The howling storm',f_storm_m:'Thunder surrounds the hut tonight.',f_storm_b1:'Shield your {n}',f_storm_b2:'Face the storm together',f_storm_r1:'A safe night. Stamina +{a}.',f_storm_r2:'Scary but thrilling! Spirit +{a}, Power +{a2}.',
f_star_t:'The night of shooting stars',f_star_m:'The sky rains starlight. A once-in-a-lifetime night.',f_star_b1:'Make a wish together',f_star_b2:'Watch it in silence',f_star_r1:'Your bond sparkles. Mood +{a}!',f_star_r2:'A wonder: Spirit +{a}!',
f_fest_t:'The town festival!',f_fest_m:'Lanterns everywhere! Join the booth games?',f_fest_b1:'Join — {c} coins',f_fest_b2:'Buy a festival snack — 5 coins',f_fest_r1:'You won a goldfish! Charm +{a}, Mood +{a2}.',f_fest_r2:'Food costs: {c} coins. Mood +{a}.',
f_gift_t:'A mysterious package',f_gift_m:'A wrapped box… from a fan?',f_gift_b1:'Open it',f_gift_b2:'Send it back',f_gift_r1:'Inside: premium snacks and {c} coins!',f_gift_r2:'Polite decline. The fan respects you. Mood +{a}.',
f_cook_t:'The hungry traveler',f_cook_m:'"A chef? I could eat a horse!" How about it?',f_cook_b1:'Cook up a storm',f_cook_b2:'Point down the road',f_cook_r1:'"Incredible!!" Payment: {c} coins!',f_cook_r2:'"Aw… how much for a hug?" Mood +{a}!',
f_egg_t:'?! A black egg?!',f_egg_m:'A mysterious black egg is humming softly…',f_egg_b1:'Keep it warm',f_egg_b2:'Call the authorities',f_egg_r1:'It hatched into… light! Spirit +{a}, Brains +{a2}.',f_egg_r2:'The egg just smiled. Nothing happened.',
shop_t:'Shop',shop_ok:'You bought {it}!',shop_no:'You don\'t have the coins…',
fin_t:'And then…',fin_m:'Day 60 is done. Time to see how far your {n} has come.',form_l:'Final form:',the_end:'✦ THE END ✦',
end_title:'ENDING',rank_l:'Rank',days_l:'Days together: 60',end_stats:'Stats',btn_toTitle:'Back to Title',btn_newRun:'New Journey',
col_t:'Ending Collection',col_sub:'{n}/{m} discovered',col_locked:'???',
off_note:'3D library unavailable — playing in simple mode.',
s_emblem:'Emblem',s_totem:'Totem',s_blessing:'Blessing',
form_l1:'Hatchling',form_l2:'Youth',form_l3:'Adult'
};
const JA={
app:'Stardia −星のともだち育成日記−',
tag:'星から生まれた大切な子を、60日間育てあげよう。',
menu_title:'タイトル',menu_new:'新しくそだてる',menu_cont:'つづきから始める ▶',menu_del:'✕',menu_slots:'セーブデータ選択',menu_slots_sub:'スロットを選んで始めよう',
menu_start:'始める',menu_delq:'このセーブデータを削除しますか？',menu_yes:'削除する',menu_no:'やめる',menu_back:'もどる',
m_save:'セーブ',m_title:'タイトルへ',m_help:'あそびかた',
help_text:'画面をドラッグで視点回転・生き物をタップでなでる♥\n1日2回まで行動して「日を終える」で翌日へ。\n20日目と45日目に進化。分岐は育て方しだいで約30種類。\nエンディングは21種類。気分が高いほど成長しやすいよ。\n行動ごとに自動セーブ（ローカル保存・3スロット）。',
new_title:'相棒をえらぼう',new_sub:'相棒を選んで、なまえをつけよう。',starter_t1:'元気にほえる炎の子。トレーニング・冒険向き',starter_t2:'おとなしい芽の子。おべんきょう・しゅみが得意',starter_t3:'おちゃめな波の子。あそび・お手入れ向き',name_label:'ニックネーム',start_btn:'タマゴをわかす ✦',replace:'このセーブデータを上書きしますか？',n_extra:'ヒント：気分が高いほど成長が大きく、病気は成長を鈍らせる。',
d:'Day {d}/{max}',ph1:'あさ',ph2:'ひる',ph3:'よる',stage_l:'段階',
st_pw:'ちから',st_br:'あたま',st_ch:'おしゃれ',st_st:'たいりょく',st_sp:'せいしん',mood:'きぶん',energy:'げんき',coins:'ゴールド',total:'合計',
a_end:'日を終える ✦',
a_train:'トレーニング',a_study:'おべんきょう',a_work:'アルバイト',a_adventure:'ぼうけん',a_rest:'おやすみ',a_play:'あそぶ',a_hobby:'しゅみ',a_shop:'かいもの',a_groom:'お手入れ',a_medicine:'くすりを飲む',a_social:'町へでる',a_clean:'そうじ',
a_tip_train:'走る・筋力トレ。ちから↑ たいりょく↑',a_tip_study:'本とパズル。あたま↑',a_tip_work:'お金を稼ぐ。たいりょく↑ おしゃれ↑ 少し',a_tip_adventure:'外へ探索。運しだいでごほうび',a_tip_rest:'ぐっすり。げんき♥ ねむさと病気を治す',a_tip_play:'いっしょに遊ぶ。きぶん↑♥ おしゃれ↑',a_tip_hobby:'ものづくり。せいしん↑ あたま↑ きぶん↑',a_tip_shop:'新しい服。おしゃれ↑ きぶん↑（お金）',a_tip_groom:'ブラッシングと磨き。おしゃれ↑ きぶん↑',a_tip_medicine:'くすり。病気を治す（無料）',a_tip_social:'町で友だち。きぶん↑♥ あたま↑',a_tip_clean:'部屋を片付ける。きぶん↑ たいりょく↑',
e_train:'がんにトレーニング！',e_study:'本にふける…',e_work:'お仕事へ！',e_adventure:'ぼうけんに出発！',e_rest:'ぐっすりお昼寝。',e_play:'あそびに夢中！',e_hobby:'しゅみにふける…',e_shop:'かいものへ！',e_groom:'ブラッシング！',e_medicine:'くすりの時間…',e_social:'町へおでかけ。',e_clean:'そうじの時間！',
no_energy:'げんきが足りない…',no_coins:'ゴールドが足りない…',no_medicine:'今は病気をかかえていない。',tired_now:'くたくだ！おやすみするまで楽な行動だけ。',
ad_pre:'本格的なぼうけんにはまだヘトヘト。ねむたい・たいりょく不足。',ad_great_tre:'古代のアーティファクトを発見！',ad_bad:'雨と泥道。グチばかり…。',ad_wonder:'自然のふしぎを目撃した…',saved_ok:'セーブしたよ！',save_failed:'セーブできませんでした。ブラウザーの保存設定を確認してください。',
g_pw:'ちから',g_br:'あたま',g_ch:'おしゃれ',g_st:'たいりょく',g_sp:'せいしん',g_mood:'きぶん',g_coins:'G',g_energy:'げんき',
daysep:'── Day {d} ──',day60:'Day 60。最後の日が明けた…',
evo_l1:'{n}は{f}に進化した！',evo_l2:'{n}が変化している…',evolve_title:'しんか！',
log_pet:'{n}をなでなで。すりよってくる♥',
w_ill:'{n}の顔色がすぐれない…',w_heal:'すっきり完治！',w_tired:'くたくただ…早く休ませよう！',w_food:'食事代 {c}G を使った。',
f_market_t:'いちばの日！',f_market_m:'広場がコインの音でいっぱい。どこへ行く？',f_b1:'あんしん積立',f_b2:'サイコロブース',f_b3:'見ているだけ',f_market_r1:'確実に貯めた：+{c}G。',f_market_r2:'大当たり！ +{c}G！',f_market_r3:'負けてしまった… -{c}G。',f_market_r4:'見てるだけ無料。きぶん+{a}。',
f_rival_t:'ライバルあらわる！',f_rival_m:'派手な精霊がニヤリ：「勝てるのか？」',f_b4:'真っ向から受ける',f_b5:'知らんぷり',f_b6:'てきらかに手ふる',f_rival_r1:'勝負開始！ ちから+{a} たいりょく+{a2}。',f_rival_r2:'あいては去った。せいしん+{a}。',f_rival_r3:'連絡先を交換した。おしゃれ+{a} きぶん+{a2}！',
f_cup_t:'大会の日！',f_cup_m:'闘技場に応援の声…{n}に注目が集まる！',f_cup_b1:'たたかう！',f_cup_b2:'応援する',f_cup_r1:'優勝！！ +{c}G ちから+{a} きぶん+{a2}！',f_cup_r2:'惜敗…でも大収穫。たいりょく+{a} きぶん+{a2}。',f_cup_r3:'声援を送った。きぶん+{a}。',
f_sick_t:'ゴホッ…チュン…',f_sick_m:'{n}が風邪をひいた！成長が遅れる。くすりは？',f_sick_m2:'{n}はまだ本調子じゃない。',f_sick_b1:'くすりを飲む（無料）',f_sick_b2:'げんきで乗り切る',f_sick_r1:'くすりが効いた！ピッカピカ。',f_sick_r2:'気合で耐えた…ギリギリ。',
f_dream_t:'ゆかのような夢',f_dream_m:'{n}が眠りながらメロディを口ずさんでいる。',f_dream_b1:'そばで耳をすます',f_dream_b2:'そっとしておく',f_dream_r1:'夢で再会。せいしんが高ぶった！',f_dream_r2:'しずかで平和な夜。',
f_tre_t:'つちの中からキラリ',f_tre_m:'土の中になにか光るもの…！',f_tre_b1:'お店に持っていく',f_tre_b2:'宝物としてみがく',f_tre_r1:'{c}Gで売却！',f_tre_r2:'大切な宝物に。きぶん大幅アップ！',
f_friend_t:'内気な訪問者',f_friend_m:'野生の精霊がこっそり手を振っている。',f_friend_b1:'いっしょにおしゃべり',f_friend_b2:'おやつをわける（4G）',f_friend_b3:'会釈して見送る',f_friend_r1:'物語を交換。おしゃれ+{a}！',f_friend_r2:'うれしそうにかじった。きぶん+{a}！',f_friend_r3:'お礼に{c}Gを置いていった。',
f_insp_t:'ひらめきの瞬間',f_insp_m:'キターッ！ひらめいたアイデアが離れない。',f_insp_b1:'とことん深める',f_insp_b2:'ノートにメモ',f_insp_r1:'大発明！あたま+{a}！',f_insp_r2:'ちょっとした収穫。あたま+{a}。',
f_storm_t:'吠える嵐',f_storm_m:'今夜は家中に雷の音。',f_storm_b1:'{n}を守る',f_storm_b2:'いっしょに嵐へ',f_storm_r1:'無事に夜明け。たいりょく+{a}。',f_storm_r2:'怖いが痛快！せいしん+{a} ちから+{a2}。',
f_star_t:'流れ星の夜',f_star_m:'空が星のシャワー。一生に一度の夜。',f_star_b1:'いっしょにねがう',f_star_b2:'しずかに見送る',f_star_r1:'絆がひかる。きぶん+{a}！',f_star_r2:'神秘の体験：せいしん+{a}！',
f_fest_t:'町のまつり！',f_fest_m:'ちょうちんでいっぱい。屋台のゲームに挑戦？',f_fest_b1:'参加する −{c}G',f_fest_b2:'屋台のおやつを買う（5G）',f_fest_r1:'金魚をゲット！おしゃれ+{a} きぶん+{a2}。',f_fest_r2:'ごちそう代{c}G。きぶん+{a}。',
f_gift_t:'ふしぎな小包',f_gift_m:'包まれた箱…ファンからの贈り物？',f_gift_b1:'あけてみる',f_gift_b2:'お返しする',f_gift_r1:'特製おやつと{c}Gが入っていた！',f_gift_r2:'丁重にお断り。ファンはあなたを尊敬。きぶん+{a}。',
f_cook_t:'お腹すいた旅人',f_cook_m:'「料理ができるのか？馬一頭はいけるぞ！」どうする？',f_cook_b1:'腕によりをかける',f_cook_b2:'道を教える',f_cook_r1:'「うますぎる！！」支払い{c}G！',f_cook_r2:'「ごちそうさま。ハグはいくら？」きぶん+{a}！',
f_egg_t:'！？黒いタマゴ！？',f_egg_m:'ふしぎな黒いタマゴがうっすらうたっている…',f_egg_b1:'あったかくしてあげる',f_egg_b2:'まかせる',f_egg_r1:'かえったのは…ひかり！せいしん+{a} あたま+{a2}。',f_egg_r2:'タマゴはにっこり。何も起きなかった。',
shop_t:'ショップ',shop_ok:'{it}を買った！',shop_no:'ゴールドが足りない…',
fin_t:'そして——',fin_m:'Day 60の夜。{n}がどこまで成長したか見届けよう。',form_l:'最後のすがた：',the_end:'✦ THE END ✦',
end_title:'エンディング',rank_l:'ランク',days_l:'共に過ごした日数：60日',end_stats:'最終能力',btn_toTitle:'タイトルへもどる',btn_newRun:'新しく育てる',
col_t:'エンディング図鑑',col_sub:'{n}/{m} 発見',col_locked:'？？？',
off_note:'3Dライブラリを読み込めないため、かんたんモードで遊びます。',
s_emblem:'エンブレム',s_totem:'トーテム',s_blessing:'祝福',
form_l1:'赤ちゃん',form_l2:'こども',form_l3:'おとな'
};
const ZH={
app:'Stardia −星之伙伴养成日记−',
tag:'养育从星星诞生的孩子，度过60天的冒险！',
menu_title:'标题',menu_new:'开始新旅程',menu_cont:'继续游戏 ▶',menu_del:'✕',menu_slots:'选择存档',menu_slots_sub:'选择一个槽位开始',
menu_start:'开始',menu_delq:'确定删除这份存档吗？',menu_yes:'删除',menu_no:'取消',menu_back:'返回',
m_save:'保存',m_title:'回标题',m_help:'玩法',
help_text:'拖动画面旋转视角・点击生物可以抚摸♥\n每天最多行动2次，点“结束一天”进入明天。\n约第20天和第45天进化，分支由你的养育方式决定，共30种形态。\n21种结局。心情越高成长越多，生病会减缓成长。\n每次行动自动存档（本地保存・3个槽位）。',
new_title:'选择伙伴',new_sub:'选择初始伙伴并取个名字。',starter_t1:'活泼的火之孩子・擅长锻炼与冒险',starter_t2:'安静的芽之孩子・擅长学习与爱好',starter_t3:'调皮的波之孩子・擅长玩耍与打扮',name_label:'昵称',start_btn:'孵蛋 ✦',replace:'覆盖这份存档？',n_extra:'提示：心情越高成长越大，生病会拖慢成长。',
d:'第 {d}/{max} 天',ph1:'晨',ph2:'昼',ph3:'夜',stage_l:'阶段',
st_pw:'力量',st_br:'智慧',st_ch:'魅力',st_st:'体力',st_sp:'精神',mood:'心情',energy:'体力值',coins:'金币',total:'合计',
a_end:'结束一天 ✦',
a_train:'锻炼',a_study:'学习',a_work:'打工',a_adventure:'冒险',a_rest:'休息',a_play:'玩耍',a_hobby:'爱好',a_shop:'购物',a_groom:'打扮',a_medicine:'吃药',a_social:'去镇上',a_clean:'打扫',
a_tip_train:'跑步与力量。力量↑ 体力↑',a_tip_study:'读书与谜题。智慧↑',a_tip_work:'赚金币。体力↑ 魅力↑一点',a_tip_adventure:'外出探索，运气决定收获',a_tip_rest:'熟睡。体力值♥ 治愈疲劳与疾病',a_tip_play:'一起玩。心情↑♥ 魅力↑',a_tip_hobby:'手作。精神↑ 智慧↑ 心情↑',a_tip_shop:'新衣服。魅力↑ 心情↑（金币）',a_tip_groom:'梳理与抛光。魅力↑ 心情↑',a_tip_medicine:'吃药治病（免费）',a_tip_social:'镇上交友。心情↑♥ 智慧↑',a_tip_clean:'打扫小屋。心情↑ 体力↑',
e_train:'努力锻炼！',e_study:'埋头读书…',e_work:'去打工！',e_adventure:'冒险出发！',e_rest:'香甜午睡。',e_play:'玩得开心！',e_hobby:'沉浸在爱好里…',e_shop:'购物去！',e_groom:'刷呀刷，擦呀擦！',e_medicine:'该吃药了…',e_social:'去镇上散步。',e_clean:'打扫时间！',
no_energy:'体力不够…',no_coins:'金币不够…',no_medicine:'目前没有生病。',tired_now:'累坏了！休息之前只能做轻松的行动。',
ad_pre:'太疲惫，无法真正冒险——先休息或锻炼！',ad_great_tre:'发现了古代神器！',ad_bad:'下雨、泥路，一路抱怨…',ad_wonder:'目击了自然的奇迹…',saved_ok:'已保存！',save_failed:'保存失败。请检查浏览器的存储设置。',
g_pw:'力量',g_br:'智慧',g_ch:'魅力',g_st:'体力',g_sp:'精神',g_mood:'心情',g_coins:'金币',g_energy:'体力值',
daysep:'── 第 {d} 天 ──',day60:'第60天，最后一天…',
evo_l1:'{n}进化成了 {f}！',evo_l2:'{n}发生了变化…',evolve_title:'进化！',
log_pet:'你抚摸了{n}，它蹭了蹭你♥',
w_ill:'{n}的脸色不太好…',w_heal:'完全康复！',w_tired:'精疲力竭，必须休息！',w_food:'餐费花了 {c} 金币。',
f_market_t:'市集日！',f_market_m:'广场满是金币的响声。去哪里？',f_b1:'稳妥理财',f_b2:'骰子摊',f_b3:'只看看',f_market_r1:'稳稳存下：+{c}金币。',f_market_r2:'赢大了！+{c}金币！',f_market_r3:'输了…-{c}金币。',f_market_r4:'白看也开心。心情+{a}。',
f_rival_t:'劲敌出现！',f_rival_m:'一个张扬的精灵坏笑：“你打得过我吗？”',f_b4:'正面应战',f_b5:'装作没看见',f_b6:'友好地挥手',f_rival_r1:'对决开始！力量+{a} 体力+{a2}。',f_rival_r2:'它走了。精神+{a}。',f_rival_r3:'交换了联络方式。魅力+{a} 心情+{a2}！',
f_cup_t:'大会之日！',f_cup_m:'竞技场万众瞩目，全都看着{n}…',f_cup_b1:'上场战斗！',f_cup_b2:'在场边加油',f_cup_r1:'冠军！！+{c}金币 力量+{a} 心情+{a2}！',f_cup_r2:'惜败…但收获很大。体力+{a} 心情+{a2}。',f_cup_r3:'卖力加油。心情+{a}。',
f_sick_t:'咳咳…阿嚏…',f_sick_m:'{n}感冒了！成长变慢。要吃药吗？',f_sick_m2:'{n}还没有完全好。',f_sick_b1:'吃药（免费）',f_sick_b2:'硬撑过去',f_sick_r1:'药到病除！精神抖擞。',f_sick_r2:'硬扛过去了…勉强。',
f_dream_t:'清晰的梦',f_dream_m:'{n}在睡梦中哼着旋律。',f_dream_b1:'守在床边',f_dream_b2:'让它继续睡',f_dream_r1:'共享了一个梦。精神高涨！',f_dream_r2:'安静平和的夜晚。',
f_tre_t:'土里闪一闪',f_tre_m:'土里有东西在发光！',f_tre_b1:'拿去店里卖',f_tre_b2:'擦拭成宝物',f_tre_r1:'卖了{c}金币！',f_tre_r2:'变成了珍贵的宝物。心情大涨！',
f_friend_t:'害羞的访客',f_friend_m:'野生精灵探头跟你打招呼。',f_friend_b1:'一起聊天',f_friend_b2:'分享点心（4金币）',f_friend_b3:'点头送别',f_friend_r1:'互诉故事。魅力+{a}！',f_friend_r2:'它吃得开心。心情+{a}！',f_friend_r3:'它留下谢礼：{c}金币。',
f_insp_t:'灵光一闪',f_insp_m:'灵光乍现——这个点子挥之不去！',f_insp_b1:'钻研到底',f_insp_b2:'记在笔记本上',f_insp_r1:'大发明！智慧+{a}！',f_insp_r2:'小小的收获。智慧+{a}。',
f_storm_t:'咆哮的暴风雨',f_storm_m:'今夜雷声包围小屋。',f_storm_b1:'护住{n}',f_storm_b2:'一起迎击暴风雨',f_storm_r1:'平安到天亮。体力+{a}。',f_storm_r2:'可怕但痛快！精神+{a} 力量+{a2}。',
f_star_t:'流星的夜晚',f_star_m:'天空下起星光之雨，一生一次的夜晚。',f_star_b1:'一起许愿',f_star_b2:'静静观赏',f_star_r1:'羁绊闪光。心情+{a}！',f_star_r2:'奇迹体验：精神+{a}！',
f_fest_t:'小镇庆典！',f_fest_m:'到处是灯笼。要参加摊位游戏吗？',f_fest_b1:'参加 −{c}金币',f_fest_b2:'购买庆典点心（5金币）',f_fest_r1:'赢得金鱼！魅力+{a} 心情+{a2}。',f_fest_r2:'小吃花了{c}金币。心情+{a}。',
f_gift_t:'神秘包裹',f_gift_m:'一个包好的盒子…是粉丝送的？',f_gift_b1:'打开看看',f_gift_b2:'退回去了',f_gift_r1:'里面有高级点心和{c}金币！',f_gift_r2:'礼貌回绝。粉丝更尊敬你了。心情+{a}。',
f_cook_t:'饥饿的旅人',f_cook_m:'“你会做饭？我能吃下一头马！”怎么办？',f_cook_b1:'大显身手',f_cook_b2:'指个路',f_cook_r1:'“太好吃了！！”付款{c}金币！',f_cook_r2:'“谢谢款待。拥抱收费吗？”心情+{a}！',
f_egg_t:'！？黑色的蛋！？',f_egg_m:'神秘的黑蛋在轻轻歌唱…',f_egg_b1:'帮它保温',f_egg_b2:'交给管理处',f_egg_r1:'孵出来的是…光！精神+{a} 智慧+{a2}。',f_egg_r2:'蛋只是笑了笑。什么也没发生。',
shop_t:'商店',shop_ok:'买下了{it}！',shop_no:'金币不够…',
fin_t:'于是——',fin_m:'第60天的夜晚。来见证{n}成长到了什么地步吧。',form_l:'最终形态：',the_end:'✦ THE END ✦',
end_title:'结局',rank_l:'评级',days_l:'共度天数：60天',end_stats:'最终能力',btn_toTitle:'回到标题',btn_newRun:'新的旅程',
col_t:'结局图鉴',col_sub:'已发现 {n}/{m}',col_locked:'？？？',
off_note:'无法加载3D库，将以简单模式游玩。',
s_emblem:'纹章',s_totem:'图腾',s_blessing:'祝福',
form_l1:'幼年',form_l2:'少年',form_l3:'成年'
};
const TR={en:EN,ja:JA,zh:ZH};
function t(k,p){const s=(TR[SET.lang]&&TR[SET.lang][k])!==undefined?TR[SET.lang][k]:(EN[k]!==undefined?EN[k]:k);return fmt(s,p);}
/* ================= form data (30) ================= */
const FORMS={
ember0:{sp:'ember',st:0,emo:'🔥',name:{en:'Emby',ja:'ヒナモ',zh:'小火苗'},spec:{color:0xff7a3c,accent:0xffd166,shape:'blob',scale:1.0,tail:'flame',glow:true}},
ember1_p:{sp:'ember',st:2,emo:'🐗',name:{en:'Grulga',ja:'モグラッシュ',zh:'岩突'},spec:{color:0xd9542b,accent:0xffc94d,shape:'wide',scale:1.15,horns:1,tail:'flame'}},
ember1_b:{sp:'ember',st:2,emo:'🦎',name:{en:'Vitreo',ja:'ガラスード',zh:'琉璃蜥'},spec:{color:0xe86a4a,accent:0x9fe3ff,shape:'tall',scale:1.1,wings:'crystal',tail:'flame',glow:true}},
ember1_c:{sp:'ember',st:2,emo:'🦙',name:{en:'Woolflame',ja:'モコモファイ',zh:'绒焰'},spec:{color:0xf58a50,accent:0xffe29a,shape:'blob',scale:1.2,tail:'flame',tuft:true}},
ember2_p:{sp:'ember',st:3,emo:'🐲',name:{en:'Ignarok',ja:'イグナロク',zh:'炎岩龙'},spec:{color:0xc23b24,accent:0xffb14d,shape:'wide',scale:1.32,horns:3,tail:'flame',mane:true}},
ember2_b:{sp:'ember',st:3,emo:'🐉',name:{en:'Crystaliam',ja:'クリスタリア',zh:'晶辉龙'},spec:{color:0xd8547c,accent:0xa8ecff,shape:'tall',scale:1.25,wings:'crystal',tail:'flame',glow:true}},
ember2_c:{sp:'ember',st:3,emo:'🦁',name:{en:'Manealuce',ja:'マニールチェ',zh:'鬃光狮'},spec:{color:0xf2a13c,accent:0xffefa6,shape:'blob',scale:1.3,tail:'flame',mane:true,tuft:true}},
ember2_s:{sp:'ember',st:3,emo:'🌟',name:{en:'Solarama',ja:'ソララマ',zh:'曜拉玛'},spec:{color:0xff9a3c,accent:0xfff0b0,shape:'blob',scale:1.28,tail:'flame',aura:true,glow:true,tuft:true}},
sprout0:{sp:'sprout',st:0,emo:'🌱',name:{en:'Sprig',ja:'メモちゃん',zh:'小芽'},spec:{color:0x59c36a,accent:0xffc7d5,shape:'blob',scale:1.0,tail:'leaf'}},
sprout1_p:{sp:'sprout',st:2,emo:'🐘',name:{en:'Barkot',ja:'バークトン',zh:'树墩'},spec:{color:0x4fae5e,accent:0x9a6b3f,shape:'wide',scale:1.15,legs:true,tail:'leaf'}},
sprout1_b:{sp:'sprout',st:2,emo:'🦚',name:{en:'Lyrain',ja:'ライレイン',zh:'翎羽'},spec:{color:0x63c98a,accent:0xbde8ff,shape:'tall',scale:1.1,wings:'leaf',tail:'leaf',glow:true}},
sprout1_c:{sp:'sprout',st:2,emo:'🌷',name:{en:'Tulpen',ja:'チュウリーネ',zh:'郁铃'},spec:{color:0x7cc86f,accent:0xff9ec4,shape:'blob',scale:1.2,tuft:true,tail:'leaf'}},
sprout2_p:{sp:'sprout',st:3,emo:'🌳',name:{en:'Grandelph',ja:'グランデルフ',zh:'巨橡'},spec:{color:0x3f9a52,accent:0x8a5a33,shape:'wide',scale:1.35,legs:true,tail:'leaf',mane:true}},
sprout2_b:{sp:'sprout',st:3,emo:'🦜',name:{en:'Aurewyn',ja:'アウレウィン',zh:'金翼'},spec:{color:0x55bd7d,accent:0xdff7ff,shape:'tall',scale:1.28,wings:'leaf',tail:'leaf',glow:true,horns:1}},
sprout2_c:{sp:'sprout',st:3,emo:'💮',name:{en:'Bloomeo',ja:'フルールー',zh:'繁花'},spec:{color:0x6cc06a,accent:0xffb7d2,shape:'blob',scale:1.32,tuft:true,tail:'leaf',mane:true}},
sprout2_s:{sp:'sprout',st:3,emo:'🍀',name:{en:'Quadmania',ja:'クアッドニア',zh:'四叶灵'},spec:{color:0x66cf7c,accent:0xeaffb0,shape:'blob',scale:1.28,aura:true,glow:true,tuft:true,tail:'leaf'}},
bubble0:{sp:'bubble',st:0,emo:'💧',name:{en:'Bubu',ja:'シズク',zh:'波波'},spec:{color:0x4fa8e8,accent:0xcfeeff,shape:'blob',scale:1.0,tail:'fin',ears:true}},
bubble1_p:{sp:'bubble',st:2,emo:'🐢',name:{en:'Carapash',ja:'カラボッシュ',zh:'甲壶'},spec:{color:0x3f8fc9,accent:0x9fe0c8,shape:'wide',scale:1.15,tail:'fin'}},
bubble1_b:{sp:'bubble',st:2,emo:'🐬',name:{en:'Delphini',ja:'デルフィナ',zh:'跃豚'},spec:{color:0x55b6ef,accent:0xe6f7ff,shape:'tall',scale:1.1,tail:'fin',glow:true,horns:1}},
bubble1_c:{sp:'bubble',st:2,emo:'🐙',name:{en:'Takoela',ja:'タコエーラ',zh:'八腕'},spec:{color:0x6a9ef0,accent:0xffd3e2,shape:'blob',scale:1.2,tail:'fin',legs:true}},
bubble2_p:{sp:'bubble',st:3,emo:'🐋',name:{en:'Leviatune',ja:'レヴィチューン',zh:'海吟'},spec:{color:0x2f76b8,accent:0xa8d8ff,shape:'wide',scale:1.38,tail:'fin',mane:true}},
bubble2_b:{sp:'bubble',st:3,emo:'🦈',name:{en:'Sharkneel',ja:'サーキンエール',zh:'潮牙'},spec:{color:0x3fa0d8,accent:0xeef9ff,shape:'tall',scale:1.3,tail:'fin',glow:true,horns:3}},
bubble2_c:{sp:'bubble',st:3,emo:'🪼',name:{en:'Jellynn',ja:'ジェリィン',zh:'水母精'},spec:{color:0x8fb8f5,accent:0xffc7e8,shape:'blob',scale:1.3,ears:true,tail:'fin',glow:true,mane:true}},
bubble2_s:{sp:'bubble',st:3,emo:'🔮',name:{en:'Lunaria',ja:'ルナリア',zh:'月灵'},spec:{color:0x7fa8ee,accent:0xf4ecff,shape:'blob',scale:1.28,aura:true,glow:true,ears:true,tail:'fin'}},
ail_p:{sp:null,st:2,emo:'😷',name:{en:'Shadowpup',ja:'カゲ丸',zh:'影丸'},spec:{color:0x6b6f8a,accent:0xb9a6ff,shape:'wide',scale:1.05,tail:'flame'}},
ail_b:{sp:null,st:2,emo:'🫧',name:{en:'Foglet',ja:'キリット',zh:'雾仔'},spec:{color:0x8f9ab5,accent:0xcfe0ff,shape:'tall',scale:1.0,tail:'fin'}},
ail_c:{sp:null,st:2,emo:'🥀',name:{en:'Duskpetal',ja:'ボタニャ',zh:'残花'},spec:{color:0x8a6f9e,accent:0xd8b8ff,shape:'blob',scale:1.1,tail:'leaf'}},
ail2:{sp:null,st:3,emo:'🥀',name:{en:'Grayember',ja:'ハイエマール',zh:'灰焰'},spec:{color:0x5d6478,accent:0xff9a8c,shape:'wide',scale:1.15,tail:'flame'}},
egg:{sp:null,st:-1,emo:'🥚',name:{en:'Egg',ja:'タマゴ',zh:'蛋'},spec:{color:0xf3ead8,accent:0xffb14d,shape:'egg',scale:1.0}}
};
const SPECIES={
ember:{emo:'🔥',t:'starter_t1',default:{en:'Ember',ja:'ホムジ',zh:'小火'}},
sprout:{emo:'🌱',t:'starter_t2',default:{en:'Fern',ja:'モクゾウ',zh:'小蕨'}},
bubble:{emo:'💧',t:'starter_t3',default:{en:'Bubbles',ja:'シュワ',zh:'泡泡'}}
};
/* ================= actions ================= */
const ACTS=[
{id:'train',ic:'🏋️',e:22,c:0,min:25,g:{pw:6,st:3},log:'e_train'},
{id:'study',ic:'📚',e:18,c:4,min:10,g:{br:6},log:'e_study'},
{id:'work',ic:'💼',e:22,c:0,min:20,g:{st:2,ch:1},coins:[12,17],log:'e_work'},
{id:'adventure',ic:'🗺️',e:30,c:6,min:30,special:1,log:'e_adventure'},
{id:'rest',ic:'😴',e:0,c:0,min:0,free:1,log:'e_rest'},
{id:'play',ic:'🎾',e:12,c:0,min:10,g:{ch:2},mood:10,aff:2,log:'e_play'},
{id:'hobby',ic:'🎨',e:15,c:2,min:10,g:{br:2,sp:3},mood:5,flag:'hobby',log:'e_hobby'},
{id:'shop',ic:'🛍️',e:10,c:25,min:5,g:{ch:5},mood:8,flag:'shop',log:'e_shop'},
{id:'groom',ic:'✨',e:10,c:0,min:5,g:{ch:4},mood:4,log:'e_groom'},
{id:'medicine',ic:'💊',e:6,c:0,min:0,special:2,log:'e_medicine'},
{id:'social',ic:'🫂',e:14,c:4,min:10,g:{br:2,ch:1},mood:8,aff:2,log:'e_social'},
{id:'clean',ic:'🧹',e:8,c:0,min:0,g:{st:1},mood:6,log:'e_clean'}
];
const STATKEYS=['pw','br','ch','st','sp'];
const STATICON=['💪','🧠','💃','🏃','🧘'];
/* ================= endings (21) ================= */
const ENDINGS=[
{id:'legendary',rank:'S',cond:s=>/_(p|b|c|s)$/.test(s.form)&&s.form.indexOf('ail')<0&&s.sp>=70&&s.mood>=70&&s.aff>=60,
name:{en:'Legend of the Star Lineage',ja:'星脈の伝説',zh:'星脉传说'},
text:{en:'Bards will sing of you two for a hundred years. The bond you forged became an actual constellation.',ja:'あなたたちの絆は星脈そのもの。百年先まで歌い継がれる伝説となった。',zh:'你们的羁绊化作了真正的星座，将被歌咏百年。'}},
{id:'champion',rank:'S',cond:s=>/2_(p|s)$/.test(s.form)&&s.flags.champion&&s.pw>=70,
name:{en:'Unbeaten Champion',ja:'無敗のチャンピオン',zh:'不败冠军'},
text:{en:'Four tournaments, four trophies. Your name is engraved on the arena\'s hall of fame.',ja:'四度の大舞台を制し、名は闘技場の名誉の壁に刻まれた。',zh:'四战四胜，你的名字被刻进了竞技场的名人堂。'}},
{id:'scholar',rank:'S',cond:s=>/2_(b|p)$/.test(s.form)&&s.br>=75&&!s.flags.rival,
name:{en:'The Academy Never Sleeps',ja:'学園は眠らない',zh:'不眠的学院'},
text:{en:'An honorary degree, three papers, and a dorm full of admirers. Knowledge sparkles.',ja:'名誉学位と三つの論文。学びの星として学院に伝説が残った。',zh:'荣誉学位与三篇论文，你成为学院里闪耀的星。'}},
{id:'duo',rank:'S',cond:s=>s.flags.rival&&s.flags.champion&&s.br>=50,
name:{en:'Rivals, Side by Side',ja:'並んだ好敵手',zh:'并肩的劲敌'},
text:{en:'The final was decided in extra time. Afterwards, the two of you trained together.',ja:'決勝は延長戦にもつれ込んだ。そのあと、二人は固い握手を交わした。',zh:'决赛打到加时。赛后的那一次握手，让劲敌变成了挚友。'}},
{id:'idol',rank:'S',cond:s=>/2_(c|b)$/.test(s.form)&&s.ch>=75,
name:{en:'Standing Ovation',ja:'割れんばかりの拍手',zh:'起立鼓掌'},
text:{en:'The hall sways in a sea of light sticks. Your smile is canon now.',ja:'会場がペンライトの海に揺れる。あなたの笑顔はもう伝説だ。',zh:'会场化作荧光海的浪潮，你的笑容已成经典。'}},
{id:'starperfect',rank:'S',cond:s=>s.pw>=50&&s.br>=50&&s.ch>=50&&s.st>=50&&s.sp>=50&&s.mood>=50&&s.aff>=55,
name:{en:'Consummate Star-Raiser',ja:'育て手の完成',zh:'养成大师'},
text:{en:'Power, wits, style, stamina, spirit — a flawless garden you tended day by day.',ja:'すべてを育て上げ、60日間の庭はどの区画も花が咲いた。',zh:'力量、智慧、魅力、体力、精神——60天的花园每一畦都开了花。'}},
{id:'hero',rank:'A',cond:s=>s.ev.adventure>=4&&s.sp>=55&&!s.flags.sick,
name:{en:'The Hero Returns',ja:'旅の英雄、凱旋',zh:'凯旋的英雄'},
text:{en:'Your travel-worn map has more stamps than anyone in town. Next route, already planned.',ja:'地図のスタンプは町一番。次の旅の計画はもう始まっている。',zh:'你的地图印章是全镇最多，下段旅程已在计划中。'}},
{id:'dojo',rank:'A',cond:s=>/2_(p|s)$/.test(s.form)&&s.pw>=75&&s.st>=45,
name:{en:'Dojo Legacy',ja:'道場の系譜',zh:'道场宗师'},
text:{en:'Little sprites now line up at your gate to learn the First Swing.',ja:'小さな精霊たちが「第一の型」を学ぶため、あなたの門を叩く。',zh:'小精灵们排队拜入门下，学习“第一之型”。'}},
{id:'rivalwin',rank:'A',cond:s=>s.flags.rival&&s.flags.champion,
name:{en:'Eternal Rivals',ja:'永遠の好敵手',zh:'永远的劲敌'},
text:{en:'"Rematch next spring." You both know that is a promise, not a threat.',ja:'「来春も再戦だ」。それは脅しではなく、二人の約束になった。',zh:'“明年再战。”那不再是挑衅，而是你们的约定。'}},
{id:'family',rank:'A',cond:s=>s.flags.love&&!s.flags.sick&&s.mood>=60,
name:{en:'The Richest Morning',ja:'いちばん豊かな朝',zh:'最富有的清晨'},
text:{en:'Breakfast for two, sunlit table. This ordinary morning is the treasure.',ja:'朝ご飯は二人分。ありふれた朝が、あなたにとっての宝物だった。',zh:'早餐摆上两人份。平常的清晨，就是最珍贵的宝物。'}},
{id:'skyfarer',rank:'B',cond:s=>s.ev.explore>=3&&s.st>=50,
name:{en:'Skyfarer',ja:'空を渡った者',zh:'渡空者'},
text:{en:'You crossed the Cloud Sea. The pilot\'s license frame is already on the wall.',ja:'あなたは雲海を渡った。操縦許可証の額縁はもう壁に掛かっている。',zh:'你飞越了云海，飞行执照早已挂上墙上。'}},
{id:'alchemist',rank:'B',cond:s=>s.ev.hobby>=3&&s.ev.medicine>=1&&s.sp>=45,
name:{en:'The Hidden Apothecary',ja:'みちくさの錬金術',zh:'路边炼金术'},
text:{en:'Your homemade remedies now sit on the town shelf. Sold out by noon.',ja:'自作の薬は町の棚に並び、昼前に売切れるようになった。',zh:'你自制的药剂摆上了镇里的货架，午前就售罄。'}},
{id:'toymaker',rank:'B',cond:s=>s.ev.hobby>=5,
name:{en:'The Little Toy Workshop',ja:'小さなおもちゃ工房',zh:'小小玩具工坊'},
text:{en:'Workshop sign: open at ten. The line of children forms at nine.',ja:'工房の看板は10時開店。子どもたちの列は9時からできる。',zh:'工坊招牌写着10点开业，孩子们9点就排起了队。'}},
{id:'muse',rank:'B',cond:s=>/_(c|b)$/.test(s.form)&&s.ch>=60&&s.br<70,
name:{en:'Muse of the Valley',ja:'谷のミューズ',zh:'溪谷缪斯'},
text:{en:'Painters migrate to your valley each spring now. You inspire without trying.',ja:'春ごとに画家たちがこの谷へ集まる。努力ゼロのひらめき。',zh:'每年春天画家们都迁来溪谷。你不刻意却自成灵感。'}},
{id:'championmid',rank:'A',cond:s=>/^sprout1|^ember1|^bubble1/.test(s.form)&&s.flags.champion,
name:{en:'The Neighborhood Champion',ja:'地区大会を沸かせた',zh:'炸裂地区大赛'},
text:{en:'The youth division trophy. The first of many, you both promise.',ja:'ジュニア部門の優勝カップ。二人で「次は本戦」と約束した。',zh:'少年组冠军奖杯。你们约定：“下次是正赛。”'}},
{id:'troublemaker',rank:'B',cond:s=>s.ev.fight>=2,
name:{en:'Trouble Follows You',ja:'トラブルはあなたの隣に',zh:'麻烦住在你隔壁'},
text:{en:'Three broken windows, two repaired. The town grumbles, but it misses you when you\'re gone.',ja:'割った窓3枚、直した窓2枚。町は文句を言いながらも、あなたを待っている。',zh:'打碎三块窗、修好两块。镇上一边抱怨一边等你回来。'}},
{id:'sickailment',rank:'B',cond:s=>s.form.indexOf('ail2')>=0,
name:{en:'Together Till the End',ja:'最期まで共に',zh:'陪伴到最后'},
text:{en:'The long nights at the sickbed. The blanket, the medicine smell, your hand held out. Not regret.',ja:'長い闘病の夜。薬の匂いと差し出した手。あなたはそれを悔やんではいない。',zh:'漫长的病床之夜。药味与伸出的手。你并不后悔。'}},
{id:'sickteen',rank:'C',cond:s=>/^ail/.test(s.form),
name:{en:'The Long Vigil',ja:'看病の季節',zh:'守护的季节'},
text:{en:'The growth stalled, but every day you sat by the bed. That is its own kind of star.',ja:'成長は止まった。でも毎日、あなたはベッドの側にいた。',zh:'成长停下了，但你每天都守在床边。'}},
{id:'couch',rank:'D',cond:s=>s.mood>=60&&(s.pw+s.br+s.ch+s.st+s.sp)<80,
name:{en:'Professional Loungers',ja:'ゴロゴロの極み',zh:'躺平大师'},
text:{en:'No medals. No trophies. Just two experts on napping in sunbeams.',ja:'メダルもトロフィーもない。でも日向で昼寝をする腕前なら世界一だ。',zh:'没有奖牌也没有奖杯，但晒太阳打盹的手腕世界第一。'}},
{id:'vigil2',rank:'C',cond:s=>s.flags.sick&&/1_/.test(s.form),
name:{en:'Medicine and Patience',ja:'薬と根気',zh:'药与耐心'},
text:{en:'You learned the exact temperature of a good medicine. One day, the fever will break.',ja:'あなたは良い薬の温度を知った。いつか熱は必ず下がる。',zh:'你懂得了良药的温度。总有一天，热度会退去。'}},
{id:'companion',rank:'C',cond:s=>true,
name:{en:'Happiness, As Is',ja:'ただ今のしあわせ',zh:'此刻的幸福'},
text:{en:'An ordinary 60 days. And yet the ordinary was, you both agree, the best.',ja:'ありふれた60日間。でもありふれていることが、一番よかったね。',zh:'平凡的60天。而你们一致同意：平凡即最好。'}}
];
const SHOPITEMS=[
{it:'book',price:15,g:{br:4}},
{it:'vitamin',price:12,st:12},
{it:'outfit',price:25,g:{ch:3}},
{it:'art',price:18,g:{sp:4}}
];
const SHOPNAME={book:{en:'Special Book',ja:'特別なおとぎ本',zh:'特别绘本'},vitamin:{en:'Vitamins',ja:'ビタミン剤',zh:'维生素'},outfit:{en:'Stage Outfit',ja:'ステージ衣装',zh:'舞台服装'},art:{en:'Art Set',ja:'お絵かきセット',zh:'绘画套装'}};

/* ================= state & save ================= */
const SAVEKEY=i=>'stardia_save'+i, LASTKEY='stardia_last', SETKEY='stardia_set', ENDKEY='stardia_endings';
const MAXDAY=60;
let S=null;
function saveSet(){try{localStorage.setItem(SETKEY,JSON.stringify(SET));}catch(e){}}
try{const s=JSON.parse(localStorage.getItem(SETKEY)||'null');if(s){if(LANGS.indexOf(s.lang)>=0)SET.lang=s.lang;SET.sound=!!s.sound;}}catch(e){}
function slotData(i){try{const d=JSON.parse(localStorage.getItem(SAVEKEY(i))||'null');return (d&&d.sp)?d:null;}catch(e){return null;}}
function saveGame(){
if(!S)return false;
try{localStorage.setItem(SAVEKEY(S.slot),JSON.stringify(S));}
catch(e){console.error('Stardia save failed',e);return false;}
try{localStorage.setItem(LASTKEY,String(S.slot));}
catch(e){console.error('Stardia last-slot update failed',e);}
return true;
}
function deleteSlot(i){try{localStorage.removeItem(SAVEKEY(i));}catch(e){}}
function endingColl(){try{const a=JSON.parse(localStorage.getItem(ENDKEY)||'[]');return Array.isArray(a)?a:[];}catch(e){return[];}}
function lastSlot(){try{const v=+(localStorage.getItem(LASTKEY));return isNaN(v)?-1:v;}catch(e){return -1;}}
function addEndingColl(id){const a=endingColl();if(a.indexOf(id)<0){a.push(id);try{localStorage.setItem(ENDKEY,JSON.stringify(a));}catch(e){}}}
/* ================= audio ================= */
const AU={ctx:null,master:null,timer:0,step:0,mel:[]};
function audioInit(){if(AU.ctx||!SET.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AU.ctx=new C();AU.master=AU.ctx.createGain();AU.master.gain.value=SET.sound?0.9:0;AU.master.connect(AU.ctx.destination);}catch(e){}}
function tone(f,dur,type,vol,delay,slide){if(!SET.sound||!AU.ctx)return;try{const c=AU.ctx,t0=c.currentTime+(delay||0);const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.linearRampToValueAtTime(slide,t0+dur);g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(vol||0.2,t0+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);o.connect(g);g.connect(AU.master);o.start(t0);o.stop(t0+dur+0.05);}catch(e){}}
const SFX={
click(){tone(900,0.07,'triangle',0.12);},
ok(){tone(660,0.12,'sine',0.16);tone(880,0.14,'sine',0.12,0.09);},
no(){tone(200,0.2,'sawtooth',0.1);},
coin(){tone(980,0.09,'square',0.08);tone(1320,0.12,'square',0.08,0.07);},
chime(){tone(1568,0.25,'sine',0.14);tone(2093,0.3,'sine',0.1,0.12);},
fanfare(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.28,'triangle',0.2,i*0.11));[1319].forEach(f=>tone(f,0.7,'triangle',0.16,0.62));},
pet(){tone(520,0.09,'sine',0.12,0,760);},
end(){[392,523,659,784,659,784,1047].forEach((f,i)=>tone(f,0.4,'sine',0.18,i*0.22));}
};
function bgmScale(){const base=[220,262,294,329,392,440,523,587];let seed=0;const nm=SPECIES[S.species].default[SET.lang]||'x'+S.slot;for(let i=0;i<nm.length;i++)seed=(seed*31+nm.charCodeAt(i))>>>0;const arr=base.slice();for(let i=arr.length-1;i>0;i--){seed=(seed*1103515245+12345)>>>0;const j=seed%(i+1);const t=arr[i];arr[i]=arr[j];arr[j]=t;}AU.mel=arr;}
function startBgm(){stopBgm();bgmScale();AU.timer=setInterval(()=>{if(!SET.sound||!AU.ctx||screen!=='game')return;const m=AU.mel,st=AU.step++;const n=m[(st*3+((st>>3)*5))%m.length]*(st%8===7?0.5:1);tone(n,0.16,'triangle',0.045);if(st%8===0)tone(m[0]*0.5,0.4,'sine',0.05);if(st%8===4)tone(m[2]*1,0.3,'sine',0.035);},350);}
function stopBgm(){if(AU.timer){clearInterval(AU.timer);AU.timer=0;}}
function applySound(){if(AU.master)AU.master.gain.value=SET.sound?0.9:0;if(SET.sound){audioInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();}$('#btnSound').textContent=SET.sound?'🔊 ON':'🔇 OFF';saveSet();}
/* ================= UI ================= */
let screen='title', evQueue=[], ovlOpen=false, petLock=0, chosenStarter='ember', pendingSlot=0;
function showScreen(name){screen=name;['title','slots','new','game','gallery'].forEach(n=>{$('#screen-'+n).classList.toggle('hidden',n!==name);$('#screen-'+n).classList.toggle('screen',true);});$('#stage').classList.toggle('off',name==='slots'||name==='new'||name==='gallery');updateTopbar();}
function dayPhase(d){return d<=19?1:d<=44?2:3;}
function updateTopbar(){if(S&&screen==='game'){$('#daylbl').textContent=t('d',{d:S.day,max:MAXDAY})+' ✦ '+t('ph'+dayPhase(S.day));}else{$('#daylbl').textContent='Stardia ✦';}}
function L(k,p){return t(k,p);}
function applyLabels(){
document.documentElement.lang=SET.lang;
$('#btnLang').textContent='🌐 '+LANGNAME[SET.lang];
$('#titleTag').textContent=L('tag');
$('#btnNew').textContent=L('menu_new');
$('#btnCont').textContent=L('menu_cont');
$('#btnGal').textContent=L('col_t');
$('#btnHelpT').textContent=L('m_help');
$('#btnEndDay').textContent=L('a_end');
$('#btnSave').textContent=L('m_save');
$('#btnTitle').textContent=L('m_title');
$('#hNote').textContent=L('n_extra');
$('#nameLabel').textContent=L('name_label');
$('#btnStart').textContent=L('start_btn');
buildStatGrid();
updateTopbar();renderLog();renderActs();renderHUD();}
/* log */
function logLine(key,par,cls){if(!S)return;S.log.push({k:key,p:par||null,c:cls||''});if(S.log.length>80)S.log.shift();renderLog();}
function renderLog(){const el=$('#glog');if(!S){el.innerHTML='';return;}let h='';for(let i=Math.max(0,S.log.length-40);i<S.log.length;i++){const e=S.log[i];h+='<p class="'+(e.c||'')+'">'+esc(t(e.k,e.p))+'</p>';}el.innerHTML=h;el.scrollTop=el.scrollHeight;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
/* HUD */
function renderHUD(){if(!S)return;
const f=FORMS[S.form];
$('#hForm').innerHTML='<span>'+f.emo+'</span><b>'+esc(f.name[SET.lang]||f.name.en)+'</b><span style="color:#93a0c8">'+L('form_l'+(f.st===0?1:f.st===2?2:3))+'</span>';
$('#hCoins').textContent='🪙 '+S.coins;
$('#bE').firstElementChild.style.width=S.energy+'%';$('#vE').textContent=S.energy;
$('#bM').firstElementChild.style.width=S.mood+'%';$('#vM').textContent=S.mood;
STATKEYS.forEach((k,i)=>{const v=S[k];const bar=$('#bar'+i),val=$('#val'+i);if(bar){bar.style.width=Math.min(100,v)+'%';val.textContent=Math.round(v);}});}
function buildStatGrid(){let h='';STATKEYS.forEach((k,i)=>{h+='<div class="stat">'+STATICON[i]+'<b>'+esc(L('st_'+k))+'</b><div class="bar" id="bar'+i+'"><i></i></div><em id="val'+i+'">0</em></div>';});$('#statgrid').innerHTML=h;}
function renderActs(){const el=$('#acts');if(!S){el.innerHTML='';return;}el.innerHTML='';
ACTS.forEach(a=>{const b=document.createElement('button');b.className='abtn';
let dis=false;
if(S.ended)dis=true;
else if(S.actLeft<=0&&!a.free)dis=true;
else if(S.flags.tired&&['train','study','work','adventure','hobby','shop'].indexOf(a.id)>=0)dis=true;
else if(a.id==='medicine'&&!S.flags.sick)dis=true;
else if(S.energy<a.e||S.coins<a.c)dis=true;
if(dis)b.classList.add('dis');
b.title=L('a_tip_'+a.id);
const cost=(a.e?'⚡'+a.e:'⚡0')+(a.c?' 🪙'+a.c:'')+(a.free?'':'')+(a.free?'':' ×'+S.actLeft);
b.innerHTML='<span class="ai">'+a.ic+'</span><span class="an">'+esc(L('a_'+a.id))+'</span><span class="ac">'+esc(cost)+'</span>';
b.addEventListener('click',()=>doAction(a));el.appendChild(b);});}
/* overlay */
function showOvl(o){ovlOpen=true;$('#ov').classList.remove('hidden');
const em=$('#ovemo');if(o.emo){em.textContent=o.emo;em.classList.remove('hidden');}else em.classList.add('hidden');
if(o.rank){$('#ovTitle').innerHTML='<span class="rank rank'+o.rank+'">'+L('rank_l')+' '+o.rank+'</span><br>'+esc(o.title);}else $('#ovTitle').textContent=o.title||'';
$('#ovMsg').innerHTML=o.html?o.msg:'<span style="white-space:pre-line">'+esc(o.msg||'')+'</span>';
const bb=$('#ovbtns');bb.innerHTML='';(o.btns||[{l:L('menu_yes'),cb:closeOvl}]).forEach(b=>{const x=document.createElement('button');if(b.hi)x.className='hi';if(b.res){x.className='res';x.textContent=b.res;}else{x.textContent=b.l;x.addEventListener('click',()=>{SFX.click();b.cb();});}bb.appendChild(x);});}
function closeOvl(){ovlOpen=false;$('#ov').classList.add('hidden');if(S)renderPending();}
function renderPending(){if(evQueue.length&&!ovlOpen){const e=evQueue.shift();showEventOvl(e);}}
function showEventOvl(e){if(e.evo){G3.evolveFx();showOvl({emo:e.emo,title:e.title,msg:e.msg,btns:[{l:'OK ✓',cb:closeOvl}]});return;}showOvl({title:e.title,msg:e.msg,btns:e.buttons});}
/* ================= gain helpers ================= */
function moodMult(){return S.mood>=70?1.15:(S.mood<40?0.8:1);}
function applyGain(stat,base){const v=Math.max(1,Math.round(base*moodMult()*(S.flags.sick?0.6:1)*(0.85+Math.random()*0.3)));S[stat]=clamp(S[stat]+v,0,99);return v;}
function addMood(v){S.mood=clamp(S.mood+v,0,100);}
function addAff(v){S.aff=clamp(S.aff+v,0,100);}
function gainMsg(parts){const g=[];STATKEYS.forEach(k=>{if(parts['g_'+k])g.push(L('g_'+k)+' +'+parts['g_'+k]);});if(parts.mood)g.push(L('g_mood')+' '+(parts.mood>0?'+':'')+parts.mood);if(parts.coins)g.push('+'+parts.coins+' '+L('g_coins'));return g.join(' · ');}
/* ================= actions ================= */
function doAction(a){
if(!S||S.ended||ovlOpen)return;
if(S.actLeft<=0&&!a.free){SFX.no();return;}
if(S.flags.tired&&['train','study','work','adventure','hobby','shop'].indexOf(a.id)>=0){SFX.no();return;}
if(S.energy<a.e){SFX.no();logLine('no_energy',null,'sys');return;}
if(S.coins<a.c){SFX.no();logLine('no_coins',null,'sys');return;}
if(a.id==='medicine'&&!S.flags.sick){logLine('no_medicine',null,'sys');SFX.no();return;}
if(a.id==='adventure'&&(S.energy<30||S.st<15)){SFX.no();logLine('ad_pre',null,'sys');return;}
logLine(a.log,null,'');
if(a.id==='adventure'){adventure();}
else if(a.id==='medicine'){S.energy-=a.e;S.flags.sick=false;logLine('w_heal',null,'evo');S.ev.medicine=(S.ev.medicine||0)+1;SFX.ok();G3.jump();}
else if(a.id==='rest'){S.energy=clamp(S.energy+45,0,100);addMood(8);const wasSick=S.flags.sick;S.flags.tired=false;if(wasSick){S.flags.sick=false;logLine('w_heal',null,'evo');}logLine('⚡ +45 · '+L('g_mood')+' +8',null,'sys');SFX.ok();}
else{
S.energy-=a.e;S.coins-=a.c;
const parts={};
STATKEYS.forEach(k=>{if(a.g&&a.g[k]){parts['g_'+k]=applyGain(k,a.g[k]);}});
if(a.coins){const m=a.coins[0]+ri(0,a.coins[1]-a.coins[0]);S.coins+=m;parts.coins=m;SFX.coin();}
if(a.mood){addMood(a.mood);parts.mood=a.mood;}
if(a.aff)addAff(a.aff);
if(a.flag)S.ev[a.id]=(S.ev[a.id]||0)+1;
if(a.id==='clean')S.cleanFlag=true;
logLine(gainMsg(parts),null,'sys');
SFX.ok();if(a.id==='play'||a.id==='shop'||a.id==='groom')G3.hearts(2);else G3.jump();
if(a.id==='shop')openShop();
}
if(!a.free)S.actLeft--;
if(S.energy<=1&&!S.flags.tired){S.flags.tired=true;logLine('w_tired',null,'evo');}
tryEvolve();
if(S.day>=MAXDAY&&!S.ended&&evQueue.length===0){/* waiting endDay */}
saveGame();renderActs();renderHUD();updateTopbar();renderPending();
}
function adventure(){
S.energy-=30;S.coins-=6;S.ev.adventure=(S.ev.adventure||0)+1;
const roll=ri(1,10)+(S.pw+S.st+S.br)/40;
if(roll>=8){
const c=10+ri(5,15);S.coins+=c;const g1=applyGain('st',3),g2=applyGain('pw',2);
if(Math.random()<0.3){S.ev.artifact=(S.ev.artifact||0)+1;addMood(6);S.ev.sp=(S.ev.sp||0)+1;logLine('ad_great_tre',null,'ev');}
logLine(gainMsg({g_st:g1,g_pw:g2,coins:c}),null,'sys');SFX.coin();
}else if(roll>=4.5){
const c=5+ri(2,8);S.coins+=c;const g=applyGain('st',2);logLine(gainMsg({g_st:g,coins:c}),null,'sys');SFX.ok();
}else{
addMood(-8);S.flags.tired=true;const g=applyGain('sp',1);logLine('ad_bad',null,'ev');logLine(gainMsg({g_sp:g,mood:-8}),null,'sys');SFX.no();
}
if(Math.random()<0.35){S.ev.explore=(S.ev.explore||0)+1;const g=applyGain('sp',3);addMood(3);logLine('ad_wonder',null,'ev');logLine(gainMsg({g_sp:g,mood:3}),null,'sys');SFX.chime();}
}
/* ================= evolution ================= */
function branchId(sp,st){
if(st===1){
if(S.flags.sick){const top=topStat(['pw','br','ch']);return 'ail_'+({pw:'p',br:'b',ch:'c'})[top];}
const top=topStat(['pw','br','ch']);return sp+'1_'+({pw:'p',br:'b',ch:'c'})[top];
}else{
if(S.flags.sick)return 'ail2';
if(S.aff>=75&&S.mood>=80)return sp+'2_s';
const top=topStat(['pw','br','ch']);return sp+'2_'+({pw:'p',br:'b',ch:'c'})[top];
}
}
function topStat(keys){let best=keys[0];keys.forEach(k=>{if(S[k]>S[best])best=k;});return best;}
function tryEvolve(){
const st=FORMS[S.form].st;
if(st===0&&S.day>=19){evolveTo(branchId(S.species,1));}
else if(st===2&&S.day>=44){evolveTo(branchId(S.species,2));}
}
function evolveTo(id){
const old=FORMS[S.form],nf=FORMS[id];
S.form=id;
logLine('evo_l1',{n:S.name,f:nf.name[SET.lang]||nf.name.en},'evo');
S.energy=clamp(S.energy+20,0,100);addMood(6);addAff(4);
evQueue.push({evo:true,emo:nf.emo,title:L('evolve_title'),msg:L('evo_l1',{n:S.name,f:nf.name[SET.lang]||nf.name.en})});
if(nf.st===3){S.flags.love=S.flags.love||(id.indexOf('_s')>=0);if(id.indexOf('_s')>=0)S.flags.love=true;}
G3.buildCreature(id);G3.jump();SFX.fanfare();
}
/* ================= end of day ================= */
function endDay(){
if(!S||S.ended||ovlOpen)return;
SFX.click();
if(S.day>=MAXDAY){finishEnding();return;}
if(S.energy>=40)S.flags.tired=false;
S.coins=Math.max(0,S.coins-2);logLine('w_food',{c:2},'sys');
addMood(-(S.cleanFlag?2:3));S.cleanFlag=false;
if(!S.flags.sick&&S.ev.sickRoll===undefined)S.ev.sickRoll=0;
if(!S.flags.sick&&(S.energy<25||S.mood<30)&&S.ev.sick<2&&Math.random()<0.16){S.flags.sick=true;S.ev.sick=(S.ev.sick||0)+1;logLine('w_ill',{n:S.name},'evo');}
S.day++;S.energy=clamp(55+S.st/4,0,100);S.actLeft=2;
logLine('daysep',{d:S.day},'sep');
tryEvolve();
if(S.day===MAXDAY)logLine('day60',null,'evo');
rollDayEvents(S.day);
saveGame();renderHUD();renderActs();updateTopbar();
renderPending();
}
/* ================= events ================= */
function rollDayEvents(d){
if(d%15===12)evQueue.push(evCup());
if(d%15===0)evQueue.push(evFestival());
const pool=EVENT_POOL.filter(e=>{try{return (!e.one||!S.ev['ev_'+e.id])&&e.cond();}catch(err){return false;}});
if(Math.random()<0.6&&pool.length){const e=pool[ri(0,pool.length-1)];S.ev['ev_'+e.id]=1;evQueue.push(e.make());}
}
function b(l,cb){return {l:l,cb:cb};}
function evt(o){SFX.chime();return o;}
function evCup(){
return evt({title:L('f_cup_t'),msg:L('f_cup_m',{n:S.name}),buttons:[
b(L('f_cup_b1'),()=>{S.ev.fight=(S.ev.fight||0)+1;const pw=S.pw+S.st/2+ri(1,15);const win=pw>=45&&Math.random()<clamp(pw/85,0.2,0.92);
if(win){S.flags.champion=true;const c=35;S.coins+=c;const a1=applyGain('pw',4),a2=6;addMood(a2);logLine('f_cup_r1',{c:c,a:a1,a2:a2},'ev');SFX.fanfare();G3.jump();}
else{const a1=applyGain('st',4),a2=4;addMood(a2);logLine('f_cup_r2',{c:0,a:a1,a2:a2},'ev');SFX.ok();}closeOvl();}),
b(L('f_cup_b2'),()=>{const a=5;addMood(a);logLine('f_cup_r3',{a:a},'ev');closeOvl();})
]});
}
function evFestival(){
return evt({title:L('f_fest_t'),msg:L('f_fest_m'),buttons:[
b(L('f_fest_b1',{c:10}),()=>{if(S.coins>=10){S.coins-=10;const a1=applyGain('ch',4),a2=8;addMood(a2);logLine('f_fest_r1',{a:a1,a2:a2},'ev');SFX.coin();G3.hearts(3);}closeOvl();}),
b(L('f_fest_b2'),()=>{if(S.coins<5){$('#ovMsg').textContent=L('no_coins');SFX.no();return;}S.coins-=5;const a=6;addMood(a);logLine('f_fest_r2',{c:5,a:a},'ev');closeOvl();})
]});
}
function evSickRepeat(){
return evt({title:L('f_sick_t'),emo:'🤒',msg:L('f_sick_m2',{n:S.name}),buttons:[
b(L('f_sick_b1'),()=>{S.flags.sick=false;S.ev.medicine=(S.ev.medicine||0)+1;logLine('w_heal',null,'evo');SFX.ok();closeOvl();}),
b(L('f_sick_b2'),()=>{logLine('f_sick_r2',null,'ev');closeOvl();})
]});
}
const EVENT_POOL=[
{id:'market',one:false,cond:()=>S.day>=5,make:()=>evt({title:L('f_market_t'),emo:'🪙',msg:L('f_market_m'),buttons:[
 b(L('f_b1'),()=>{const c=8;S.coins+=c;logLine('f_market_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_b2'),()=>{if(Math.random()<0.5){const c=22;S.coins+=c;logLine('f_market_r2',{c:c},'ev');SFX.coin();}else{const c=Math.min(S.coins,12);S.coins-=c;logLine('f_market_r3',{c:c},'ev');SFX.no();}closeOvl();}),
 b(L('f_b3'),()=>{const a=3;addMood(a);logLine('f_market_r4',{a:a},'ev');closeOvl();})
]})},
{id:'rival',one:true,cond:()=>S.day>=6&&!S.flags.rival,make:()=>evt({title:L('f_rival_t'),emo:'😼',msg:L('f_rival_m'),buttons:[
 b(L('f_b4'),()=>{S.flags.rival=true;const a1=applyGain('pw',3),a2=applyGain('st',3);logLine('f_rival_r1',{a:a1,a2:a2},'ev');closeOvl();}),
 b(L('f_b5'),()=>{const a=applyGain('sp',4);logLine('f_rival_r2',{a:a},'ev');closeOvl();}),
 b(L('f_b6'),()=>{const a1=applyGain('ch',3),a2=6;addMood(a2);logLine('f_rival_r3',{a:a1,a2:a2},'ev');closeOvl();})
]})},
{id:'sick',one:false,cond:()=>S.flags.sick,make:evSickRepeat},
{id:'dream',one:true,cond:()=>(S.ev.sp||0)>=6,make:()=>evt({title:L('f_dream_t'),emo:'💭',msg:L('f_dream_m',{n:S.name}),buttons:[
 b(L('f_dream_b1'),()=>{addMood(8);addAff(3);const a=applyGain('sp',2);logLine('f_dream_r1',null,'ev');logLine(gainMsg({g_sp:a,mood:8}),null,'sys');G3.hearts(3);closeOvl();}),
 b(L('f_dream_b2'),()=>{addMood(4);logLine('f_dream_r2',null,'ev');closeOvl();})
]})},
{id:'treasure',one:true,cond:()=>S.day>=8,make:()=>evt({title:L('f_tre_t'),emo:'💎',msg:L('f_tre_m'),buttons:[
 b(L('f_tre_b1'),()=>{const c=24;S.coins+=c;logLine('f_tre_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_tre_b2'),()=>{S.ev.artifact=(S.ev.artifact||0)+1;addMood(10);logLine('f_tre_r2',null,'ev');SFX.chime();closeOvl();})
]})},
{id:'friend',one:false,cond:()=>S.day>=4&&S.day%3!==0,make:()=>evt({title:L('f_friend_t'),emo:'👋',msg:L('f_friend_m'),buttons:[
 b(L('f_friend_b1'),()=>{const a=applyGain('ch',3);logLine('f_friend_r1',{a:a},'ev');closeOvl();}),
 b(L('f_friend_b2'),()=>{if(S.coins<4){$('#ovMsg').textContent=L('no_coins');SFX.no();return;}S.coins-=4;const a=7;addMood(a);logLine('f_friend_r2',{a:a},'ev');closeOvl();}),
 b(L('f_friend_b3'),()=>{const c=6;S.coins+=c;logLine('f_friend_r3',{c:c},'ev');SFX.coin();closeOvl();})
]})},
{id:'insp',one:true,cond:()=>S.br>=20,make:()=>evt({title:L('f_insp_t'),emo:'💡',msg:L('f_insp_m'),buttons:[
 b(L('f_insp_b1'),()=>{const a=applyGain('br',6);logLine('f_insp_r1',{a:a},'ev');SFX.chime();closeOvl();}),
 b(L('f_insp_b2'),()=>{const a=applyGain('br',3);logLine('f_insp_r2',{a:a},'ev');closeOvl();})
]})},
{id:'storm',one:true,cond:()=>S.day>=10&&dayPhase(S.day)===3,make:()=>evt({title:L('f_storm_t'),emo:'⛈️',msg:L('f_storm_m',{n:S.name}),buttons:[
 b(L('f_storm_b1'),()=>{const a=applyGain('st',4);logLine('f_storm_r1',{a:a},'ev');closeOvl();}),
 b(L('f_storm_b2'),()=>{const a=applyGain('sp',4),a2=applyGain('pw',3);logLine('f_storm_r2',{a:a,a2:a2},'ev');G3.jump();closeOvl();})
]})},
{id:'star',one:true,cond:()=>dayPhase(S.day)===3&&S.day>=15,make:()=>evt({title:L('f_star_t'),emo:'🌠',msg:L('f_star_m'),buttons:[
 b(L('f_star_b1'),()=>{const a=12;addMood(a);addAff(6);logLine('f_star_r1',{a:a},'ev');G3.hearts(4);closeOvl();}),
 b(L('f_star_b2'),()=>{const a=applyGain('sp',5);logLine('f_star_r2',{a:a},'ev');SFX.chime();closeOvl();})
]})},
{id:'gift',one:true,cond:()=>S.aff>=55,make:()=>evt({title:L('f_gift_t'),emo:'🎁',msg:L('f_gift_m'),buttons:[
 b(L('f_gift_b1'),()=>{const c=20;S.coins+=c;addMood(6);logLine('f_gift_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_gift_b2'),()=>{const a=applyGain('sp',4);addMood(5);logLine('f_gift_r2',{a:a},'ev');closeOvl();})
]})},
{id:'cook',one:true,cond:()=>S.ch>=30,make:()=>evt({title:L('f_cook_t'),emo:'🍳',msg:L('f_cook_m'),buttons:[
 b(L('f_cook_b1'),()=>{if(S.ch+ri(1,10)>=S.day*0.8){const c=26;S.coins+=c;logLine('f_cook_r1',{c:c},'ev');SFX.coin();}else{addMood(-4);logLine('f_market_r3',{c:5},'ev');S.coins=Math.max(0,S.coins-5);SFX.no();}closeOvl();}),
 b(L('f_cook_b2'),()=>{const a=6;addMood(a);logLine('f_cook_r2',{a:a},'ev');closeOvl();})
]})},
{id:'egg',one:true,cond:()=>S.day>=20&&Math.random()<0.5,make:()=>evt({title:L('f_egg_t'),emo:'🥚',msg:L('f_egg_m'),buttons:[
 b(L('f_egg_b1'),()=>{const a=applyGain('sp',6),a2=applyGain('br',4);logLine('f_egg_r1',{a:a,a2:a2},'ev');SFX.chime();closeOvl();}),
 b(L('f_egg_b2'),()=>{logLine('f_egg_r2',null,'ev');closeOvl();})
]})}
];
/* ================= ending ================= */
function finishEnding(){
let e=null;for(const E of ENDINGS){try{if(E.cond(S)){e=E;break;}}catch(err){}}
if(!e)e=ENDINGS[ENDINGS.length-1];
S.ended=e.id;addEndingColl(e.id);saveGame();stopBgm();SFX.end();
logLine('fin_t',null,'evo');
showOvl({emo:FORMS[S.form].emo,title:e.name[SET.lang]||e.name.en,rank:e.rank,msg:(e.text[SET.lang]||e.text.en)+'\n\n'+L('form_l')+': '+FORMS[S.form].emo+' '+(FORMS[S.form].name[SET.lang]||FORMS[S.form].name.en)+'\n'+L('end_stats')+': 💪'+Math.round(S.pw)+' 🧠'+Math.round(S.br)+' 💃'+Math.round(S.ch)+' 🏃'+Math.round(S.st)+' 🧘'+Math.round(S.sp)+'\n'+L('days_l'),btns:[
 {l:L('btn_newRun'),hi:true,cb:()=>{closeOvlNoQueue();goNew(S.slot);}},
 {l:L('btn_toTitle'),cb:()=>{closeOvlNoQueue();goTitle();}}
]});
}
function closeOvlNoQueue(){ovlOpen=false;evQueue.length=0;$('#ov').classList.add('hidden');}
/* ================= shop ================= */
function openShop(){
if(!S||S.ended||ovlOpen)return;SFX.click();
const btns=SHOPITEMS.map(it=>b('🪙'+it.price+' · '+SHOPNAME[it.it][SET.lang],()=>{
 if(S.coins<it.price){logLine('shop_no',null,'sys');SFX.no();closeOvl();return;}
 S.coins-=it.price;const parts={};
 if(it.st){S.st=clamp(S.st+it.st,0,99);}
 if(it.g)STATKEYS.forEach(k=>{if(it.g[k])parts['g_'+k]=applyGain(k,it.g[k]);});
 logLine('shop_ok',{it:SHOPNAME[it.it][SET.lang]},'ev');logLine(gainMsg(parts),null,'sys');SFX.coin();closeOvl();}));
btns.push(b(L('menu_no'),closeOvl));
showOvl({title:L('shop_t'),emo:'🛒',msg:'',btns:btns});
}
/* ================= screens ================= */
function goTitle(){stopBgm();showScreen('title');renderTitle();}
function renderTitle(){
const last=lastSlot();const d=slotData(last);
$('#btnCont').classList.toggle('hidden',!(S||d));
if(d)$('#btnCont').textContent=L('menu_cont')+'  (Day '+d.day+' · '+(d.name||'')+')';
$('#titleHint').textContent=L('help_text').split('\n')[0];
}
function goSlots(){SFX.click();buildSlots();showScreen('slots');}
function buildSlots(){
$('#slotsTitle').textContent=L('menu_slots');$('#slotsSub').textContent=L('menu_slots_sub');
$('#btnSlotsBack').textContent=L('menu_back');
const el=$('#slotsList');el.innerHTML='';
for(let i=0;i<3;i++){
const d=slotData(i);const card=document.createElement('div');card.className='slot';
if(d){const f=FORMS[d.form]||FORMS.egg;
card.innerHTML='<div class="semo">'+f.emo+'</div><div class="sinfo"><div class="st1">'+esc(d.name||'')+' ('+esc(SPECIES[d.sp]?SPECIES[d.sp].default[SET.lang]:'')+')'+'</div><div class="st2">'+esc(L('d',{d:d.day,max:MAXDAY}))+' · '+esc(f.name[SET.lang]||f.name.en)+'</div></div>';
const go=document.createElement('button');go.className='go';go.textContent=L('menu_start');go.addEventListener('click',ev=>{ev.stopPropagation();SFX.click();resumeGame(i);});
const del=document.createElement('button');del.className='del';del.textContent=L('menu_del');del.addEventListener('click',ev=>{ev.stopPropagation();SFX.click();showOvl({title:L('menu_delq'),btns:[{l:L('menu_yes'),cb:()=>{deleteSlot(i);closeOvlNoQueue();buildSlots();},hi:true},{l:L('menu_no'),cb:closeOvlNoQueue}]});});
const w=document.createElement('div');w.className='sbtns';w.appendChild(go);w.appendChild(del);card.appendChild(w);
card.addEventListener('click',()=>{SFX.click();showOvl({title:L('replace'),btns:[{l:L('menu_start'),hi:true,cb:()=>{closeOvlNoQueue();goNew(i);}},{l:L('menu_cont'),cb:()=>{closeOvlNoQueue();resumeGame(i);}},{l:L('menu_no'),cb:closeOvlNoQueue}]});});
}else{
card.innerHTML='<div class="semo">➕</div><div class="sinfo"><div class="st1">Slot '+(i+1)+'</div><div class="st2">'+L('menu_new')+'</div></div>';
card.addEventListener('click',()=>{SFX.click();goNew(i);});
}
el.appendChild(card);}
}
function goNew(slot){pendingSlot=slot;chosenStarter='ember';
$('#newTitle').textContent=L('new_title');$('#newSub').textContent=L('new_sub');
const el=$('#starterList');el.innerHTML='';
['ember','sprout','bubble'].forEach(sp=>{
const c=document.createElement('button');c.className='starter'+(sp===chosenStarter?' sel':'');
c.innerHTML='<span class="semo">'+SPECIES[sp].emo+'</span><span><b>'+esc(FORMS[sp+'0'].name[SET.lang]||FORMS[sp+'0'].name.en)+'</b><span>'+esc(L(SPECIES[sp].t))+'</span></span>';
c.addEventListener('click',()=>{chosenStarter=sp;SFX.click();[...el.children].forEach(x=>x.classList.remove('sel'));c.classList.add('sel');$('#nameInput').value=SPECIES[sp].default[SET.lang];});
el.appendChild(c);});
$('#nameInput').value=SPECIES[chosenStarter].default[SET.lang];
showScreen('new');
}
function startGame(){
SFX.fanfare();
const nm=($('#nameInput').value||'').trim().slice(0,10)||SPECIES[chosenStarter].default[SET.lang];
S={slot:pendingSlot,sp:chosenStarter,species:chosenStarter,name:nm,day:1,actLeft:2,energy:70,coins:30,mood:70,aff:10,
pw:5,br:5,ch:5,st:5,sp:5,form:chosenStarter+'0',ended:null,
flags:{sick:false,tired:false,love:false,rival:false,champion:false},ev:{sick:0},log:[]};
logLine('daysep',{d:1},'sep');
buildStatGrid();showScreen('game');G3.setPhase(1);G3.buildCreature(S.form);
saveGame();applyLabels();startBgm();
G3.evolveFx();
}
function resumeGame(i){
const d=slotData(i);if(!d)return;S=d;
if(!S.ev)S.ev={};if(!S.flags)S.flags={};if(!S.log)S.log=[];
buildStatGrid();showScreen('game');G3.setPhase(dayPhase(S.day));G3.buildCreature(S.form);
applyLabels();startBgm();
if(S.ended){const e=ENDINGS.find(x=>x.id===S.ended)||ENDINGS[ENDINGS.length-1];logLine('fin_t',null,'evo');finishShow(e);}
}
function finishShow(e){showOvl({emo:FORMS[S.form].emo,title:e.name[SET.lang]||e.name.en,rank:e.rank,msg:(e.text[SET.lang]||e.text.en),btns:[{l:L('btn_newRun'),hi:true,cb:()=>{closeOvlNoQueue();goNew(S.slot);}},{l:L('btn_toTitle'),cb:()=>{closeOvlNoQueue();goTitle();}}]});}
function goGallery(){SFX.click();buildGallery();showScreen('gallery');}
function buildGallery(){
$('#galTitle').textContent=L('col_t');
const got=endingColl();
$('#galSub').textContent=L('col_sub',{n:got.length,m:ENDINGS.length});
$('#btnGalBack').textContent=L('menu_back');
const el=$('#galList');el.innerHTML='';
ENDINGS.slice().sort((a,b)=>('SABCD'.indexOf(a.rank)-'SABCD'.indexOf(b.rank))).forEach(e=>{
const div=document.createElement('div');div.className='galitem'+(got.indexOf(e.id)<0?' lock':'');
if(got.indexOf(e.id)<0)div.innerHTML='<span class="gr rankD">?</span>'+L('col_locked');
else div.innerHTML='<span class="gr rank'+e.rank+'">'+e.rank+'</span><b>'+esc(e.name[SET.lang]||e.name.en)+'</b><div style="font-size:11.5px;color:#93a0c8;margin-top:3px">'+esc(e.text[SET.lang]||e.text.en)+'</div>';
el.appendChild(div);});
}
/* pet */
function petPet(){
if(!S||screen!=='game'||ovlOpen||S.ended)return;
const now=Date.now();if(now-petLock<2000)return;petLock=now;
addMood(2);addAff(1);logLine('log_pet',{n:S.name},'');
SFX.pet();G3.hearts(2);saveGame();renderHUD();
}

/* ================= three.js visual ================= */
const G3=(function(){
let ok=false,renderer,scene,camera,hemi,dir,dirBase,rim,fx=[],CRE=null,t0=0,jumpT=0,flashV=0,blink=2,blinkT=0;
let yaw=0.5,pitch=0.3,userYaw=0,userPitch=0,autoYaw=0,dragging=false,lastX=0,lastY=0,movedDist=0;
let curSky=null,tarSky=null,tarDir=null,rocks=[],onPetCb=null,heartTex=null,starTex=null,lastW=0,lastH=0;
const SKY=[0x000000,0x20294a,0x252c52,0x302a4c,0x131a30];
const DIRC=[0x000000,0xdfe8ff,0xfff0d5,0xffc98a,0xbccfff];
function fallback(){const st=$('#stage');st.classList.add('off3');$('#c3').style.display='none';const n=$('#offnote');n.classList.remove('hidden');n.firstElementChild.textContent=L('off_note');}
function texHeart(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#ff5f7a';g.beginPath();g.moveTo(32,52);g.bezierCurveTo(4,34,10,8,32,20);g.bezierCurveTo(54,8,60,34,32,52);g.fill();return new THREE.CanvasTexture(c);}
function texStar(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#ffd166';g.beginPath();for(let i=0;i<10;i++){const r=i%2?9:26,a=-Math.PI/2+i*Math.PI/5;g.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r);}g.closePath();g.fill();return new THREE.CanvasTexture(c);}
function mat(col,emissive,glow){const m=new THREE.MeshStandardMaterial({color:col,roughness:0.85,metalness:0.02});if(emissive){m.emissive=new THREE.Color(emissive);m.emissiveIntensity=glow?0.45:0.25;}return m;}
function addShadow(o){o.traverse(n=>{if(n.isMesh)n.castShadow=true;});}
function disposeGroup(g){if(!g)return;g.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material){(Array.isArray(n.material)?n.material:[n.material]).forEach(m=>m.dispose());}});if(g.parent)g.parent.remove(g);}
function buildCreature(id){
 const f=FORMS[id];if(!f)return null;
 $('#stage-emoji').textContent=f.emo;
 if(!ok)return null;
 if(CRE)disposeGroup(CRE.group);
 const sp=f.spec,col=sp.color,acc=sp.accent,glow=!!sp.glow;
 const G=new THREE.Group();const bodyMats=[];const eyes=[];let tail=null,wings=[],aura=null,head=null,torso=null,headY=0;
 const mainMat=mat(col,glow?col:null,glow);bodyMats.push(mainMat);
 if(sp.shape==='egg'){
  const e=new THREE.Mesh(new THREE.SphereGeometry(0.6,28,22),mat(0xf3ead8,null,false));e.scale.set(0.82,1.08,0.82);e.position.y=0.66;G.add(e);torso=e;
  for(let i=0;i<7;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8),mat(0xffb14d,null,false));const a=Math.random()*Math.PI*2,p=Math.random()*Math.PI-Math.PI/2;s.position.set(Math.cos(a)*0.5*Math.cos(p),0.66+Math.sin(p)*0.64,Math.sin(a)*0.5*Math.cos(p));s.scale.set(1.4,1,0.4);G.add(s);}
 }else if(sp.shape==='wide'){
  torso=new THREE.Mesh(new THREE.SphereGeometry(0.8,26,20),mainMat);torso.scale.set(1.18,0.82,1.05);torso.position.y=0.66;G.add(torso);
  headY=1.32;head=new THREE.Mesh(new THREE.SphereGeometry(0.44,24,18),mainMat);head.position.y=headY;G.add(head);
 }else if(sp.shape==='tall'){
  torso=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.56,1.0,22),mainMat);torso.position.y=0.92;G.add(torso);
  const capm=new THREE.Mesh(new THREE.SphereGeometry(0.4,22,16),mainMat);capm.position.y=1.42;capm.scale.set(1,0.8,1);G.add(capm);
  headY=1.62;head=new THREE.Mesh(new THREE.SphereGeometry(0.44,24,18),mainMat);head.position.y=headY;G.add(head);
  if(sp.legs)[[-0.24,-0.18],[0.24,-0.18],[-0.24,0.22],[0.24,0.22]].forEach(p=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.45,10),mat(col,null,false));l.position.set(p[0],0.22,p[1]);G.add(l);});
 }else{
  torso=new THREE.Mesh(new THREE.SphereGeometry(0.66,26,20),mainMat);torso.scale.set(1,0.94,0.96);torso.position.y=0.7;G.add(torso);
  headY=1.45;head=new THREE.Mesh(new THREE.SphereGeometry(0.5,24,18),mainMat);head.position.y=headY;G.add(head);
 }
 if(sp.shape!=='egg'){
  const hr=(sp.shape==='wide')?0.44:(sp.shape==='tall')?0.44:0.5;
  [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.SphereGeometry(0.105,12,10),mat(0xffffff,null,false));w.position.set(0.17*s,headY+0.05,hr*0.72);const p=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),mat(0x141a26,null,false));p.position.set(0.17*s,headY+0.05,hr*0.87);G.add(w);G.add(p);eyes.push(w);eyes.push(p);});
  const mo=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.02,8,16,Math.PI),mat(0x3a2a2a,null,false));mo.position.set(0,headY-0.13,hr*0.82);mo.rotation.x=Math.PI+0.2;G.add(mo);
 }
 if(sp.ears&&head)[[-1,1]].concat([]).forEach(()=>{[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,10),mat(acc,glow?acc:false,glow));e.position.set(0.5*s,headY+0.28,0);e.scale.set(0.8,1,0.6);G.add(e);});});
 if(sp.tuft&&head){const tg=new THREE.Group();tg.position.y=headY+0.45;const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,8),mat(acc,acc,glow));tg.add(b);const c1=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.3,8),mat(acc,acc,true));c1.position.y=0.2;tg.add(c1);const c2=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,8),mat(acc,acc,true));c2.position.set(0.12,0.14,0);c2.rotation.z=-0.6;tg.add(c2);G.add(tg);}
 if(sp.horns&&head){for(let i=0;i<sp.horns;i++){const hc=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.26,8),mat(0xf2ead8,glow?acc:null,glow));hc.position.set((i-(sp.horns-1)/2)*0.2,headY+0.5,(i%2)*0.05);hc.rotation.z=(i-(sp.horns-1)/2)*-0.18;G.add(hc);}}
 if(sp.wings){[-1,1].forEach(s=>{const wmat=new THREE.MeshStandardMaterial({color:acc,roughness:0.5,transparent:true,opacity:0.8,side:THREE.DoubleSide,emissive:new THREE.Color(acc),emissiveIntensity:0.15});const w=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.65,0.05),wmat);w.position.set(0.55*s,1.25,-0.2);w.rotation.set(0.2*s,0.3*s,0.55*s);G.add(w);wings.push({m:w,base:0.55*s});});}
 if(sp.tail){
  if(sp.tail==='flame'){tail=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.55,10),mat(0xff9a3c,0xff7a1e,true));tail.position.set(0,0.5,-0.95);tail.rotation.x=-0.55;}
  else if(sp.tail==='leaf'){tail=new THREE.Mesh(new THREE.SphereGeometry(0.24,12,8),mat(acc,glow?acc:false,glow));tail.scale.set(0.35,1.1,0.7);tail.position.set(0,0.75,-0.85);tail.rotation.x=-0.7;}
  else{tail=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.06,8,20,Math.PI),mat(acc,glow?acc:false,glow));tail.position.set(0,0.62,-0.85);tail.rotation.set(Math.PI/2,0,1.2);}
  if(tail)G.add(tail);
 }
 if(sp.mane){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),mat(acc,glow?acc:false,glow));m.position.set(Math.cos(a)*0.52,headY-0.3,Math.sin(a)*0.52);G.add(m);}}
 if(sp.aura){aura=new THREE.Mesh(new THREE.SphereGeometry(1.15,26,20),new THREE.MeshStandardMaterial({color:acc,transparent:true,opacity:0.14,emissive:new THREE.Color(acc),emissiveIntensity:0.5,depthWrite:false}));aura.position.y=1.1;G.add(aura);}
 if(S&&S.flags.sick&&id.indexOf('ail')<0){G.traverse(n=>{if(n.isMesh&&n.material&&n.material.color)n.material.color.lerp(new THREE.Color(0x6a6f7e),0.35);});}
 const sc=sp.scale||1;G.scale.set(sc,sc,sc);addShadow(G);G.position.y=0.04;scene.add(G);
 autoYaw=0;userYaw=0;userPitch=0;
 CRE={group:G,torso:torso,head:head,headY:headY,eyes:eyes,tail:tail,wings:wings,aura:aura,baseTorso:torso?torso.scale.y:1,baseHead:headY};
 return G;
}
function spawnFx(tex,x,y,vy){if(fx.length>28)return;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(0.28,0.28,1);s.position.set(x,y,0.6);s.userData={vy:vy,t:0};scene.add(s);fx.push(s);}
function setPhase(p){if(!ok)return;tarSky=new THREE.Color(SKY[p]);tarDir=new THREE.Color(DIRC[p]);}
function init(canvas,cb){
 onPetCb=cb;
 if(!window.THREE){fallback();return;}
 try{
  ok=true;heartTex=texHeart();starTex=texStar();
  renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene();
  curSky=new THREE.Color(SKY[1]);tarSky=curSky.clone();
  scene.background=curSky;scene.fog=new THREE.Fog(curSky.getHex(),7.5,17);
  camera=new THREE.PerspectiveCamera(42,1,0.1,60);
  hemi=new THREE.HemisphereLight(0xbfd0ff,0x272138,0.8);scene.add(hemi);
  dir=new THREE.DirectionalLight(0xfff0d5,1.0);dirBase=1.0;dir.position.set(3.2,5.5,3.2);dir.castShadow=true;
  dir.shadow.mapSize.set(1024,1024);dir.shadow.camera.left=-4;dir.shadow.camera.right=4;dir.shadow.camera.top=4.5;dir.shadow.camera.bottom=-4.5;scene.add(dir);
  tarDir=dir.color.clone();
  rim=new THREE.PointLight(0xff8a5c,0.55,14);rim.position.set(-2.6,1.7,-2);scene.add(rim);
  const g1=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.3,0.36,44),new THREE.MeshStandardMaterial({color:0x2b3557,roughness:0.95}));
  g1.position.y=-0.18;g1.receiveShadow=true;scene.add(g1);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.42,0.045,10,64),new THREE.MeshStandardMaterial({color:0x5a6a9c,emissive:new THREE.Color(0x28406e),emissiveIntensity:0.5,roughness:0.5}));
  ring.rotation.x=Math.PI/2;ring.position.y=0.01;scene.add(ring);
  for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(0.1+Math.random()*0.09,0),new THREE.MeshStandardMaterial({color:0x3b4a74,roughness:0.9,flatShading:true}));const a=Math.random()*Math.PI*2,rr=1.9+Math.random()*1.1;m.position.set(Math.cos(a)*rr,1+Math.random()*1.4,Math.sin(a)*rr);m.userData={fy:m.position.y,ph:Math.random()*7};scene.add(m);rocks.push(m);}
  for(let i=0;i<3;i++){const cr=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.5+Math.random()*0.4,6),new THREE.MeshStandardMaterial({color:0x4a5f96,emissive:new THREE.Color(0x2a4a8a),emissiveIntensity:0.4,flatShading:true,roughness:0.6}));const a=2.2+i*2.1;cr.position.set(Math.cos(a)*1.85,0.25,Math.sin(a)*1.85);cr.rotation.z=(Math.random()-0.5)*0.3;cr.receiveShadow=true;cr.castShadow=true;scene.add(cr);}
  const pos=[];for(let i=0;i<170;i++){const x=(Math.random()-0.5)*26,y=1+Math.random()*11,z=(Math.random()-0.5)*26;pos.push(x,y,z);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  const st=new THREE.Points(sg,new THREE.PointsMaterial({color:0xd6e4ff,size:0.07,transparent:true,opacity:0.9}));scene.add(st);rocks.push(st);st.userData={fy:0,ph:0,isStars:true};
  // interaction
  canvas.addEventListener('pointerdown',e=>{dragging=true;movedDist=0;lastX=e.clientX;lastY=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch(err){}});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;movedDist+=Math.abs(dx)+Math.abs(dy);userYaw+=dx*0.008;userPitch=clamp(userPitch-dy*0.006,-0.3,0.55);lastX=e.clientX;lastY=e.clientY;});
  canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(movedDist<12&&CRE&&onPetCb){const r=canvas.getBoundingClientRect();const mx=((e.clientX-r.left)/r.width)*2-1,my=-((e.clientY-r.top)/r.height)*2+1;const rc=new THREE.Raycaster();rc.setFromCamera({x:mx,y:my},camera);const hit=rc.intersectObject(CRE.group,true);if(hit.length)onPetCb();}});
  t0=performance.now();
  requestAnimationFrame(loop);
 }catch(err){ok=false;console.error('Stardia 3D init failed',err);fallback();}
}
function loop(){
 const now=performance.now();const dt=Math.min(0.05,(now-t0)/1000);t0=now;
 const st=$('#stage');
 if(st&&lastW!==st.clientWidth&&st.clientWidth>0){lastW=st.clientWidth;lastH=st.clientHeight;renderer.setSize(lastW,lastH,false);camera.aspect=lastW/lastH;camera.updateProjectionMatrix();}
 // sky lerp
 if(tarSky&&curSky){curSky.lerp(tarSky,Math.min(1,dt*2.2));scene.background=curSky;scene.fog.color.copy(curSky);}
 if(tarDir)dir.color.lerp(tarDir,Math.min(1,dt*2.2));
 if(!dragging)autoYaw+=dt*0.12;
 const yy=yaw+autoYaw+userYaw,pp=clamp(pitch+userPitch,-0.15,0.85),rad=4.5;
 camera.position.set(Math.sin(yy)*Math.cos(pp)*rad,1.05+Math.sin(pp)*rad,Math.cos(yy)*Math.cos(pp)*rad);
 camera.lookAt(0,1.05,0);
 const T=now/1000;
 rocks.forEach(m=>{m.position.y=m.userData.fy+Math.sin(T*0.8+m.userData.ph)*0.12;if(m.userData.isStars)m.rotation.y+=dt*0.01;});
 if(CRE){
  let jy=0;
  if(jumpT>0){jumpT-=dt;jy=Math.max(0,Math.sin((1-Math.max(0,jumpT)/0.75)*Math.PI))*0.6;}
  CRE.group.position.y=0.04+jy+Math.sin(T*2.1)*0.045;
  CRE.group.rotation.z=Math.sin(T*0.9)*0.02;
  if(CRE.torso){const k=1+Math.sin(T*2.1)*0.03;CRE.torso.scale.y=CRE.baseTorso*k;}
  if(CRE.head)CRE.head.position.y=CRE.baseHead+Math.sin(T*2.1+0.5)*0.03;
  if(CRE.tail)CRE.tail.rotation.y=Math.sin(T*3)*0.35;
  CRE.wings.forEach((w,i)=>{w.m.rotation.z=w.base+Math.sin(T*6+i*3)*0.25;});
  if(CRE.aura){const a=1+Math.sin(T*3)*0.05;CRE.aura.scale.set(a,a,a);CRE.aura.rotation.y+=dt*0.6;}
  blink-=dt;if(blink<=0){blink=1.5+Math.random()*3;blinkT=0.12;}
  const es=blinkT>0?0.15:1;if(blinkT>0)blinkT-=dt;
  CRE.eyes.forEach(e=>{e.scale.y=es;});
 }
 // fx
 for(let i=fx.length-1;i>=0;i--){const s=fx[i];s.userData.t+=dt;s.position.y+=s.userData.vy*dt;s.position.x+=Math.sin(s.userData.t*7)*0.003;const k=s.userData.t;s.material.opacity=Math.max(0,1-k*0.8);s.scale.setScalar(0.24+k*0.1);if(k>1.3){scene.remove(s);s.material.dispose();fx.splice(i,1);}}
 if(flashV>0){flashV=Math.max(0,flashV-dt*1.8);dir.intensity=dirBase+flashV*3;}else dir.intensity=dirBase;
 if(rim)rim.intensity=0.5+Math.sin(T*2.4)*0.12;
 if(lastW>0)renderer.render(scene,camera);
 requestAnimationFrame(loop);
}
return {
 ok:function(){return ok;},
 init:init,
 setPhase:setPhase,
 buildCreature:buildCreature,
 jump:function(){jumpT=0.75;},
 hearts:function(n){if(!ok||!heartTex)return;for(let i=0;i<n;i++){const hx=(Math.random()-0.5)*1.4;spawnFx(heartTex,hx,1.2+Math.random()*0.5,0.8+Math.random()*0.5);}},
 evolveFx:function(){if(!ok||!starTex)return;flashV=1;for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2;spawnFx(starTex,Math.cos(a)*1.2,0.9+Math.random()*1.2,1+Math.random()*1.2);}}
};
})();

/* ================= boot ================= */
function wire(){
$('#btnLang').addEventListener('click',()=>{SET.lang=LANGS[(LANGS.indexOf(SET.lang)+1)%LANGS.length];saveSet();SFX.click();applyLabels();if(screen==='title')renderTitle();else if(screen==='slots')buildSlots();else if(screen==='gallery')buildGallery();});
$('#btnSound').addEventListener('click',()=>{SET.sound=!SET.sound;applySound();if(SET.sound)SFX.click();saveSet();});
$('#btnNew').addEventListener('click',goSlots);
$('#btnCont').addEventListener('click',()=>{SFX.click();const last=lastSlot();if(slotData(last))resumeGame(last);});
$('#btnGal').addEventListener('click',goGallery);
$('#btnHelpT').addEventListener('click',()=>{SFX.click();showOvl({title:L('m_help'),msg:L('help_text'),btns:[{l:'OK ✓',cb:closeOvlNoQueue}]});});
$('#btnSlotsBack').addEventListener('click',()=>{SFX.click();goTitle();});
$('#btnGalBack').addEventListener('click',()=>{SFX.click();goTitle();});
$('#btnStart').addEventListener('click',startGame);
$('#btnEndDay').addEventListener('click',endDay);
$('#btnSave').addEventListener('click',()=>{if(S&&!S.ended){if(saveGame()){logLine('saved_ok',null,'sys');SFX.ok();}else{logLine('save_failed',null,'sys');SFX.no();}}});
$('#btnTitle').addEventListener('click',()=>{SFX.click();if(S)saveGame();stopBgm();goTitle();});
}
function boot(){
applyLabels();
applySound();
wire();
G3.init($('#c3'),()=>petPet());
G3.setPhase(1);
G3.buildCreature('egg');
renderTitle();
showScreen('title');
}
boot();
