import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EnrollmentForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [soldCount, setSoldCount] = useState(10); // Replace this with the actual count logic

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const phone = urlParams.get('phone');

        if (email && phone) {
            setName(name);
            setEmail(email);
            setPhone(phone);
            submitToGoogleSheet(name, email, phone);
        } else {
            window.location.href = 'https://form.typeform.com/to/Ko438oSw';
        }
    }, []);

    const submitToGoogleSheet = async (name, email, phone) => {
        const sheetId = '1dVdryyzNxhtwS3QY0amFf65XT6VJCVY1gp1nlgmXmVo';
        const range = 'Hello!A:D';
        const values = [[new Date().toLocaleString(), name, email, phone]];

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_KEY}`,
            },
        };

        try {
            await axios.post(url, { values }, config);
        } catch (error) {
            console.error('Error appending to Google Sheets:', error);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handlePayNow = async () => {
        if (!validateEmail(email)) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }

        if (!validatePhone(phone)) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }

        if (validateEmail(email) && validatePhone(phone)) {
            await submitToGoogleSheet(name, email, phone);
            setSoldCount(soldCount + 1);
            document.getElementById('razorpay-form').submit();
        }
    };

    return (
        <div className="container">
            <div className="enrollment-details">
                <h1>Provisional Enrollment</h1>
                <p>{soldCount} out of 50</p>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(soldCount / 50) * 100}%` }}></div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderColor: emailError ? 'red' : '#324a52' }}
                    />
                    {emailError && <small>Please enter a valid email</small>}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ borderColor: phoneError ? 'red' : '#324a52' }}
                    />
                    {phoneError && <small>Please enter a valid phone number</small>}
                </div>
                <div className="payment-button">
                    <form id="razorpay-form">
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