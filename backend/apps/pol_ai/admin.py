from django.contrib import admin
from .models import AIConversationLog, SupportTicket


@admin.register(AIConversationLog)
class AIConversationLogAdmin(admin.ModelAdmin):
    list_display = ['user_query_short', 'assistant_name', 'intent_detected', 'created_at']
    list_filter = ['assistant_name', 'intent_detected', 'created_at']
    search_fields = ['user_query', 'ai_response']
    readonly_fields = ['user_query', 'ai_response', 'intent_detected', 'created_at', 'assistant_name']

    def user_query_short(self, obj):
        return obj.user_query[:80] + '...' if len(obj.user_query) > 80 else obj.user_query
    user_query_short.short_description = 'User Query'


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'name', 'email', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['ticket_id', 'name', 'email']
    list_editable = ['status']
    readonly_fields = ['ticket_id', 'created_at', 'updated_at']
    ordering = ['-created_at']
