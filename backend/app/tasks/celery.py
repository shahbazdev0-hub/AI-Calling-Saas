# backend/app/tasks/celery.py - ✅ COMPLETE FILE

from celery import Celery
from celery.schedules import crontab
import os

# Get broker URL from environment
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

# Initialize Celery
celery_app = Celery(
    'callcenter',
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Toronto',  # Canada Eastern Time
    enable_utc=False,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# ✅ SCHEDULE: Run campaign scheduler every hour
celery_app.conf.beat_schedule = {
    'run-campaign-scheduler-every-hour': {
        'task': 'run_campaign_scheduler',
        'schedule': crontab(minute=0),  # Every hour at XX:00
        'options': {
            'expires': 3600,  # Expire after 1 hour
        }
    },
}

# Auto-discover tasks from all installed apps
celery_app.autodiscover_tasks([
    'app.tasks',
])

# Optional: Add task routes for better organization
celery_app.conf.task_routes = {
    'run_campaign_scheduler': {'queue': 'campaigns'},
    'app.tasks.email_tasks.*': {'queue': 'emails'},
    'app.tasks.sms_tasks.*': {'queue': 'sms'},
}

if __name__ == '__main__':
    celery_app.start()