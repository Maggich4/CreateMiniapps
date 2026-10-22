from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=40)
    description = models.CharField(max_length=220)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    emoji = models.CharField(max_length=8)
    accent_color = models.CharField(max_length=7, default='#e9e3d8')
    is_new = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']
