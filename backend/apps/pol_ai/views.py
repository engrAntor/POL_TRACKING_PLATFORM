from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle, ScopedRateThrottle
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.utils import timezone

from .ai_service import FaissRAGService, MarketplaceFaissRAGService
from .serializers import (
    AIQuerySerializer,
    AIConversationLogSerializer,
    SupportTicketSerializer,
    TicketStatusUpdateSerializer,
)
from .models import AIConversationLog, SupportTicket

class AIChatView(APIView):
    """
    POST /api/ai/chat/ - Interact with Lilian AI
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat'

    def post(self, request):
        serializer = AIQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': 'Invalid request', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        query = serializer.validated_data['query']
        user_id = request.user.id

        try:
            ai_response = FaissRAGService.ask(query, user_id=user_id)
            AIConversationLog.objects.create(
                user=request.user,
                user_query=query,
                ai_response=ai_response['message'],
                intent_detected=ai_response.get('intent', 'unknown'),
                assistant_name='lilian_rag',
            )
            return Response({'success': True, **ai_response})
        except Exception as e:
            return Response({'success': False, 'error': 'AI error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MarketplaceChatView(APIView):
    """
    POST /api/ai/marketplace-chat/ - Interact with Marie AI
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat'

    def get(self, request):
        return Response({
            "success": True,
            "message": "I am Marie. I can help you find best buyers/sellers in the marketplace.",
            "data": [],
            "intent": "greeting"
        })

    def post(self, request):
        serializer = AIQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': 'Invalid request', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        query = serializer.validated_data['query']
        user_id = request.user.id

        try:
            ai_response = MarketplaceFaissRAGService.ask(query, user_id=user_id)
            AIConversationLog.objects.create(
                user=request.user,
                user_query=query,
                ai_response=ai_response['message'],
                intent_detected=ai_response.get('intent', 'unknown'),
                assistant_name='marie_faiss',
            )
            return Response({'success': True, **ai_response})
        except Exception as e:
            return Response({'success': False, 'error': 'AI error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIConversationHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AIConversationLogSerializer

    def get_queryset(self):
        assistant = self.kwargs.get('assistant')
        return AIConversationLog.objects.filter(assistant_name=assistant, user=self.request.user).order_by('-created_at')[:50]


class SupportTicketCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tickets = SupportTicket.objects.filter(email=request.user.email).order_by('-created_at')
        serializer = SupportTicketSerializer(tickets, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        serializer = SupportTicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        ticket = serializer.save()
        
        # Notify superadmins (simplified since we're in the same DB now)
        try:
            from apps.superadmin.models import SuperAdminNotification
            SuperAdminNotification.objects.create(
                type='new_ticket',
                title="New Support Ticket",
                description=f"User {ticket.email} submitted a new issue: {ticket.ticket_id}."
            )
        except Exception as e:
            print(f"Failed to notify super admins: {e}")

        return Response({
            'success': True,
            'message': f'Ticket submitted. ID: {ticket.ticket_id}',
            'ticket_id': ticket.ticket_id,
            'data': SupportTicketSerializer(ticket).data,
        }, status=status.HTTP_201_CREATED)


class AdminTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id=None):
        if ticket_id:
            try:
                ticket = SupportTicket.objects.get(ticket_id=ticket_id)
                return Response({'success': True, 'data': SupportTicketSerializer(ticket).data})
            except SupportTicket.DoesNotExist:
                return Response({'success': False, 'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)
        
        qs = SupportTicket.objects.all()
        serializer = SupportTicketSerializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def patch(self, request, ticket_id=None):
        try:
            ticket = SupportTicket.objects.get(ticket_id=ticket_id)
        except SupportTicket.DoesNotExist:
            return Response({'success': False, 'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TicketStatusUpdateSerializer(ticket, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        was_resolved = ticket.status == 'resolved'
        ticket = serializer.save()
        
        if ticket.status == 'resolved' and not was_resolved:
            # Notify user
            try:
                from apps.accounts.models import User
                from apps.admin_dashboard.models import Notification
                user = User.objects.filter(email=ticket.email).first()
                if user:
                    Notification.objects.create(
                        user=user,
                        title="Issue Resolved",
                        message=f"Your support ticket ({ticket.ticket_id}) has been Resolved."
                    )
            except Exception as e:
                print(f"Failed to notify user: {e}")

        return Response({'success': True, 'data': SupportTicketSerializer(ticket).data})
