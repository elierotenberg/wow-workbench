import fetch from "node-fetch";

const baseURL = "https://www.warcraftlogs.com:443/v1";

interface IParams {
  [key: string]: any;
}

interface IReportFights {
  fights: Array<{
    id: number;
    start_time: number;
    end_time: number;
    boss: number;
    name: string;
    size?: number;
    difficulty?: number;
    kill?: boolean;
    partial: number;
    originalBoss?: number;
    bossPercentage?: number;
    fightPercentage?: number;
    lastPhaseForPercentageDisplay?: number;
  }>;
  lang: string;
  friendlies: Array<{
    name: string;
    id: number;
    guid: number;
    type: string;
    fights: Array<{ id: number }>;
  }>;
  enemies: Array<{
    name: string;
    id: number;
    guid: number;
    type: string;
    fights: Array<{ id: number }>;
  }>;
  friendlyPets: Array<{
    name: string;
    id: number;
    guid: number;
    type: string;
    petOwner: number;
    fights: Array<{ id: number }>;
  }>;
  enemyPets: Array<{
    name: string;
    id: number;
    guid: number;
    type: string;
    petOwner: number;
    fights: Array<{ id: number }>;
  }>;
  phases: Array<{
    boss: number;
    phases: string[];
  }>;
  title: string;
  owner: string;
  start: number;
  end: number;
  zone: number;
  exportedCharacters: [];
}

interface IReport {
  id: string;
  title: string;
  owner: string;
  start: number;
  end: number;
  zone: number;
}

const makeFullURL = (
  publicKey: string,
  slugs: string[],
  params: IParams = {},
): string => {
  const path = [baseURL, ...slugs.map(encodeURIComponent)].join("/");
  const args = Array.of(
    Object.entries({ ...params, ["api_key"]: publicKey })
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&"),
  );
  return `${path}?${args}`;
};

const fetchGuildReports = async (
  publicKey: string,
  guildName: string,
  serverName: string,
  serverRegion: string,
  start: number = 0,
  end: number = Date.now(),
): Promise<IReport[]> => {
  const fullURL = makeFullURL(
    publicKey,
    ["reports", "guild", guildName, serverName, serverRegion],
    {
      end,
      start,
    },
  );
  const res = await fetch(fullURL);
  const reports: IReport[] = await res.json();
  return reports;
};

const fetchReportFights = async (
  publicKey: string,
  reportId: string,
): Promise<IReportFights> => {
  const fullURL = makeFullURL(publicKey, ["report", "fights", reportId]);
  const res = await fetch(fullURL);
  const fights: IReportFights = await res.json();
  return fights;
};

export { fetchGuildReports, fetchReportFights };
export { IReportFights, IReport };