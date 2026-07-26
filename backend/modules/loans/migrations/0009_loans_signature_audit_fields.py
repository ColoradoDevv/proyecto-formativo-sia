from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("loans", "0008_signotp"),
    ]

    operations = [
        migrations.AddField(
            model_name="loans",
            name="signed_ip_responsable",
            field=models.GenericIPAddressField(
                blank=True,
                null=True,
                help_text="IP desde la que firmó el responsable.",
            ),
        ),
        migrations.AddField(
            model_name="loans",
            name="signed_ua_responsable",
            field=models.CharField(
                blank=True,
                max_length=500,
                null=True,
                help_text="User-Agent del navegador al firmar (responsable).",
            ),
        ),
        migrations.AddField(
            model_name="loans",
            name="signed_ip_receptor",
            field=models.GenericIPAddressField(
                blank=True,
                null=True,
                help_text="IP desde la que firmó el receptor.",
            ),
        ),
        migrations.AddField(
            model_name="loans",
            name="signed_ua_receptor",
            field=models.CharField(
                blank=True,
                max_length=500,
                null=True,
                help_text="User-Agent del navegador al firmar (receptor).",
            ),
        ),
    ]
