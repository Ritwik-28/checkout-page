import React, { useEffect, useState } from 'react';
import '../App.css';

const EnrollmentForm = () => {
    const [soldCount, setSoldCount] = useState(10);

    useEffect(() => {
        // Dynamically add the Razorpay script
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.setAttribute("data-payment_button_id", "pl_Oly4SGpv6WDzJr");
        script.async = true;
        document.getElementById("razorpay-form").appendChild(script);

        // Auto-populate email and phone fields from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('email').value = urlParams.get('email') || '';
        document.getElementById('phone').value = urlParams.get('phone') || '';
    }, []);

    return (
        <div className="container">
            <div className="enrollment-details">
                <img src="https://directus.crio.do/assets/b647b599-ae7a-41a4-98d2-d428a64cc768.webp" alt="Crio.Do" width="100px" />
                <h1>Provisional Enrollment</h1>
                <p><strong>{soldCount}</strong> sold out of <strong>50</strong></p>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(soldCount / 50) * 100}%` }}></div>
                </div>
                <p><strong>{soldCount}</strong> supporters</p>
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
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="Enter your phone number" required />
                </div>
                <div className="payment-button" id="razorpay-form">
                    {/* Razorpay button will be appended here */}
                </div>
            </div>
        </div>
    );
};

export default EnrollmentForm;