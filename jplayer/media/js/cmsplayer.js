function cmsplayer_ready (element, playlist, autoplay, playerid)
{
    var playItem = 0;
    
    element.jPlayerId("play", "player_play_"+playerid)
    .jPlayerId("pause", "player_pause_"+playerid)
    .jPlayerId("stop", "player_stop_"+playerid)
    .jPlayerId("loadBar", "player_progress_load_bar_"+playerid)
    .jPlayerId("playBar", "player_progress_play_bar_"+playerid)
    .jPlayerId("volumeMin", "player_volume_min_"+playerid)
    .jPlayerId("volumeMax", "player_volume_max_"+playerid)
    .jPlayerId("volumeBar", "player_volume_bar_"+playerid)
    .jPlayerId("volumeBarValue", "player_volume_bar_value_"+playerid)
    .onProgressChange( function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
        var myPlayedTime = new Date(playedTime);
        var ptMin = (myPlayedTime.getUTCMinutes() < 10) ? "0" + myPlayedTime.getUTCMinutes() : myPlayedTime.getUTCMinutes();
        var ptSec = (myPlayedTime.getUTCSeconds() < 10) ? "0" + myPlayedTime.getUTCSeconds() : myPlayedTime.getUTCSeconds();
        $("#play_time_"+playerid).text(ptMin+":"+ptSec);
    
        var myTotalTime = new Date(totalTime);
        var ttMin = (myTotalTime.getUTCMinutes() < 10) ? "0" + myTotalTime.getUTCMinutes() : myTotalTime.getUTCMinutes();
        var ttSec = (myTotalTime.getUTCSeconds() < 10) ? "0" + myTotalTime.getUTCSeconds() : myTotalTime.getUTCSeconds();
        $("#total_time_"+playerid).text(ttMin+":"+ttSec);
    });

    element.onSoundComplete( function() {
        playListNext();
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
            display = "<li class='song' id='playlist_item_"+playerid+"_'"+i+"'><span class='songname' id='cmsplay_song_'"+i+"'>"+song.name + '</span> - ';
            if (song.artist_url)
            {
                display+=" <a class='artist' href='"+song.artist_url+"'>"+song.artist_name+"</a>";
            }
            else
            {
                display+=" <span class='artist'>"+song.artist_name+"</span>";
            }
            if (song.credits_name)
            {
                if (song.credits_url)
                {
                    display+=" - <a class='credits' href='"+song.credits_url+"'>"+song.credits_name+"</a>";
                }
                else
                {
                    display+=" - <span class='credits'>"+song.credits_name+"</span>";
                }
            }
            $("#playlist_list_"+playerid +" ul").append(display);
            $("#playlist_item_"+playerid+"_"+i).data( "index", i ).hover(
                function() {
                    if (playItem != $(this).data("index")) {
                        $(this).addClass("playlist_hover");
                    }
                },
                function() {
                    $(this).removeClass("playlist_hover");
                }
            )
            $('#cmsplay_song_'+playerid+'_'+i).click( function() {
                var index = $(this).data("index");
                if (playItem != index) {
                    playListChange( index );
                } else {
                    $("#jquery_jplayer_"+playerid).play();
                }
            });
        }
    }
    
    function playListInit(autoplay) {
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
            $("#jquery_jplayer_"+playerid).setFile(playlist[playItem].mp3, myPlayList[playItem].ogg);
        }
        else
        {
            $("#jquery_jplayer_"+playerid).setFile(playlist[playItem].mp3);
        }
    }
    
    function playListChange( index ) {
        playListConfig( index );
        $("#jquery_jplayer_"+playerid).play();
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

jQuery.cmsplayer_ready = cmsplayer_ready;