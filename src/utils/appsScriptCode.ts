// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export const APPS_SCRIPT_CODE = `/**
 * SPEAK UP! - Google Apps Script Backend & Sync Utility
 * Siap tempel ke Google Apps Script editor.
 */

var FOLDER_ID = "1A05dEI5jQ4iB9x-_7j-OfY8GZsAgacTb";
var SPREADSHEET_ID = "1Bjap1Zqy7esjgV_lxk2qNI8Hjw3TkcAFaSXE8uGXaVM";
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

    var isPublicGet = (action === "getPublicData" || action === "testConnection");
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

    if (action === "syncData") {
      var collection = data.collection;
      var payload = data.payload;
      var sheet = ss.getSheetByName(collection) || ss.insertSheet(collection);
      sheet.clear();
      sheet.appendRow(["Updated", "Data"]);
      sheet.appendRow([new Date(), JSON.stringify(payload)]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Berhasil disimpan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "getData") {
      var coll = data.collection;
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

    if (action === "getProposals") {
      var sheetName = data.sheetName || "Form Responses 1";
      var sh = ss.getSheetByName(sheetName);
      if (!sh) {
        var allSheets = ss.getSheets();
        for (var s = 0; s < allSheets.length; s++) {
          var sName = allSheets[s].getName();
          if (sName.indexOf("Form Responses") === 0 || sName.indexOf("Tanggapan Formulir") === 0) {
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
      var statusColIdx = headers.indexOf("Status");
      if (statusColIdx === -1) {
        sh.getRange(1, headers.length + 1).setValue("Status");
        statusColIdx = headers.length;
      }
      var proposals = [];
      for (var i = 1; i < dataRows.length; i++) {
        var row = dataRows[i];
        if (!row[1]) continue;
        proposals.push({
          id: "prop-" + i,
          rowIdx: i + 1,
          timestamp: row[0] ? new Date(row[0]).toISOString().replace('T', ' ').substring(0, 16) : "",
          namaDepan: row[1] || "",
          kelas: row[2] || "",
          usulanTopik: row[3] || "",
          pertanyaanUtama: row[4] || "",
          diskusi1: row[5] || "",
          diskusi2: row[6] || "",
          diskusi3: row[7] || "",
          status: row[statusColIdx] || "Baru"
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
