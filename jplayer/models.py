from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from jplayer.utils import safe_json


class JPlayer(models.Model):
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    songs = models.ManyToManyField('jplayer.Song', related_name='players')
    autoplay = models.BooleanField(default=False)
    
    def __unicode__(self):
        return self.name
    
    def get_json_playlist(self):
        if not hasattr(self, '_cached_playlist'):
            self._cached_playlist = safe_json(self.playlist())
        return self._cached_playlist
    
    def playlist(self):
        playlist = []
        ogg_support = self.ogg_support()
        for song in self.songs.all():
            data = {}
            data['title'] = song.title
            data['mp3'] = song.mp3_file.url
            if ogg_support:
                data['ogg'] = song.ogg_file.url
            else:
                data['ogg'] = False
            data['artist_name'] = song.artist.name
            data['artist_url'] = song.artist.url if song.artist.url else False
            data['credits_name'] = song.credits.name if song.credits else False
            data['credits_url'] = song.credits.url if song.credits and song.credits.url else False
            playlist.append(data)
        return playlist
    
    def ogg_support(self):
        return not self.songs.filter(ogg_file__exact='').count()
    
    def get_json_ogg_support(self):
        return safe_json(self.ogg_support())
    
    def get_base_path(self):
        return safe_json('./jplayer/')
    
    def get_json_autoplay(self):
        return safe_json(self.autoplay)

    
class Artist(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    url = models.URLField(blank=True)
    
    def __unicode__(self):
        return self.name
    
    
class Credits(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    url = models.URLField(blank=True)
    
    def __unicode__(self):
        return self.name
    
    
class Song(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, related_name='songs')
    credits = models.ForeignKey(Credits, related_name='songs', blank=True, null=True)
    mp3_file = models.FileField(upload_to='songs/mp3/')
    ogg_file = models.FileField(upload_to='songs/ogg/', blank=True, null=True)
    
    def __unicode__(self):
        return self.title
    


if 'cms' in settings.INSTALLED_APPS:
    from cms.models import CMSPlugin
    class JPlayerIntermediate(CMSPlugin):
        player = models.ForeignKey(JPlayer, verbose_name=_('JPlayer'))
        
        def __unicode__(self):
            return self.player.name