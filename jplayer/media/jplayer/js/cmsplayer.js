(function($) {
    function dbg(msg){window.console && console.log && console.log(msg);}

    function cmsplayer_ready (element, options)
    {
        element.data('cmsplayer.playlist', options.playlist);
        function get_playlist(){
            return element.data('cmsplayer.playlist');
        }
        var playerid = options.playerid;
        var autoplay = options.autoplay;
        var autonext = options.autonext;
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
            element.trigger('cmsplayer_songcomplete', [get_playlist()[playItem]]);
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
            var playlist = get_playlist();
            for (i=0; i < playlist.length; i++) {
                song = playlist[i];
                $("#playlist_item_"+playerid+"_"+i).data("cmsplayer.index", i).hover(
                    function() {
                        if (playItem != $(this).data("cmsplayer.index")) {
                            $(this).addClass("playlist_hover");
                        }
                    },
                    function() {
                        $(this).removeClass("playlist_hover");
                    }
                ).click( function() {
                    var index = $(this).data("cmsplayer.index");
                    playListChange(index);
                });
            }
        }
        element.data('cmsplayer.displayPlayList', displayPlayList);
        
        function playListInit(autoplay) {
            element.trigger('cmsplayer_init', [get_playlist()[playItem]]);
            if(autoplay) {
                playListChange(playItem);
            } else {
                playListConfig(playItem);
            }
        }
        element.data('cmsplayer.playListInit', playListInit);
        
        function playListConfig(index) {
            $("#playlist_item_"+playerid+"_"+playItem).removeClass("playlist_current");
            $("#playlist_item_"+playerid+"_"+index).addClass("playlist_current");
            playItem = index;
            var playlist = get_playlist();
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
        element.data('cmsplayer.playListConfig', playListConfig);
        
        function playListChange( index ) {
            playListConfig( index );
            element.jPlayer("play");
            element.trigger('cmsplayer_change', [get_playlist()[playItem]]);
        }
        
        function playListNext() {
            var index = (playItem+1 < get_playlist().length) ? playItem+1 : 0;
            playListChange( index );
        }
        element.data('cmsplayer.playListNext', playListNext);
        
        function playListPrev() {
            var index = (playItem-1 >= 0) ? playItem-1 : get_playlist().length-1;
            playListChange( index );
        }
        element.data('cmsplayer.playListPrev', playListPrev);
        
        function init(){
            playItem = 0;
            displayPlayList();
            playListInit(autoplay);
        }
        element.data('cmsplayer.init', init);
        
        function replacePlaylist(new_playlist){
            element.data('cmsplayer.playlist', new_playlist);
        }
        element.data('cmsplayer.replacePlaylist', replacePlaylist);
        
        function getPlayItem(){
            return playItem;
        }
        element.data('cmsplayer.getPlayItem', getPlayItem);

        init();
    }
    $.fn.cmsPlayer = function(options) {
        var das = $(this);
        if (typeof options == 'string')
        {
            var args = Array.prototype.slice.call(arguments, 1);
            var func = das.data('cmsplayer.' + options);
            if (func){
                func(args);
            } else {
                das.jPlayer(options, args);
            }
        } else {
            if (!options){
                var options = {};
            }
            $.extend(options, {
                ready: function(){cmsplayer_ready(das, options)}
            });
            var fulloptions = {
                autoplay: true,
                autonext: true
            };
            $.extend(fulloptions, options);
            if (!fulloptions.playerid || !fulloptions.playlist)
            {
                dbg("[CMSPLAYER] ERROR: playerid and playlist *must* be defined!");
                return das;
            }
            $(das).jPlayer(fulloptions);
        }
        return das;
    };
})(jQuery);

document.cmsPlayerLoaded = true;