import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

declare var Stripe;

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})

export class StripePage {

  stripe = Stripe('pk_test_vZyPEUMgELXB3Z2xiKGD1Ynx');
  card: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.setupStripe();
  }

  setupStripe(){
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });

    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      //this.stripe.createSource(this.card)
      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          let alert = this.alertCtrl.create({
            title: 'Creado Exitosamente!',
            subTitle: 'Token: '+result.token.id+'<br><br>'+
            'Card: '+result.token.card.id,
            buttons: ['Aceptar']
          });
          alert.present();
        }
      });
    });
  }

}
