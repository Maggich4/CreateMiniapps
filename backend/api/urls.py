
from django.urls import path
from .views import hello, products

urlpatterns = [
    path("hello/", hello),
    path("products/", products),
]