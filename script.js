document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalElement = document.querySelector('.total');
    const floatingTotal = document.getElementById('floating-total');
    const header = document.querySelector('.main-header');
    const modal = document.getElementById('orderModal');
    const orderButton = document.querySelector('.order-now');
    const closeButton = document.querySelector('.close');
    const orderForm = document.getElementById('orderForm');
    let totalPrice = 0;
    
    // تحديث الإجمالي
    function updateTotal() {
        const selectedStudies = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        const selectedCount = selectedStudies.length;
        
        // حساب السعر بناءً على العدد المحدد من الدراسات
        if (selectedCount === 1) {
            totalPrice = 150;
        } else if (selectedCount === 2) {
            totalPrice = 250;
        } else if (selectedCount === 3) {
            totalPrice = 350;
        } else if (selectedCount > 3) {
            totalPrice = 350 + ((selectedCount - 3) * 75);
        } else {
            totalPrice = 0;
        }
        
        // تحديث العرض
        totalElement.textContent = `الإجمالي: ${totalPrice} جنيه`;
        
        // تحديث حالة زر الطلب
        if (totalPrice > 0) {
            orderButton.style.display = 'block';
        } else {
            orderButton.style.display = 'none';
        }
    }

    // إضافة مستمع الحدث لكل checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotal);
    });

    // التحكم في الفورم المنبثق
    orderButton.addEventListener('click', function() {
        modal.style.display = "block";
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // معالجة إرسال الفورم
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const whatsapp = document.getElementById('whatsapp').value;
        
        // جمع الدراسات المختارة
        const selectedStudies = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.closest('.project-card').querySelector('.project-title').textContent);

        // إرسال بيانات إلى بيكسل فيسبوك
        fbq('track', 'Purchase', {
            value: totalPrice,
            currency: 'EGP'
        });

        // إرسال بيانات إلى جوجل أدس
        gtag('event', 'conversion', {
            'send_to': 'YOUR_GOOGLE_ADS_CONVERSION_ID',
            'value': totalPrice,
            'currency': 'EGP'
        });

        // إرسال بيانات إلى تيك توك
        ttq.track('CompletePayment', {
            content_type: 'Studies',
            content_name: selectedStudies.join(', '),
            value: totalPrice,
            currency: 'EGP'
        });

        // إرسال بيانات إلى سناب شات
        snaptr('track', 'PURCHASE', {
            'price': totalPrice,
            'currency': 'EGP'
        });

        // إنشاء نص الرسالة
        const message = `
            طلب جديد:
            الاسم: ${name}
            رقم الهاتف: ${phone}
            رقم الواتساب: ${whatsapp}
            الإجمالي: ${totalPrice} جنيه
            الدراسات المطلوبة:
            ${selectedStudies.join('\n')}
        `;

        // إرسال إلى واتساب
        window.location.href = `https://wa.me/201030435987?text=${encodeURIComponent(message)}`;
    });

    // التحكم في موضع العداد العائم
    window.addEventListener('scroll', function() {
        const headerBottom = header.getBoundingClientRect().bottom;
        const headerTop = header.getBoundingClientRect().top;
        
        if (window.scrollY > headerBottom) {
            floatingTotal.style.position = 'fixed';
            floatingTotal.style.bottom = '20px';
        } else {
            floatingTotal.style.position = 'absolute';
            floatingTotal.style.bottom = (headerBottom - headerTop + 20) + 'px';
        }
    });
});
