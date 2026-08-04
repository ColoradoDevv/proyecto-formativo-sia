from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0014_loans_loan_types_alter_loans_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='loandraft',
            name='loan_type',
            field=models.CharField(
                max_length=20,
                choices=[('Interno', 'Interno'), ('Externo', 'Externo')],
                default='Interno',
            ),
            preserve_default=False,
        ),
    ]
