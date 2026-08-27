export type StatKey = "wins" | "starts" | "pointsFinishes" | "podiums" | "titles" | "poles";
export type DriverStat = { name: string; code: string; country: string; era: string; debut: number; wins: number; starts: number; pointsFinishes: number; podiums: number; titles: number; poles: number };

export const statLabels: Record<StatKey, string> = { wins: "優勝", starts: "出走", pointsFinishes: "入賞", podiums: "表彰台", titles: "タイトル", poles: "ポール" };

export const driverStats: DriverStat[] = [
  { name:"Lewis Hamilton",code:"HAM",country:"GBR",era:"2007—",debut:2007,wins:105,starts:356,pointsFinishes:313,podiums:202,titles:7,poles:104 },
  { name:"Michael Schumacher",code:"MSC",country:"GER",era:"1991—2012",debut:1991,wins:91,starts:306,pointsFinishes:221,podiums:155,titles:7,poles:68 },
  { name:"Max Verstappen",code:"VER",country:"NED",era:"2015—",debut:2015,wins:63,starts:209,pointsFinishes:180,podiums:112,titles:4,poles:40 },
  { name:"Sebastian Vettel",code:"VET",country:"GER",era:"2007—2022",debut:2007,wins:53,starts:299,pointsFinishes:249,podiums:122,titles:4,poles:57 },
  { name:"Alain Prost",code:"PRO",country:"FRA",era:"1980—1993",debut:1980,wins:51,starts:199,pointsFinishes:128,podiums:106,titles:4,poles:33 },
  { name:"Ayrton Senna",code:"SEN",country:"BRA",era:"1984—1994",debut:1984,wins:41,starts:161,pointsFinishes:96,podiums:80,titles:3,poles:65 },
  { name:"Fernando Alonso",code:"ALO",country:"ESP",era:"2001—",debut:2001,wins:32,starts:401,pointsFinishes:263,podiums:106,titles:2,poles:22 },
  { name:"Nigel Mansell",code:"MAN",country:"GBR",era:"1980—1995",debut:1980,wins:31,starts:187,pointsFinishes:101,podiums:59,titles:1,poles:32 },
  { name:"Jackie Stewart",code:"STE",country:"GBR",era:"1965—1973",debut:1965,wins:27,starts:99,pointsFinishes:57,podiums:43,titles:3,poles:17 },
  { name:"Jim Clark",code:"CLA",country:"GBR",era:"1960—1968",debut:1960,wins:25,starts:72,pointsFinishes:40,podiums:32,titles:2,poles:33 },
  { name:"Niki Lauda",code:"LAU",country:"AUT",era:"1971—1985",debut:1971,wins:25,starts:171,pointsFinishes:93,podiums:54,titles:3,poles:24 },
  { name:"Juan Manuel Fangio",code:"FAN",country:"ARG",era:"1950—1958",debut:1950,wins:24,starts:51,pointsFinishes:43,podiums:35,titles:5,poles:29 },
  { name:"Nelson Piquet",code:"PIQ",country:"BRA",era:"1978—1991",debut:1978,wins:23,starts:204,pointsFinishes:100,podiums:60,titles:3,poles:24 },
  { name:"Nico Rosberg",code:"ROS",country:"GER",era:"2006—2016",debut:2006,wins:23,starts:206,pointsFinishes:183,podiums:57,titles:1,poles:30 },
  { name:"Damon Hill",code:"HIL",country:"GBR",era:"1992—1999",debut:1992,wins:22,starts:115,pointsFinishes:72,podiums:42,titles:1,poles:20 },
  { name:"Kimi Räikkönen",code:"RAI",country:"FIN",era:"2001—2021",debut:2001,wins:21,starts:349,pointsFinishes:272,podiums:103,titles:1,poles:18 },
  { name:"Mika Häkkinen",code:"HAK",country:"FIN",era:"1991—2001",debut:1991,wins:20,starts:161,pointsFinishes:100,podiums:51,titles:2,poles:26 },
  { name:"Stirling Moss",code:"MOS",country:"GBR",era:"1951—1961",debut:1951,wins:16,starts:66,pointsFinishes:46,podiums:24,titles:0,poles:16 },
  { name:"Jenson Button",code:"BUT",country:"GBR",era:"2000—2017",debut:2000,wins:15,starts:306,pointsFinishes:224,podiums:50,titles:1,poles:8 },
  { name:"Graham Hill",code:"GHI",country:"GBR",era:"1958—1975",debut:1958,wins:14,starts:176,pointsFinishes:82,podiums:36,titles:2,poles:13 },
  { name:"Jack Brabham",code:"BRA",country:"AUS",era:"1955—1970",debut:1955,wins:14,starts:126,pointsFinishes:75,podiums:31,titles:3,poles:13 },
  { name:"Emerson Fittipaldi",code:"FIT",country:"BRA",era:"1970—1980",debut:1970,wins:14,starts:144,pointsFinishes:84,podiums:35,titles:2,poles:6 },
  { name:"Alberto Ascari",code:"ASC",country:"ITA",era:"1950—1955",debut:1950,wins:13,starts:32,pointsFinishes:21,podiums:17,titles:2,poles:14 },
  { name:"David Coulthard",code:"COU",country:"GBR",era:"1994—2008",debut:1994,wins:13,starts:246,pointsFinishes:163,podiums:62,titles:0,poles:12 },
  { name:"Mario Andretti",code:"AND",country:"USA",era:"1968—1982",debut:1968,wins:12,starts:128,pointsFinishes:67,podiums:19,titles:1,poles:18 },
  { name:"Carlos Reutemann",code:"REU",country:"ARG",era:"1972—1982",debut:1972,wins:12,starts:146,pointsFinishes:84,podiums:45,titles:0,poles:6 },
  { name:"Alan Jones",code:"JON",country:"AUS",era:"1975—1986",debut:1975,wins:12,starts:116,pointsFinishes:67,podiums:24,titles:1,poles:6 },
  { name:"Jacques Villeneuve",code:"VIL",country:"CAN",era:"1996—2006",debut:1996,wins:11,starts:163,pointsFinishes:107,podiums:23,titles:1,poles:13 },
  { name:"Felipe Massa",code:"MAS",country:"BRA",era:"2002—2017",debut:2002,wins:11,starts:269,pointsFinishes:207,podiums:41,titles:0,poles:16 },
  { name:"Rubens Barrichello",code:"BAR",country:"BRA",era:"1993—2011",debut:1993,wins:11,starts:322,pointsFinishes:228,podiums:68,titles:0,poles:14 },
];
