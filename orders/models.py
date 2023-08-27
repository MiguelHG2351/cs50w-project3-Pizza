from django.db import models

#TODO Create your models here

TYPES_ORDER = (
    ('pending', 'Pending'),
    ('accepted', 'Accepted'),
    ('rejected', 'Rejected'),
    ('delivered', 'Delivered'),
)

TYPES_FOOD = (
    ('salad', 'Salad'),
    ('subs', 'Subs'),
    ('dinner', 'Dinner'),
    ('pizza', 'Pizza'),
    ('pasta', 'Pasta'),
)

SIZES = (
    ('small & large', 'Small & Large'),
    ('small', 'Small'),
    ('large', 'Large'),
    ('normal', 'Normal')
)

class Category_Food(models.Model):
    name_category = models.CharField(max_length=255, choices=TYPES_FOOD) #! Aplicacion de la opcion FOOD
    
    def __str__(self):
        return self.name_category

class Food(models.Model):
    name_food = models.CharField(max_length=255)
    description = models.TextField()
    image_food = models.ImageField(upload_to='/orders/img/food', default='')
    size_food = models.CharField(max_length=150, choices=SIZES)  #! Aplicacion de la opcion SIZES
    price_food = models.DecimalField(max_digits=10, decimal_places=2)
    pub_date = models.DateTimeField('date published')
    category_food = models.ForeignKey(Category_Food, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_food

class Toppings(models.Model):
    name_toppings = models.CharField(max_length=255)
    image_toppings = models.ImageField(upload_to='/orders/img/food', default='')
    price_toppings = models.CharField(max_length=50, default='')

    def __str__(self):
        return self.name_toppings

class Food_Toppings(models.Model):
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    toppings = models.ForeignKey(Toppings, on_delete=models.CASCADE)

class Status(models.Model):
    name_status = models.CharField(max_length=255)

    def __str__(self):
        return self.name_status

class Orders(models.Model):
    order_date = models.DateField(auto_now_add=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, choices=TYPES_ORDER)  #! Aplicacion de la opcion ORDER

    def __str__(self):
        return f"Order - Date: {self.order_date}"

class Order_Details(models.Model):
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    orders = models.ForeignKey(Orders, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)

    def __str__(self):
        return f"Order Details - Food: {self.food}, Quantity: {self.quantity}"
