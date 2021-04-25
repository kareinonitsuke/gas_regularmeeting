//件名と本文を渡すとメール送信する関数
function send_email(subject, text){
    const recipient = PropertiesService.getScriptProperties().getProperty("RECIPIENT");
    const options = {name: 'スケジュール調整システム'};
    const recipientname = PropertiesService.getScriptProperties().getProperty("RECIPIENTNAME");
    const body = `${recipientname}\n\n${text}`;
  
    GmailApp.sendEmail(recipient, subject, body, options);
  }
  