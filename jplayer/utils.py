from django.conf import settings
from django.template import RequestContext
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.utils.simplejson import dumps

def _safe_json(data):
    return mark_safe(dumps(data))

class PlayerObject(object):
    def __init__(self, playerid, playlist, autoplay, base_path, ogg_support):
        self.id = playerid
        self.get_json_playlist = playlist
        self.get_json_autoplay = autoplay
        self.get_base_path = base_path
        self.get_json_ogg_support = ogg_support
        
    def render(self, request):
        return render_jplayer(self, request)

def build_player(playerid, playlist, autoplay=True, base_path=settings.JPLAYER_BASE_PATH):
    """
    playlist structure:
    
    [
        {
            'title': song title,
            'mp3': song mp3 url,
            'ogg': song ogg url (optional),
            'artist_name': song artist name,
            'artist_url': song artist url (optional),
            'credits_name': song credits name (optional),
            'credits_url': song credits url (optional),
        }
    ]
    """
    oggsupport = _safe_json(all([song.get('ogg', False) for song in playlist]))
    playlist = _safe_json(playlist)
    autoplay = _safe_json(autoplay)
    base_path = _safe_json(base_path)
    return PlayerObject(playerid, playlist, autoplay, base_path, oggsupport)

def render_jplayer(player_object, request):
    return render_to_string('jplayer/player.html', {'player': player_object}, RequestContext(request))

def safe_json(func):
    def decorated(*args, **kwargs):
        return _safe_json(func(*args, **kwargs))
    return decorated