from audioop import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from orders.templates import *
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from .models import Category_Food, Food, Size_Food, Food_Toppings, Orders, Order_Details
from django.db.models import F
from django.contrib import messages


# Create your views here.
def index(request):
    ct_fod = Category_Food.objects.all()
    queryset = (
        Food.objects.select_related("size_food", "category_food")
        .values(
            "id",
            "name_food",
            "description",
            "image_food",
            "size_food__name_size",
            small_price=F("size_food__price_food_small"),
            large_price=F("size_food__price_food_large"),
            category_name=F("category_food__name_category"),
            category_id=F("category_food__id"),
        )
        .order_by("category_food__id")
    )
    return render(request, "index.html",{"Food_Inf":queryset,"Category": ct_fod})

def select_category(request, id):
    ct_fod = Category_Food.objects.all()
    queryset = (
        Food.objects.select_related("size_food", "category_food")
        .values(
            "id",
            "name_food",
            "description",
            "image_food",
            "size_food__name_size",
            small_price=F("size_food__price_food_small"),
            large_price=F("size_food__price_food_large"),
            category_name=F("category_food__name_category"),
            category_id=F("category_food__id"),
        )
        .order_by("category_food__id")
        .filter(category_food__id=id)
    )
    # Convierte el queryset en una lista de diccionarios
    Food_Inf = list(queryset)

    # Devuelve la lista como una respuesta JSON
    return JsonResponse(Food_Inf, safe=False)




def orders(request, food_id, category_id):
    try:
        detalles_comida = Size_Food.objects.get(food_id=food_id)
        food_toppings = (
            Food_Toppings.objects.filter(category_food_id=category_id)
            .select_related("toppings")
            .values(
                "toppings__name_toppings", "toppings_id", "toppings__price_toppings"
            )
        )
    except Size_Food.DoesNotExist:
        response_data = {"message": "Producto no encontrado"}
    else:
        name_food = detalles_comida.food.name_food
        image_food = detalles_comida.food.image_food
        small_price = detalles_comida.price_food_small
        large_price = detalles_comida.price_food_large

        toppings_list = [
            {
                "toppings_id": topping["toppings_id"],
                "name": topping["toppings__name_toppings"],
                "price_toppings": topping["toppings__price_toppings"],
            }
            for topping in food_toppings
        ]

        response_data = {
            "name_food": name_food,
            "image_food": str(image_food),
            "small_price": small_price,
            "large_price": large_price,
            "toppings": toppings_list,
        }

    return JsonResponse(response_data)


def login_views(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f"Bienvenido usuario {username}")
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, "Credenciales invalidas")
    return render(request, "users/login.html")


def register_views(request):
    if request.method == "POST":
        firstname = request.POST.get("firstname")
        lastname = request.POST.get("lastname")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirmpassword = request.POST.get("confirmpassword")

        #! Valida que todos los campos estén llenos
        if (
            not firstname
            or not lastname
            or not username
            or not email
            or not password
            or not confirmpassword
        ):
            messages.error(request, "Por favor, complete todos los campos.")

        #! Valida que las contraseñas coincidan
        if password != confirmpassword:
            messages.error(request, "Las contraseñas no coinciden.")
        #! Crea un nuevo usuario
        try:
            user = User.objects.create_user(
                username=username, email=email, password=password
            )
            user.first_name = firstname
            user.last_name = lastname
            user.save()
            messages.success(request, f"Usuario {user.first_name} Creado exitosamente")
            #! Autentica al usuario después de registrarse
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("home")  #! Redirige a la página de inicio
        except Exception as e:
            messages.error(request, f"No se pudo crear el usuario:{user.first_name} ")

    return render(request, "users/register.html", {"form": UserCreationForm})


def logout_views(request):
    logout(request)
    messages.success(request, "Logged out")
    return render(request, "users/login.html")


def cart(request):
    return


def orders_views(request):
    return """"""
