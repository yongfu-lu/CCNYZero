const tabooWords = ["fuck","shit"];

exports.passTabooWordsCheck = passTabooWordsCheck;


function passTabooWordsCheck(text){
    var count = 0;
    for(var i = 0; i<tabooWords.length; i++){
        var re = new RegExp(tabooWords[i],'g');
        count += (text.match(re) || []).length;
    }
    if(count > 2){
        return false;
    }else{
        for(var i = 0; i<tabooWords.length; i++){
            var re = new RegExp(tabooWords[i],'g');
            text = text.replace(re, '*');
        }
        return text;
    }
}