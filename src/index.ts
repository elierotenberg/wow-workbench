import { Config, readConfigSync } from "./config";
import { fetchGuildReports, fetchReportFights } from "./warcraftlogs";

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
  );
  const lastReport = reports[0];

  const fights = await fetchReportFights(publicKey, lastReport.id);

  console.dir(fights, { depth: null });
};

main().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
