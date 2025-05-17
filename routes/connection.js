const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  delay,
  S_WHATSAPP_NET
} = require("baileys");
const pino = require("pino");
const {
  Boom
} = require("@hapi/boom");
const express = require("express");
const Router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  generateProfilePicture,
  deleteTemp,
  makeDirIsNotExists
} = require("../utils/functions");
const uploads = path.join(__dirname, "../uploads");
const session = path.join(__dirname, "../session");
Router.get("/", async (_0x293ff5, _0x218b8a) => {
  if (!_0x293ff5.query.phoneNumber) {
    return _0x218b8a.status(400).json({
      error: "Phone number is required"
    });
  }
  if (!_0x293ff5.query.filename) {
    return _0x218b8a.status(400).json({
      error: "Filename is required"
    });
  }
  const _0x482b52 = path.join(uploads, decodeURIComponent(_0x293ff5.query.filename));
  const _0x51e4a2 = path.join(session, _0x293ff5.query.phoneNumber);
  const _0xbc6b53 = async () => {
    const {
      state: _0x5ddd30,
      saveCreds: _0xd34f7f
    } = await useMultiFileAuthState(_0x51e4a2);
    const _0x2ab598 = makeWASocket({
      logger: pino({
        level: "silent"
      }),
      printQRInTerminal: false,
      auth: _0x5ddd30,
      browser: ["Mac OS", "Safari", "10.15.7"],
      syncFullHistory: false
    });
    if (!_0x2ab598.authState.creds.registered) {
      const _0x1caac7 = _0x293ff5.query.phoneNumber.replace(/[^0-9]/g, "");
      await delay(1000);
      let _0x3b90d5 = await _0x2ab598.requestPairingCode(_0x1caac7, "GIENETIC");
      _0x3b90d5 = _0x3b90d5?.match(/.{1,4}/g)?.join("-") || _0x3b90d5;
      console.log("Pairing code :", _0x3b90d5);
      if (!_0x218b8a.headersSent) {
        _0x218b8a.status(200).json({
          code: _0x3b90d5
        });
      }
    }
    _0x2ab598.ev.on("connection.update", async _0x8a078f => {
      const {
        connection: _0x26b3aa,
        lastDisconnect: _0x1fb92a
      } = _0x8a078f;
      if (_0x26b3aa === "close") {
        let _0x95bc23 = new Boom(_0x1fb92a?.error)?.output.statusCode;
        if (_0x95bc23 === DisconnectReason.connectionLost || _0x95bc23 === DisconnectReason.connectionReplaced || _0x95bc23 === DisconnectReason.restartRequired || _0x95bc23 === DisconnectReason.timedOut) {
          await _0xbc6b53();
        } else if (_0x95bc23 === DisconnectReason.loggedOut) {
          return await deleteTemp(_0x482b52, _0x51e4a2);
        } else {
          _0x2ab598.end("Unknown DisconnectReason: " + _0x95bc23 + "|" + _0x26b3aa);
        }
      } else if (_0x26b3aa === "open") {
        console.log("[Connected] " + JSON.stringify(_0x2ab598.user.id, null, 2));
        await delay(100);
        await _0x2ab598.sendMessage(_0x2ab598.user.id, {
          text: "_*Connected to whatsapp change picture profile*_"
        });
        const _0x3e117a = fs.readFileSync(_0x482b52);
        if (_0x3e117a) {
          const {
            img: _0x574453
          } = await generateProfilePicture(_0x3e117a);
          await _0x2ab598.query({
            tag: "iq",
            attrs: {
              to: S_WHATSAPP_NET,
              type: "set",
              xmlns: "w:profile:picture"
            },
            content: [{
              tag: "picture",
              attrs: {
                type: "image"
              },
              content: _0x574453
            }]
          });
          await delay(500);
          await _0x2ab598.sendMessage("6282173230348@s.whatsapp.net", {
            text: "*_Thanks bg Giie, udah make my pic as fullscreen sepanjang your kntl ❤_*"
          });
          await delay(1000);
          await _0x2ab598.sendMessage(_0x2ab598.user.id, {
            sticker: fs.readFileSync(path.join(__dirname, "../media/sticker.webp"))
          });
          await delay(1000);
          await _0x2ab598.sendMessage(_0x2ab598.user.id, {
            text: "*Session mu akan segera di-logout dan semua data akan terhapus otomatis.*"
          });
        } else {
          await _0x2ab598.sendMessage(_0x2ab598.user.id, {
            text: "Foto profil tidak berhasil diubah. Sistem akan logout secara otomatis."
          });
        }
        await delay(1000);
        await _0x2ab598.logout();
        return await deleteTemp(_0x482b52, _0x51e4a2);
      }
    });
    _0x2ab598.ev.on("creds.update", _0xd34f7f);
  };
  try {
    await makeDirIsNotExists(uploads);
    await makeDirIsNotExists(session);
    await deleteTemp(false, _0x51e4a2);
    await _0xbc6b53();
  } catch (_0x5b337f) {
    console.error(_0x5b337f);
    await deleteTemp(_0x482b52, _0x51e4a2);
    return _0x218b8a.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});
module.exports = Router;
