# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Toilet'
        db.create_table(u'toilet_toilet', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('male', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('female', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('date', self.gf('django.db.models.fields.DateTimeField')()),
            ('creator', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('numberOfReviews', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('rating', self.gf('django.db.models.fields.DecimalField')(default=5.0, max_digits=11, decimal_places=10)),
            ('lat', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=10, decimal_places=6)),
            ('lng', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=10, decimal_places=6)),
        ))
        db.send_create_signal(u'toilet', ['Toilet'])

        # Adding model 'Flag'
        db.create_table(u'toilet_flag', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.TextField')(unique=True)),
            ('explanation', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'toilet', ['Flag'])

        # Adding model 'FlagRanking'
        db.create_table(u'toilet_flagranking', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('flag', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['toilet.Flag'])),
            ('toilet', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['toilet.Toilet'])),
            ('up_down_vote', self.gf('django.db.models.fields.SmallIntegerField')(null=True)),
        ))
        db.send_create_signal(u'toilet', ['FlagRanking'])

        # Adding model 'FlagVote'
        db.create_table(u'toilet_flagvote', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('flag', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['toilet.Flag'])),
            ('toilet', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['toilet.Toilet'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('vote', self.gf('django.db.models.fields.SmallIntegerField')()),
        ))
        db.send_create_signal(u'toilet', ['FlagVote'])


    def backwards(self, orm):
        # Deleting model 'Toilet'
        db.delete_table(u'toilet_toilet')

        # Deleting model 'Flag'
        db.delete_table(u'toilet_flag')

        # Deleting model 'FlagRanking'
        db.delete_table(u'toilet_flagranking')

        # Deleting model 'FlagVote'
        db.delete_table(u'toilet_flagvote')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'toilet.flag': {
            'Meta': {'object_name': 'Flag'},
            'explanation': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {'unique': 'True'})
        },
        u'toilet.flagranking': {
            'Meta': {'object_name': 'FlagRanking'},
            'flag': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['toilet.Flag']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'toilet': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['toilet.Toilet']"}),
            'up_down_vote': ('django.db.models.fields.SmallIntegerField', [], {'null': 'True'})
        },
        u'toilet.flagvote': {
            'Meta': {'object_name': 'FlagVote'},
            'flag': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['toilet.Flag']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'toilet': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['toilet.Toilet']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'vote': ('django.db.models.fields.SmallIntegerField', [], {})
        },
        u'toilet.toilet': {
            'Meta': {'object_name': 'Toilet'},
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'female': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '10', 'decimal_places': '6'}),
            'lng': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '10', 'decimal_places': '6'}),
            'male': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'numberOfReviews': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'rating': ('django.db.models.fields.DecimalField', [], {'default': '5.0', 'max_digits': '11', 'decimal_places': '10'})
        }
    }

    complete_apps = ['toilet']