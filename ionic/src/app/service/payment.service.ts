import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

declare let Stripe;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  stripe: any = null;

  constructor(
    private http: HttpClient,
  ) { }

  getStripeInstance() {
    if( !this.stripe ) {
      this.stripe = Stripe('pk_test_rxNxe90ymfrR59ybzGPaNRxq00jTv8kOQG');
    }
    
    return this.stripe;
  }

  confirmPayment(paymentIntent: any, card: any): Promise<any> {
    if( !this.stripe ) { 
      console.error('[confirmPayment] Not allowed access');
      alert('Not allowed access!');
      return;
    } 

    const clientSecret = paymentIntent.client_secret;
    
    return this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: 'Taewoo Kim'
        }
      }
    });
  }

  stripeManualWebhook(paymentIntent: any): Observable<any> {
    const url = 'https://hwrscxw9wb.execute-api.ap-northeast-1.amazonaws.com/prod/stripe-webhook';
    const data = {
      type: 'payment_intent.' + paymentIntent.status,
      data: {
        object: paymentIntent,
      }
    };

    console.log('stripeManaulWebhook()');
    console.log({data});

    return this.http.post(url, data);
  }
}
