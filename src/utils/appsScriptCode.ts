// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export const APPS_SCRIPT_CODE = `/**
 * SPEAK UP! - Google Apps Script Backend & Sync Utility
 * Siap tempel ke Google Apps Script editor.
 */

var FOLDER_ID = "1A05dEI5jQ4iB9x-_7j-OfY8GZsAgacTb";
var SPREADSHEET_ID = "1zdKNn7AnQBVv1Id3xdQMVM8upOOZIBe8LSnmURpjvm8";
// Ganti nilai di bawah dengan token rahasia Anda sendiri
var TOKEN = "GANTI_DENGAN_TOKEN_ANDA";

function siapkanAwal() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. Pengguna
  var shPengguna = ss.getSheetByName("Pengguna") || ss.insertSheet("Pengguna");
  if (shPengguna.getLastRow() === 0) {
    shPengguna.appendRow(["peran", "hash_kata_sandi", "garam", "waktu_diubah"]);
    var saltAdmin = Utilities.getUuid();
    var hashAdmin = computeSha256("admin123" + saltAdmin);
    var saltSuper = Utilities.getUuid();
    var hashSuper = computeSha256("superadmin123" + saltSuper);
    shPengguna.appendRow(["admin", hashAdmin, saltAdmin, new Date()]);
    shPengguna.appendRow(["superadmin", hashSuper, saltSuper, new Date()]);
  }

  // 2. Sesi
  var shSesi = ss.getSheetByName("Sesi") || ss.insertSheet("Sesi");
  if (shSesi.getLastRow() === 0) {
    shSesi.appendRow(["Updated", "Data"]);
  }

  // 3. Toolkit
  var shToolkit = ss.getSheetByName("Toolkit") || ss.insertSheet("Toolkit");
  if (shToolkit.getLastRow() === 0) {
    shToolkit.appendRow(["Updated", "Data"]);
  }

  // 4. Pengaturan
  var shPengaturan = ss.getSheetByName("Pengaturan") || ss.insertSheet("Pengaturan");
  if (shPengaturan.getLastRow() === 0) {
    shPengaturan.appendRow(["Kunci", "Nilai"]);
  }

  // 5. Riwayat
  var shRiwayat = ss.getSheetByName("Riwayat") || ss.insertSheet("Riwayat");
  if (shRiwayat.getLastRow() === 0) {
    shRiwayat.appendRow(["Waktu", "Peran", "Aksi", "Objek"]);
  }

  // 6. Galeri
  getOrCreateGallerySheet(ss);
}

function getOrCreateGallerySheet(ss) {
  var shGaleri = ss.getSheetByName("Galeri") || ss.insertSheet("Galeri");
  if (shGaleri.getLastRow() === 0) {
    shGaleri.appendRow(["id", "idSesi", "fileId", "keterangan", "tanggalUnggah", "urutan"]);
  }
  return shGaleri;
}

function getOrCreateGalleryFolder() {
  var parent;
  try {
    parent = DriveApp.getFolderById(FOLDER_ID);
  } catch (err) {
    parent = DriveApp.getRootFolder();
  }
  var folders = parent.getFoldersByName("Gallery");
  var galleryFolder;
  if (folders.hasNext()) {
    galleryFolder = folders.next();
  } else {
    galleryFolder = parent.createFolder("Gallery");
  }
  try {
    galleryFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (shareErr) {
    // Domain or folder policy may restrict public link sharing; galeriGambar fallback remains available
  }
  return galleryFolder;
}

function siapkanGaleri() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateGallerySheet(ss);
  getOrCreateGalleryFolder();
}

function readGalleryRows(ss) {
  var sh = ss.getSheetByName("Galeri");
  if (!sh) return [];
  var rows = sh.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0] || !r[2]) continue;
    list.push({
      id: String(r[0]),
      idSesi: String(r[1] || ""),
      fileId: String(r[2] || ""),
      keterangan: String(r[3] || ""),
      tanggalUnggah: String(r[4] || ""),
      urutan: Number(r[5] || 0)
    });
  }
  list.sort(function(a, b) { return a.urutan - b.urutan; });
  return list;
}

function getArchiveSessionIds(ss) {
  var archiveMap = {};
  var shSesi = ss.getSheetByName("Sesi");
  if (!shSesi) return archiveMap;
  var sRows = shSesi.getDataRange().getValues();
  var sJson = sRows.length > 1 ? sRows[sRows.length - 1][1] : null;
  var allSesi = sJson ? JSON.parse(sJson) : [];
  for (var i = 0; i < allSesi.length; i++) {
    if (allSesi[i].status === "Arsip" && allSesi[i].id) {
      archiveMap[String(allSesi[i].id)] = true;
    }
  }
  return archiveMap;
}

function computeSha256(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  var txtHash = "";
  for (var i = 0; i < rawHash.length; i++) {
    var byteValue = rawHash[i];
    if (byteValue < 0) byteValue += 256;
    var byteString = byteValue.toString(16);
    if (byteString.length == 1) byteString = "0" + byteString;
    txtHash += byteString;
  }
  return txtHash;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var token = data.token;

    var isPublicGet = (
      action === "getPublicData" ||
      action === "testConnection" ||
      action === "galeriDaftar" ||
      action === "galeriGambar"
    );
    if (token !== TOKEN && !isPublicGet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unauthorized token" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === "testConnection") {
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Terhubung" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "login") {
      var password = data.password;
      var shPengguna = ss.getSheetByName("Pengguna");
      var role = "public";
      if (shPengguna) {
        var rows = shPengguna.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
          var r = rows[i][0];
          var storedHash = rows[i][1];
          var salt = rows[i][2];
          if (computeSha256(password + salt) === storedHash) {
            role = r;
            break;
          }
        }
      } else {
        if (password === "superadmin123") role = "superadmin";
        else if (password === "admin123") role = "admin";
      }
      return ContentService.createTextOutput(JSON.stringify({ success: role !== "public", role: role }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "getPublicData") {
      var shSesi = ss.getSheetByName("Sesi");
      var pubSessions = [];
      if (shSesi) {
        var sRows = shSesi.getDataRange().getValues();
        var sJson = sRows.length > 1 ? sRows[sRows.length - 1][1] : null;
        var allSesi = sJson ? JSON.parse(sJson) : [];
        for (var si = 0; si < allSesi.length; si++) {
          if (allSesi[si].status === "Mendatang" || allSesi[si].status === "Arsip") {
            pubSessions.push(allSesi[si]);
          }
        }
      }
      var shToolkit = ss.getSheetByName("Toolkit");
      var pubToolkit = null;
      if (shToolkit) {
        var tRows = shToolkit.getDataRange().getValues();
        var tJson = tRows.length > 1 ? tRows[tRows.length - 1][1] : null;
        if (tJson) pubToolkit = JSON.parse(tJson);
      }
      var shPengaturan = ss.getSheetByName("Pengaturan");
      var pubSchedule = null;
      var pubCms = null;
      if (shPengaturan) {
        var pRows = shPengaturan.getDataRange().getValues();
        var pJson = pRows.length > 1 ? pRows[pRows.length - 1][1] : null;
        if (pJson) {
          var pObj = JSON.parse(pJson);
          pubSchedule = pObj.schedule || null;
          pubCms = pObj.cms || null;
        }
      }
      var archiveMap = getArchiveSessionIds(ss);
      var allGallery = readGalleryRows(ss);
      var pubGallery = [];
      for (var gi = 0; gi < allGallery.length; gi++) {
        if (archiveMap[allGallery[gi].idSesi]) {
          pubGallery.push(allGallery[gi]);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        sessions: pubSessions,
        toolkit: pubToolkit,
        schedule: pubSchedule,
        cms: pubCms,
        gallery: pubGallery
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "syncData") {
      var collection = data.collection;
      var payload = data.payload;
      if (collection === "Galeri") {
        var shGalSync = getOrCreateGallerySheet(ss);
        shGalSync.clear();
        shGalSync.appendRow(["id", "idSesi", "fileId", "keterangan", "tanggalUnggah", "urutan"]);
        if (payload && payload.length) {
          for (var gsi = 0; gsi < payload.length; gsi++) {
            var item = payload[gsi];
            shGalSync.appendRow([
              String(item.id || ""),
              String(item.idSesi || ""),
              String(item.fileId || ""),
              String(item.keterangan || ""),
              String(item.tanggalUnggah || ""),
              String(item.urutan || gsi)
            ]);
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Berhasil disimpan" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var sheet = ss.getSheetByName(collection) || ss.insertSheet(collection);
      sheet.clear();
      sheet.appendRow(["Updated", "Data"]);
      sheet.appendRow([new Date(), JSON.stringify(payload)]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Berhasil disimpan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "getData") {
      var coll = data.collection;
      if (coll === "Galeri") {
        return ContentService.createTextOutput(JSON.stringify({ success: true, payload: readGalleryRows(ss) }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var sh = ss.getSheetByName(coll);
      if (!sh) {
        return ContentService.createTextOutput(JSON.stringify({ success: true, payload: null }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var rows = sh.getDataRange().getValues();
      var jsonStr = rows.length > 1 ? rows[rows.length - 1][1] : null;
      var payload = jsonStr ? JSON.parse(jsonStr) : null;
      return ContentService.createTextOutput(JSON.stringify({ success: true, payload: payload }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "galeriDaftar") {
      var filterIdSesi = data.idSesi ? String(data.idSesi) : "";
      var archIds = getArchiveSessionIds(ss);
      var rowsGal = readGalleryRows(ss);
      var pubPhotos = [];
      for (var gp = 0; gp < rowsGal.length; gp++) {
        var ph = rowsGal[gp];
        if (!archIds[ph.idSesi]) continue;
        if (filterIdSesi && ph.idSesi !== filterIdSesi) continue;
        pubPhotos.push(ph);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, photos: pubPhotos }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "galeriUnggah") {
      var idSesiUp = String(data.idSesi || "");
      var mimeTypeUp = String(data.mimeType || "");
      var base64Up = String(data.base64 || "");
      var fileNameUp = String(data.fileName || ("photo-" + Date.now() + ".jpg"));
      var ketUp = String(data.keterangan || "");
      var urutanUp = String(data.urutan !== undefined ? data.urutan : 0);

      var allowedMimes = { "image/jpeg": true, "image/png": true, "image/webp": true };
      if (!idSesiUp || !base64Up || !allowedMimes[mimeTypeUp]) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid file" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var bytesUp = Utilities.base64Decode(base64Up);
      if (!bytesUp || bytesUp.length === 0 || bytesUp.length > 10 * 1024 * 1024) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "File size invalid" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var gFolder = getOrCreateGalleryFolder();
      var blobUp = Utilities.newBlob(bytesUp, mimeTypeUp, fileNameUp);
      var createdFile = gFolder.createFile(blobUp);
      try {
        createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (fileShareErr) {
        // Ignore if domain policy blocks public link sharing
      }
      var newFileId = createdFile.getId();
      var newPhotoId = String(data.id || ("gal-" + Date.now() + "-" + Math.floor(Math.random() * 1000)));
      var tglUp = new Date().toISOString().replace("T", " ").substring(0, 16);

      var shGalUp = getOrCreateGallerySheet(ss);
      shGalUp.appendRow([newPhotoId, idSesiUp, newFileId, ketUp, tglUp, urutanUp]);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: newFileId,
        photo: {
          id: newPhotoId,
          idSesi: idSesiUp,
          fileId: newFileId,
          keterangan: ketUp,
          tanggalUnggah: tglUp,
          urutan: Number(urutanUp)
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "galeriUbah") {
      var shGalEdit = getOrCreateGallerySheet(ss);
      var gRowsEdit = shGalEdit.getDataRange().getValues();
      var updatesList = Array.isArray(data.updates)
        ? data.updates
        : [{ id: data.id, keterangan: data.keterangan, urutan: data.urutan }];

      for (var ui = 0; ui < updatesList.length; ui++) {
        var upd = updatesList[ui];
        if (!upd || !upd.id) continue;
        for (var rIdx = 1; rIdx < gRowsEdit.length; rIdx++) {
          if (String(gRowsEdit[rIdx][0]) === String(upd.id)) {
            if (upd.keterangan !== undefined) {
              shGalEdit.getRange(rIdx + 1, 4).setValue(String(upd.keterangan));
            }
            if (upd.urutan !== undefined) {
              shGalEdit.getRange(rIdx + 1, 6).setValue(String(upd.urutan));
            }
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "galeriHapus") {
      var delId = data.id ? String(data.id) : "";
      var delIdSesi = data.idSesi ? String(data.idSesi) : "";
      var shGalDel = ss.getSheetByName("Galeri");
      if (!shGalDel) {
        return ContentService.createTextOutput(JSON.stringify({ success: true, deletedCount: 0 }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var gRowsDel = shGalDel.getDataRange().getValues();
      var delCount = 0;
      for (var ri = gRowsDel.length - 1; ri >= 1; ri--) {
        var rowId = String(gRowsDel[ri][0] || "");
        var rowIdSesi = String(gRowsDel[ri][1] || "");
        var rowFileId = String(gRowsDel[ri][2] || "");
        var match = (delId && rowId === delId) || (delIdSesi && rowIdSesi === delIdSesi);
        if (match) {
          if (rowFileId) {
            try {
              DriveApp.getFileById(rowFileId).setTrashed(true);
            } catch (trashErr) {
              // ignore if already removed
            }
          }
          shGalDel.deleteRow(ri + 1);
          delCount++;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, deletedCount: delCount }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "galeriGambar") {
      var reqFileId = String(data.fileId || "");
      if (!reqFileId) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Missing fileId" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var galleryDir = getOrCreateGalleryFolder();
      var galleryDirId = galleryDir.getId();
      var targetFile = DriveApp.getFileById(reqFileId);
      if (targetFile.isTrashed()) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var parents = targetFile.getParents();
      var inGalleryFolder = false;
      while (parents.hasNext()) {
        if (parents.next().getId() === galleryDirId) {
          inGalleryFolder = true;
          break;
        }
      }
      if (!inGalleryFolder) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Forbidden" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var fileBlob = targetFile.getBlob();
      var encoded = Utilities.base64Encode(fileBlob.getBytes());
      var cType = fileBlob.getContentType() || "image/jpeg";
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        dataUrl: "data:" + cType + ";base64," + encoded
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "getProposals") {
      var sheetName = data.sheetName || "Form Responses 1";
      var sh = ss.getSheetByName(sheetName);
      if (!sh) {
        var allSheets = ss.getSheets();
        for (var s = 0; s < allSheets.length; s++) {
          var sName = allSheets[s].getName();
          if (
            sName.indexOf("Form Responses") === 0 ||
            sName.indexOf("Tanggapan Formulir") === 0 ||
            sName.indexOf("Jawaban Formulir") === 0 ||
            sName.indexOf("Respons Formulir") === 0
          ) {
            sh = allSheets[s];
            break;
          }
        }
      }
      if (!sh) {
        return ContentService.createTextOutput(JSON.stringify({ success: true, proposals: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var dataRows = sh.getDataRange().getValues();
      if (dataRows.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({ success: true, proposals: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var headers = dataRows[0];
      var statusColIdx = -1;
      var nameIdx = -1;
      var classIdx = -1;
      var topicIdx = -1;
      var mainQIdx = -1;
      var d1Idx = -1;
      var d2Idx = -1;
      var d3Idx = -1;

      for (var h = 0; h < headers.length; h++) {
        var hLower = String(headers[h] || "").toLowerCase().trim();
        if (hLower === "status") statusColIdx = h;
        else if (nameIdx === -1 && (hLower.indexOf("name") !== -1 || hLower.indexOf("nama") !== -1)) nameIdx = h;
        else if (classIdx === -1 && (hLower.indexOf("class") !== -1 || hLower.indexOf("kelas") !== -1)) classIdx = h;
        else if (topicIdx === -1 && (hLower.indexOf("topic") !== -1 || hLower.indexOf("topik") !== -1)) topicIdx = h;
        else if (mainQIdx === -1 && (hLower.indexOf("pertanyaan utama") !== -1 || hLower.indexOf("main question") !== -1)) mainQIdx = h;
        else if (d1Idx === -1 && (hLower.indexOf("question 1") !== -1 || hLower.indexOf("questions 1") !== -1 || hLower.indexOf("diskusi 1") !== -1)) d1Idx = h;
        else if (d2Idx === -1 && (hLower.indexOf("question 2") !== -1 || hLower.indexOf("questions 2") !== -1 || hLower.indexOf("diskusi 2") !== -1)) d2Idx = h;
        else if (d3Idx === -1 && (hLower.indexOf("question 3") !== -1 || hLower.indexOf("questions 3") !== -1 || hLower.indexOf("diskusi 3") !== -1)) d3Idx = h;
      }

      if (statusColIdx === -1) {
        sh.getRange(1, headers.length + 1).setValue("Status");
        statusColIdx = headers.length;
      }

      if (nameIdx === -1) nameIdx = 1;
      if (classIdx === -1) classIdx = 2;
      if (topicIdx === -1) topicIdx = 3;
      if (d1Idx === -1 && d2Idx === -1 && d3Idx === -1) {
        if (mainQIdx === -1 && headers.length <= 7) {
          d1Idx = 4;
          d2Idx = 5;
          d3Idx = 6;
        } else {
          mainQIdx = 4;
          d1Idx = 5;
          d2Idx = 6;
          d3Idx = 7;
        }
      }

      var getVal = function(r, idx) {
        if (idx < 0 || idx === statusColIdx || idx >= r.length) return "";
        return String(r[idx] || "");
      };

      var proposals = [];
      for (var i = 1; i < dataRows.length; i++) {
        var row = dataRows[i];
        if (!row[0] && !getVal(row, nameIdx) && !getVal(row, topicIdx)) continue;
        var tsStr = "";
        if (row[0]) {
          var dObj = new Date(row[0]);
          tsStr = isNaN(dObj.getTime()) ? String(row[0]) : dObj.toISOString().replace('T', ' ').substring(0, 16);
        }
        proposals.push({
          id: "prop-" + i,
          rowIdx: i + 1,
          timestamp: tsStr,
          namaDepan: getVal(row, nameIdx),
          kelas: getVal(row, classIdx),
          usulanTopik: getVal(row, topicIdx),
          pertanyaanUtama: getVal(row, mainQIdx),
          diskusi1: getVal(row, d1Idx),
          diskusi2: getVal(row, d2Idx),
          diskusi3: getVal(row, d3Idx),
          status: String(row[statusColIdx] || "Baru")
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, proposals: proposals }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateProposalStatus") {
      var sheetName = data.sheetName || "Form Responses 1";
      var rowIndex = data.rowIndex;
      var newStatus = data.status;
      var sh = ss.getSheetByName(sheetName);
      if (!sh) {
        var allSheets2 = ss.getSheets();
        for (var s2 = 0; s2 < allSheets2.length; s2++) {
          var sName2 = allSheets2[s2].getName();
          if (sName2.indexOf("Form Responses") === 0 || sName2.indexOf("Tanggapan Formulir") === 0) {
            sh = allSheets2[s2];
            break;
          }
        }
      }
      if (!sh) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Sheet not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var headers2 = sh.getDataRange().getValues()[0];
      var statusColIdx2 = headers2.indexOf("Status");
      if (statusColIdx2 === -1) {
        sh.getRange(1, headers2.length + 1).setValue("Status");
        statusColIdx2 = headers2.length;
      }
      sh.getRange(rowIndex, statusColIdx2 + 1).setValue(newStatus);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Status diperbarui" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "active", name: "SPEAK UP! Apps Script" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
