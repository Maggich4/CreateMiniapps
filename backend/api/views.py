from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .catalog_data import PRODUCTS as FALLBACK_PRODUCTS
from .models import Product


def hello(request):
    return JsonResponse({
        "message" : "hello from django kotch",
        "status": "success"
    })


@require_GET
def products(request):
    if Product._meta.db_table in connection.introspection.table_names():
        items = list(
            Product.objects.values(
                'id',
                'name',
                'category',
                'description',
                'price',
                'old_price',
                'emoji',
                'accent_color',
                'is_new',
            )
        )
    else:
        items = [
            {
                **product,
                'id': index,
            }
            for index, product in enumerate(FALLBACK_PRODUCTS, start=1)
        ]

    return JsonResponse(
        [
            {
                **product,
                'price': float(product['price']),
                'old_price': (
                    float(product['old_price']) if product['old_price'] else None
                ),
            }
            for product in items
        ],
        safe=False,
    )