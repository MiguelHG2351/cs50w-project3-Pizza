from audioop import reverse
from collections import UserDict
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from orders.templates import *
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from .models import  Category_Food,Food,Size_Food, Toppings,Food_Toppings,Orders, Order_Details
from django.db.models import F, Value
from django.db.models.functions import Concat

# Create your views here.
def index(request):
    ct_fod = Category_Food.objects.all()
    #food = Food.objects.all()
    queryset = Food.objects.select_related(
    'size_food', 'category_food'
    ).values(
        'id', 'name_food', 'description', 'image_food',
        'size_food__name_size', 
        small_price=F('size_food__price_food_small'),
        large_price=F('size_food__price_food_large'),
        category_name=F('category_food__name_category'),
        category_id=F('category_food__id'),
    )
    
    print(queryset)
    return render(request, 'index.html',{'Food_Inf':queryset, 'Category':ct_fod})


def orders(request, food_id, category_id):
    try:
        detalles_comida = Size_Food.objects.get(food_id=food_id)
        food_toppings = Food_Toppings.objects.filter(category_food_id=category_id).select_related('toppings').values('toppings__name_toppings')
    except Size_Food.DoesNotExist:
        response_data = {'message': 'Producto no encontrado'}
    else:
        name_food = detalles_comida.food.name_food
        image_food = detalles_comida.food.image_food
        small_price = detalles_comida.price_food_small
        large_price = detalles_comida.price_food_large

        toppings_list = [topping['toppings__name_toppings'] for topping in food_toppings]

        response_data = {
            'name_food': name_food,
            'image_food': image_food.url,
            'small_price': small_price,
            'large_price': large_price,
            'toppings': toppings_list,
        }

    return JsonResponse(response_data)

def menu_views(request):
    return """"""

def login_views(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user =  authenticate(request,username=username,password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request,"users/login.html",{"message":"Invalid credentials"})

def register_views(request):
    if request.method == "POST":
        firstname = request.POST.get("firstname")
        lastname = request.POST.get("lastname")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirmpassword = request.POST.get("confirmpassword")

        #! Valida que todos los campos estén llenos
        if not firstname or not lastname or not username or not email or not password or not confirmpassword:
            return render(request, "register.html", {"error_message": "Por favor, complete todos los campos."})

        #! Valida que las contraseñas coincidan
        if password != confirmpassword:
            return render(request, "register.html", {"error_message": "Las contraseñas no coinciden."})

        #! Crea un nuevo usuario
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = firstname
            user.last_name = lastname
            user.save()
            #! Autentica al usuario después de registrarse
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("home")  #! Redirige a la página de inicio
        except Exception as e:
            return render(request, "register.html", {"error_message": f"No se pudo crear el usuario: {str(e)}"})

    return render(request, "register.html")


def logout_views(request):
    logout(request)
    return render(request,"users/login.html",{"message":"Logged out"})

def cart(request):
    return    
    