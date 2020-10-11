import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/interface/Item.interface';
import { ItemService } from 'src/app/service/item.service';
import { PaymentService } from 'src/app/service/payment.service';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { APIService } from 'src/app/API.service';
import { exit } from 'process';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  item: Item = null;
  card: any = null;

  constructor(
    private itemService: ItemService,
    private paymentService: PaymentService,
    private appsyncService: APIService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.fetchItem();
  }

  ngAfterViewInit() {
    if( this.item ) {
      this.initStripe();
    }
  }

  fetchItem() {
    this.route.queryParams.subscribe(params => {
      const itemId = parseInt(params.itemId);
      
      this.itemService.getItem(itemId).subscribe( item => {
        this.item = item;
      })
    })
  }

  initStripe() {
    let stripe = this.paymentService.getStripeInstance();

    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
      }
    };

    this.card = elements.create("card", { style: style });
    this.card.mount("#card-element");
    
    this.card.addEventListener('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }
  
  payment() {
    let self = this;
    let order;
    let paymentIntent;

    const inputData = {
      itemId: this.item.itemId,
      title: this.item.title,
      subtitle: this.item.subtitle,
      price: Math.floor(this.item.price)
    };

    this.appsyncService.CreateOrderReservation(inputData).then(result => {
      order = result.order;
      paymentIntent = result.paymentIntent;
      const metadata = paymentIntent.metadata;

      self.next(order.id);

      self.paymentService.confirmPayment(paymentIntent, self.card).then(function(result) {
        if ( !result.error ) {
          if (result.paymentIntent.status === 'succeeded') {
            console.log('payment success!')
            console.log(result);
  
            result.paymentIntent.metadata = metadata;
            console.log(result.paymentIntent.metadata);
            self.paymentService.stripeManualWebhook(result.paymentIntent).subscribe(result => {
              console.log(result);
            });
          }
          else {
            console.log(result.paymentIntent.status);
            alert('payment status: ' + result.paymentIntent.status);
          }
        } 
        else {
          console.log(result.error.message);
          alert(result.error.message);
        }
      });;
    }).catch(error => {
      console.error(error);
      alert('There was an error creating your payment intent.');
    });
  }

  before() {
    this.router.navigate(['/list']);
  }

  next(orderId: string) {
    this.router.navigate(['/result'], { queryParams: { orderId: orderId }});
  }

}
