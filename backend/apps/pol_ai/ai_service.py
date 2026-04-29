import os
import json
import re
from datetime import date
from django.conf import settings
from django.db import connection
from django.db.models import Q
from google import genai
from google.genai import types
import numpy as np

try:
    import faiss
except ImportError:
    faiss = None

# Import actual models from main apps
from apps.admin_dashboard.models import POLItem
from apps.marketplace.models import Listing
from .models import AIConversationLog

class FaissManager:
    """
    Manages the FAISS vector index and metadata for semantic search.
    """
    @classmethod
    def get_index_paths(cls, index_type="inventory"):
        # Store indices in a dedicated data directory
        data_dir = os.path.join(settings.BASE_DIR, 'ai_data')
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
            
        if index_type == "marketplace":
            return os.path.join(data_dir, "marketplace_index.faiss"), os.path.join(data_dir, "marketplace_meta.json")
        return os.path.join(data_dir, "inventory_index.faiss"), os.path.join(data_dir, "inventory_meta.json")

    @classmethod
    def get_client(cls):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return None
        return genai.Client(api_key=api_key)

    @classmethod
    def generate_embeddings(cls, texts):
        client = cls.get_client()
        if not client:
            return None
        
        response = client.models.embed_content(
            model='gemini-embedding-001',
            contents=texts,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
        )
        return [item.values for item in response.embeddings]

    @classmethod
    def sync_index(cls, index_type="inventory"):
        """Forces a rebuild of the FAISS index from the database."""
        index_file, metadata_file = cls.get_index_paths(index_type)

        if index_type == "marketplace":
            items = Listing.objects.all()
        else:
            items = POLItem.objects.all()
            
        if not items.exists():
            return f"No {index_type} items to index."

        texts = []
        metadata = []
        for item in items:
            if index_type == "marketplace":
                text = (
                    f"Listing: {item.name}, Company: {item.company}, "
                    f"Type: {item.pol_type}, Category: {item.category}, "
                    f"Price: {item.price} {item.price_unit}, Quantity: {item.quantity} {item.quantity_unit}, "
                    f"Location: {item.location}, Brand: {item.brand}, Status: {item.status}, "
                    f"Description: {item.description}, Expiry: {item.expiry}, Rating: {item.rating}"
                )
                metadata.append({
                    "id": item.id,
                    "user_id": item.user_id,
                    "name": item.name,
                    "company": item.company,
                    "pol_type": item.pol_type,
                    "category": item.category,
                    "price": float(item.price) if item.price else 0,
                    "price_unit": item.price_unit,
                    "quantity": float(item.quantity),
                    "quantity_unit": item.quantity_unit,
                    "location": item.location,
                    "brand": item.brand,
                    "status": item.status,
                    "description": item.description,
                    "rating": float(item.rating) if item.rating else 0
                })
            else:
                text = (
                    f"Product: {item.product_name}, Part: {item.part_number}, "
                    f"Type: {item.pol_type}, UOM: {item.uom}, Quantity: {item.quantity}, "
                    f"Condition: {item.condition}, Expiry: {item.expiry}, "
                    f"Description: {item.description}, MilSpec: {item.mil_spec}, "
                    f"Source: {item.source}, Status: {item.status}, Notes: {item.notes}"
                )
                metadata.append({
                    "id": item.id,
                    "user_id": item.user_id,
                    "product_name": item.product_name,
                    "part_number": item.part_number,
                    "pol_type": item.pol_type,
                    "uom": item.uom,
                    "quantity": float(item.quantity),
                    "condition": item.condition,
                    "expiry": str(item.expiry),
                    "description": item.description,
                    "mil_spec": item.mil_spec,
                    "source": item.source,
                    "status": item.status,
                    "notes": item.notes,
                    "price_per_unit": float(item.price_per_unit)
                })
            texts.append(text)

        embeddings = cls.generate_embeddings(texts)
        if not embeddings:
            return "Failed to generate embeddings."

        dimension = len(embeddings[0])
        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings).astype('float32'))

        faiss.write_index(index, index_file)
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f)

        return f"Successfully indexed {len(texts)} {index_type} items."

    @classmethod
    def search(cls, query, k=5, index_type="inventory", user_id=None):
        """Searches the appropriate FAISS index for the top k similar items."""
        index_file, metadata_file = cls.get_index_paths(index_type)

        if not os.path.exists(index_file) or not os.path.exists(metadata_file):
            # Try to sync if index missing
            cls.sync_index(index_type)
            if not os.path.exists(index_file):
                return []

        client = cls.get_client()
        if not client:
            return []

        query_embedding = client.models.embed_content(
            model='gemini-embedding-001',
            contents=[query],
            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
        ).embeddings[0].values

        index = faiss.read_index(index_file)
        search_k = k * 10 if user_id is not None else k
        D, I = index.search(np.array([query_embedding]).astype('float32'), search_k)

        with open(metadata_file, 'r') as f:
            metadata = json.load(f)

        results = []
        for idx in I[0]:
            if idx != -1 and idx < len(metadata):
                item_meta = metadata[idx]
                if user_id is not None and item_meta.get("user_id") != user_id:
                    continue
                results.append(item_meta)
                if len(results) >= k:
                    break
        
        return results

class FaissRAGService:
    @classmethod
    def ask(cls, user_query: str, user_id: int) -> dict:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {"message": "Gemini API Key missing in environment.", "data": [], "intent": "error"}

        client = genai.Client(api_key=api_key)

        try:
            context_data = FaissManager.search(user_query, k=10, index_type="inventory", user_id=user_id)
            items = POLItem.objects.filter(user_id=user_id)
            total_inventory_count = items.count()

            if not context_data:
                recent = items.order_by('-created_at')[:5]
                context_data = [
                    {
                        "product_name": i.product_name, "part_number": i.part_number, 
                        "pol_type": i.pol_type, "quantity": float(i.quantity), 
                        "status": i.status, "expiry": str(i.expiry)
                    } for i in recent
                ]

            context_text = json.dumps(context_data, indent=2)

            recent_logs = AIConversationLog.objects.filter(assistant_name='lilian_rag', user_id=user_id).order_by('-created_at')[:5]
            history_text = "RECENT CONVERSATION HISTORY:\n"
            if recent_logs.exists():
                for log in reversed(recent_logs):
                    history_text += f"- User: {log.user_query}\n- You: {log.ai_response}\n\n"
            else:
                history_text += "No recent history.\n"

            prompt = f"""
You are Lilian, the Inventory AI for the POL Tracking Platform.
Use the provided SEMANTIC CONTEXT and RECENT CONVERSATION HISTORY to answer the user's question.

SYSTEM FACTS:
- The user currently has exactly {total_inventory_count} total products in their entire inventory.

SEMANTIC CONTEXT:
{context_text}

{history_text}

USER QUESTION: "{user_query}"

INSTRUCTIONS:
- Be helpful, concise, and professional.
- If the user refers to a previous topic, use the history.
- If asked to list products, use a clear format.
- Do NOT mention that you are using FAISS or semantic search.
"""
            response = client.models.generate_content(
                model='gemini-3-flash-preview', # Updated to a more standard model name
                contents=prompt,
            )

            return {
                "message": response.text.strip(),
                "data": context_data,
                "intent": "faiss_rag_query"
            }

        except Exception as e:
            return {
                "message": f"AI Processing Error: {str(e)}",
                "data": [],
                "intent": "error"
            }

class MarketplaceFaissRAGService:
    @classmethod
    def ask(cls, user_query: str, user_id: int) -> dict:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {"message": "Gemini API Key missing in environment.", "data": [], "intent": "error"}

        client = genai.Client(api_key=api_key)

        try:
            context_data = FaissManager.search(user_query, k=10, index_type="marketplace", user_id=user_id)
            items = Listing.objects.filter(user_id=user_id)
            total_marketplace_listings = items.count()

            if not context_data:
                recent = items.order_by('-created_at')[:5]
                context_data = [
                    {
                        "id": i.id, "name": i.name, "company": i.company, "pol_type": i.pol_type,
                        "price": float(i.price) if i.price else 0, "quantity": float(i.quantity),
                        "category": i.category, "status": i.status
                    } for i in recent
                ]

            context_text = json.dumps(context_data, indent=2)

            recent_logs = AIConversationLog.objects.filter(assistant_name='marie_faiss', user_id=user_id).order_by('-created_at')[:5]
            history_text = "RECENT CONVERSATION HISTORY:\n"
            if recent_logs.exists():
                for log in reversed(recent_logs):
                    history_text += f"- User: {log.user_query}\n- You: {log.ai_response}\n\n"
            else:
                history_text += "No recent history.\n"

            prompt = f"""
You are Marie, the Marketplace Assistant for the POL Tracking Platform.
Help users find products for sale or analyze marketplace data.

SYSTEM FACTS:
- The user currently has EXACTLY {total_marketplace_listings} total active listings.

SEMANTIC CONTEXT:
{context_text}

{history_text}

USER QUESTION: "{user_query}"

INSTRUCTIONS:
- If the user wants to BUY, look for listings with category "sell".
- If the user wants to SELL, look for listings with category "buy".
- Compare prices numerically to find the "best" or "cheapest" options.
- Be professional and encouraging.
"""
            response = client.models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
            )

            return {
                "message": response.text.strip(),
                "data": context_data,
                "intent": "marketplace_faiss_rag_query"
            }

        except Exception as e:
            return {
                "message": f"Marketplace AI Error: {str(e)}",
                "data": [],
                "intent": "error"
            }
