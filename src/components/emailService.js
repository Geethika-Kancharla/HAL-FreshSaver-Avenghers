import emailjs from 'emailjs-com';

const sendExpiryEmail = (userEmail, productName, expiryDate) => {
    const templateParams = {
        to_email: userEmail,
        product_name: productName,
        expiry_date: expiryDate,
    };

    emailjs.send(
        'service_82g0ha2', // Replace with your EmailJS service ID
        'template_uiodh1v', // Replace with your EmailJS template ID
        templateParams,
        'SrT6C8cMhKi75s8kH' // Replace with your EmailJS user ID
    )
    .then((response) => {
        console.log('Email sent successfully:', response);
    })
    .catch((error) => {
        console.error('Error sending email:', error);
    });
};

export default sendExpiryEmail;