// ==UserScript==
// @name         CSGOSkins market extension
// @namespace    https://raw.github.com/Xbaal/CSGOSkins-market-extension/
// @version      0.1
// @description  displaying which bots have a specific item as tooltip
// @author       Xbaal
// @match        http://s7.csgoskins.net/clutch-boss/market/*
// @updateURL		 https://raw.github.com/Xbaal/CSGOSkins-market-extension/CSGOSkins_market_extension.user.js
// @downloadURL  https://raw.github.com/Xbaal/CSGOSkins-market-extension/CSGOSkins_market_extension.user.js		
// @grant        none
// ==/UserScript==

//checking with interval if there are new items on the market
searchInterval = setInterval(function(){
    var elements = $("a[href^='http://steamcommunity.com/market/listings/730/']").parent().not(".tooltipExtend");
    if(!elements.length) return;
    elements.mouseenter(function(){
        //bots: steamID -> ClutchBoss-number
				var bots = {};
        Bot.find().fetch().forEach(function(bot,i){
            bots[bot._id] = +i + 1;
        });
        $('body').append("<div id='hoveringTooltip' style='position:fixed;background:white'></div>");
        var name = $(this).find("a").attr("href").split("/730/")[1];
        Session.get("market").items.some(function(item){
            if(item.hash==name){
                var botCount = {};
                item.items.forEach(function(info){ 
                    var id=bots[info.steam_id];
                    if(id) botCount[id] = (+botCount[id]||0) + 1; 
                });
                $('#hoveringTooltip').html(Object.keys(botCount).map(function(botNr){return "BOT #"+botNr+(botCount[botNr]>1?" (x"+botCount[botNr]+")":"")}).join("<br>"));
                return true;
            }
        });
        $('#hoveringTooltip').css({
            "top" : $(this).offset().top - $(window).scrollTop() + 105,
            "left" : $(this).offset().left - $(window).scrollLeft() + 5
        });
    });
    elements.mouseleave(function(){
        $('#hoveringTooltip').remove();
    });
    elements.addClass("tooltipExtend");
},200);