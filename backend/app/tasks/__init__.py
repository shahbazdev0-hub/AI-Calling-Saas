# backend/app/tasks/__init__.py
from app.tasks.celery import celery_app

__all__ = ['celery_app']
