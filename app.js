const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
const db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () => {
      console.log("Server is Running at http://localhost:3009/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    palyerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getCricketQuery = `
        SELECT * FROM cricket_team ;`;
  const cricketArray = await db.all(getCricketQuery);
  response.send(
    cricketArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { palyerName, jerseyNumber, role } = playerDetails;
  const getPlayerQuery = `
        INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(getPlayerQuery);
  response.send("Players Added to Team");
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
        SELECT * FROM cricket_team WHERE playerId =${player_id}`;
  const player = await db.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player));
});
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
        UPDATE 
        cricket_team 
        SET 
        playerName= '${playerName}'',
        jerseyNumber= ${jerseyNumber}, 
        role='${role}' 
        WHERE
        player_id=${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Deatils Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
