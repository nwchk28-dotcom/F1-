export type ArchiveType = "グリッド" | "チーム" | "マシン" | "ドライバー" | "規則";
export type ArchiveEvent = { year: string; end: string; title: string; note: string; stat: string };

export const archiveTypes: ArchiveType[] = ["グリッド", "チーム", "マシン", "ドライバー", "規則"];
export const archiveDescriptions: Record<ArchiveType, string> = {
  "グリッド":"参戦台数と勢力図の変化", "チーム":"名門の誕生、改称、継承の系譜", "マシン":"速さの定義を変えた革新的な一台", "ドライバー":"王者とライバルが築いた時代", "規則":"車両、安全、競技規則の大転換",
};

export const archiveData: Record<ArchiveType, ArchiveEvent[]> = {
  "グリッド":[
    {year:"1950",end:"1957",title:"The works pioneers",note:"アルファロメオ、フェラーリ、マセラティと多数のプライベーターが混走。",stat:"20+台の大グリッド"},
    {year:"1958",end:"1967",title:"British garagistes",note:"Cooper、Lotus、BRMが小型・ミッドシップ化でワークス勢力を逆転。",stat:"Constructors' title"},
    {year:"1968",end:"1988",title:"The kit-car boom",note:"DFVエンジンとHewlandギアボックスが新規参入を支え、グリッドが多様化。",stat:"Pre-qualifying"},
    {year:"1989",end:"2009",title:"Manufacturer arms race",note:"Honda、Renault、BMW、Toyotaなど自動車メーカーの投資がグリッドを席巻。",stat:"10—12 teams"},
    {year:"2010",end:"2025",title:"Ten-team stability",note:"参戦枠とコストが整理され、10チーム20台の時代が定着。",stat:"20 cars"},
    {year:"2026",end:"NOW",title:"Eleven teams",note:"Cadillacの参入でグリッドは11チーム22台へ。Audiもワークス参戦。",stat:"22 cars"},
  ],
  "チーム":[
    {year:"1950",end:"NOW",title:"Scuderia Ferrari",note:"世界選手権初年度から続く唯一のチーム。F1の歴史そのもの。",stat:"16 constructors' titles"},
    {year:"1966",end:"NOW",title:"McLaren",note:"創設者の名を受け継ぎ、複数の時代で王朝を構築。",stat:"Woking"},
    {year:"1977",end:"NOW",title:"Williams",note:"プライベーター精神からハイテク王朝へ。Groveを拠点に再建が続く。",stat:"9 constructors' titles"},
    {year:"1997",end:"2026",title:"Stewart to Red Bull",note:"Stewart → Jaguar → Red Bull。拠点とエントリー権が強豪へ受け継がれた。",stat:"Milton Keynes"},
    {year:"1999",end:"NOW",title:"BAR to Mercedes",note:"BAR → Honda → Brawn GP → Mercedes。撤退と再生の先に8連覇が生まれた。",stat:"Brackley lineage"},
    {year:"2026",end:"NOW",title:"Audi & Cadillac",note:"ザウバーを継承するAudiと、新規参入のCadillacがグリッドを拡大。",stat:"New works era"},
  ],
  "マシン":[
    {year:"1954",end:"1955",title:"Mercedes W196",note:"燃料噴射、デスモドロミックバルブ、流線形ボディで技術優位を示した。",stat:"Straight-8"},
    {year:"1962",end:"1965",title:"Lotus 25",note:"バスタブ型モノコックが軽量化と高剛性を両立。F1車の基礎を変えた。",stat:"Monocoque"},
    {year:"1977",end:"1978",title:"Lotus 78 / 79",note:"ベンチュリ・トンネルで床下からダウンフォースを発生。",stat:"Ground effect"},
    {year:"1988",end:"1988",title:"McLaren MP4/4",note:"低い車体とHondaターボの組み合わせで15勝を記録。",stat:"15 wins / 16 races"},
    {year:"1992",end:"1993",title:"Williams FW14B",note:"アクティブサスと電子制御を統合し、「史上最も高度」な一台に。",stat:"Active ride"},
    {year:"2022",end:"NOW",title:"Floor-led aero",note:"グランドエフェクトが復活。床下設計がマシン性能の中心に戻った。",stat:"Venturi floors"},
  ],
  "ドライバー":[
    {year:"1950",end:"1958",title:"Fangio's mastery",note:"異なる4メーカーを渡り歩き、5度のドライバーズ王者を獲得。",stat:"5 titles"},
    {year:"1976",end:"1976",title:"Lauda vs Hunt",note:"ニュルブルクリングの事故と復帰、富士の最終戦まで続いた対決。",stat:"1 point"},
    {year:"1988",end:"1993",title:"Senna vs Prost",note:"同じマシンから始まり、複数チームを跨いだF1最大のライバルストーリー。",stat:"7 titles combined"},
    {year:"1994",end:"2004",title:"Schumacher era",note:"ベネトンで頭角を現し、Ferrariを強豪に再建して5連覇。",stat:"7 titles"},
    {year:"2007",end:"2020",title:"Hamilton's records",note:"ルーキーイヤーから王者争い。優勝とポールの通算記録を更新。",stat:"100+ wins"},
    {year:"2021",end:"NOW",title:"Verstappen generation",note:"アグレッシブな速さと一貫性で新時代を定義。次世代の挑戦者も台頭。",stat:"4 consecutive titles"},
  ],
  "規則":[
    {year:"1958",end:"1958",title:"Constructors' Championship",note:"ドライバーだけでなく、マシンを作るチームにも世界選手権が誕生。",stat:"Teams recognised"},
    {year:"1961",end:"1965",title:"1.5-litre formula",note:"排気量縮小で速度を抑え、軽量ミッドシップの開発を促進。",stat:"1.5L NA"},
    {year:"1989",end:"1989",title:"Turbo ban",note:"第一期ターボ時代が終了し、3.5L自然吸気エンジンへ統一。",stat:"3.5L NA"},
    {year:"1994",end:"1994",title:"Safety reset",note:"ドライバー支援電子制御の禁止と、イモラ後の包括的な安全改革。",stat:"Step planes"},
    {year:"2014",end:"2014",title:"Hybrid power units",note:"1.6L V6ターボとエネルギー回生を統合し、熱効率を競うフォーミュラへ。",stat:"V6 turbo hybrid"},
    {year:"2026",end:"NOW",title:"50/50 power",note:"電動出力を大幅に強化。アクティブエアロと100%持続可能燃料を導入。",stat:"New formula"},
  ],
};
