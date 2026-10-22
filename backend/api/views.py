from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Product


def hello(request):
    return JsonResponse({
        "message" : "hello from django kotch",
        "status": "success"
    })


@require_GET
def products(request):
    items = [
        {
            **product,
            'price': float(product['price']),
            'old_price': (
                float(product['old_price']) if product['old_price'] else None
            ),
        }
        for product in Product.objects.values(
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
    ]
    return JsonResponse(items, safe=False)