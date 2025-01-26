import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
import { useHistory } from 'react-router-dom';


const DashboardCustomer = () => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);

  const [newRental, setNewRental] = useState({
    carID: '',
    startDate: '',
    endDate: '',
    totalPrice: 0,
    status: 'belum dibayar',
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  // Fetching data
  const fetchData = async () => {
    try {
      const token = getToken();
      console.log('Token:', token);
      if (!token) {
        console.log('Token tidak ditemukan');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
  
      const userId = decodedToken.user_id;
      if (!userId) {
        console.log('User ID tidak ditemukan dalam token');
        alert('User ID tidak ditemukan dalam token. Silakan login kembali.');
        return;
      }
  
      // Fetch data dari server
      const carsResponse = await axios.get('http://localhost:3000/cars', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(carsResponse.data.filter((car) => car.status === 'available'));
  
      const rentalsResponse = await axios.get('http://localhost:3000/rentals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRentals = rentalsResponse.data.filter((rental) => rental.user_id === userId);
      setRentals(userRentals);
  
      const paymentsResponse = await axios.get('http://localhost:3000/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Filter payments hanya untuk rentals milik user
      const userPayments = paymentsResponse.data.filter((payment) =>
        userRentals.some((rental) => rental.ID === payment.rental_id)
      );
      
      setPayments(userPayments);
      console.log("User Payments:", userPayments); // Tambahkan log di sini untuk memverifikasi data
      
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleRentalChange = (e) => {
    const { name, value } = e.target;
    setNewRental((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReserveCar = async (e) => {
    e.preventDefault();
  
    const token = getToken();
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;
  
    if (!userId) {
      console.log('User ID belum ada. Tidak bisa menyewa mobil.');
      alert('User ID tidak ditemukan. Silakan login kembali.');
      return;
    }
  
    try {
      const car = cars.find((car) => car.ID === parseInt(newRental.carID));
      if (!car) {
        alert('Car not found.');
        return;
      }
  
      const startDate = new Date(newRental.startDate).toISOString();
      const endDate = new Date(newRental.endDate).toISOString();
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
      const totalPrice = car.price_per_day * days;
  
      const rentalData = {
        user_id: userId,
        car_id: parseInt(newRental.carID),
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: 'belum dibayar',
      };
  
      console.log('Rental Data:', rentalData); // Log rental data before sending
  
      // Create rental first, no need to create payment here
      const rentalResponse = await axios.post('http://localhost:3000/rentals', rentalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Rental Response:', rentalResponse); // Log rental response for debugging
  
      if (rentalResponse.data && rentalResponse.data.ID) {
        console.log('Rental ID:', rentalResponse.data.ID);  // Log ID rental
      } else {
        console.error('Rental ID not found in the response.');
        alert('Failed to create rental.');
        return;
      }
  
      // After successful rental, update the car status to 'rented'
    const updatedCarData = { status: 'rented' };
    await axios.put(`http://localhost:3000/cars/${car.ID}`, updatedCarData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Car status updated to rented'); // Log car status update

      // Refresh data to show user payments after rental success
      fetchData(); // This will refresh the list of payments
  
    } catch (err) {
      console.error('Error reserving car:', err);
      if (err.response) {
        console.error('Server responded with error:', err.response.data);
      }
    }
  };
  
  
  const handlePayment = async (paymentId) => {
    try {
      console.log("Payment ID selected:", paymentId); 
      const token = getToken();
      const payment = payments.find((payment) => payment.ID === paymentId);
    
      // Pastikan metode pembayaran dipilih
      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }
  
      if (payment.status === 'unpaid') {
        const paymentResponse = await axios.put(`http://localhost:3000/payments/${paymentId}`, {
          payment_method: paymentMethod,
          status: 'paid', // Update status pembayaran menjadi dibayar
        });
  
        console.log('Payment response:', paymentResponse); // Log response dari API
    
        const rentalResponse = await axios.put(`http://localhost:3000/rentals/${payment.rental_id}`, {
          status: 'paid', // Update status rental menjadi dibayar
        });
  
        console.log('Rental response:', rentalResponse); // Log response rental update
    
        // Segarkan data setelah pembayaran
        fetchData();
      }
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  };
  
  // Handle Logout
  const handleLogout = () => {
    removeToken(); // Hapus token dari penyimpanan
    window.location.href = '/login'; // Redirect ke halaman login menggunakan window.location
  };
  

  return (
    <div>
      <h2>Customer Dashboard</h2>

      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>

      {/* Cars List */}
      <h3>Cars List</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price Per Day</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.ID}>
              <td>{car.ID}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.price_per_day}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Car Reservation Form */}
      <h3>Reserve Car</h3>
      <form onSubmit={handleReserveCar}>
        <input
          type="date"
          name="startDate"
          value={newRental.startDate}
          onChange={handleRentalChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={newRental.endDate}
          onChange={handleRentalChange}
          required
        />
        <select
          name="carID"
          value={newRental.carID}
          onChange={handleRentalChange}
          required
        >
          <option value="">Select Car</option>
          {cars.map((car) => (
            <option key={car.ID} value={car.ID}>
              {car.brand} {car.model}
            </option>
          ))}
        </select>
        <button type="submit">Rent Car</button>
      </form>

      {/* Payment Table */}
<h3>Payments</h3>
<table border="1">
  <thead>
    <tr>
      <th>Rental ID</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {payments.map((payment) => (
      <tr key={payment.ID}>
        <td>{payment.rental_id}</td>
        <td>{payment.amount}</td>
        <td>{payment.status}</td>
        <td>
          {payment.status === 'unpaid' && (
            <>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <button onClick={() => handlePayment(payment.ID)}>
              Pay
            </button>
            </>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default DashboardCustomer;
