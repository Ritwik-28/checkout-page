import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EnrollmentForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [soldCount, setSoldCount] = useState(10); // Default count of 10

    const scriptURL = "https://script.google.com/macros/s/AKfycbxrSJqpnC0ezXTAbzjfvKUAKrPKJ44ZzqMoOReItT8sd6QlJl6Ms6-hdcWmeowiYGGM/exec";

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

        // Fetch the sold count from Google Sheets
        fetchSoldCount();
    }, []);

    const fetchSoldCount = async () => {
        try {
            const response = await axios.get(scriptURL, {
                params: { action: "getSoldCount" }
            });
            const data = response.data;
            if (data.soldCount) {
                setSoldCount(data.soldCount);
            }
        } catch (error) {
            console.error('Error fetching sold count:', error);
            setSoldCount(10); // Fallback to 10 if fetch fails
        }
    };

    const submitToGoogleSheet = async (sheet, email, phone, name = null) => {
        const params = new URLSearchParams({
            sheet,
            email,
            phone,
        });

        if (name) {
            params.append('name', name);
        }

        try {
            const response = await axios.post(scriptURL, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error appending to Google Sheets:', error);
        }
    };

    const handlePayNowClick = async () => {
        await submitToGoogleSheet("YOLO", email, phone); // Submit to YOLO sheet on Pay Now click
        fetchSoldCount(); // Fetch the updated sold count after payment
    };

    return (
        <div className="container">
            <div className="top-strip">
                <img src="https://directus.crio.do/assets/b647b599-ae7a-41a4-98d2-d428a64cc768.webp" alt="Crio Logo" className="logo" />
                <h1 className="top-strip-heading">Provisional Enrollment</h1>
            </div>
            <div className="content-container">
                <div className="enrollment-details">
                    <h3>Secure Your Spot in Crio.Do's Next Batch with Provisional Enrollment!</h3>
                        <ul>
                             <li><strong>Lock in Your Seat Today!</strong></li>
                             <li><strong>Limited Spots Available—Act Fast to Reserve Yours!</strong></li>
                        </ul>
                    <p>By choosing Crio.Do's Provisional Enrollment, you guarantee a place in our upcoming batch. Don't miss this chance to jumpstart your tech career with us. Enroll now and access our world-class training program.</p>
                    <h3>Terms and Conditions:</h3>
                    <p>The provisional enrollment fees of ₹1,000/- is to block your scholarship for a period of 24 Hours and shall not be returned in case the learner decides to not move forward with the program.</p>
                    <p>You agree to share information entered on this page with Qift Solutech Private Limited (owner of this page) and Razorpay, adhering to applicable laws.</p>
                    <div className="contact-info">
                        <p><strong>Contact Us:</strong></p>
                        <p>📧 ping@criodo.com</p>
                        <p>📞 06366528148</p>
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
                    <p className="payment-note">
                        Note: By clicking "Pay Now", you confirm your provisional enrollment. Please ensure your contact details are accurate. Our counsellor will get in touch with you to assist you with the further process.
                    </p>
                </div>
            </div>
            <div className="progress-bar-container">
                <h3>Enrollments Done Till Now:</h3>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(soldCount / 50) * 100}%` }}></div>
                    <p>{soldCount} sold out of 50</p>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentForm;