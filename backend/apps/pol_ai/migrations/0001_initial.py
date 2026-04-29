import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SupportTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('resolved', 'Resolved'), ('closed', 'Closed')], default='open', max_length=20)),
                ('admin_notes', models.TextField(blank=True, null=True)),
                ('action_taken', models.TextField(blank=True, help_text='Specific actions taken by admin to resolve the ticket', null=True)),
                ('ticket_id', models.CharField(blank=True, max_length=20, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='AIConversationLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ai_conversation_logs', to=settings.AUTH_USER_MODEL)),
                ('user_query', models.TextField(help_text='The question the user asked')),
                ('ai_response', models.TextField(help_text="The AI's response")),
                ('intent_detected', models.CharField(blank=True, help_text='The intent category detected by the AI', max_length=100)),
                ('assistant_name', models.CharField(default='lilian', help_text="Which AI assistant handled this query (e.g., 'lilian_rag' or 'marie_faiss')", max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
