import React, { useState } from 'react';
import './client.css';
import './paybill.css'
import BPayLogo from './img/bpay_logo.jpg';
import { getAccBalance, checkBPayPayment } from './util/api-calls';

const PayBillForm = props => {
    return (
        <main id='cous'>
            <div id='header-id'>
                <h2 id='header-text'>Enter bill details</h2>
            </div>
            <div class="box">
                <div class="inner-box" id="box-body-id">
                    <form onSubmit={props.onSubmit}>
                        <div class='upper-inner-box'>
                            <div class="bpay bpay-logo"> <img class="bpay-logo-img" src={BPayLogo} alt="paybuddy-logo"/></div>
                            <div class='bpay'>
                                <div class='bpay-payment-details'>
                                    <div class='text-line'><input id='bllerCode' type="text" size='32' placeholder=' Biller Code *' onBlur={props.verifyBillerCode.bind(this)} required/></div>
                                    <div class='text-line'><input id='crn' type="text" size='32' placeholder=' Ref Number *' required/></div>
                                </div>
                            </div>
                        </div>
                        <div class='middle-inner-box'>
                            <div class='biller-details'>
                                <div>Biller Name:</div>
                                <div class='biller-name'>{props.billerName}</div>
                            </div>
                        </div>
                        <div class='middle-inner-box'>
                            <div class='payment-details'>
                                <input id='amount' class='payment-amount-text-box' type="text" size='6' placeholder=' Amount *' required/>
                                <input id='descrip' class='payment-dexcription-text-box' type="text" size='6' placeholder=' Description'/>
                            </div>
                        </div>
                        <div class='lower-inner-box'>
                            <input type ='submit' class="IzjkL _2Y_WL FiOTW continue-button"id="submit-button"/>
                        </div>
                  </form>
                </div>
            </div>
        </main>
    );
}

const PayBillConfirm = props => {
    //debugger;
    return (
        <main id='cous'>
            <div class='_3mYpM' id='header-id'>
                <h2 class='_00004'>Confirm your payment</h2>
            </div>
            <div class='box'>
                <div class='inner-box' id='box-body-id'>
                    <div class='upper-inner-box'>
                        <div>
                            BillerName:
                            {props.bill.billerName}
                        </div>
                    </div>
                    <div class='middle-inner-box'>
                        <div class='payment-details'>
                            <div class='payment-amount-text-box'>CRN:</div>
                            <div class='payment-dexcription-text-box'>{props.bill.crn.value}</div>
                        </div>
                    </div>
                    <div class='middle-inner-box'>
                        <div class='payment-details'>
                            <div class='payment-amount-text-box'>Amount:</div>
                            <div class='payment-dexcription-text-box'>{props.bill.amount.value}</div>
                        </div>
                    </div>
                    <div class='middle-inner-box'>
                        <div class='payment-details'>
                            <div class='payment-amount-text-box'>Biller Code:</div>
                            <div class='payment-dexcription-text-box'>{props.bill.billerCode.value}</div>
                        </div>
                    </div>
                    <button id="cancelButton" onClick={props.onSubmit} class="_16apt _2Y_Wp">
                        <span>Submit</span>
                    </button>
                    <button id="cancelButton" onClick={props.cancelPayment} class="_16apt _2Y_Wp">
                        <span>Cancel</span>
                    </button>
                    
                    {props.error}
                </div>
            </div>
        </main>
    )
}

function PayBill(props) {

    const [show, setShow] = useState(false);
    const [err, setErr] = useState(false);
    const [bill, setBill] = useState('');
    const [api, setApi] = useState('');

    const showConfirm = () => setShow(true);
    const closeConfirm = () => {
        //debugger;
        setBill('');
        setShow(false);
    };

    function handleSubmit(event) {
        //debugger;
        
        event.preventDefault();
        const { bllerCode, crn, amount, descrip } = event.target.elements;

        if (bllerCode === '' || crn === '' || amount === '')
        {
            return;
        }
        else {
            setBill({
                userID: 1,
                billerName: bill,
                billerCode: bllerCode,
                crn: crn,
                amount: amount,
                descrip: descrip
            }); 
    
            showConfirm();
        }
    }

    function verifyBillerCode(event) {
        if(event.target.value === '') {
            setBill('');
        } else {
            fetch(`http://localhost:9000/payments/biller/${event.target.value}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setBill(data.longName);
                return;
            });
        }
    }
    
    function validatePayment(event) {
        debugger;
        getAccBalance(1, function(response) {
            debugger;
            console.log(response[0].account_value);

            var billValue = bill.amount.value;

            if(parseInt(response[0].account_value) > parseInt(billValue,10)) {

                console.log('Sufficient funds');
                debugger;

                /* checkBPayPayment(bill, function(response) {
                    console.log(response.text);
                    debugger;
                }); */
                try {
                    fetch(`http://localhost:9000/payments/validatePayment`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            userID: '1',
                            payment: {
                                billerCode: bill.billerCode.value,
                                crn: bill.crn.value,
                                amount: parseFloat(bill.amount.value),
                                settlementDate: "2017-10-23",
                                paymentMethod: "001",
                                paymentDate: "2019-01-10"
                            }
                        })
                    })
                    .then((response) => {
                        debugger;
                        console.log(response);
                        console.log(response.status);

                        if(response.status === 200) {
                            console.log('responseFromServer');

                            //Page re-route
                            //window.location.href = "/Dashboard?user_id=1";
                        } else {
                            console.log('API error');
                            setErr('API error');
                        }
                    });
                } catch {
                    debugger;
                    console.log('Eroror');
                }
            } else {
                console.log('Not Valid');
                setErr('Insufficient funds');
            }
        });
    }

    return (
        <div>
            {
                !show ? <PayBillForm verifyBillerCode={verifyBillerCode}
                                     onSubmit={handleSubmit}
                                     billerName={bill}/>
                      : <PayBillConfirm bill={bill}
                                        onSubmit={validatePayment}
                                        error={err}
                                        cancelPayment={closeConfirm}/>
            }
        </div>
    );
}

export default PayBill;