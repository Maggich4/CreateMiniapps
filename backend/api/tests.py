from unittest.mock import patch

from django.test import TestCase

from .catalog_data import PRODUCTS as FALLBACK_PRODUCTS
from .models import Product


class ApiTests(TestCase):
    def test_hello_returns_message_for_frontend(self):
        origin = 'https://main.miniapp-cd3.pages.dev'
        response = self.client.get('/api/hello/', HTTP_ORIGIN=origin)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Access-Control-Allow-Origin'], origin)
        self.assertEqual(
            response.json(),
            {'message': 'hello from django kotch', 'status': 'success'},
        )

    def test_products_returns_catalog_with_cors_header(self):
        Product.objects.create(
            name='Керамическая ваза',
            category='Для дома',
            description='Ручная работа с мягкой матовой фактурой.',
            price='2490.00',
            emoji='🏺',
            accent_color='#e9ded2',
            is_new=True,
        )

        origin = 'https://main.miniapp-cd3.pages.dev'
        response = self.client.get('/api/products/', HTTP_ORIGIN=origin)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Access-Control-Allow-Origin'], origin)
        product = next(
            item
            for item in response.json()
            if item['name'] == 'Керамическая ваза'
        )
        self.assertEqual(product['price'], 2490.0)

    def test_catalog_is_seeded(self):
        response = self.client.get('/api/products/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 6)
        self.assertEqual(response.json()[0]['category'], 'Керамика')

    def test_products_uses_catalog_when_database_table_is_missing(self):
        with patch(
            'api.views.connection.introspection.table_names',
            return_value=[],
        ):
            response = self.client.get('/api/products/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), len(FALLBACK_PRODUCTS))
        self.assertEqual(response.json()[0]['id'], 1)
        self.assertEqual(response.json()[0]['price'], 3290.0)
