from datetime import datetime
import random
class Product():
    def __init__(self, name, price, deal_price,rating):
        self.name = name
        self.price = price
        self.deal_price = deal_price
        self.you_save = price - deal_price
        self.rating = rating
        
    def display_product_details(self): 
        print("| Name: {}".format(self.name))
        print("| Price: {}".format(self.price))
        print("| Deal Price: {}".format(self.deal_price))
        print("| You Save: {}".format(self.you_save))
        print("| Rating: {}".format(self.rating))
        
class ElectronicItem(Product):
    def __init__(self,name, price, deal_price,rating, extra_features, warranty_in_months):
        super().__init__(name, price, deal_price,rating)
        self.extra_features = extra_features
        self.warranty_in_months = warranty_in_months
    
    def display_product_details(self):
        super().display_product_details()
        print("| Extra Features: {}".format(self.extra_features))
        print("| Warranty In Months: {} Months".format(self.warranty_in_months))

class GroceryItems(Product):
    def __init__(self,name, price, deal_price, rating, expiry_date):
        super().__init__(name, price, deal_price, rating)
        self.expiry_date = expiry_date
    
    def display_product_details(self):
        super().display_product_details()
        print("| Expiry Date: {}".format(self.expiry_date))

class Order():
    delivery_charges = {
        "prime member":0,
        "non prime member":50
    }
    def __init__(self,delivery_speed, delivery_address):
        self.items_in_cart = []
        self.delivery_speed = delivery_speed
        self.delivery_address = delivery_address
        
    def add_item(self,product, quantity):
        self.items_in_cart.append((product,quantity))
    
    def display_order_details(self):
        print("------------------------------INVOICE------------------------------------")
        print("Product                         Quantity     Price    Deal Price")
        print("-------------------------------------------------------------------------")
        total_price = 0
        total_deal_price = 0
        self.invoice_number = random.randint(100000, 999999)
        self.invoice_date = datetime.now().strftime("%d-%m-%Y")
        delivery_charge = Order.delivery_charges[self.delivery_speed]
        for product, quantity in self.items_in_cart:
            string_length = len(product.name) 
            price = product.price*quantity
            deal_price = product.deal_price*quantity
            total_price += price
            total_deal_price += deal_price
            space_for_price = 9*" "
            space_for_deal_price = " "*(10 - len(str(price)))
            space_for_string = " "* (35 - string_length)
            print(f"{product.name}{space_for_string}{quantity}{space_for_price}{price}{space_for_deal_price}{deal_price}")
        print("-------------------------------------------------------------------------")
        print("Total Price:",total_price,"+",delivery_charge,"\nDiscounted Price: ",total_deal_price,"\nYou Saved: ",total_price- total_deal_price)
        print("-------------------------------------------------------------------------")
        
        print(f"Final Amount to Pay: {total_deal_price + delivery_charge}")
        print("Delivery Speed: {}".format(self.delivery_speed))
        print("Delivery Address: {}".format(self.delivery_address))
        
        print("Invoice No: ",self.invoice_number)
        print("Date: ",self.invoice_date)
        print("......................Thank You for shopping visit again..................")

mobile = ElectronicItem("Samsung A15 5G",19999,10500,4.9,"Fingerprint Unlock",12) 
TV = ElectronicItem("Samsung TV",40000,38000,4.5,"Google Assistance",14) 
mouse = ElectronicItem("Ideapad Mouse",2000,1600,3.9,"RGB",6) 
flour = GroceryItems("1 KG TATA Wheat",400,350,4.2,"01/02/2026")

order = Order("non prime member","Jintur")
order.add_item(TV,2)
order.add_item(mobile, 2)
order.add_item(mouse, 1)
order.add_item(flour, 1)
order.display_order_details()
