from django.db import migrations


PRODUCTS = [
    {
        'name': 'Ваза «Тёплый берег»',
        'category': 'Керамика',
        'description': 'Фактурная керамика ручной работы для любимых веток.',
        'price': '3290.00',
        'old_price': '3890.00',
        'emoji': '🏺',
        'accent_color': '#e8ddd0',
        'is_new': True,
    },
    {
        'name': 'Чашка «Первый свет»',
        'category': 'Керамика',
        'description': 'Уютная чашка для неспешного утреннего кофе.',
        'price': '1490.00',
        'old_price': None,
        'emoji': '☕',
        'accent_color': '#d9c9b4',
        'is_new': False,
    },
    {
        'name': 'Плед «Облако»',
        'category': 'Текстиль',
        'description': 'Мягкий хлопковый плед для тихих вечеров.',
        'price': '4590.00',
        'old_price': None,
        'emoji': '🧶',
        'accent_color': '#d8ded2',
        'is_new': True,
    },
    {
        'name': 'Свеча «После дождя»',
        'category': 'Ароматы',
        'description': 'Ноты кедра и бергамота в натуральном воске.',
        'price': '1890.00',
        'old_price': '2290.00',
        'emoji': '🕯️',
        'accent_color': '#e8d5cf',
        'is_new': False,
    },
    {
        'name': 'Поднос «Тихое утро»',
        'category': 'Для дома',
        'description': 'Лаконичный поднос из светлого натурального дерева.',
        'price': '2790.00',
        'old_price': None,
        'emoji': '🪵',
        'accent_color': '#e7dfc9',
        'is_new': False,
    },
    {
        'name': 'Льняные салфетки',
        'category': 'Текстиль',
        'description': 'Набор из двух салфеток из мягкого натурального льна.',
        'price': '1290.00',
        'old_price': None,
        'emoji': '🧺',
        'accent_color': '#e2ddd2',
        'is_new': False,
    },
]


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
