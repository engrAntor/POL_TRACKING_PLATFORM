from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.admin_dashboard.models import POLItem
from apps.marketplace.models import Listing
from .ai_service import FaissManager
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=POLItem)
@receiver(post_delete, sender=POLItem)
def auto_sync_inventory_faiss(sender, instance, **kwargs):
    """
    Automatically triggers a FAISS index sync for inventory.
    """
    try:
        result = FaissManager.sync_index(index_type="inventory")
        logger.info(f"FAISS Inventory Auto-Sync: {result}")
    except Exception as e:
        logger.error(f"FAISS Inventory Auto-Sync Error: {str(e)}")

@receiver(post_save, sender=Listing)
@receiver(post_delete, sender=Listing)
def auto_sync_marketplace_faiss(sender, instance, **kwargs):
    """
    Automatically triggers a FAISS index sync for marketplace.
    """
    try:
        result = FaissManager.sync_index(index_type="marketplace")
        logger.info(f"FAISS Marketplace Auto-Sync: {result}")
    except Exception as e:
        logger.error(f"FAISS Marketplace Auto-Sync Error: {str(e)}")
