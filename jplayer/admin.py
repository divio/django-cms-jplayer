from django.contrib.admin.sites import site
from models import JPlayer, Song, Artist, Credits

site.register(JPlayer)
site.register(Song)
site.register(Artist)
site.register(Credits)