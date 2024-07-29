import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import toast, { Toaster } from "react-hot-toast";

const Shop = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/all-books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // handlePayment Function
  const handlePayment = async (price) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: price 
        })
      });

      const data = await res.json();
      handlePaymentVerify(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data) => {
    const options = {
      key: ({}).REACT_APP_RAZORPAY_KEY_ID, // Correctly access the API key from environment variables
      amount: data.amount,
      currency: data.currency,
      name: "Neema Rao",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await fetch(`http://localhost:5000/api/payment/order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className='mt-28 px-4 lg:px24'>
      <h2 className='text-5xl font-bold text-center'>All Books are here</h2>
      <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-3 grid-cols-1'>
        {books.map((book) => (
          <Card key={book._id} className='max-w-sm'>
            <img src={book.imageurl} alt={book.bookTitle} className='h-96' />
            <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              <p>{book.bookTitle}</p>
              <p>rs{book.price}</p>
            </h5>
            <p className='font-normal text-gray-700 dark:text-gray-400'>LATEST BOOKS</p>
            <button
              className='bg-blue-700 font-semibold text-white py-1'
              onClick={() => handlePayment(book.price)}
            >
              Buy Now
            </button>
            <Toaster/>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
