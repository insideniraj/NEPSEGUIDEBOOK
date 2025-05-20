const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_GMAIL_ADDRESS', // Replace with your Gmail address
        pass: 'YOUR_APP_PASSWORD'    // Replace with your Gmail app password
    }
});

// Endpoint to handle email sending
app.post('/send-email', async (req, res) => {
    const { name, email } = req.body;

    // Email to customer
    const customerMailOptions = {
        from: 'YOUR_GMAIL_ADDRESS',
        to: email,
        subject: 'Welcome to NEPSE Guide - Your Purchase Details',
        html: `
            <h1>Welcome to NEPSE Guide!</h1>
            <p>Dear ${name},</p>
            <p>Thank you for purchasing the NEPSE Guide. We're excited to have you join our community of investors!</p>
            
            <h2>Your Access Details:</h2>
            <ul>
                <li><strong>Private Telegram Channel:</strong> <a href="https://t.me/your_channel_link">Click here to join</a></li>
                <li><strong>eBook Access:</strong> You can download your copy from the Telegram channel</li>
            </ul>
            
            <h2>Next Steps:</h2>
            <ol>
                <li>Join our private Telegram channel using the link above</li>
                <li>Download your copy of the NEPSE Guide</li>
                <li>Start your investment journey with confidence!</li>
            </ol>
            
            <p>If you have any questions, feel free to reach out to us through the Telegram channel.</p>
            
            <p>Best regards,<br>NEPSE Guide Team</p>
        `
    };

    // Email to admin
    const adminMailOptions = {
        from: 'YOUR_GMAIL_ADDRESS',
        to: 'YOUR_GMAIL_ADDRESS', // Your email to receive notifications
        subject: 'New NEPSE Guide Purchase',
        html: `
            <h1>New Purchase Notification</h1>
            <p>A new customer has purchased the NEPSE Guide:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
            </ul>
        `
    };

    try {
        // Send email to customer
        await transporter.sendMail(customerMailOptions);
        
        // Send notification to admin
        await transporter.sendMail(adminMailOptions);
        
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ error: 'Failed to send emails' });
    }
});

// Khalti payment verification endpoint
app.post('/verify-khalti-payment', async (req, res) => {
    const { token, amount, name, email } = req.body;

    try {
        // Verify payment with Khalti
        const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                amount: amount
            })
        });

        const data = await response.json();

        if (data.idx) {
            // Payment successful
            // Send email notifications
            await sendEmailNotifications(name, email);
            
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
});

// Function to send email notifications
async function sendEmailNotifications(name, email) {
    // Email to customer
    const customerMailOptions = {
        from: 'YOUR_GMAIL_ADDRESS',
        to: email,
        subject: 'Welcome to NEPSE Guide - Your Purchase Details',
        html: `
            <h1>Welcome to NEPSE Guide!</h1>
            <p>Dear ${name},</p>
            <p>Thank you for purchasing the NEPSE Guide. We're excited to have you join our community of investors!</p>
            
            <h2>Your Access Details:</h2>
            <ul>
                <li><strong>Private Telegram Channel:</strong> <a href="https://t.me/youngfreedman">Click here to join</a></li>
                <li><strong>eBook Access:</strong> You can download your copy from the Telegram channel</li>
            </ul>
            
            <h2>Next Steps:</h2>
            <ol>
                <li>Join our private Telegram channel using the link above</li>
                <li>Download your copy of the NEPSE Guide</li>
                <li>Start your investment journey with confidence!</li>
            </ol>
            
            <p>If you have any questions, feel free to reach out to us through the Telegram channel.</p>
            
            <p>Best regards,<br>NEPSE Guide Team</p>
        `
    };

    // Email to admin
    const adminMailOptions = {
        from: 'YOUR_GMAIL_ADDRESS',
        to: 'YOUR_GMAIL_ADDRESS', // Your email to receive notifications
        subject: 'New NEPSE Guide Purchase',
        html: `
            <h1>New Purchase Notification</h1>
            <p>A new customer has purchased the NEPSE Guide:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Payment Method:</strong> Khalti</li>
            </ul>
        `
    };

    try {
        // Send email to customer
        await transporter.sendMail(customerMailOptions);
        
        // Send notification to admin
        await transporter.sendMail(adminMailOptions);
    } catch (error) {
        console.error('Error sending emails:', error);
        throw error;
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 