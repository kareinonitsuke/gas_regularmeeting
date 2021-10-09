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
  const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SURVEYFORMID"));
  const sheet = spreadsheet.getSheetByName('Scheduler');

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
  let kouhobi = new Date();
  kouhobi.setMonth(kouhobi.getMonth() + 1);
  kouhobi.setDate(1);

  //  項目名を書き直します。
  sheet.getRange(offsetLine, offsetColumn+0).setValue("日付");
  sheet.getRange(offsetLine, offsetColumn+1).setValue("曜日");
  sheet.getRange(offsetLine, offsetColumn+2).setValue("開始時間");
  sheet.getRange(offsetLine, offsetColumn+3).setValue("LT");
  sheet.getRange(offsetLine, offsetColumn+4).setValue("〇");
  sheet.getRange(offsetLine, offsetColumn+5).setValue("×");
  for(let i=0; i<=19; i++){
    sheet.getRange(offsetLine, i+offsetColumn+6).setValue("名前(未記入)_"+(i+1));
  }

  //  日付と集計結果を初期化します。
  const arrDay = new Array('日', '月', '火', '水', '木', '金', '土');
  const ol = offsetLine + 1;
  for (var i=0; i<=6; i++) {
    sheet.getRange(i+ol, 2).setValue(Utilities.formatDate(kouhobi,"JST","yyyy/MM/dd"));
    sheet.getRange(i+ol, 3).setValue(arrDay[kouhobi.getDay()]);
    sheet.getRange(i+ol, 4).setValue("19:00");
    sheet.getRange(i+ol, 5).setValue("=COUNTIF($H"+(i+ol)+":$AA"+(i+ol)+",\"LT\")"); 
    sheet.getRange(i+ol, 6).setValue("=COUNTIF($H"+(i+ol)+":$AA"+(i+ol)+",\"〇\")"); 
    sheet.getRange(i+ol, 7).setValue("=COUNTIF($H"+(i+ol)+":$AA"+(i+ol)+",\"×\")");

    kouhobi.setDate(kouhobi.getDate() + 1);
  }

}

function getResultSchedule(){
  // ===============================================
  //  対象スプレッドシートのスプレッドシート情報を取得します。
  // ===============================================
  //  参考：https://qiita.com/chihiro/items/3e1d17b78676c6a39d24
  const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SURVEYFORMID"));
  const sheet = spreadsheet.getSheetByName('Scheduler');

  const ol = offsetLine + 1;
  let max_maru = 0;
  let max_lt = 0;
  let dateFlg = 0; 

  result = sheet.getRange("E6:G12").getValues();
  Logger.log(result);
  for (let i=0; i<=6; i++) {
    if((max_maru+max_lt)<(result[i][0]+result[i][1])){
      max_lt = result[i][0];
      max_maru = result[i][1];
      dateFlg = i;
    }
    else if(((max_lt+max_maru)==(result[i][0]+result[i][1]))&&(max_lt<=result[i][0])){
      max_lt = result[i][0];
      max_maru = result[i][1];
      dateFlg = i;
    }
  }
  Logger.log(dateFlg);
  return dateFlg;
}