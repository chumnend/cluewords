const { getIO } = require("./socket");
const allMatches = require("./models/gameModel/allMatches");
const Match = require("./models/gameModel/Match");
let ioExport;
let socketExport;
module.exports = {
  init: () => {
    const io = getIO();
    ioExport = io;
    io.on("connection", (socket) => {
      socketExport = socket;
      console.log("Match socket connected");
      console.log(socket.handshake.session);
      // Socket listener for match rooms
      socket.on("join-match", (data) => {
        console.log("bam", data);
        // socket.join(room);
        // Match.findOne({ matchId: matchId })
        //   .then((match) => {
        //     console.log("Players array inside socket: ",match.players);
        //     // Send updated players array to front
        //     io.to(room).emit("updateplayers",match.players)
        //   })
        //   .catch((err) => console.log(err));
        //   // New user joined notification
        // io.to(room).emit("joined-match", "New user joined");
      });

      // Socket listener for next move
      socket.on("move", ({ matchId, playerId, cardIndex }) => {
        let currentMatch = allMatches.getAllMatches().get(matchId); //make sure matchId is not a string
        currentMatch.pickCard(playerId, cardIndex); // Result of the move would be in console for now
      });
    });
    return io;
  },
  getMatchIO: () => {
    return ioExport;
  },
  getMatchSocket: () => {
    return socketExport;
  },
};