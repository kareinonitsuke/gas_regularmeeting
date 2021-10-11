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
  PropertiesService.getScriptProperties().setProperty("SURVEYFORMID", "");
  PropertiesService.getScriptProperties().setProperty("SURVEYFORMURL","");
  PropertiesService.getScriptProperties().setProperty("DISCORDMENTION","");
  PropertiesService.getScriptProperties().setProperty("REMINDERANNOUNCETXT","")
  PropertiesService.getScriptProperties().setProperty("REMINDERSUBJECT","")
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
  Logger.log(PropertiesService.getScriptProperties().getProperty("SURVEYFORMID"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("SURVEYFORMURL"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("DISCORDMENTION"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("REMINDERANNOUNCETXT"));
  Logger.log(PropertiesService.getScriptProperties().getProperty("REMINDERSUBJECT"));
}

//集計開始日の設定
function set_survaydate(){
  //あとできれいにする
  const offset = -10;
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(offset);
  ScriptApp.newTrigger("request_answer").timeBased().at(date).create();
}

//offset日後の日時を取得する関数                                                
function get_date(offset_date, based_on_today_date, offset_month, based_on_today_month){
  const date = new Date();//const?
  if(based_on_today_month==1){
    date.setMonth(date.getMonth() + offset_month);
  }
  else{
    date.setMonth(offset_month);
  }

  if(based_on_today_date==1){
    date.setDate(date.getDate() + offset_date);
  }
  else{
    date.setDate(offset_date);
  }
  return date;
}

//offset日後の成形された日時を取得する関数
function get_datestr(offset_date, based_on_today_date, offset_month, based_on_today_month){
  const date = get_date(offset_date, based_on_today_date, offset_month, based_on_today_month);
  const datestr = Utilities.formatDate(date, "JST", "MM/dd");
  return datestr;
}

//funcnameをoffset日後実行するようTriggerを設定する関数
function set_trigger(funcname, offset_date, based_on_today_date, offset_month, based_on_today_month){
  const date = get_date(offset_date, based_on_today_date, offset_month, based_on_today_month);
  ScriptApp.newTrigger(funcname).timeBased().at(date).create();
}

//集計開始の時に呼ぶ関数
function request_answer(){
  //集計用スプレッドシートを初期化
  updateSchedule();

  //集計日数の幅を指定
  const simekiri_offset = 6;
  
  //集計開始日と締め切り日を取得
  const today = get_datestr(0, 1, 0, 1);
  const simekiri = get_datestr(simekiri_offset, 1, 0, 1);

  //結果集計のトリガーを設定
  set_trigger('announce_result', simekiri_offset+1, 1, 0, 1);
  
  //メール本文
  const subject = PropertiesService.getScriptProperties().getProperty("REQUESTANSWERSUBJECT");
  let text = PropertiesService.getScriptProperties().getProperty("REQUESTANSWERTEXT");
  text += `回答期限は${simekiri}です。\n`;
  text += PropertiesService.getScriptProperties().getProperty("SURVEYFORMURL");
  text += "\n"

  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}

//集計締め切りの時に呼ぶ関数
function announce_result(){
  const subject = PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTSUBJECT");
  let text = PropertiesService.getScriptProperties().getProperty("ANNOUNCERESULTTEXT");
  const date = getResultSchedule();

  let kouhobi = get_date(date+1, 0, 1, 1);
  // kouhobi.setMonth(kouhobi.getMonth() + 1);
  // kouhobi.setDate(date+1);
  // let datestr = Utilities.formatDate(kouhobi, "JST", "MM/dd");
  let datestr =get_datestr(kouhobi.getDate(), 0, kouhobi.getMonth(), 0);

  let arrDay = new Array('日', '月', '火', '水', '木', '金', '土');
  let youbi = arrDay[kouhobi.getDay()];

  text += `今月の定例会は${datestr}(${youbi})です。\n`;
  text += PropertiesService.getScriptProperties().getProperty("SURVEYFORMURL");
  text += "\n"
  
  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);

  PropertiesService.getScriptProperties().setProperty("REMINDERANNOUNCETXT",`${datestr}(${youbi})です。\n`)
  // ScriptApp.newTrigger("announce_reminder_bf0").timeBased().at(kouhobi).create();
  set_trigger("announce_reminder_bf0", kouhobi.getDate(), 0, kouhobi.getMonth(), 0);

  // let kouhobi_3before = new Date();
  // kouhobi_3before.setMonth(kouhobi.getMonth());
  // kouhobi_3before.setDate(kouhobi.getDay()+3);
  set_trigger("announce_reminder_bf3", kouhobi.getDate()-3, 0, kouhobi.getMonth(), 0);
  //ScriptApp.newTrigger("announce_reminder_bf3").timeBased().at(kouhobi_3before).create();

  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}

function announce_reminder_bf3(){
  const subject = PropertiesService.getScriptProperties().getProperty("REMINDERSUBJECT");
  const text = "今月の定例会は3日後の"+PropertiesService.getScriptProperties().getProperty("REMINDERANNOUNCETXT");
  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}

function announce_reminder_bf0(){
  const subject = PropertiesService.getScriptProperties().getProperty("REMINDERSUBJECT");
  const text = "今日は定例会当日の"+PropertiesService.getScriptProperties().getProperty("REMINDERANNOUNCETXT");
  //件名と本文を指定してメール送信
  send_email(subject, text);
  //本文を指定してDiscoedに投稿
  post_discord(text);
}