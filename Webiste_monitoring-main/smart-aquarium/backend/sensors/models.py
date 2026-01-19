from django.db import models

from django.db import models

class Sensor(models.Model):
    id = models.BigAutoField(primary_key=True)
    suhu = models.FloatField()
    ph = models.FloatField()
    kekeruhan = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
