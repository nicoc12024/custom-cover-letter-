from django.urls import path
from .views import ExtractPDFView

urlpatterns = [
    path('api/extract/', ExtractPDFView.as_view(), name='extract-pdf'),
]
