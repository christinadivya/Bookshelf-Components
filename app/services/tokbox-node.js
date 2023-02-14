const _ = require('lodash');

const apiKey = TOKBOX_API_KEY;
const secret = TOKBOX_SECRET;

const OpenTokbox = require('opentok');
const opentok = new OpenTokbox(apiKey, secret);

let roomToSessionIdDictionary = {};

// returns the room name, given a session ID that was associated with it
function findRoomFromSessionId(sessionId) {
  return _.findKey(roomToSessionIdDictionary, function (value) { return value === sessionId; });
}

function getSessionToken(req, res){
  let roomName = req.query.roomName;
  let sessionId;
  let token;
  
  if (roomToSessionIdDictionary[roomName]) { // if the room name is associated with a session ID, fetch that
    sessionId = roomToSessionIdDictionary[roomName];
    
    token = opentok.generateToken(sessionId); // generate token
    return res.json({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  } else { // if this is the first time the room is being accessed, create a new session ID
    opentok.createSession({ mediaMode: 'routed' }, function (err, session) {
      if (err) {
        res.status(500).send({ error: 'createSession error:' + err });
        return;
      }

      roomToSessionIdDictionary[roomName] = session.sessionId;
      token = opentok.generateToken(session.sessionId); // generate token

      return res.json({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token
      });
    });
  }
}

function archiveStart(req, res) {
  let json = req.body;
  let sessionId = json.sessionId;

  let archiveOptions = {
  name: findRoomFromSessionId(sessionId),
  hasVideo: true,  // Record audio only (hasAudio or hasVideo)
  hasAudio: true
};
  opentok.startArchive(sessionId, archiveOptions, function (err, archive) {
    if (err) {
      res.status(500).send({ error: 'startArchive error:' + err });
      return;
    }
    return res.json(archive);
  });
}

function archiveStop(req, res) {
  let archiveId = req.body.archiveId;
  opentok.stopArchive(archiveId, function (err, archive) {
    if (err) {
      res.status(500).send({ error: 'stopArchive error:' + err });
      return;
    }
    return res.json(archive);
  });
}

function archiveView(req, res) {
  let archiveId = req.query.archiveId;
  opentok.getArchive(archiveId, function (err, archive) {
    if (err) {
      res.status(500).send({ error: 'getArchive error:' + err });
      return;
    }
    return res.json(archive);
  });
}

function archiveFetchAndDelete(req, res) {
  let archiveId = req.query.archiveId;
  opentok.getArchive(archiveId, function (err, archive) {
    if (err) {
      res.status(500).send({ error: 'getArchive error:' + err });
      return;
    }
    // Delete an Archive from an Archive instance (returned from archives.create, archives.find)
    archive.delete(function(err) {
    });
    return res.json(archive);
  });
}

function archiveList(req, res) {
  let options = {};
  if (req.query.count) {
    options.count = req.query.count;
  }
  if (req.query.offset) {
    options.offset = req.query.offset;
  }

  // list archives
  opentok.listArchives(options, function (err, archives, totalCount) {
    if (err) {
      res.status(500).send({ error: 'infoArchive error:' + err });
      return;
    }
    return res.json({
      archives: archives,
      totalCount: totalCount
    });
  });
}

function archiveDelete(req, res) {
  let archiveId = req.query.archiveId;
  opentok.deleteArchive(archiveId, function(err) {
    if (err) {
      res.status(500).send({ error: 'error:' + err });
      return;
    }
    return res.json("Deleted");
  });
}

function sendSignal(req, res) {
  let queryData = req.query;
  opentok.signal(queryData.sessionId, queryData.connectionId, { 'type': 'chat', 'data': 'Hello!' }, function(err) {
    if (err) {
      res.status(500).send({ error: 'error:' + err });
      return;
    }
    return res.json("Message Sent");
  });
}

function forceDisconnect(req, res) {
  let queryData = req.query;
  opentok.forceDisconnect(queryData.sessionId, queryData.connectionId, function(err) {
    if (err) {
      res.status(500).send({ error: 'error:' + err });
      return;
    }
    return res.json("Disconnected");
  });
}
