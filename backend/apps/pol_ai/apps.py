from django.apps import AppConfig


class PolAiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.pol_ai'
    verbose_name = 'Lilian AI - Inventory Intelligence'

    def ready(self):
        try:
            import apps.pol_ai.signals
        except ImportError:
            pass
