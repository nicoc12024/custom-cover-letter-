from django.db import models

class PDF(models.Model):
    pdf_file = models.FileField(upload_to='pdfs/')
