import { readFileSync } from "fs";
import { join } from "path";

interface IConfig {
  warcraftlogs: {
    publicKey: string;
    privateKey: string;
  };
  characterName: string;
  guildName: string;
  serverName: string;
  serverRegion: string;
}

const readConfigSync = (): IConfig =>
  JSON.parse(
    readFileSync(join(__dirname, "..", "env", "config.json"), {
      encoding: "utf8",
    }),
  );

export { IConfig as Config };
export { readConfigSync };
