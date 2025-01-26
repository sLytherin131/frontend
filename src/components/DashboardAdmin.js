import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);

  // State untuk form input user baru
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  // State untuk form edit user
  const [editUser, setEditUser] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    pricePerDay: '',
    status: '',
  });
  
  const [editCar, setEditCar] = useState({
    id: null,
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    pricePerDay: '',
    status: '',
  });
  

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users data:', err);
      }
    };

    const fetchCars = async () => {
        try {
          const response = await axios.get('http://localhost:3000/cars', {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          setCars(response.data);
        } catch (err) {
          console.error('Error fetching cars data:', err);
        }
      };
      

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/payments', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments data:', err);
      }
    };

    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rentals', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setRentals(response.data);
      } catch (err) {
        console.error('Error fetching rentals data:', err);
      }
    };

    // Call all fetch functions
    fetchUsers();
    fetchCars();
    fetchPayments();
    fetchRentals();
  }, []);

  // Handle input change for new user form
  const handleUserInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for edit user form
  const handleEditUserInputChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCarInputChange = (e) => {
    setNewCar({
      ...newCar,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleEditCarInputChange = (e) => {
    setEditCar({
      ...editCar,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle form submit to add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users', {
        full_name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers([...users, response.data]); // Add new user to users list
      setNewUser({ fullName: '', email: '', phone: '', role: '' }); // Clear form
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
    }
  };

  // Handle edit user (set data to editUser state)
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.ID === userId); // menyesuaikan ID sesuai yang ada di response
    if (userToEdit) {
      setEditUser({
        id: userToEdit.ID, // pastikan ini menggunakan `userToEdit.ID` sesuai data Anda
        fullName: userToEdit.full_name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        role: userToEdit.role,
      });
    }
  };

  // Handle form submit to update an existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // Pastikan ID user ada sebelum mencoba mengupdate
    if (!editUser.id) return;
  
    try {
      // Kirim permintaan PUT untuk memperbarui data user
      const response = await axios.put(`http://localhost:3000/users/${editUser.id}`, {
        full_name: editUser.fullName,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
  
      // Pastikan response.data berisi data yang sudah diperbarui
      console.log('Updated user:', response.data);
  
      // Perbarui state users dengan data yang terbaru
      setUsers(users.map(user => user.id === editUser.id ? response.data : user));
      
      // Reset form setelah pembaruan
      setEditUser({ id: null, fullName: '', email: '', phone: '', role: '' });
  
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };
  

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (!id) {
      console.error('ID is undefined');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(users.filter((user) => user.ID !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/cars', {
        brand: newCar.brand,
        model: newCar.model,
        year: parseInt(newCar.year, 10),
        license_plate: newCar.licensePlate,
        price_per_day: parseFloat(newCar.pricePerDay),
        status: newCar.status,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCars([...cars, response.data]); // Add new car to cars list
      setNewCar({ brand: '', model: '', year: '', licensePlate: '', pricePerDay: '', status: '' }); // Clear form
    } catch (err) {
      console.error('Error adding car:', err);
    }
  };
  
  const handleEditCar = (carId) => {
    const carToEdit = cars.find((car) => car.ID === carId); 
    if (carToEdit) {
      setEditCar({
        id: carToEdit.ID,
        brand: carToEdit.brand,
        model: carToEdit.model,
        year: carToEdit.year,
        licensePlate: carToEdit.license_plate,
        pricePerDay: carToEdit.price_per_day,
        status: carToEdit.status,
      });
    }
  };
  
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    
    if (!editCar.id) return;
  
    try {
      const response = await axios.put(`http://localhost:3000/cars/${editCar.id}`, {
        brand: editCar.brand,
        model: editCar.model,
        year: editCar.year,
        license_plate: editCar.licensePlate,
        price_per_day: editCar.pricePerDay,
        status: editCar.status,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
  
      setCars(cars.map(car => car.ID === editCar.id ? response.data : car));
      setEditCar({ id: null, brand: '', model: '', year: '', licensePlate: '', pricePerDay: '', status: '' });
    } catch (err) {
      console.error('Error updating car:', err);
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cars/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCars(cars.filter((car) => car.ID !== id)); // Remove car from list
    } catch (err) {
      console.error('Error deleting car:', err);
    }
  };

  const navigate = useNavigate();

  // Function to clear token (log out user)
  const clearToken = () => {
    localStorage.removeItem('token'); // Assuming token is stored in localStorage
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login'); // Navigate to login page after logout
  };
  

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <section>
        <h3>Add New User</h3>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={handleUserInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleUserInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newUser.phone}
            onChange={handleUserInputChange}
            required
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleUserInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </section>

      {/* Form for editing user */}
      {editUser.id && (
  <div>
    <h3>Edit User</h3>
    <form onSubmit={handleUpdateUser}>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={editUser.fullName}
        onChange={handleEditUserInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={editUser.email}
        onChange={handleEditUserInputChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={editUser.phone}
        onChange={handleEditUserInputChange}
        required
      />
      <select
        name="role"
        value={editUser.role}
        onChange={handleEditUserInputChange}
        required
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>
      <button type="submit">Update User</button>
    </form>
  </div>
)}


      {/* Display list of users */}
      <h3>Users</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditUser(user.ID)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* Form for adding new car */}
<h3>Add New Car</h3>
<form onSubmit={handleAddCar}>
  <input
    type="text"
    name="brand"
    placeholder="Brand"
    value={newCar.brand}
    onChange={handleCarInputChange}
    required
  />
  <input
    type="text"
    name="model"
    placeholder="Model"
    value={newCar.model}
    onChange={handleCarInputChange}
    required
  />
  <input
    type="text"
    name="year"
    placeholder="Year"
    value={newCar.year}
    onChange={handleCarInputChange}
    required
  />
  <input
    type="text"
    name="licensePlate"
    placeholder="License Plate"
    value={newCar.licensePlate}
    onChange={handleCarInputChange}
    required
  />
  <input
    type="number"
    name="pricePerDay"
    placeholder="Price Per Day"
    value={newCar.pricePerDay}
    onChange={handleCarInputChange}
    required
  />
  <select
    name="status"
    value={newCar.status}
    onChange={handleCarInputChange}
    required
  >
    <option value="">Select Status</option>
    <option value="available">Available</option>
    <option value="rented">Rented</option>
  </select>
  <button type="submit">Add Car</button>
</form>

{/* Form for editing car */}
{editCar.id && (
  <div>
    <h3>Edit Car</h3>
    <form onSubmit={handleUpdateCar}>
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={editCar.brand}
        onChange={handleEditCarInputChange}
        required
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={editCar.model}
        onChange={handleEditCarInputChange}
        required
      />
      <input
        type="text"
        name="year"
        placeholder="Year"
        value={editCar.year}
        onChange={handleEditCarInputChange}
        required
      />
      <input
        type="text"
        name="licensePlate"
        placeholder="License Plate"
        value={editCar.licensePlate}
        onChange={handleEditCarInputChange}
        required
      />
      <input
        type="number"
        name="pricePerDay"
        placeholder="Price Per Day"
        value={editCar.pricePerDay}
        onChange={handleEditCarInputChange}
        required
      />
      <select
        name="status"
        value={editCar.status}
        onChange={handleEditCarInputChange}
        required
      >
        <option value="">Select Status</option>
        <option value="available">Available</option>
        <option value="rented">Rented</option>
      </select>
      <button type="submit">Update Car</button>
    </form>
  </div>
)}


      {/* Display list of cars */}
<h3>Cars</h3>
<table border="1">
  <thead>
    <tr>
      <th>ID</th>
      <th>Brand</th>
      <th>Model</th>
      <th>Year</th>
      <th>License Plate</th>
      <th>Price Per Day</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {cars.map((car) => (
      <tr key={car.ID}>
        <td>{car.ID}</td>
        <td>{car.brand}</td>
        <td>{car.model}</td>
        <td>{car.year}</td>
        <td>{car.license_plate}</td>
        <td>{car.price_per_day}</td>
        <td>{car.status}</td>
        <td>
          <button onClick={() => handleEditCar(car.ID)}>Edit</button>
          <button onClick={() => handleDeleteCar(car.ID)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <h3>Payments</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rental ID</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.rental_id}</td>
              <td>{payment.amount}</td>
              <td>{payment.payment_method}</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Rentals</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Car ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td>{rental.id}</td>
              <td>{rental.user_id}</td>
              <td>{rental.car_id}</td>
              <td>{rental.start_date}</td>
              <td>{rental.end_date}</td>
              <td>{rental.total_price}</td>
              <td>{rental.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAdmin;
