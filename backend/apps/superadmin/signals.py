from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.accounts.models import User
from .models import Order, SuperAdminNotification


@receiver(post_save, sender=Order)
def notify_new_order(sender, instance, created, **kwargs):
    if created:
        SuperAdminNotification.objects.create(
            type='new_order',
            title='New Order Placed',
            description=f"Order #{instance.id} — {instance.quantity} {instance.quantity_unit} {instance.product_name} from {instance.user.full_name}",
        )


@receiver(post_save, sender=User)
def notify_new_user(sender, instance, created, **kwargs):
    if created and instance.role == 'admin':
        SuperAdminNotification.objects.create(
            type='new_user',
            title='New User Registered',
            description=f"{instance.email} just created an account",
        )
