from django import template
from orders.templates import *
from django.http import HttpResponse
from django.shortcuts import render
from .models import  Category_Food,Food,Size_Food, Toppings,Food_Toppings,Status,Orders, Order_Details

# Create your views here.
def index(request):
    ct_fod = Category_Food.objects.all()
    food = Food.objects.all()
    sz_food = Size_Food.objects.all()
    print(food)
    return render(request, 'index.html',{'Category_Food':ct_fod, 'Food':food, 'size':sz_food})

def orders(request):
    return ""

def menu(request):
    return """"""

def login(request):
    return render(request,"login.html")

def register(request):
    return render(request,"register.html")

def logout(request):
    return render(request,"login.html")

def cart(request):
    return    
    