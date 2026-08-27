import { writeFile } from "node:fs/promises";

const API = "https://api.jolpi.ca/ergast/f1";
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function get(url, attempt = 0) {
  const response = await fetch(url);
  if ((response.status === 429 || response.status >= 500) && attempt < 8) {
    await pause(1200 * (attempt + 1));
    return get(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

const archive = {};
for (let year = 1950; year <= 2025; year += 1) {
  const [driverJson, teamJson] = await Promise.all([
    get(`${API}/${year}/driverstandings/?limit=100`),
    get(`${API}/${year}/constructorstandings/?limit=100`),
  ]);
  const drivers = driverJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  const teamStandings = teamJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  const teamMap = new Map();
  for (const driver of drivers) {
    for (const team of driver.Constructors ?? []) {
      const entry = teamMap.get(team.constructorId) ?? { id: team.constructorId, name: team.name, drivers: [] };
      const name = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
      if (!entry.drivers.includes(name)) entry.drivers.push(name);
      teamMap.set(team.constructorId, entry);
    }
  }
  for (const standing of teamStandings) {
    const team = standing.Constructor;
    const entry = teamMap.get(team.constructorId) ?? { id: team.constructorId, name: team.name, drivers: [] };
    teamMap.set(team.constructorId, {...entry, position: standing.position, points: standing.points, wins: standing.wins});
  }
  archive[year] = {
    drivers,
    teams: [...teamMap.values()].sort((a,b) => Number(a.position ?? 999) - Number(b.position ?? 999)),
  };
  process.stdout.write(`${year}${year === 2025 ? "\n" : " "}`);
  await pause(700);
}

await writeFile(new URL("../data/season-archive.json", import.meta.url), `${JSON.stringify(archive)}\n`);
