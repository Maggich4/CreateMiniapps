from django.test import TestCase


class HelloApiTests(TestCase):
    def test_hello_returns_message_for_frontend(self):
        origin = 'https://main.miniapp-cd3.pages.dev'
        response = self.client.get('/api/hello/', HTTP_ORIGIN=origin)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Access-Control-Allow-Origin'], origin)
        self.assertEqual(
            response.json(),
            {'message': 'hello from django kotch', 'status': 'success'},
        )
