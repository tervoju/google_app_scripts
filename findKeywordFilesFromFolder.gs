var keywordsList = ['computer vision','nvidia','intel', 'huawei', 'basler', 'camera', 'azure', 'aws']

function formatSheet(sheet, keyword)
{
  sheet.appendRow( ['folder', 'link', 'file', 'file link', 'file type'] );
  sheet.getRange('A1:E1').activate();
  sheet.getActiveRangeList().setFontWeight('bold').setBackground('#4a86e8');
  sheet.setColumnWidth(3, 460);
  sheet.getCurrentCell().offset(0, 4).activate();
  sheet.setColumnWidth(5, 260);
  sheet.setName(keyword);
}

function searchSiloFiles4keywords(keyword) {
  // Log the name of every file in the user's Drive.

  const shared = Drive.Drives.list().items.map(drive => ({id: drive.id, name: drive.name}))
  var foldername = 'Clients';
  var folderlisting = 'Silo AI ' + foldername + " " + keyword;
  console.log(folderlisting)
  var result = shared.filter(obj => {
  return obj.name === foldername})
  console.log(result[0].id)

  var clientFolders = DriveApp.getFolderById(result[0].id).getFolders();
  var ss = SpreadsheetApp.create(folderlisting);
  var sheet = ss.getActiveSheet();
  formatSheet(sheet, keyword);
  /* sheet.appendRow( ['folder', 'link', 'file', 'file link', 'file type'] );
  sheet.getRange('A1:E1').activate();
  sheet.getActiveCell().setFontWeight('bold').setBackground('#4a86e8');
  sheet.setColumnWidth(3, 460);
  sheet.getCurrentCell().offset(0, 4).activate();
  sheet.setColumnWidth(5, 260);
  sheet.setName(keyword);
  */

  while(clientFolders.hasNext())
  {
    var folder = clientFolders.next();
  
    var files = folder.getFiles();
    var hitFiles = folder.searchFiles("fullText contains " + "'" + keyword + "'")
    while (hitFiles.hasNext()){
      file = hitFiles.next();
      googleType =  file.getMimeType();
      fileName = file.getName()
      if (!fileName.includes('Silo AI CV') && !fileName.includes('SILO AI CV')) {
          Logger.log(folder.getName() + " " + keyword + " found")
          sheet.appendRow([folder.getName(), folder.getUrl(), file.getName(), file.getUrl(), file.getMimeType()])
      }
    }
  }
}

function excecuteSearch()
{
  keywordsList.forEach((element) => {
    searchSiloFiles4keywords(element);
    console.log(element);
  })
}