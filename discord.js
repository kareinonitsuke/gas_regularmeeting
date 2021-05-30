function post_discord(message){
    const url        = PropertiesService.getScriptProperties().getProperty("DISCORDURL");
    const token      = PropertiesService.getScriptProperties().getProperty("DISCORDTOKEN");
    const channel    = PropertiesService.getScriptProperties().getProperty("DISCORDCHANNEL");
    const text       = message;
    const username   = '日程調整システム(試運転)';
    const parse      = 'full';
    const method     = 'post';

    const payload = {
        'token'      : token,
        'channel'    : channel,
        "content"    : text,
        'username'   : username,
        'parse'      : parse,
    };

    const params = {
        'method' : method,
        'payload' : payload,
        'muteHttpExceptions': true
    };

   response = UrlFetchApp.fetch(url, params);
}

function discord_test(){
    post_discord("投稿テストです");
}