function dbg(msg){window.console && console.log && console.log(msg);}

function cmsplayer_ready (element, options)
{
    var playerid = options.playerid;
    var autoplay = options.autoplay;
    var autonext = options.autonext;
    var playlist = options.playlist;
    var playItem = 0;
    var playtime = $("#play_time_"+playerid);
    var totaltime =  $("#total_time_"+playerid);
    element.jPlayer("cssId", "play", "player_play_"+playerid)
    .jPlayer("cssId", "pause", "player_pause_"+playerid)
    .jPlayer("cssId", "stop", "player_stop_"+playerid)
    .jPlayer("cssId", "loadBar", "player_progress_load_bar_"+playerid)
    .jPlayer("cssId", "playBar", "player_progress_play_bar_"+playerid)
    .jPlayer("cssId", "volumeMin", "player_volume_min_"+playerid)
    .jPlayer("cssId", "volumeMax", "player_volume_max_"+playerid)
    .jPlayer("cssId", "volumeBar", "player_volume_bar_"+playerid)
    .jPlayer("cssId", "volumeBarValue", "player_volume_bar_value_"+playerid)
    .jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
        var myPlayedTime = new Date(playedTime);
        var ptMin = (myPlayedTime.getUTCMinutes() < 10) ? "0" + myPlayedTime.getUTCMinutes() : myPlayedTime.getUTCMinutes();
        var ptSec = (myPlayedTime.getUTCSeconds() < 10) ? "0" + myPlayedTime.getUTCSeconds() : myPlayedTime.getUTCSeconds();
        playtime.text(ptMin+":"+ptSec);
    
        var myTotalTime = new Date(totalTime);
        var ttMin = (myTotalTime.getUTCMinutes() < 10) ? "0" + myTotalTime.getUTCMinutes() : myTotalTime.getUTCMinutes();
        var ttSec = (myTotalTime.getUTCSeconds() < 10) ? "0" + myTotalTime.getUTCSeconds() : myTotalTime.getUTCSeconds();
        totaltime.text(ttMin+":"+ttSec);
    }).jPlayer("onSoundComplete", function() {
        element.trigger('cmsplayer_songcomplete', [playlist[playItem]]);
        if(autonext){
            playListNext();
        }
    });
    
    $("#ctrl_prev_"+playerid).click( function() {
        playListPrev();
        return false;
    });
    
    $("#ctrl_next_"+playerid).click( function() {
        playListNext();
        return false;
    });
    
    function displayPlayList() {
        for (i=0; i < playlist.length; i++) {
            song = playlist[i];
            $("#playlist_item_"+playerid+"_"+i).data( "index", i ).hover(
                function() {
                    if (playItem != $(this).data("index")) {
                        $(this).addClass("playlist_hover");
                    }
                },
                function() {
                    $(this).removeClass("playlist_hover");
                }
            ).click( function() {
                var index = $(this).data("index");
                playListChange( index );
            });
        }
    }
    
    function playListInit(autoplay) {
        element.trigger('cmsplayer_init', [playlist[playItem]]);
        if(autoplay) {
            playListChange( playItem );
        } else {
            playListConfig( playItem );
        }
    }
    
    function playListConfig( index ) {
        $("#playlist_item_"+playerid+"_"+playItem).removeClass("playlist_current");
        $("#playlist_item_"+playerid+"_"+index).addClass("playlist_current");
        playItem = index;
        if (playlist[playItem].ogg)
        {
            element.jPlayer("setFile", playlist[playItem].mp3, playlist[playItem].ogg);
        }
        else
        {
            element.jPlayer("setFile", playlist[playItem].mp3);
        }
        element.trigger('cmsplayer_config', [playlist[playItem]]);
    }
    
    function playListChange( index ) {
        playListConfig( index );
        element.jPlayer("play");
        element.trigger('cmsplayer_change', [playlist[playItem]]);
    }
    
    function playListNext() {
        var index = (playItem+1 < playlist.length) ? playItem+1 : 0;
        playListChange( index );
    }
    
    function playListPrev() {
        var index = (playItem-1 >= 0) ? playItem-1 : playlist.length-1;
        playListChange( index );
    }
    
    displayPlayList();
    playListInit(autoplay);
}

(function($) {
    $.fn.cmsPlayer = function(options) {
        if (!options){
            var options = {};
        }
        $.extend(options, {
            ready: cmsplayer_ready(this, options)
        })
        var fulloptions = {
            autoplay: true,
            autonext: true
        };
        $.extend(fulloptions, options);
        if (!fulloptions.playerid || !fulloptions.playlist)
        {
            dbg("[CMSPLAYER] ERROR: playerid and playlist *must* be defined!");
            return this;
        }
        this.jPlayer(fulloptions);
        return this;
    };
})(jQuery);

document.cmsPlayerLoaded = true;