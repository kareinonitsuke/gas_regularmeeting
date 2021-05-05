function set_val(){
  //キーに値を格納する
  PropertiesService.getScriptProperties().setProperty("RECIPIENT", "");
  PropertiesService.getScriptProperties().setProperty("RECIPIENTNAME", "");
  PropertiesService.getScriptProperties().setProperty("REQUESTANSWERSUBJECT", "");
  PropertiesService.getScriptProperties().setProperty("REQUESTANSWERTEXT", "\n");
  PropertiesService.getScriptProperties().setProperty("ANNOUNCERESULTSUBJECT", "");
  PropertiesService.getScriptProperties().setProperty("ANNOUNCERESULTTEXT", "\n");
  PropertiesService.getScriptProperties().setProperty("DISCORDURL", "");
  PropertiesService.getScriptProperties().setProperty("DISCORDTOKEN", "");
  PropertiesService.getScriptProperties().setProperty("DISCORDCHANNEL", "");
  //スクリプトプロパティを取得する
  Logger.log(PropertiesService.getScriptProperties().getProperty("RECIPIENT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("RECIPIENTNAME"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("REQUESTANSWERSUBJECT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("REQUESTANSWERTEXT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTSUBJECT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTTEXT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("DISCORDURL"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("DISCORDTOKEN"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("DISCORDCHANNNEL"));
}

//offset日後の日時を取得する関数                                                
function get_date(offset){
  const date = new Date();//const?
  date.setDate(date.getDate() + offset);
  return date;
}

//offset日後の成形された日時を取得する関数
function get_datestr(offset){
  const date = get_date(offset);
  const datestr = Utilities.formatDate(date, "JST", "MM/dd");
  return datestr;
}

//funcnameをoffset日後実行するようTriggerを設定する関数
function set_trigger(funcname, offset){
  const date = get_date(offset);
  ScriptApp.newTrigger(funcname).timeBased().at(date).create();
}

//集計開始の時に呼ぶ関数
function request_answer(){
  //集計日数の幅を指定
  const simekiri_offset = 6;
  
  //集計開始日と締め切り日を取得
  const today = get_datestr(0);
  const simekiri = get_datestr(simekiri_offset);

  //結果集計のトリガーを設定
  set_trigger('announce_result', simekiri_offset+1);
  
  //メール本文
  const subject = PropertiesService.getScriptProperties().getProperty("REQUESTANSWERSUBJECT");
  let text = PropertiesService.getScriptProperties().getProperty("REQUESTANSWERTEXT");
  text += `回答期限は${simekiri}です。\n`;
  //text += '[url]\n'

  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}

//集計締め切りの時に呼ぶ関数
function announce_result(){
  const subject = PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTSUBJECT");
  const text = PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTTEXT");
  //text += `今月の定例会は〇月〇日です。\n`;

  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}