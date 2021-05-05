// このスクリプトは毎月25日にスプレッドシート(LT_Scheduler)を
// 来月のLTスケジュール調整版にアップデートします。

// アップデート範囲の開始列です。
const offsetColumn = 2;
// アップデート範囲の開始行です。
const offsetLine = 5;
// アップデート範囲の列数です。
const maxColumn = 26;
// アップデート範囲の行数です。
const maxLine = 8;

// 過去のデータ(日付、メンバーの予定)を削除し、日付を更新します。
function updateSchedule(){

  // ===============================================
  //  対象スプレッドシートのスプレッドシート情報を取得します。
  // ===============================================
  //  参考：https://qiita.com/chihiro/items/3e1d17b78676c6a39d24
  var spreadsheet = SpreadsheetApp.openById('10SB0Vf4404BwiYzSNJm5YKrt-cBwSWz9SBvcW2Ox7cE');
  var sheet = spreadsheet.getSheetByName('Scheduler');

  // ===============================================
  //  先月の内容を一旦クリアします。
  // ===============================================
  // 参考：https://www.yukibnb.com/entry/gas_range_clear
  sheet.getRange(offsetLine,offsetColumn,maxLine,maxColumn).clearContent();

  // ===============================================
  //  来月分のフォーマットにアップデートします。
  // ===============================================
  //  日付情報を入手します。
  //  参考：http://www.googleappsscript.info/2017-07-27/get_now.html
  var kouhobi = new Date();
  kouhobi.setMonth(kouhobi.getMonth() + 1);
  kouhobi.setDate(1);

  //  項目名を書き直します。
  sheet.getRange(offsetLine, offsetColumn+0).setValue("日付");
  sheet.getRange(offsetLine, offsetColumn+1).setValue("曜日");
  sheet.getRange(offsetLine, offsetColumn+2).setValue("開始時間");
  sheet.getRange(offsetLine, offsetColumn+3).setValue("〇");
  sheet.getRange(offsetLine, offsetColumn+4).setValue("△");
  sheet.getRange(offsetLine, offsetColumn+5).setValue("×");
  for(var i=0; i<=19; i++){
    sheet.getRange(offsetLine, i+offsetColumn+6).setValue("名前(未記入)_"+(i+1));
  }

  //  日付と集計結果を初期化します。
  var arrDay = new Array('日', '月', '火', '水', '木', '金', '土');
  var ol = offsetLine + 1;
  for (var i=0; i<=6; i++) {
    sheet.getRange(i+ol, 2).setValue(Utilities.formatDate(kouhobi,"JST","yyyy/MM/dd"));
    sheet.getRange(i+ol, 3).setValue(arrDay[kouhobi.getDay()]);
    sheet.getRange(i+ol, 4).setValue("19:00");
    sheet.getRange(i+ol, 5).setValue("=COUNTIF($H"+(i+ol)+":$Q"+(i+ol)+",\"〇\")"); 
    sheet.getRange(i+ol, 6).setValue("=COUNTIF($H"+(i+ol)+":$Q"+(i+ol)+",\"△\")"); 
    sheet.getRange(i+ol, 7).setValue("=COUNTIF($H"+(i+ol)+":$Q"+(i+ol)+",\"×\")");

    kouhobi.setDate(kouhobi.getDate() + 1);
  }

}
