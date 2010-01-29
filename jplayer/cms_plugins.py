from django.utils.translation import ugettext_lazy as _

from cms.plugin_pool import plugin_pool
from cms.plugin_base import CMSPluginBase

from jplayer.models import JPlayerIntermediate

class JPlayerPlugin(CMSPluginBase):
    model = JPlayerIntermediate
    name = _("JPlayer")
    render_template = "jplayer/player.html"
    
    def render(self, context, instance, placeholder):
        context.update({'player': instance.player})
        return context
    
    # include media stuff???
    
plugin_pool.register_plugin(JPlayerPlugin)