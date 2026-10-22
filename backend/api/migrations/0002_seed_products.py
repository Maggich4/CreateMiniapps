from django.db import migrations

from api.catalog_data import PRODUCTS


def seed_products(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    Product.objects.bulk_create([Product(**product) for product in PRODUCTS])


def remove_seeded_products(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    Product.objects.filter(name__in=[product['name'] for product in PRODUCTS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_products, remove_seeded_products),
    ]
