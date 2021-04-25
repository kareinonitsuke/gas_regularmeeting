function post_discord(message){
    const url        = 'https://discordapp.com/api/webhooks/835343084056346664/axpWPVwAmPEe5ciSMSYbCtZFhA5z7g0z1sbFd-0e68bK7ndcnUjKjWQDJqYb0S8e_O9b';
    const token      = 'axpWPVwAmPEe5ciSMSYbCtZFhA5z7g0z1sbFd-0e68bK7ndcnUjKjWQDJqYb0S8e_O9b';
    const channel    = '#定例会アナウンス';
    const text       = message;
    const username   = 'スケジュール調整システム(試運転)';
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

function test(){
    post_discord("投稿テストです");
}