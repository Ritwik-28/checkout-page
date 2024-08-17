import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EnrollmentForm = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [soldCount, setSoldCount] = useState(10);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setEmail(urlParams.get('email') || '');
        setPhone(urlParams.get('phone') || '');

        // Automatically increment the sold count when the form is loaded
        setSoldCount(soldCount + 1);
    }, []);

    const handleSubmit = async () => {
        try {
            const sheetId = '1dVdryyzNxhtwS3QY0amFf65XT6VJCVY1gp1nlgmXmVo';
            const range = 'Hello!A:D';
            const values = [[new Date().toLocaleString(), email, phone]];

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
            const config = {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_KEY}`,
                },
            };

            await axios.post(url, { values }, config);
            // After successful submission, trigger the Razorpay payment
            document.getElementById('razorpay-form').submit();
        } catch (error) {
            console.error('Error appending to Google Sheets:', error);
        }
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
                    <form id="razorpay-form" onSubmit={handleSubmit}>
                        <script 
                            src="https://checkout.razorpay.com/v1/payment-button.js"
                            data-payment_button_id="pl_Oly4SGpv6WDzJr" 
                            async> 
                        </script>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentForm;