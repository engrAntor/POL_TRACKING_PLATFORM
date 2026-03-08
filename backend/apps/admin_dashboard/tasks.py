from django.utils import timezone


def generate_expiry_alerts(user):
    """
    Scan POL items for a user and create Notification records
    for expired / near-expiry items. No emails sent.
    """
    from .models import POLItem, Notification

    today = timezone.now().date()
    items = POLItem.objects.filter(
        user=user,
        expiry_status__in=['expired', 'near_expiry'],
    )

    created_count = 0
    for item in items:
        days_left = (item.expiry - today).days
        title = f"EXPIRY ALERT: {item.product_name}"
        message = (
            f"Automated notice: Your stock of {item.product_name} "
            f"expires in {days_left} days ({item.expiry}). "
            f"Please plan for replenishment."
        )

        # Avoid duplicate alerts for the same item on the same day
        already_exists = Notification.objects.filter(
            user=user,
            title=title,
            created_at__date=today,
        ).exists()
        if already_exists:
            continue

        Notification.objects.create(
            user=user,
            title=title,
            message=message,
            status='alert',
        )
        created_count += 1

    return created_count
