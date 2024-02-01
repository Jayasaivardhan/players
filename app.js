const express = require('express')
let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
let path = require('path')

let dbpath = path.join(__dirname, 'cricketTeam.db')

let app = express()
let db = null
app.use(express.json())
InitializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log(
        'Server running by https://jayasaivardhandttqpnjscpxtwms.drops.nxtwave.tech',
      )
    })
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}
InitializeDBandServer()

const converseObject = dbobj => {
  return {
    playerId: dbobj.player_id,
    playerName: dbobj.player_name,
    jerseyNumber: dbobj.jersey_number,
    role: dbobj.role,
  }
}

app.get('/players/', async (request, response) => {
  let query1 = `
    SELECT
      *
    FROM
      cricket_team ;`

  const players = await db.all(query1)
  response.send(players.map(dbobj => converseObject(dbobj)))
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const aQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
       '${playerName}',
         ${jerseyNumber},
        '${role}'
      );`

  const dbResponse = await db.run(aQuery)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let iquery = `select
                *
                from
               cricket_team
               where player_id 
               = ${playerId}; `

  const resy = await db.get(iquery)
  response.send(converseObject(resy))
})

app.put('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let {playerName, jerseyNumber, role} = request.body
  const updateplayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role= '${role}'
    WHERE
      player_id = ${playerId} ;`
  let playerresponse = await db.run(updateplayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  const deleteplayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  let playerResponse = await db.run(deleteplayerQuery)
  response.send('Player Removed')
})

module.exports = app
