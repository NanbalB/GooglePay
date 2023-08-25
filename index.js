'use strict';

/**
 * @fileoverview This file supports a payment system for wearecity NGO 
 * 
 */

/**
 * google pay api configuration
 */
const tokenizationSpecification= {
    type: 'PAYENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayerchantId: 'gatewayMerchantId',
        }
}

const cardPaymentethod = {
    type: 'CARD',
    tokenizationSpecification: tokenizationSpecification,
    parameters: {
        allowedCardNetworks: ['VISA', 'MASTERCARD'],
        allowedAuthMethods:['PAN_ONLY', 'CRYPTPGRAM_3DS']
    }
}

const googlePayConfiguration = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentethod] ,
};

/**
 * holds the googlepay client used to call the different methods available through the API.
* @type {PaymentsClient}
* @private
*/

let googlePayClient;

/**
 * defines and handles the main operations related to the integration
 * of google pay. this function is executed when the google pay library script has
 * finished loading.
 */
function onGooglePayLoaded() {
googlePayClient = new google.payments.api.PaymentsClient({
    environent: 'TEST',
});

googlePayClient.isReadyToPay(googlePayConfiguration)
    .then(response => {
        if (response.result) {
            createAndAddButton();
        }   else {
            //the current user cannot pay using Google Pay. offer another
            // payent method.
        }
    })
    .catch(error => console.error('isReadyToPay error:', error));
}

/**
 * handles the creation of the button to pay with googfle pay 
 * once created this button is appended to DOM, under the element
 * buy-now
 */
function createAndAddButton() {
    const googlePayButton = googlePayClient.createButton({
        onClick: onGooglePayButtonClicked,
    });
}

document.getElementById('buy-now').appendChild(googlePayButton);
}

/**
 * handles the click of the button to pay with google pay. takes
 * care of definign the payment data request to be used in order to load
 * the payment methods available to the user.
 */
function onGooglePayButtonClicked() {
    const paymentDataRequest = {...googlePayConfiguration};
    paymentDataRequest.merchantInfo = {
        merchantId: 'BCR2DN4TRKYIH2TS'
        merchantName: 'Christian Initiative for Transforming Youth',
    };

    paymentDataRequest.transactioninfo = {
        totalPriceStatus: 'FINAL'
        currencyCode: 'USD',
        countryCode: 'US',
    };

    }

    googlePayClient.loadPaymentData(paymentDataRequest)
    .then(paymentData => processPaymentData(paymentData))
    .catch(error => console.error('loadPaymentData error: ', error));

function processPaymentData(paymentData){
    fetch(orderEndpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}