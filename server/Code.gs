// Deploy as a web app: execute as yourself, access Anyone.
// Set Script Properties: CONTACT_TO=info@kitotoki.jp, CONTACT_ENABLED=true
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var p = e && e.parameter || {};
  function result(title, message) {
    return HtmlService.createHtmlOutput('<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>木ととき｜お問い合わせ</title></head><body style="margin:0;padding:40px 24px;background:#f8f5ed;color:#293c32;font:16px/1.9 sans-serif"><main style="max-width:600px;margin:auto"><p>木ととき</p><h1 style="font-size:24px">' + title + '</h1><p>' + message + '</p><p>元の画面に戻るには、このタブを閉じてください。</p></main></body></html>');
  }
  if (props.getProperty('CONTACT_ENABLED') !== 'true') return result('受付準備中です', '現在、お問い合わせ受付の準備中です。');
  if (p.website) return result('送信できませんでした', '入力内容をご確認ください。');
  var required = ['name', 'email', 'area', 'message'];
  if (required.some(function(k){return !p[k] || !p[k].trim();}) || p.consent !== 'on' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '')) return result('入力内容をご確認ください', '必須項目とメールアドレス、同意欄をご確認ください。');
  var limits = {name:120,email:254,tel:50,area:200,service:100,message:5000};
  if (Object.keys(limits).some(function(k){return (p[k] || '').length > limits[k];}) || /[\r\n]/.test(p.email)) return result('送信できませんでした', '入力文字数またはメールアドレスをご確認ください。');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return result('ただいま混み合っています', '時間をおいて、もう一度送信してください。');
  try {
    var to = props.getProperty('CONTACT_TO');
    if (!to || MailApp.getRemainingDailyQuota() < 1) throw new Error('Unavailable');
    // Global cap limits mail abuse. Does not retain inquiry contents in storage.
    var day = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
    var count = props.getProperty('CONTACT_DAY') === day ? Number(props.getProperty('CONTACT_COUNT') || 0) : 0;
    if (count >= 30) return result('本日の受付上限に達しました', '恐れ入りますが、日を改めてお送りください。');
    MailApp.sendEmail({to:to,replyTo:p.email,subject:'【木ととき】ホームページからのお問い合わせ',body:'お名前：'+p.name+'\nメール：'+p.email+'\n電話：'+(p.tel||'未記入')+'\n地域：'+p.area+'\n作業：'+(p.service||'未選択')+'\n\n'+p.message});
    props.setProperties({CONTACT_DAY:day,CONTACT_COUNT:String(count+1)});
    return result('お問い合わせを受け付けました', '内容を確認のうえ、担当よりご連絡します。自動返信メールは送信していません。');
  } catch (error) {
    return result('送信を確認できませんでした', '元の画面の入力内容は残っています。時間をおいてお試しください。繰り返し送信する場合、重複して届く可能性があります。');
  } finally { lock.releaseLock(); }
}
