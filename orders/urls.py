from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu/order/<int:food_id>/<int:category_id>", views.orders, name="order"),
    path("cart/<int:id>", views.cart, name="cart"),
    path("login/", views.login_views, name="login"), 
    path("register/", views.register_views, name="register"), 
    path("logout/", views.logout_views, name="logout"),  
]




