from django import template
register = template.Library()

def render_jplayer(context, player):
    return {'player': player}
register.inclusion_tag('jplayer/player.html', takes_context=True)(render_jplayer)