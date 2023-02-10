import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import '../assets/styles/pages/checkout.scss';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51MEywtKxQEKWpZmHIePBopv3mnBUK0wKxe87BIeSxPEQppGH7S2P8YxXFgsZ6WdYfD0uvxFn691HZgSNzUY4FT0900M9gmk14C');

export default function CheckoutPage(props) {
  const tutorshipData = props.location.state.state;

  return (
    <div className="payment__body">
      <Elements stripe={stripePromise}>
        <CheckoutForm tutorshipData={tutorshipData}/>
      </Elements>
    </div>
  );
}
