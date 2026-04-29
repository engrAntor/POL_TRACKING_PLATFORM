from django.db import models
from django.conf import settings


class AIConversationLog(models.Model):
    """
    Stores conversation history between users and AI assistants.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='ai_conversation_logs',
    )
    user_query = models.TextField(help_text="The question the user asked")
    ai_response = models.TextField(help_text="The AI's response")
    intent_detected = models.CharField(
        max_length=100,
        blank=True,
        help_text="The intent category detected by the AI"
    )
    assistant_name = models.CharField(
        max_length=50,
        default='lilian',
        help_text="Which AI assistant handled this query (e.g., 'lilian_rag' or 'marie_faiss')"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Q: {self.user_query[:50]}... | Intent: {self.intent_detected}"


class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'), ('in_progress', 'In Progress'), 
        ('resolved', 'Resolved'), ('closed', 'Closed'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    admin_notes = models.TextField(null=True, blank=True)
    action_taken = models.TextField(null=True, blank=True, help_text="Specific actions taken by admin to resolve the ticket")
    ticket_id = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            super().save(*args, **kwargs)
            self.ticket_id = f"TKT-{self.pk:04d}"
            self.save(update_fields=['ticket_id'])
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.ticket_id}] {self.name} - {self.status}"
