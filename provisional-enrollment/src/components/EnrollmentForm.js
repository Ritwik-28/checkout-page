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
        const url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`;

        const params = new URLSearchParams({
            sheet,
            email,
            phone
        });

        if (name) {
            params.append('name', name);
        }

        try {
            const response = await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
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
            <div className="top-strip">
                <img src="https://directus.crio.do/assets/b647b599-ae7a-41a4-98d2-d428a64cc768.webp" alt="Crio Logo" className="logo" />
                <h1>Provisional Enrollment</h1>
            </div>

            <div className="enrollment-details">
                <h2>Crio.Do Provisional Enrollment</h2>
                <p>Provisional Enrollment is a temporary enrollment process that allows you to secure a spot in a program or course before completing the full enrollment process. By providing your email and phone number, you are indicating your interest in enrolling and will be contacted with further instructions.</p>
                <p><strong>Terms and Conditions:</strong></p>
                <p>The provisional enrollment fees of ₹1,000/- is to block your scholarship for a period of 24 Hours and shall not be returned in case the learner decides to not move forward with the program.</p>
                <p>You agree to share information entered on this page with Qift Solutech Private Limited (owner of this page) and Razorpay, adhering to applicable laws.</p>
                <p><strong>Contact Us:</strong></p>
                <p>📧 ping@criodo.com</p>
                <p>📞 06366528148</p>
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

            <div className="progress-bar-container clearfix">
                <p>Enrollments Done Till Now:</p>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(soldCount / 50) * 100}%` }}></div>
                </div>
                <p>{soldCount} sold out of 50</p>
                <p>{soldCount} supporters</p>
            </div>
        </div>
    );
};

export default EnrollmentForm;