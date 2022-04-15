const RPC = require("discord-rpc");
const Trakt = require("trakt.tv");

const config = require("./config.js");

const clientId = config.discordClientId;

const client = new RPC.Client({ transport: "ipc" });
const startTimestamp = new Date();

let options = {
  client_id: config.traktClientId,
  client_secret: config.traktClientSecret,
  redirect_uri: null,
  api_url: null,
  useragent: null,
  pagination: true,
};

const trakt = new Trakt(options);

async function traktCheck() {
  const watching = await trakt.users.watching({
    username: "papaya",
  });

  if (watching) {
    const endTimestamp = new Date(watching.data.expires_at);

    if (watching.data.show) {
      client.setActivity({
        details: `Watching: ${watching.data.show.title}`,
        state: `s${watching.data.episode.season}e${watching.data.episode.number} - ${watching.data.episode.title}`,
        startTimestamp,
        endTimestamp,
        largeImageKey: "trakt-icon-red-white",
        instance: false,
        buttons: [
          {
            label: "Show IMDB",
            url: `https://imdb.com/title/${watching.data.show.ids.imdb}`,
          },
          {
            label: "Episode IMDB",
            url: `https://imdb.com/title/${watching.data.episode.ids.imdb}`,
          },
        ],
      });
    }
    if (watching.data.movie) {
      client.setActivity({
        details: `Watching: ${watching.data.movie.title}`,
        startTimestamp,
        endTimestamp,
        largeImageKey: "trakt-icon-red-white",
        instance: false,
        buttons: [
          {
            label: "Movie IMDB",
            url: `https://imdb.com/title/${watching.data.movie.ids.imdb}`,
          },
        ],
      });
    }
  }
}

client.on("ready", () => {
  console.log("Ready");

  traktCheck();
  setInterval(() => {
    traktCheck();
  }, 60000);
});

client.login({ clientId });
