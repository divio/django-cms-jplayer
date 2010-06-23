# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'JPlayer'
        db.create_table('jplayer_jplayer', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
            ('autoplay', self.gf('django.db.models.fields.BooleanField')(default=False, blank=True)),
        ))
        db.send_create_signal('jplayer', ['JPlayer'])

        # Adding M2M table for field songs on 'JPlayer'
        db.create_table('jplayer_jplayer_songs', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('jplayer', models.ForeignKey(orm['jplayer.jplayer'], null=False)),
            ('song', models.ForeignKey(orm['jplayer.song'], null=False))
        ))
        db.create_unique('jplayer_jplayer_songs', ['jplayer_id', 'song_id'])

        # Adding model 'Artist'
        db.create_table('jplayer_artist', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal('jplayer', ['Artist'])

        # Adding model 'Credits'
        db.create_table('jplayer_credits', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal('jplayer', ['Credits'])

        # Adding model 'Song'
        db.create_table('jplayer_song', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(related_name='songs', to=orm['jplayer.Artist'])),
            ('credits', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='songs', null=True, to=orm['jplayer.Credits'])),
            ('mp3_file', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('ogg_file', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal('jplayer', ['Song'])

        # Adding model 'JPlayerIntermediate'
        db.create_table('cmsplugin_jplayerintermediate', (
            ('cmsplugin_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['cms.CMSPlugin'], unique=True, primary_key=True)),
            ('player', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['jplayer.JPlayer'])),
        ))
        db.send_create_signal('jplayer', ['JPlayerIntermediate'])


    def backwards(self, orm):
        
        # Deleting model 'JPlayer'
        db.delete_table('jplayer_jplayer')

        # Removing M2M table for field songs on 'JPlayer'
        db.delete_table('jplayer_jplayer_songs')

        # Deleting model 'Artist'
        db.delete_table('jplayer_artist')

        # Deleting model 'Credits'
        db.delete_table('jplayer_credits')

        # Deleting model 'Song'
        db.delete_table('jplayer_song')

        # Deleting model 'JPlayerIntermediate'
        db.delete_table('cmsplugin_jplayerintermediate')


    models = {
        'cms.cmsplugin': {
            'Meta': {'object_name': 'CMSPlugin'},
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '5', 'db_index': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.CMSPlugin']", 'null': 'True', 'blank': 'True'}),
            'placeholder': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.Placeholder']", 'null': 'True'}),
            'plugin_type': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'publisher_is_draft': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True', 'blank': 'True'}),
            'publisher_public': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'publisher_draft'", 'unique': 'True', 'null': 'True', 'to': "orm['cms.CMSPlugin']"}),
            'publisher_state': ('django.db.models.fields.SmallIntegerField', [], {'default': '0', 'db_index': 'True'}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'cms.placeholder': {
            'Meta': {'object_name': 'Placeholder'},
            'default_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slot': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'jplayer.artist': {
            'Meta': {'object_name': 'Artist'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'jplayer.credits': {
            'Meta': {'object_name': 'Credits'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'jplayer.jplayer': {
            'Meta': {'object_name': 'JPlayer'},
            'autoplay': ('django.db.models.fields.BooleanField', [], {'default': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'songs': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'players'", 'symmetrical': 'False', 'to': "orm['jplayer.Song']"})
        },
        'jplayer.jplayerintermediate': {
            'Meta': {'object_name': 'JPlayerIntermediate', 'db_table': "'cmsplugin_jplayerintermediate'", '_ormbases': ['cms.CMSPlugin']},
            'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'}),
            'player': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['jplayer.JPlayer']"})
        },
        'jplayer.song': {
            'Meta': {'object_name': 'Song'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'songs'", 'to': "orm['jplayer.Artist']"}),
            'credits': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'songs'", 'null': 'True', 'to': "orm['jplayer.Credits']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mp3_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'ogg_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['jplayer']
