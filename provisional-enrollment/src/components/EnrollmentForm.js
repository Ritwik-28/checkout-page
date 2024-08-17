import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EnrollmentForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [soldCount, setSoldCount] = useState(10); // Initial count

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const phone = urlParams.get('phone');

        if (email && phone) {
            setName(name);
            setEmail(email);
            setPhone(phone);
            submitToGoogleSheet("Hello", email, phone, name); // Submit to Hello sheet on page load
        } else {
            window.location.href = 'https://form.typeform.com/to/Ko438oSw';
        }

        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.setAttribute('data-payment_button_id', 'pl_Oly4SGpv6WDzJr');
        script.async = true;
        document.getElementById('razorpay-form').appendChild(script);
    }, []);

    const submitToGoogleSheet = async (sheet, email, phone, name = null) => {
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${corsProxy}https://script.google.com/macros/s/AKfycbzMe-aToK35uxOYz-Z2lg_lG5jBCqo3YxoqrB-_ncm4u30icM9QBv-nUAhRqVwjyP_j/exec`; // Replace YOUR_SCRIPT_ID with actual script ID

        const params = {
            sheet,
            email,
            phone
        };

        if (name) {
            params.name = name;
        }

        try {
            const response = await axios.post(url, null, { params });
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error appending to Google Sheets:', error);
        }
    };

    const handlePayNowClick = () => {
        submitToGoogleSheet("YOLO", email, phone); // Submit to YOLO sheet on Pay Now click
    };

    return (
        <div className="container">
            <div className="enrollment-details">
                <img src="https://directus.crio.do/assets/b647b599-ae7a-41a4-98d2-d428a64cc768.webp" alt="Crio Logo" className="logo" />
                <h1>Provisional Enrollment</h1>
                <p>{soldCount} sold out of 50</p>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(soldCount / 50) * 100}%` }}></div>
                </div>
                <p>{soldCount} supporters</p>
                <div className="contact-info">
                    <p><strong>Contact Us:</strong></p>
                    <p>📧 ping@criodo.com</p>
                    <p>📞 06366528148</p>
                </div>
                <div className="terms">
                    <p><strong>Terms & Conditions:</strong></p>
                    <p>The provisional enrollment fees of ₹1,000/- is to block your scholarship for a period of 24 Hours and shall not be returned in case the learner decides to not move forward with the program.</p>
                    <p>You agree to share information entered on this page with Qift Solutech Private Limited (owner of this page) and Razorpay, adhering to applicable laws.</p>
                </div>
            </div>
            <div className="payment-details">
                <h2>Payment Details</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="payment-button">
                    <form id="razorpay-form" onClick={handlePayNowClick}></form>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentForm;