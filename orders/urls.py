from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu/", views.menu, name="menu"),  
    path("menu/order/<int:food_id>", views.orders, name="order"),
    path("cart/<int:id>", views.cart, name="cart"),
    path("login/", views.login, name="login"), 
    path("register/", views.register, name="register"), 
    path("logout/", views.logout, name="logout"),  
]




