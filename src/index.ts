import { Config, readConfigSync } from "./config";
import { fetchGuildReports, fetchReportFights, IReportFights, IReport } from "./warcraftlogs";
import { writeFileSync } from 'fs';
import { join } from 'path';

const config: Config = readConfigSync();
const {
  warcraftlogs: { publicKey },
  guildName,
  serverName,
  serverRegion,
} = config;

const main = async () => {
  const reports = await fetchGuildReports(
    publicKey,
    guildName,
    serverName,
    serverRegion,
    Date.now() - 3600 * 24 * 100 * 1000,
  );
  const jainaAttendance: { [character: string]: number } = {};

  const analyze = async (report: IReport) => {
    try {
      const fightReport = await fetchReportFights(publicKey, report.id);
      const fightById: { [id: number]: IReportFights["fights"][0] } = {};
      for (const fight of fightReport.fights) {
        fightById[fight.id] = fight;
      }
      for (const friendly of fightReport.friendlies) {
        if (friendly.type === "NPC" || friendly.type === "Pet") {
          continue;
        }

        if (!jainaAttendance[friendly.name]) {
          jainaAttendance[friendly.name] = 0;
        }
        for (const { id } of friendly.fights) {
          const fight = fightById[id];
          if (fight.name.includes("Jaina") && fight.difficulty === 5) {
            jainaAttendance[friendly.name]++;
          }
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  for (let k = 0; k < reports.length; k++) {
    console.log(`${k}/${reports.length}`);
    await analyze(reports[k]);
  }

  const sortedAttendance = Object.entries(jainaAttendance).sort((a, b) => b[1] - a[1]).reduce((acc, [key, value]) => Object.assign(acc, {[key]: value}), {})

  writeFileSync(join(__dirname, "..", "attendance.json"), JSON.stringify(sortedAttendance, null, 2), "utf-8");
};

main().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
