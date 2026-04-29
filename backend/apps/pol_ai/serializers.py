from rest_framework import serializers
from .models import AIConversationLog, SupportTicket


class AIQuerySerializer(serializers.Serializer):
    """
    Validates the incoming AI chat request.
    """
    query = serializers.CharField(
        max_length=1000,
        required=True,
        help_text="Natural language question for AI",
        error_messages={
            'required': 'Please provide a query.',
            'blank': 'Query cannot be empty.',
            'max_length': 'Query is too long.',
        }
    )


class AIResponseSerializer(serializers.Serializer):
    """
    Formats the AI response for the frontend.
    """
    message = serializers.CharField()
    data = serializers.JSONField(allow_null=True)
    intent = serializers.CharField()
    count = serializers.IntegerField(required=False)
    query = serializers.CharField(required=False)
    extracted_dates = serializers.DictField(required=False)
    extracted_keywords = serializers.DictField(required=False)


class AIConversationLogSerializer(serializers.ModelSerializer):
    """Serializer for conversation history."""
    class Meta:
        model = AIConversationLog
        fields = ['id', 'user_query', 'ai_response', 'intent_detected', 'created_at', 'assistant_name']
        read_only_fields = ['id', 'created_at']


class SupportTicketSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='ticket_id', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'name', 'email', 'description',
            'status', 'admin_notes', 'action_taken', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'ticket_id', 'status', 'admin_notes', 'created_at', 'updated_at'
        ]


class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['status', 'admin_notes', 'action_taken']
