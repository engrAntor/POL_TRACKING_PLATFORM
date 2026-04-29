from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('superadmin', '0005_alter_superadminnotification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='superadminnotification',
            name='type',
            field=models.CharField(
                choices=[
                    ('new_order', 'New Order Placed'),
                    ('new_user', 'New User Registered'),
                    ('new_ticket', 'New Support Ticket'),
                ],
                max_length=20,
            ),
        ),
    ]
