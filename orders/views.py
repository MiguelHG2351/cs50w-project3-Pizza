from django import template
from orders.templates import *
from django.http import HttpResponse
from django.shortcuts import render
from .models import  Category_Food,Food,Size_Food, Toppings,Food_Toppings,Orders, Order_Details
from django.db.models import F, Value
from django.db.models.functions import Concat

# Create your views here.
def index(request):
    ct_fod = Category_Food.objects.all()
    #food = Food.objects.all()
    sz_food = Size_Food.objects.all()
    toppings = Toppings.objects.all()
    
    queryset = Food.objects.select_related(
    'size_food', 'category_food'
    ).values(
        'id', 'name_food', 'description', 'image_food',
        'size_food__name_size', 
        small_price=F('size_food__price_food_small'),
        large_price=F('size_food__price_food_large'),
        category_name=F('category_food__name_category')
    )
    
    # Asegúrate de usar los nombres correctos de las relaciones
    print(queryset)
    return render(request, 'index.html',{'Food_Inf':queryset, 'Category':ct_fod,'Toppings':toppings,'Size':sz_food})

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
    