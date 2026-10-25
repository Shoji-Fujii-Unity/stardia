# Stardia −星のともだち育成日記− / Star Friend Raising Diary / 星之伙伴养育日记

A single-file, portrait-layout pet-raising game built with Three.js.
一个使用 Three.js 制作的竖屏养成游戏。
Three.jsで作られた縦画面の育成ゲーム。

---

## 日本語

### 遊び方
星から生まれた大切な子を **60日間** 育てる育成シミュレーションです。1日 **2アクション** まで選べます。

- **12種類のアクション**: トレーニング・おべんきょう・アルバイト・ぼうけん・おやすみ・あそぶ・しゅみ・かいいも・おて入れ・くすり・おしゃべり・そうじ
- **ステータス**: ちから・あたま・おしゃれ・たいりょく・せいしん(いずれも最大99)
- **気分・絆・エネルギー・コイン**: 気分が高いほど成長が大きく、病気は成長を鈍らせます
- **ランダムイベント**: 15日ごとに大会(闘技場)と音楽祭、その他たくさんのイベント
- **分岐育成**: 初期キャラ3種 × 段階的進化で **全30形態**(病気ルート・絆MAXの特別な姿あり)
- **エンディング21種類**: 達成したエンディングは図鑑に記録されます(S〜Dランク)

### 操作
| 操作 | 内容 |
|---|---|
| 画面をドラッグ | 3D視点を回転 |
| 生き物をタップ/クリック | なでる(気分+2・絆+1) |
| 🌐 ボタン | 日本語 → English → 中文 の順で言語切替 |
| 🔊 ボタン | サウンド ON/OFF |

### 必要環境
- 最近のブラウザ(Chrome / Edge / Firefox / Safari など、スマホでもOK)
- 3D表示には WebGL が必要です。Three.js の読み込みに失敗した場合は、絵文字で遊ぶ「かんたんモード」に自動で切り替わります(ゲーム内容は同じ)

### ファイル
```
stardia/
├─ index.html    ← この1ファイルで遊べます(ブラウザで開くだけ)
├─ three.min.js  ← Three.js r128 のローカルコピー(CDN 遮断時用)
├─ README.md
└─ dev/          ← 開発用ソース(分割 js / HTMLシェル / テストスクリプト)
```

### セーブデータ
ブラウザの localStorage にローカル保存されます(サーバー送信なし)。
- `stardia_save0` / `stardia_save1` / `stardia_save2` … セーブスロット3枠(プレイ中は自動保存)
- `stardia_endings` … エンディング図鑑の収集記録
- `stardia_set` … 言語・サウンド設定 / `stardia_last` … 最終スロット

削除したい場合はブラウザのサイトデータ消去、またはゲーム内のスロット初期化を使ってください。

---

## English

### How to play
Raise a child born from the stars for **60 days**. You may choose up to **2 actions per day**.

- **12 actions**: Training, Study, Work, Adventure, Rest, Play, Hobby, Shopping, Grooming, Medicine, Social, Cleaning
- **Stats**: power, brain, charm, stamina, spirit (each capped at 99)
- **Mood, bond, energy, coins**: high mood boosts growth; sickness slows it down
- **Random events**: a colosseum cup and a music festival every 15 days, plus many one-time events
- **Branching evolution**: 3 starters × staged evolutions = **30 forms** (including sickness branches and a special high-bond form)
- **21 endings**: collected in a gallery, ranked S to D

### Controls
| Input | Action |
|---|---|
| Drag the scene | Orbit the 3D camera |
| Tap / click the creature | Pet it (mood +2, bond +1) |
| 🌐 button | Cycle language: 日本語 → English → 中文 |
| 🔊 button | Sound ON/OFF |

### Requirements
- Any modern browser (Chrome / Edge / Firefox / Safari; works on phones too)
- WebGL is used for the 3D view. If Three.js fails to load, the game automatically switches to an emoji-based simple mode with identical gameplay.

### Files
```
stardia/
├─ index.html    ← the whole game in one file (just open it)
├─ three.min.js  ← local copy of Three.js r128 (fallback when CDN is blocked)
├─ README.md
└─ dev/          ← development sources (split js / html shell / test scripts)
```

### Save data
Everything is stored locally in your browser's localStorage — nothing is sent to a server.
- `stardia_save0/1/2` — three save slots (autosave while playing)
- `stardia_endings` — ending-collection record
- `stardia_set` / `stardia_last` — language & sound settings / last slot

To erase data, clear the site data in your browser settings.

---

## 中文

### 玩法
养育从星星诞生的孩子,共 **60 天**,每天可选择 **2 次行动**。

- **12 种行动**:锻炼、学习、打工、冒险、休息、玩耍、兴趣、购物、打理身体、吃药、交流、打扫
- **能力值**:力量、头脑、时尚、体力、精神(上限均为 99)
- **心情・羁绊・能量・金币**:心情越高成长越大,生病会拖慢成长
- **随机事件**:每 15 天举办大会(竞技场)和音乐节,还有许多一次性事件
- **分支养成**:3 种初始伙伴 × 阶段进化 = **共 30 种形态**(含生病分支和羁绊满值的特殊形态)
- **21 种结局**:达成的结局会收录到图鉴中(S〜D 等级)

### 操作
| 操作 | 内容 |
|---|---|
| 拖动画面 | 旋转 3D 视角 |
| 点击生物 | 抚摸(心情 +2、羁绊 +1) |
| 🌐 按钮 | 依次切换 日本語 → English → 中文 |
| 🔊 按钮 | 音效 开/关 |

### 运行环境
- 现代浏览器(Chrome / Edge / Firefox / Safari,手机亦可)
- 3D 画面需要 WebGL。若 Three.js 加载失败,会自动切换为用 emoji 显示的“简易模式”,游戏玩法完全相同。

### 文件
```
stardia/
├─ index.html    ← 单个文件即是完整游戏(用浏览器打开即可)
├─ three.min.js  ← Three.js r128 的本地备份(CDN 被屏蔽时使用)
├─ README.md
└─ dev/          ← 开发用源码(分割的 js / HTML 外壳 / 测试脚本)
```

### 存档数据
全部保存在浏览器的 localStorage 中,不会发送到任何服务器。
- `stardia_save0` / `stardia_save1` / `stardia_save2` … 3 个存档槽(游玩中自动保存)
- `stardia_endings` … 结局图鉴的收集记录
- `stardia_set` / `stardia_last` … 语言与音效设置 / 最后使用的槽位

如需删除数据,请在浏览器设置中清除该站点的数据。

---

## 開発者向け / For developers / 开发者说明

ゲーム本体は単一ファイル `stardia/index.html` です。ビルド時のみ `dev/` 内の分割ソースを使用します。
The game itself is the single file `stardia/index.html`; the split sources in `dev/` are only used when rebuilding.

```
dev/_shell.html  HTML+CSS の外枠
dev/js/p1.js     多言語辞書・種族/形態/行動/エンディング定義
dev/js/p2.js     セーブ・音声・UI・ゲームロジック
dev/js/p3.js     Three.js の 3D モジュール(G3)
dev/js/p4.js     初期化とイベント配線
```

ビルド(PowerShell)は `_shell.html` + `p1〜p4.js` を連結して `index.html` を生成します。UTF-8 で読み書きしてください。
Rebuild = concatenate `_shell.html` + `p1…p4.js` into `index.html` (read/write as UTF-8; plain `Get-Content -Raw` on Windows PowerShell 5.1 corrupts CJK — use .NET `File::ReadAllText/WriteAllText` with explicit UTF-8).

Three.js は r128 を前提としています(新バージョンの Geometry 名变更に非対応)。
The game targets Three.js **r128** (CapsuleGeometry 等の新しいジオメトリは使いません / no newer geometry APIs are used).

---

Made with ♥ and Three.js. 遊ぶほどに増える「エンディング図鑑」を、ぜひコンプリートしてください。
