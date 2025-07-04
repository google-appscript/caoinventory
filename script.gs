function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;

  if (action === "register") return registerUser(params);
  if (action === "login") return loginUser(params);
  return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid action." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function registerUser(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registered Employees");
  const users = sheet.getRange(2, 3, sheet.getLastRow() - 1).getValues().flat();

  if (users.includes(data.username)) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Username already exists." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    data.name,
    data.username,
    data.password,
    data.role || "user",
    "active"
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Registered successfully!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function loginUser(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registered Employees");
  const records = sheet.getDataRange().getValues();

  for (let i = 1; i < records.length; i++) {
    if (
      records[i][2] === data.username &&
      records[i][3] === data.password &&
      records[i][5] === "active"
    ) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, name: records[i][1], role: records[i][4] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid username or password." }))
    .setMimeType(ContentService.MimeType.JSON);
}
