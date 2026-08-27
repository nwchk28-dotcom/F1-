"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { driverStats, statLabels, type DriverStat, type StatKey } from "../data/driver-stats";
import { supplementalDriverStats } from "../data/supplemental-driver-stats";
import { yearIndex } from "../data/year-index";
import seasonArchive from "../data/season-archive.json";

const teams = [
  { name:"Mercedes", drivers:"G. Russell  /  K. Antonelli", driverNames:["George Russell","Kimi Antonelli"], color:"#55e6c1", code:"MER", base:"Brackley, United Kingdom", principal:"Toto Wolff", power:"Mercedes", debut:"1954 / 2010", titles:"8", story:"ハイブリッド時代を支配したシルバーアロー。若さと経験を組み合わせ、新規則時代の王座奪還を狙う。" },
  { name:"Ferrari", drivers:"C. Leclerc  /  L. Hamilton", driverNames:["Charles Leclerc","Lewis Hamilton"], color:"#ff4338", code:"FER", base:"Maranello, Italy", principal:"Frédéric Vasseur", power:"Ferrari", debut:"1950", titles:"16", story:"世界選手権の全時代を知る唯一のチーム。ルクレールとハミルトンという象徴的なラインナップを擁する。" },
  { name:"McLaren", drivers:"L. Norris  /  O. Piastri", driverNames:["Lando Norris","Oscar Piastri"], color:"#ff9e1b", code:"MCL", base:"Woking, United Kingdom", principal:"Andrea Stella", power:"Mercedes", debut:"1966", titles:"10", story:"レースの名門が現代的な技術組織として復活。ノリスとピアストリの互いに譲らない速さが武器。" },
  { name:"Red Bull Racing", drivers:"M. Verstappen  /  I. Hadjar", driverNames:["Max Verstappen","Isack Hadjar"], color:"#5471ff", code:"RBR", base:"Milton Keynes, United Kingdom", principal:"Laurent Mekies", power:"Red Bull Ford", debut:"2005", titles:"6", story:"大胆なエアロ設計とレース運用で二度の王朝を構築。2026年は独自PUプロジェクトとともに次章へ。" },
  { name:"Racing Bulls", drivers:"L. Lawson  /  A. Lindblad", driverNames:["Liam Lawson","Arvid Lindblad"], color:"#e9eef8", code:"VCB", base:"Faenza, Italy", principal:"Alan Permane", power:"Red Bull Ford", debut:"1985 lineage", titles:"0", story:"ミナルディ時代から続くファエンツァのチーム。若手を実戦で磨き、上位チームへ送り出す役割も担う。" },
  { name:"Alpine", drivers:"P. Gasly  /  F. Colapinto", driverNames:["Pierre Gasly","Franco Colapinto"], color:"#ff79b0", code:"ALP", base:"Enstone, United Kingdom", principal:"Flavio Briatore", power:"Mercedes", debut:"1981 lineage", titles:"2", story:"トールマン、ベネトン、ルノーの系譜を継ぐエンストンのチーム。2026年から新たなPU時代に入る。" },
  { name:"Haas F1 Team", drivers:"E. Ocon  /  O. Bearman", driverNames:["Esteban Ocon","Oliver Bearman"], color:"#d5d7dc", code:"HAS", base:"Kannapolis, United States", principal:"Ayao Komatsu", power:"Ferrari", debut:"2016", titles:"0", story:"現代F1のスリムなチームモデルを掲げるアメリカンチーム。小松礼雄代表のもとで組織の強化が続く。" },
  { name:"Audi", drivers:"N. Hülkenberg  /  G. Bortoleto", driverNames:["Nico Hülkenberg","Gabriel Bortoleto"], color:"#f52236", code:"AUD", base:"Hinwil, Switzerland", principal:"Jonathan Wheatley", power:"Audi", debut:"2026", titles:"0", story:"ザウバーの拠点と人材を受け継ぎ、Audiワークスとして新たに始動。車体とPUの一体開発に挑む。" },
  { name:"Williams", drivers:"C. Sainz  /  A. Albon", driverNames:["Carlos Sainz","Alexander Albon"], color:"#179bf4", code:"WIL", base:"Grove, United Kingdom", principal:"James Vowles", power:"Mercedes", debut:"1977", titles:"9", story:"グローブを拠点に数々の革新を生んだプライベーターの名門。長期再建は着実に結果へつながっている。" },
  { name:"Aston Martin", drivers:"F. Alonso  /  L. Stroll", driverNames:["Fernando Alonso","Lance Stroll"], color:"#0bbf83", code:"AMR", base:"Silverstone, United Kingdom", principal:"Adrian Newey", power:"Honda", debut:"2021", titles:"0", story:"新拠点、Honda PU、トップクラスの技術陳を結集。ワークス体制でチャンピオン争いへの飛躍を目指す。" },
  { name:"Cadillac", drivers:"S. Pérez  /  V. Bottas", driverNames:["Sergio Pérez","Valtteri Bottas"], color:"#d7b46a", code:"CAD", base:"United States / United Kingdom", principal:"Graeme Lowdon", power:"Ferrari", debut:"2026", titles:"0", story:"11番目のチームとして2026年に参戦開始。経験豊富なドライバー2名で、アメリカンワークスの基礎を築く。" },
];

const standings = [
  ["Kimi Antonelli", "Mercedes", "242", "+59"],
  ["George Russell", "Mercedes", "183", "—"],
  ["Lewis Hamilton", "Ferrari", "183", "—"],
  ["Lando Norris", "McLaren", "159", "-24"],
  ["Charles Leclerc", "Ferrari", "155", "-28"],
];

const races = [
  {round:12,country:"オランダ",place:"Zandvoort",date:"21—23 AUG",state:"done",winner:"L. Norris"},
  {round:13,country:"イタリア",place:"Monza",date:"04—06 SEP",state:"next",winner:"NEXT"},
  {round:14,country:"スペイン",place:"Madrid",date:"11—13 SEP",state:"upcoming",winner:"—"},
  {round:15,country:"アゼルバイジャン",place:"Baku",date:"24—26 SEP",state:"upcoming",winner:"—"},
  {round:16,country:"バーレーン",place:"Sakhir",date:"02—04 OCT",state:"upcoming",winner:"—"},
  {round:17,country:"シンガポール",place:"Marina Bay",date:"09—11 OCT",state:"upcoming",winner:"—"},
];

const lineages = [
  {name:"Mercedes",span:"1999—NOW",chain:[{name:"BAR",years:"1999—2005"},{name:"Honda",years:"2006—2008"},{name:"Brawn GP",years:"2009"},{name:"Mercedes",years:"2010—NOW"}],note:"ブラックリーの拠点は、撤退と買収を乗り越えてハイブリッド時代最強の組織へ。"},
  {name:"Red Bull",span:"1997—NOW",chain:[{name:"Stewart",years:"1997—1999"},{name:"Jaguar",years:"2000—2004"},{name:"Red Bull",years:"2005—NOW"}],note:"フォードワークスの撤退後、レッドブルがエントリーを継承し、二度の王朝を構築。"},
  {name:"Alpine",span:"1981—NOW",chain:[{name:"Toleman",years:"1981—1985"},{name:"Benetton",years:"1986—2001"},{name:"Renault",years:"2002—2011"},{name:"Lotus",years:"2012—2015"},{name:"Renault",years:"2016—2020"},{name:"Alpine",years:"2021—NOW"}],note:"トールマンから始まるエンストンの系譜。ベネトンとルノーの名で世界を制した。"},
  {name:"Aston Martin",span:"1991—NOW",chain:[{name:"Jordan",years:"1991—2005"},{name:"Midland",years:"2006"},{name:"Spyker",years:"2007"},{name:"Force India",years:"2008—2018"},{name:"Racing Point",years:"2018—2020"},{name:"Aston Martin",years:"2021—NOW"}],note:"豪快な新規参入から複数のオーナー交代を経て、ワークス体制へ。"},
  {name:"Racing Bulls",span:"1985—NOW",chain:[{name:"Minardi",years:"1985—2005"},{name:"Toro Rosso",years:"2006—2019"},{name:"AlphaTauri",years:"2020—2023"},{name:"Racing Bulls",years:"2024—NOW"}],note:"ファエンツァの小さなチームは、Red Bullの若手育成と独自の挑戦を担う拠点へ。"},
  {name:"Audi",span:"1993—NOW",chain:[{name:"Sauber",years:"1993—2005"},{name:"BMW Sauber",years:"2006—2009"},{name:"Sauber",years:"2010—2018"},{name:"Alfa Romeo",years:"2019—2023"},{name:"Kick Sauber",years:"2024—2025"},{name:"Audi",years:"2026—NOW"}],note:"ヒンウィルで続くザウバーの組織が、ついにAudiの完全ワークスへ移行。"},
  {name:"Haas",span:"2016—NOW",chain:[{name:"Haas F1 Team",years:"2016—NOW"}],note:"新たな連携モデルでF1に参入したアメリカンチーム。同じエントリーで成長を続ける。"},
  {name:"Williams",span:"1977—NOW",chain:[{name:"Williams Grand Prix",years:"1977—NOW"}],note:"オーナーシップは変わっても、Williamsの名とGroveの拠点は一貫して続いている。"},
  {name:"McLaren",span:"1966—NOW",chain:[{name:"Bruce McLaren Motor Racing",years:"1966—1980"},{name:"McLaren International",years:"1981—2003"},{name:"McLaren Racing",years:"2004—NOW"}],note:"創設者の名を守りながら、組織とパートナーを変化させてきた最古参の名門。"},
  {name:"Ferrari",span:"1950—NOW",chain:[{name:"Scuderia Ferrari",years:"1950—NOW"}],note:"世界選手権初年度から同じ名前で参戦する唯一のチーム。系譜そのものがF1史である。"},
  {name:"Cadillac",span:"2026—NOW",chain:[{name:"Cadillac F1 Team",years:"2026—NOW"}],note:"2026年に新規参戦したアメリカンワークスチーム。独立した新しいエントリーとしてF1での歴史を始めた。"},
];
const lineageNamesByCode:Record<string,string> = {MER:"Mercedes",FER:"Ferrari",MCL:"McLaren",RBR:"Red Bull",VCB:"Racing Bulls",ALP:"Alpine",HAS:"Haas",AUD:"Audi",WIL:"Williams",AMR:"Aston Martin",CAD:"Cadillac"};
const constructorLineageById:Record<string,string> = {mercedes:"MER",bar:"MER",honda:"MER",brawn:"MER",ferrari:"FER",mclaren:"MCL",red_bull:"RBR",stewart:"RBR",jaguar:"RBR",rb:"VCB",toro_rosso:"VCB",alphatauri:"VCB",minardi:"VCB",alpine:"ALP",renault:"ALP",benetton:"ALP",toleman:"ALP",lotus_f1:"ALP",haas:"HAS",audi:"AUD",sauber:"AUD",bmw_sauber:"AUD",alfa:"AUD",williams:"WIL",aston_martin:"AMR",jordan:"AMR",midland:"AMR",spyker:"AMR",force_india:"AMR",racing_point:"AMR",cadillac:"CAD"};
const teamLineageByName:Record<string,string> = {
  "mercedes":"MER","bar":"MER","honda":"MER","brawn gp":"MER",
  "ferrari":"FER","scuderia ferrari":"FER","mclaren":"MCL","mclaren racing":"MCL","mclaren international":"MCL","bruce mclaren motor racing":"MCL",
  "red bull":"RBR","red bull racing":"RBR","stewart":"RBR","jaguar":"RBR",
  "racing bulls":"VCB","rb":"VCB","rb f1 team":"VCB","toro rosso":"VCB","alphatauri":"VCB","minardi":"VCB","alphatauri / rb":"VCB","toro rosso / rb":"VCB","red bull / racing bulls":"VCB",
  "alpine":"ALP","alpine f1 team":"ALP","renault":"ALP","benetton":"ALP","toleman":"ALP","renault / alpine":"ALP",
  "haas":"HAS","haas f1 team":"HAS","ferrari / haas":"HAS",
  "audi":"AUD","sauber":"AUD","bmw sauber":"AUD","alfa romeo":"AUD","kick sauber":"AUD","sauber / audi":"AUD","alfa romeo / sauber":"AUD",
  "williams":"WIL","williams grand prix":"WIL",
  "aston martin":"AMR","jordan":"AMR","midland":"AMR","spyker":"AMR","force india":"AMR","racing point":"AMR","force india / racing point":"AMR",
  "cadillac":"CAD","cadillac f1 team":"CAD"
};
const teamSearchEntries = Array.from(new Map([
  ...teams.map(team=>[team.name.toLowerCase(),{name:team.name,code:team.code}] as const),
  ...lineages.flatMap(lineage=>lineage.chain.map(entry=>[entry.name.toLowerCase(),{name:entry.name,code:teamLineageByName[entry.name.toLowerCase()]}] as const)),
].filter((entry):entry is readonly [string,{name:string;code:string}]=>Boolean(entry[1].code))).values());
const activeCareers = [
  {name:"George Russell",code:"RUS",years:"2019—",steps:[{team:"Williams",years:"2019—2021",car:"FW42 → FW43B"},{team:"Mercedes",years:"2022—",car:"W13 →"}]},
  {name:"Kimi Antonelli",code:"ANT",years:"2025—",steps:[{team:"Mercedes",years:"2025—",car:"W16 →"}]},
  {name:"Charles Leclerc",code:"LEC",years:"2018—",steps:[{team:"Sauber",years:"2018",car:"C37"},{team:"Ferrari",years:"2019—",car:"SF90 →"}]},
  {name:"Lewis Hamilton",code:"HAM",years:"2007—",steps:[{team:"McLaren",years:"2007—2012",car:"MP4-22 → MP4-27"},{team:"Mercedes",years:"2013—2024",car:"W04 → W15"},{team:"Ferrari",years:"2025—",car:"SF-25 →"}]},
  {name:"Lando Norris",code:"NOR",years:"2019—",steps:[{team:"McLaren",years:"2019—",car:"MCL34 →"}]},
  {name:"Oscar Piastri",code:"PIA",years:"2023—",steps:[{team:"McLaren",years:"2023—",car:"MCL60 →"}]},
  {name:"Max Verstappen",code:"VER",years:"2015—",steps:[{team:"Toro Rosso",years:"2015—2016",car:"STR10 → STR11"},{team:"Red Bull",years:"2016—",car:"RB12 →"}]},
  {name:"Isack Hadjar",code:"HAD",years:"2025—",steps:[{team:"Racing Bulls",years:"2025",car:"VCARB 02"},{team:"Red Bull",years:"2026—",car:"RB22 →"}]},
  {name:"Liam Lawson",code:"LAW",years:"2023—",steps:[{team:"AlphaTauri / RB",years:"2023—2024",car:"AT04 / VCARB 01"},{team:"Red Bull / Racing Bulls",years:"2025—",car:"RB21 / VCARB"}]},
  {name:"Arvid Lindblad",code:"LIN",years:"2026—",steps:[{team:"Racing Bulls",years:"2026—",car:"VCARB →"}]},
  {name:"Pierre Gasly",code:"GAS",years:"2017—",steps:[{team:"Toro Rosso",years:"2017—2018",car:"STR12 → STR13"},{team:"Red Bull",years:"2019",car:"RB15"},{team:"Toro Rosso / AlphaTauri",years:"2019—2022",car:"STR14 → AT03"},{team:"Alpine",years:"2023—",car:"A523 →"}]},
  {name:"Franco Colapinto",code:"COL",years:"2024—",steps:[{team:"Williams",years:"2024",car:"FW46"},{team:"Alpine",years:"2025—",car:"A525 →"}]},
  {name:"Esteban Ocon",code:"OCO",years:"2016—",steps:[{team:"Manor",years:"2016",car:"MRT05"},{team:"Force India",years:"2017—2018",car:"VJM10 → VJM11"},{team:"Renault / Alpine",years:"2020—2024",car:"R.S.20 → A524"},{team:"Haas",years:"2025—",car:"VF-25 →"}]},
  {name:"Oliver Bearman",code:"BEA",years:"2024—",steps:[{team:"Ferrari / Haas",years:"2024",car:"SF-24 / VF-24"},{team:"Haas",years:"2025—",car:"VF-25 →"}]},
  {name:"Nico Hülkenberg",code:"HUL",years:"2010—",steps:[{team:"Williams",years:"2010",car:"FW32"},{team:"Force India",years:"2012",car:"VJM05"},{team:"Sauber",years:"2013",car:"C32"},{team:"Force India",years:"2014—2016",car:"VJM07 → VJM09"},{team:"Renault",years:"2017—2019",car:"R.S.17 → R.S.19"},{team:"Haas",years:"2023—2024",car:"VF-23 → VF-24"},{team:"Sauber / Audi",years:"2025—",car:"C45 →"}]},
  {name:"Gabriel Bortoleto",code:"BOR",years:"2025—",steps:[{team:"Sauber",years:"2025",car:"C45"},{team:"Audi",years:"2026—",car:"R26 →"}]},
  {name:"Carlos Sainz",code:"SAI",years:"2015—",steps:[{team:"Toro Rosso",years:"2015—2017",car:"STR10 → STR12"},{team:"Renault",years:"2017—2018",car:"R.S.17 → R.S.18"},{team:"McLaren",years:"2019—2020",car:"MCL34 → MCL35"},{team:"Ferrari",years:"2021—2024",car:"SF21 → SF-24"},{team:"Williams",years:"2025—",car:"FW47 →"}]},
  {name:"Alexander Albon",code:"ALB",years:"2019—",steps:[{team:"Toro Rosso",years:"2019",car:"STR14"},{team:"Red Bull",years:"2019—2020",car:"RB15 → RB16"},{team:"Williams",years:"2022—",car:"FW44 →"}]},
  {name:"Fernando Alonso",code:"ALO",years:"2001—",steps:[{team:"Minardi",years:"2001",car:"PS01"},{team:"Renault",years:"2003—2006",car:"R23 → R26"},{team:"McLaren",years:"2007",car:"MP4-22"},{team:"Renault",years:"2008—2009",car:"R28 → R29"},{team:"Ferrari",years:"2010—2014",car:"F10 → F14 T"},{team:"McLaren",years:"2015—2018",car:"MP4-30 → MCL33"},{team:"Alpine",years:"2021—2022",car:"A521 → A522"},{team:"Aston Martin",years:"2023—",car:"AMR23 →"}]},
  {name:"Lance Stroll",code:"STR",years:"2017—",steps:[{team:"Williams",years:"2017—2018",car:"FW40 → FW41"},{team:"Racing Point",years:"2019—2020",car:"RP19 → RP20"},{team:"Aston Martin",years:"2021—",car:"AMR21 →"}]},
  {name:"Sergio Pérez",code:"PER",years:"2011—",steps:[{team:"Sauber",years:"2011—2012",car:"C30 → C31"},{team:"McLaren",years:"2013",car:"MP4-28"},{team:"Force India / Racing Point",years:"2014—2020",car:"VJM07 → RP20"},{team:"Red Bull",years:"2021—2024",car:"RB16B → RB20"},{team:"Cadillac",years:"2026—",car:"Cadillac F1 →"}]},
  {name:"Valtteri Bottas",code:"BOT",years:"2013—",steps:[{team:"Williams",years:"2013—2016",car:"FW35 → FW38"},{team:"Mercedes",years:"2017—2021",car:"W08 → W12"},{team:"Alfa Romeo / Sauber",years:"2022—2024",car:"C42 → C44"},{team:"Cadillac",years:"2026—",car:"Cadillac F1 →"}]},
];

const legacyCareers = [
  {name:"Lewis Hamilton",code:"HAM",years:"2007—",steps:[{team:"McLaren",years:"2007—2012",car:"MP4-22 → MP4-27"},{team:"Mercedes",years:"2013—2024",car:"W04 → W15"},{team:"Ferrari",years:"2025—",car:"SF-25 →"}]},
  {name:"Michael Schumacher",code:"MSC",years:"1991—2012",steps:[{team:"Jordan",years:"1991",car:"191"},{team:"Benetton",years:"1991—1995",car:"B191 → B195"},{team:"Ferrari",years:"1996—2006",car:"F310 → 248 F1"},{team:"Mercedes",years:"2010—2012",car:"W01 → W03"}]},
  {name:"Fernando Alonso",code:"ALO",years:"2001—",steps:[{team:"Minardi",years:"2001",car:"PS01"},{team:"Renault",years:"2003—2006",car:"R23 → R26"},{team:"McLaren",years:"2007",car:"MP4-22"},{team:"Renault",years:"2008—2009",car:"R28 → R29"},{team:"Ferrari",years:"2010—2014",car:"F10 → F14 T"},{team:"McLaren",years:"2015—2018",car:"MP4-30 → MCL33"},{team:"Alpine",years:"2021—2022",car:"A521 → A522"},{team:"Aston Martin",years:"2023—",car:"AMR23 →"}]},
  {name:"Sebastian Vettel",code:"VET",years:"2007—2022",steps:[{team:"BMW Sauber",years:"2007",car:"F1.07"},{team:"Toro Rosso",years:"2007—2008",car:"STR2 → STR3"},{team:"Red Bull",years:"2009—2014",car:"RB5 → RB10"},{team:"Ferrari",years:"2015—2020",car:"SF15-T → SF1000"},{team:"Aston Martin",years:"2021—2022",car:"AMR21 → AMR22"}]},
  {name:"Max Verstappen",code:"VER",years:"2015—",steps:[{team:"Toro Rosso",years:"2015—2016",car:"STR10 → STR11"},{team:"Red Bull",years:"2016—",car:"RB12 →"}]},
  {name:"Kimi Räikkönen",code:"RAI",years:"2001—2021",steps:[{team:"Sauber",years:"2001",car:"C20"},{team:"McLaren",years:"2002—2006",car:"MP4-17 → MP4-21"},{team:"Ferrari",years:"2007—2009",car:"F2007 → F60"},{team:"Lotus",years:"2012—2013",car:"E20 → E21"},{team:"Ferrari",years:"2014—2018",car:"F14 T → SF71H"},{team:"Alfa Romeo",years:"2019—2021",car:"C38 → C41"}]},
  {name:"Ayrton Senna",code:"SEN",years:"1984—1994",steps:[{team:"Toleman",years:"1984",car:"TG183B / TG184"},{team:"Lotus",years:"1985—1987",car:"97T → 99T"},{team:"McLaren",years:"1988—1993",car:"MP4/4 → MP4/8"},{team:"Williams",years:"1994",car:"FW16"}]},
  {name:"Alain Prost",code:"PRO",years:"1980—1993",steps:[{team:"McLaren",years:"1980",car:"M29 / M30"},{team:"Renault",years:"1981—1983",car:"RE20B → RE40"},{team:"McLaren",years:"1984—1989",car:"MP4/2 → MP4/5"},{team:"Ferrari",years:"1990—1991",car:"641 → 643"},{team:"Williams",years:"1993",car:"FW15C"}]},
  {name:"Jenson Button",code:"BUT",years:"2000—2017",steps:[{team:"Williams",years:"2000",car:"FW22"},{team:"Benetton",years:"2001",car:"B201"},{team:"Renault",years:"2002",car:"R202"},{team:"BAR",years:"2003—2005",car:"005 → 007"},{team:"Honda",years:"2006—2008",car:"RA106 → RA108"},{team:"Brawn GP",years:"2009",car:"BGP 001"},{team:"McLaren",years:"2010—2017",car:"MP4-25 → MCL32"}]},
  {name:"Daniel Ricciardo",code:"RIC",years:"2011—2024",steps:[{team:"HRT",years:"2011",car:"F111"},{team:"Toro Rosso",years:"2012—2013",car:"STR7 → STR8"},{team:"Red Bull",years:"2014—2018",car:"RB10 → RB14"},{team:"Renault",years:"2019—2020",car:"R.S.19 → R.S.20"},{team:"McLaren",years:"2021—2022",car:"MCL35M → MCL36"},{team:"AlphaTauri / RB",years:"2023—2024",car:"AT04 → VCARB 01"}]},
];

const activeCodes = new Set(activeCareers.map(career => career.code));
const careers = [...activeCareers, ...legacyCareers.filter(career => !activeCodes.has(career.code))];
const careerCodes = new Set(careers.map(career => career.code));
const activeNationalities:Record<string,string> = {RUS:"GBR",ANT:"ITA",LEC:"MON",HAM:"GBR",NOR:"GBR",PIA:"AUS",VER:"NED",HAD:"FRA",LAW:"NZL",LIN:"GBR",GAS:"FRA",COL:"ARG",OCO:"FRA",BEA:"GBR",HUL:"GER",BOR:"BRA",SAI:"ESP",ALB:"THA",ALO:"ESP",STR:"CAN",PER:"MEX",BOT:"FIN"};
const additionalCareerSteps:Record<string,{team:string;years:string;car:string}[]> = {
  MAN:[{team:"Lotus",years:"1980—1984",car:"参戦記録"},{team:"Williams",years:"1985—1988 / 1991—1994",car:"参戦記録"},{team:"Ferrari",years:"1989—1990",car:"参戦記録"},{team:"McLaren",years:"1995",car:"参戦記録"}],
  STE:[{team:"BRM",years:"1965—1967",car:"参戦記録"},{team:"Matra International",years:"1968—1969",car:"参戦記録"},{team:"Tyrrell",years:"1970—1973",car:"参戦記録"}],
  CLA:[{team:"Lotus",years:"1960—1968",car:"参戦記録"}],
  LAU:[{team:"March / BRM",years:"1971—1973",car:"参戦記録"},{team:"Ferrari",years:"1974—1977",car:"参戦記録"},{team:"Brabham",years:"1978—1979",car:"参戦記録"},{team:"McLaren",years:"1982—1985",car:"参戦記録"}],
  FAN:[{team:"Alfa Romeo",years:"1950—1951",car:"参戦記録"},{team:"Maserati",years:"1953—1954 / 1957—1958",car:"参戦記録"},{team:"Mercedes",years:"1954—1955",car:"参戦記録"},{team:"Ferrari",years:"1956",car:"参戦記録"}],
  PIQ:[{team:"Ensign / McLaren",years:"1978",car:"参戦記録"},{team:"Brabham",years:"1978—1985",car:"参戦記録"},{team:"Williams",years:"1986—1987",car:"参戦記録"},{team:"Lotus",years:"1988—1989",car:"参戦記録"},{team:"Benetton",years:"1990—1991",car:"参戦記録"}],
  ROS:[{team:"Williams",years:"2006—2009",car:"参戦記録"},{team:"Mercedes",years:"2010—2016",car:"参戦記録"}],
  HIL:[{team:"Brabham",years:"1992",car:"参戦記録"},{team:"Williams",years:"1993—1996",car:"参戦記録"},{team:"Arrows",years:"1997",car:"参戦記録"},{team:"Jordan",years:"1998—1999",car:"参戦記録"}],
  HAK:[{team:"Lotus",years:"1991—1992",car:"参戦記録"},{team:"McLaren",years:"1993—2001",car:"参戦記録"}],
  MOS:[{team:"HWM / Connaught",years:"1951—1952",car:"参戦記録"},{team:"Cooper / Maserati",years:"1953—1954",car:"参戦記録"},{team:"Mercedes",years:"1955",car:"参戦記録"},{team:"Maserati",years:"1956—1957",car:"参戦記録"},{team:"Vanwall / Rob Walker",years:"1957—1961",car:"参戦記録"}],
  GHI:[{team:"Lotus",years:"1958—1959 / 1967—1969",car:"参戦記録"},{team:"BRM",years:"1960—1966",car:"参戦記録"},{team:"Brabham",years:"1970—1972",car:"参戦記録"},{team:"Embassy Hill",years:"1973—1975",car:"参戦記録"}],
  BRA:[{team:"Cooper",years:"1955—1961",car:"参戦記録"},{team:"Brabham",years:"1962—1970",car:"参戦記録"}],
  FIT:[{team:"Lotus",years:"1970—1973",car:"参戦記録"},{team:"McLaren",years:"1974—1975",car:"参戦記録"},{team:"Fittipaldi",years:"1976—1980",car:"参戦記録"}],
  ASC:[{team:"Ferrari",years:"1950—1953 / 1954",car:"参戦記録"},{team:"Maserati",years:"1954",car:"参戦記録"},{team:"Lancia",years:"1954—1955",car:"参戦記録"}],
  COU:[{team:"Williams",years:"1994—1995",car:"参戦記録"},{team:"McLaren",years:"1996—2004",car:"参戦記録"},{team:"Red Bull",years:"2005—2008",car:"参戦記録"}],
  AND:[{team:"Lotus",years:"1968—1969 / 1976—1980",car:"参戦記録"},{team:"March / Ferrari / Parnelli",years:"1970—1975",car:"参戦記録"},{team:"Alfa Romeo / Williams / Ferrari",years:"1981—1982",car:"参戦記録"}],
  REU:[{team:"Brabham",years:"1972—1976",car:"参戦記録"},{team:"Ferrari",years:"1976—1978",car:"参戦記録"},{team:"Lotus",years:"1979",car:"参戦記録"},{team:"Williams",years:"1980—1982",car:"参戦記録"}],
  JON:[{team:"Hesketh / Hill / Surtees",years:"1975—1976",car:"参戦記録"},{team:"Shadow",years:"1977",car:"参戦記録"},{team:"Williams",years:"1978—1981",car:"参戦記録"},{team:"Arrows / Haas Lola",years:"1983 / 1985—1986",car:"参戦記録"}],
  VIL:[{team:"Williams",years:"1996—1998",car:"参戦記録"},{team:"BAR",years:"1999—2003",car:"参戦記録"},{team:"Renault / Sauber",years:"2004—2006",car:"参戦記録"}],
  MAS:[{team:"Sauber",years:"2002 / 2004—2005",car:"参戦記録"},{team:"Ferrari",years:"2006—2013",car:"参戦記録"},{team:"Williams",years:"2014—2017",car:"参戦記録"}],
  BAR:[{team:"Jordan",years:"1993—1996",car:"参戦記録"},{team:"Stewart",years:"1997—1999",car:"参戦記録"},{team:"Ferrari",years:"2000—2005",car:"参戦記録"},{team:"Honda / Brawn GP",years:"2006—2009",car:"参戦記録"},{team:"Williams",years:"2010—2011",car:"参戦記録"}],
};
const baseDriverProfiles = [
  ...careers.map(career => ({...career, stats:supplementalDriverStats[career.code] ?? driverStats.find(driver => driver.code === career.code), nationality:activeNationalities[career.code]})),
  ...driverStats.filter(driver => !careerCodes.has(driver.code)).map(driver => ({name:driver.name, code:driver.code, years:driver.era, steps:additionalCareerSteps[driver.code] ?? [], stats:driver, nationality:driver.country})),
];

const archiveTypes = ["グリッド","チーム","ドライバー"] as const;
type ArchiveType = typeof archiveTypes[number];

type SeasonDriver = { position:string; points:string; wins:string; Driver:{driverId:string;code?:string;givenName:string;familyName:string;nationality:string}; Constructors:{constructorId:string;name:string}[] };
type SeasonData = { drivers:SeasonDriver[]; teams:{id:string;name:string;drivers:string[];position?:string;points?:string;wins?:string}[] };
const seasonCache = new Map<number,SeasonData>();

export default function Home() {
  const [tab, setTab] = useState<"now" | "ranking" | "history">("now");
  const [archiveType, setArchiveType] = useState<ArchiveType>("グリッド");
  const [metric, setMetric] = useState<StatKey>("wins");
  const [ratioMode, setRatioMode] = useState(false);
  const [numerator, setNumerator] = useState<StatKey>("wins");
  const [denominator, setDenominator] = useState<StatKey>("starts");
  const [driverQuery, setDriverQuery] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [debutDecade, setDebutDecade] = useState("all");
  const [minStarts, setMinStarts] = useState(0);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [yearView, setYearView] = useState<"grid"|"teams"|"drivers">("grid");
  const [seasonData, setSeasonData] = useState<SeasonData|null>(null);
  const [seasonStatus, setSeasonStatus] = useState<"idle"|"loading"|"ready"|"error">("idle");
  const [remoteDriverStats, setRemoteDriverStats] = useState<Record<string,DriverStat>>({});
  const [loadingDriverStats, setLoadingDriverStats] = useState<Set<string>>(new Set());
  const rankedDrivers = useMemo(() => driverStats
    .filter(driver => `${driver.name} ${driver.code} ${driver.country}`.toLowerCase().includes(driverQuery.toLowerCase()))
    .filter(driver => debutDecade === "all" || Math.floor(driver.debut / 10) * 10 === Number(debutDecade))
    .filter(driver => driver.starts >= minStarts)
    .map(driver => ({ ...driver, score: ratioMode ? (driver[denominator] ? driver[numerator] / driver[denominator] : 0) : driver[metric] }))
    .sort((a, b) => b.score - a.score), [metric, ratioMode, numerator, denominator, driverQuery, debutDecade, minStarts]);
  const visibleDrivers = rankedDrivers.slice(0, displayLimit);
  const maxScore = rankedDrivers[0]?.score || 1;
  const selectedYearData = yearIndex.find(item => item.year === selectedYear) ?? yearIndex[0];
  const driverProfiles = useMemo(() => {
    const knownCodes = new Set(baseDriverProfiles.map(driver => driver.code));
    const seasonProfiles = (seasonData?.drivers ?? [])
      .filter(driver => !knownCodes.has(driver.Driver.code ?? ""))
      .map(driver => ({
        name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
        code: driver.Driver.code ?? driver.Driver.familyName.slice(0, 3).toUpperCase(),
        years: String(selectedYear),
        steps: driver.Constructors.map(team => ({team:team.name, years:String(selectedYear), car:"シーズン登録"})),
        stats: supplementalDriverStats[driver.Driver.code ?? ""] ?? remoteDriverStats[driver.Driver.driverId],
        nationality: driver.Driver.nationality,
        driverId: driver.Driver.driverId,
      }));
    return [...baseDriverProfiles, ...seasonProfiles];
  }, [seasonData, selectedYear, remoteDriverStats]);
  const driverCodeFor = (name:string, code?:string) => driverProfiles.find(driver => driver.code === code || driver.name.toLowerCase() === name.toLowerCase())?.code;
  const teamCodeFor = (name:string, constructorId?:string) => (constructorId ? constructorLineageById[constructorId] : undefined) ?? teamLineageByName[name.trim().toLowerCase()];
  const goToTeam = (name:string, constructorId?:string) => {
    const code = teamCodeFor(name, constructorId);
    if (code) document.getElementById(`team-${code.toLowerCase()}`)?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  const teamName = (name:string, constructorId?:string):ReactNode => {
    if (name.includes("/")) return <>{name.split(/(\s*\/\s*)/).map((part,index)=><Fragment key={`${part}-${index}`}>{part.includes("/") ? part : teamName(part)}</Fragment>)}</>;
    return teamCodeFor(name,constructorId)
      ? <a className="team-name-link" href={`#team-${teamCodeFor(name,constructorId)?.toLowerCase()}`} onClick={event=>{event.preventDefault();goToTeam(name,constructorId)}}>{name}</a>
      : <span className="team-name-plain">{name}</span>;
  };
  const loadRemoteDriverStats = async (profile:(typeof driverProfiles)[number]) => {
    if (!("driverId" in profile) || profile.stats || loadingDriverStats.has(profile.driverId)) return;
    const driverId = profile.driverId;
    setLoadingDriverStats(current => new Set(current).add(driverId));
    try {
      const root = `https://api.jolpi.ca/ergast/f1/drivers/${driverId}`;
      const get = async (url:string) => { const response=await fetch(url); if(!response.ok) throw new Error("record unavailable"); return response.json(); };
      const first = await get(`${root}/results/?limit=100&offset=0`);
      const totalEntries = Number(first?.MRData?.total ?? 0);
      const pages = [first];
      for (let offset=100; offset<totalEntries; offset+=100) pages.push(await get(`${root}/results/?limit=100&offset=${offset}`));
      const results = pages.flatMap(page => page?.MRData?.RaceTable?.Races?.flatMap((race:{Results?:{points:string;status:string}[]})=>race.Results??[]) ?? []);
      const starts = results.filter((result:{status:string})=>result.status!=="Did not start").length;
      const count = async (path:string) => Number((await get(`${root}/${path}/`))?.MRData?.total ?? 0);
      const [wins,seconds,thirds,poles] = await Promise.all([count("results/1"),count("results/2"),count("results/3"),count("qualifying/1")]);
      const titles = yearIndex.filter(year => year.driver.toLowerCase() === profile.name.toLowerCase()).length;
      setRemoteDriverStats(current => ({...current,[driverId]:{name:profile.name,code:profile.code,country:profile.nationality,era:profile.years,debut:Number(profile.years.slice(0,4)),starts,wins,pointsFinishes:results.filter((result:{points:string})=>Number(result.points)>0).length,podiums:wins+seconds+thirds,titles,poles}}));
    } catch { /* Keep the neutral dash when this historical record is unavailable. */ }
    finally { setLoadingDriverStats(current => { const next=new Set(current); next.delete(driverId); return next; }); }
  };
  const goToDriver = (name:string, code?:string) => {
    const profile = driverProfiles.find(driver => driver.code === code || driver.name.toLowerCase() === name.toLowerCase());
    const targetCode = profile?.code ?? driverCodeFor(name, code);
    if (profile) void loadRemoteDriverStats(profile);
    if (targetCode) document.getElementById(`driver-${targetCode.toLowerCase()}`)?.scrollIntoView({behavior:"smooth", block:"start"});
  };
  const globalSearchResults = useMemo(() => {
    const query=globalQuery.trim().toLowerCase();
    if (!query) return [];
    const driverMatches=driverProfiles.filter(driver=>`${driver.name} ${driver.code}`.toLowerCase().includes(query)).slice(0,6).map(driver=>({kind:"driver" as const,name:driver.name,code:driver.code}));
    const teamMatches=teamSearchEntries.filter(team=>`${team.name} ${team.code}`.toLowerCase().includes(query)).slice(0,6).map(team=>({kind:"team" as const,name:team.name,code:team.code}));
    return [...driverMatches,...teamMatches].slice(0,8);
  },[globalQuery,driverProfiles]);
  const chooseSearchResult = (result:(typeof globalSearchResults)[number]) => {
    setGlobalQuery("");
    setSearchOpen(false);
    if (result.kind==="driver") goToDriver(result.name,result.code);
    else document.getElementById(`team-${result.code.toLowerCase()}`)?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  useEffect(() => {
    if (selectedYear <= 2025) {
      const archived = (seasonArchive as Record<string,SeasonData>)[String(selectedYear)];
      if (archived) {
        seasonCache.set(selectedYear, archived);
        setSeasonData(archived);
        setSeasonStatus("ready");
        return;
      }
    }
    const cached = seasonCache.get(selectedYear);
    if (cached) { setSeasonData(cached); setSeasonStatus("ready"); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSeasonStatus("loading"); setSeasonData(null);
      try {
        const [driverResponse, teamResponse] = await Promise.all([
          fetch(`https://api.jolpi.ca/ergast/f1/${selectedYear}/driverstandings/?limit=100`, {signal:controller.signal}),
          fetch(`https://api.jolpi.ca/ergast/f1/${selectedYear}/constructorstandings/?limit=100`, {signal:controller.signal}),
        ]);
        if (!driverResponse.ok) throw new Error("season data unavailable");
        const driverJson = await driverResponse.json();
        const teamJson = teamResponse.ok ? await teamResponse.json() : null;
        const drivers:SeasonDriver[] = driverJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
        const teamMap = new Map<string,{id:string;name:string;drivers:string[]}>();
        drivers.forEach(driver => driver.Constructors.forEach(team => {
          const entry = teamMap.get(team.constructorId) ?? {id:team.constructorId,name:team.name,drivers:[]};
          const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
          if (!entry.drivers.includes(driverName)) entry.drivers.push(driverName);
          teamMap.set(team.constructorId,entry);
        }));
        const standings = teamJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
        standings.forEach((standing:{position:string;points:string;wins:string;Constructor:{constructorId:string;name:string}}) => {
          const entry = teamMap.get(standing.Constructor.constructorId) ?? {id:standing.Constructor.constructorId,name:standing.Constructor.name,drivers:[]};
          teamMap.set(standing.Constructor.constructorId,{...entry,position:standing.position,points:standing.points,wins:standing.wins});
        });
        const data = {drivers,teams:[...teamMap.values()].sort((a,b)=>Number(a.position??99)-Number(b.position??99))};
        seasonCache.set(selectedYear,data); setSeasonData(data); setSeasonStatus("ready");
      } catch (error) { if ((error as Error).name !== "AbortError") setSeasonStatus("error"); }
    }, 180);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [selectedYear, yearView]);
  useEffect(() => {
    const syncNavigation = () => {
      const marker = window.scrollY + Math.min(180, window.innerHeight * 0.28);
      const rankingTop = document.getElementById("ranking")?.offsetTop ?? Number.POSITIVE_INFINITY;
      const historyTop = document.getElementById("history")?.offsetTop ?? Number.POSITIVE_INFINITY;
      const nextTab = marker >= historyTop ? "history" : marker >= rankingTop ? "ranking" : "now";
      setTab(current => current === nextTab ? current : nextTab);
    };

    syncNavigation();
    window.addEventListener("scroll", syncNavigation, { passive: true });
    window.addEventListener("resize", syncNavigation);
    return () => {
      window.removeEventListener("scroll", syncNavigation);
      window.removeEventListener("resize", syncNavigation);
    };
  }, []);
  const go = (next: "now" | "ranking" | "history") => { setTab(next); requestAnimationFrame(() => document.getElementById(next)?.scrollIntoView({ behavior: "smooth" })); };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} aria-label="Paddock Index トップへ">
          <span className="brand-mark">PI</span><span>Paddock<br/>Index</span>
        </button>
        <nav aria-label="メインナビゲーション">
          <button className={tab === "now" ? "active" : ""} onClick={() => go("now")}><i />現在</button>
          <button className={tab === "ranking" ? "active" : ""} onClick={() => go("ranking")}><i />ランキング</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => go("history")}><i />アーカイブ</button>
        </nav>
        <form className="database-search" role="search" onSubmit={event=>{event.preventDefault();if(globalSearchResults[0])chooseSearchResult(globalSearchResults[0])}} onFocus={()=>setSearchOpen(true)} onBlur={()=>window.setTimeout(()=>setSearchOpen(false),120)}>
          <span aria-hidden="true">⌕</span>
          <input value={globalQuery} onChange={event=>{setGlobalQuery(event.target.value);setSearchOpen(true)}} placeholder="チーム名・ドライバー名を検索" aria-label="チーム名・ドライバー名を検索" autoComplete="off" />
          {searchOpen&&globalQuery.trim()&&<div className="database-search-results">{globalSearchResults.length ? globalSearchResults.map(result=><button type="button" key={`${result.kind}-${result.name}`} onMouseDown={event=>event.preventDefault()} onClick={()=>chooseSearchResult(result)}><strong>{result.name}</strong><small>{result.kind==="driver"?`DRIVER · ${result.code}`:`TEAM · ${result.code}`}</small></button>) : <p>該当するデータがありません</p>}</div>}
        </form>
        <div className="season-tag"><span>SEASON</span>2026</div>
      </header>
      <aside className="section-jump" aria-label="ページ内の章へ移動">
        {[["now","現在"],["ranking","ランキング"],["history","アーカイブ"],["team-directory","チーム"],["driver-directory","ドライバー"]].map(([id,label],i)=><button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})}><span>{String(i+1).padStart(2,"0")}</span><b>{label}</b></button>)}
      </aside>

      <section className="hero" id="now">
        <div className="hero-grid" aria-hidden="true" />
        <div className="eyebrow"><span>LIVE DATABASE</span><b>Data updated 27.08.2026</b></div>
        <h1><span>F1の現在と歴史を、</span><br/>ひとつのデータベースに。</h1>
        <p className="lede">1950年から現在までのチーム、ドライバー、レース記録を、<br className="desktop"/>シーズン別の情報とともに確認できます。</p>
        <div className="hero-actions"><button onClick={() => go("history")}>歴史を探索 <span>→</span></button><div><strong>76</strong><small>SEASONS</small></div><div><strong>1,140+</strong><small>GRANDS PRIX</small></div></div>
        <div className="corner-note">CURATED FORMULA ONE ARCHIVE<br/>TOKYO, JAPAN</div>
      </section>

      <section className="now-panel">
        <div className="section-title"><div><span>01 / CURRENT</span><h2>2026シーズン</h2></div><p>現在のグリッド、チャンピオンシップと<br/>次戦の要点をひとつの画面で。</p></div>
        <div className="dashboard">
          <article className="next-race">
            <div className="card-kicker"><span>NEXT RACE</span><b>R13 / 23</b></div>
            <div className="race-flag"><span />ITALY</div>
            <h3>MONZA</h3>
            <p>Autodromo Nazionale Monza</p>
            <div className="race-date"><strong>04—06</strong><span>SEP<br/>2026</span></div>
            <div className="race-meta"><span>53 LAPS</span><span>5.793 KM</span><span>14:00 UTC</span></div>
          </article>
          <article className="standings-card">
            <div className="card-kicker"><span>DRIVER STANDINGS</span><b>AFTER R12</b></div>
            <div className="leader"><span>01</span><div><small>CHAMPIONSHIP LEADER</small><button className="driver-name-link leader-name" onClick={()=>goToDriver("Kimi Antonelli","ANT")}>Kimi<br/>Antonelli</button><em>ITA · MERCEDES</em></div><b>242<small>PTS</small></b></div>
            <div className="standings-list">{standings.slice(1).map((s, i) => <div key={s[0]}><span>{String(i+2).padStart(2,"0")}</span><button className="driver-name-link" onClick={()=>goToDriver(s[0])}>{s[0]}</button><em>{teamName(s[1])}</em><b>{s[2]}</b></div>)}</div>
            <a href="https://www.formula1.com/en/results/2026/drivers" target="_blank" rel="noreferrer">公式ランキング <span>↗</span></a>
          </article>
        </div>

        <div className="season-progress">
          <div className="progress-heading"><div><span>SEASON PROGRESS</span><h3>次の6戦</h3></div><div><strong>12</strong><span>/ 23 ROUNDS<br/>COMPLETED</span></div></div>
          <div className="race-strip">{races.map(race => <article className={race.state} key={race.round}><div><span>R{String(race.round).padStart(2,"0")}</span><b>{race.state === "next" ? "NEXT" : race.state === "done" ? "RESULT" : "UPCOMING"}</b></div><strong>{race.place}</strong><p>{race.country}</p><div className="race-card-footer"><span>{race.date}</span><b>{race.winner}</b></div></article>)}</div>
          <a className="calendar-link" href="https://www.formula1.com/en/racing/2026" target="_blank" rel="noreferrer">2026フルカレンダー <span>↗</span></a>
        </div>

        <div className="grid-heading" id="grid-2026"><div><span>2026 GRID</span><h3>11 TEAMS / 22 DRIVERS</h3></div><span>公式ラインナップ</span></div>
        <div className="teams-grid">{teams.map((team, i) => <article className="team-row" key={team.name} style={{"--team": team.color} as React.CSSProperties}><span className="team-rank">{String(i+1).padStart(2,"0")}</span><span className="team-swatch"/><div><strong>{teamName(team.name)}</strong><small>{team.driverNames.map((driver,driverIndex)=>{const code=driverCodeFor(driver);return <span className="grid-driver-link" key={driver}><a className="driver-name-link" href={code?`#driver-${code.toLowerCase()}`:"#driver-directory"} onClick={event=>{event.preventDefault();goToDriver(driver)}}>{driver}</a>{driverIndex<team.driverNames.length-1&&<i aria-hidden="true">/</i>}</span>})}</small></div><b>{team.code}</b><button onClick={() => document.getElementById(`team-${team.code.toLowerCase()}`)?.scrollIntoView({behavior:"smooth", block:"start"})} aria-label={`${team.name}の詳細へ移動`}>↓</button></article>)}</div>
      </section>

      <section className="ranking-panel" id="ranking">
        <div className="section-title"><div><span>02 / RANKINGS</span><h2>F1記録<br/>ランキング</h2></div><p>通算記録に加え、「優勝 ÷ 出走」などの<br/>比率を使ってドライバーを比較できます。</p></div>
        <div className="ranking-lab">
          <div className="ranking-controls">
            <div className="mode-switch" role="group" aria-label="ランキング方式"><button className={!ratioMode ? "active" : ""} onClick={() => setRatioMode(false)}>通算記録</button><button className={ratioMode ? "active" : ""} onClick={() => setRatioMode(true)}>比率ビルダー</button></div>
            {!ratioMode ? <div className="metric-pills">{(Object.keys(statLabels) as StatKey[]).map(key => <button key={key} className={metric === key ? "active" : ""} onClick={() => setMetric(key)}>{statLabels[key]}</button>)}</div> : <div className="ratio-builder"><label><span>NUMERATOR / 分子</span><select value={numerator} onChange={e => setNumerator(e.target.value as StatKey)}>{(Object.keys(statLabels) as StatKey[]).map(key => <option value={key} key={key}>{statLabels[key]}</option>)}</select></label><b>÷</b><label><span>DENOMINATOR / 分母</span><select value={denominator} onChange={e => setDenominator(e.target.value as StatKey)}>{(Object.keys(statLabels) as StatKey[]).map(key => <option value={key} key={key}>{statLabels[key]}</option>)}</select></label></div>}
            <div className="ranking-filters">
              <label className="driver-search"><span>DRIVER SEARCH</span><input value={driverQuery} onChange={e => setDriverQuery(e.target.value)} placeholder="名前 / 3文字コード" /></label>
              <div><label><span>DEBUT</span><select value={debutDecade} onChange={e => setDebutDecade(e.target.value)}><option value="all">全年代</option>{[1950,1960,1970,1980,1990,2000,2010].map(d => <option value={d} key={d}>{d}s</option>)}</select></label><label><span>MIN. STARTS</span><select value={minStarts} onChange={e => setMinStarts(Number(e.target.value))}><option value="0">指定なし</option><option value="50">50+</option><option value="100">100+</option><option value="200">200+</option></select></label></div>
            </div>
            <div className="formula-readout"><span>CURRENT METRIC</span><strong>{ratioMode ? `${statLabels[numerator]} ÷ ${statLabels[denominator]}` : statLabels[metric]}</strong><small>{ratioMode ? "値が高いほど上位" : "ALL-TIME TOTAL"}</small></div>
          </div>
          <div className="ranking-table">
            <div className="ranking-head"><span>POS</span><span>DRIVER</span><span>ERA</span><span>VALUE</span><span>INDEX</span></div>
            {visibleDrivers.map((driver, i) => <article key={driver.code} className={i < 3 ? "podium-rank" : ""}><span className="rank-no">{String(i + 1).padStart(2, "0")}</span><div className="driver-id"><b>{driver.code}</b><div><button className="driver-name-link" onClick={()=>goToDriver(driver.name,driver.code)}>{driver.name}</button><small>{driver.country}</small></div></div><span className="driver-era">{driver.era}</span><strong className="rank-value">{ratioMode ? `${(driver.score * 100).toFixed(1)}%` : driver.score.toLocaleString()}</strong><div className="rank-bar"><i style={{width: `${Math.max(2, driver.score / maxScore * 100)}%`}} /></div></article>)}
            {!visibleDrivers.length && <div className="ranking-empty">条件に合うドライバーがいません。</div>}
            <div className="ranking-footer"><div className="ranking-note"><span>DATA CUT</span><p>1950—2024 · 主要記録保持者 {driverStats.length}名</p><b>※ 入賞は各年の得点圏基準</b></div><label><span>SHOW</span><select value={displayLimit} onChange={e => setDisplayLimit(Number(e.target.value))}><option value="10">TOP 10</option><option value="20">TOP 20</option><option value="30">ALL 30</option></select></label></div>
          </div>
        </div>
      </section>

      <section className="history-panel" id="history">
        <div className="section-title inverse"><div><span>03 / ARCHIVE</span><h2>F1シーズン<br/>アーカイブ</h2></div><p>各年のタイトル、グリッド、チーム、<br/>ドライバー情報を年代順に確認できます。</p></div>
        <div className="year-browser">
          <div className="year-rail" aria-label="年度を選択"><div className="rail-label">YEAR</div>{yearIndex.map(item => <button key={item.year} className={selectedYear===item.year?"active":""} onMouseEnter={()=>setSelectedYear(item.year)} onFocus={()=>setSelectedYear(item.year)} onClick={()=>setSelectedYear(item.year)} aria-pressed={selectedYear===item.year}><span>{item.year}</span><i/></button>)}</div>
          <article className="year-inspector" key={`${selectedYear}-${archiveType}-${yearView}`}>
            <div className="inspector-top"><span>SEASON INDEX</span><b>{selectedYear}</b><small>{selectedYear===2026?"IN PROGRESS":"CHAMPIONSHIP COMPLETE"}</small></div>
            <div className="champion-pair"><div><span>DRIVERS' CHAMPION</span><strong>{selectedYearData.driver}</strong></div><div><span>CONSTRUCTORS' CHAMPION</span><strong>{selectedYearData.team}</strong></div></div>
            <div className="year-category"><div><span>SELECT INFORMATION</span></div><div className="year-category-tabs" role="tablist">{archiveTypes.map(type => {const view = type==="グリッド"?"grid":type==="チーム"?"teams":"drivers";return <button role="tab" aria-selected={archiveType===type} className={archiveType===type?"active":""} onClick={()=>{setArchiveType(type);setYearView(view)}} key={type}>{type}</button>})}</div></div>
            <div className="season-record">
              <div className="record-heading"><span>{selectedYear}年 / {yearView==="grid"?"グリッドとドライバーラインナップ":yearView==="teams"?"チームランキング":"ドライバーランキング"}</span><strong>{seasonData ? `${seasonData.teams.length} TEAMS · ${seasonData.drivers.length} DRIVERS` : "SEASON DATA"}</strong></div>
              {seasonStatus==="loading"&&<div className="record-state"><i/>年度データを読み込み中…</div>}
              {seasonStatus==="error"&&<div className="record-state error">データを取得できませんでした。別の年度を選択するか、再度お試しください。</div>}
              {seasonStatus==="ready"&&seasonData&&yearView==="grid"&&<div className="season-table season-grid-list"><div className="season-table-head grid-table-columns"><span>POS</span><span>TEAM</span><span>DRIVER LINE-UP</span></div>{seasonData.teams.map((team,i)=><article className="grid-table-columns" key={team.id}><span>{String(i+1).padStart(2,"0")}</span><strong>{teamName(team.name,team.id)}</strong><small>{team.drivers.join(" / ")}</small></article>)}</div>}
              {seasonStatus==="ready"&&seasonData&&yearView==="teams"&&<div className="season-table season-team-list"><div className="season-table-head team-table-columns"><span>POS</span><span>TEAM / DRIVER LINE-UP</span><span>POINTS</span><span>WINS</span></div>{seasonData.teams.map((team,i)=><article className="team-table-columns" key={team.id}><span>{team.position??String(i+1)}</span><div><strong>{teamName(team.name,team.id)}</strong><small>{team.drivers.join(" / ")}</small></div><em>{team.points??"—"} PTS</em><b>{team.wins??"0"} WINS</b></article>)}</div>}
              {seasonStatus==="ready"&&seasonData&&yearView==="drivers"&&<div className="season-table season-driver-list"><div className="season-table-head driver-table-columns"><span>POS</span><span>CODE</span><span>DRIVER / TEAM</span><span>POINTS</span></div>{seasonData.drivers.map(driver=>{const name=`${driver.Driver.givenName} ${driver.Driver.familyName}`;return <article className="driver-table-columns" key={driver.Driver.driverId}><span>{driver.position}</span><b>{driver.Driver.code??driver.Driver.familyName.slice(0,3).toUpperCase()}</b><div><button className="driver-name-link" onClick={()=>goToDriver(name,driver.Driver.code)}>{name}</button><small>{driver.Constructors.map((team,index)=><span key={team.constructorId}>{teamName(team.name,team.constructorId)}{index<driver.Constructors.length-1&&" / "}</span>)} · {driver.Driver.nationality}</small></div><em>{driver.points} PTS</em></article>})}</div>}
              {seasonStatus==="ready"&&seasonData&&!seasonData.drivers.length&&<div className="record-state error">この年度の記録はまだ公開されていません。</div>}
            </div>
            <div className="year-help">左の年度にカーソルを当てるか、タップして選択</div>
          </article>
        </div>
      </section>

      <section className="team-directory" id="team-directory">
        <div className="directory-intro"><div><span>04 / TEAM DIRECTORY</span><h2>2026グリッド、<br/>全11チーム。</h2></div><p>拠点、代表、PU、ドライバー。<br/>グリッドを作る組織を一覧する。</p></div>
        <div className="team-details">{teams.map((team, i) => {const lineage=lineages.find(item=>item.name===lineageNamesByCode[team.code]);return <article id={`team-${team.code.toLowerCase()}`} key={team.code} style={{"--team":team.color} as React.CSSProperties}>
          <div className="team-detail-index"><span>{String(i+1).padStart(2,"0")}</span><i/></div>
          <div className="team-detail-main"><div className="team-code">{team.code}</div><small>2026 CONSTRUCTOR</small><h3>{team.name}</h3><p>{team.story}</p></div>
          <div className="team-facts"><div><span>BASE</span><strong>{team.base}</strong></div><div><span>TEAM PRINCIPAL</span><strong>{team.principal}</strong></div><div><span>POWER UNIT</span><strong>{team.power}</strong></div><div><span>F1 DEBUT</span><strong>{team.debut}</strong></div><div><span>CONSTRUCTORS' TITLES</span><strong>{team.titles}</strong></div></div>
          <div className="team-driver-pair"><span>2026 DRIVERS</span>{team.driverNames.map(driver => <div key={driver}><i className="driver-marker" aria-hidden="true"/><button className="driver-name-link" onClick={()=>goToDriver(driver)}>{driver}</button></div>)}</div>
          {lineage&&<div className="integrated-lineage"><div className="integrated-lineage-heading"><span>TEAM LINEAGE</span><strong>{lineage.span}</strong></div><div className="integrated-lineage-chain">{lineage.chain.map((entry,entryIndex)=><div key={`${entry.name}-${entryIndex}`}><span>{String(entryIndex+1).padStart(2,"0")}</span><strong><a className="team-name-link" href={`#team-${team.code.toLowerCase()}`} onClick={event=>{event.preventDefault();goToTeam(team.name)}}>{entry.name}</a></strong><small>{entry.years}</small>{entryIndex<lineage.chain.length-1&&<i>→</i>}</div>)}</div><p>{lineage.note}</p></div>}
          <button className="back-to-grid" onClick={() => document.getElementById("grid-2026")?.scrollIntoView({behavior:"smooth", block:"start"})}>グリッドへ戻る <span>↑</span></button>
        </article>})}</div>
      </section>

      <section className="driver-directory" id="driver-directory">
        <div className="directory-intro"><div><span>05 / DRIVER DIRECTORY</span><h2>ドライバー<br/>個人ページ</h2></div><p>所属チーム遍歴と主要な通算記録を、<br/>ドライバーごとに確認できます。<br/><strong className="data-as-of">記録基準日：2026年8月27日</strong></p></div>
        <div className="driver-profile-list">{driverProfiles.map((driver,i)=><article id={`driver-${driver.code.toLowerCase()}`} key={`${driver.code}-${driver.name}`}>
          <div className="driver-profile-index"><span>{String(i+1).padStart(2,"0")}</span><i/></div>
          <div className="driver-profile-main"><div className="driver-profile-code">{driver.code}</div><small>FORMULA ONE DRIVER</small><h3>{driver.name}</h3><div className="driver-profile-meta"><span>ACTIVE YEARS</span><strong>{driver.years}</strong><span>NATIONALITY</span><strong>{driver.stats?.country ?? driver.nationality ?? "F1登録ドライバー"}</strong></div></div>
          <div className="driver-profile-career"><span>TEAM HISTORY</span>{driver.steps.map((step,stepIndex)=><div key={`${step.team}-${stepIndex}`}><b>{step.years}</b><strong>{teamName(step.team)}</strong><small>{step.car}</small></div>)}</div>
          <div className="driver-profile-stats"><span>CAREER RECORD</span><div className="profile-stat-grid unified-career-record"><div><b>{driver.stats?.starts ?? "—"}</b><small>STARTS</small></div><div><b>{driver.stats?.wins ?? "—"}</b><small>WINS</small></div><div><b>{driver.stats?.podiums ?? "—"}</b><small>PODIUMS</small></div><div><b>{driver.stats?.poles ?? "—"}</b><small>POLES</small></div><div><b>{driver.stats?.titles ?? "—"}</b><small>TITLES</small></div><div><b>{driver.stats?.pointsFinishes ?? "—"}</b><small>POINTS FINISHES</small></div><div><b>{driver.years.split("—")[0]}</b><small>DEBUT</small></div><div><b>{new Set(driver.steps.map(step=>step.team)).size}</b><small>TEAM ENTRIES</small></div><div><b>{driver.steps.length}</b><small>CAREER PERIODS</small></div><div><b>{driver.years.endsWith("—")?"ACTIVE":"RETIRED"}</b><small>STATUS</small></div><div><b>{driver.steps.at(-1) ? teamName(driver.steps.at(-1)!.team) : "—"}</b><small>LATEST TEAM</small></div><div><b>{driver.code}</b><small>DRIVER CODE</small></div></div></div>
          <button className="back-to-drivers" onClick={()=>document.getElementById("driver-directory")?.scrollIntoView({behavior:"smooth",block:"start"})}>ドライバー一覧へ戻る <span>↑</span></button>
        </article>)}</div>
      </section>

      <footer><div className="brand"><span className="brand-mark">PI</span><span>Paddock<br/>Index</span></div><p>FORMULA ONE, CONNECTED THROUGH TIME.</p><div><span>DATA SOURCES</span><a href="https://www.formula1.com" target="_blank" rel="noreferrer">Formula1.com ↗</a><span>FIA / FORIX</span></div><small>UNOFFICIAL F1 DATABASE · NOT AFFILIATED WITH FORMULA 1</small></footer>
    </main>
  );
}
