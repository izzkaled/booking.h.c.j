// تحميل الحجوزات من localStorage
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    console.log('Loaded bookings:', bookings); // للتأكد من تحميل البيانات
    updateStatistics(bookings);
    displayBookings(bookings);
}

// تحديث الإحصائيات
function updateStatistics(bookings) {
    // إجمالي الحجوزات
    document.getElementById('totalBookings').textContent = bookings.length;

    // حجوزات اليوم
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking => booking.checkIn === today);
    document.getElementById('todayBookings').textContent = todayBookings.length;

    // إجمالي الإيرادات
    const totalRevenue = bookings.reduce((sum, booking) => sum + (parseFloat(booking.totalPrice) || 0), 0);
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' ريال';
}

// عرض الحجوزات في الجدول
function displayBookings(bookings) {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) {
        console.error('Table body element not found!');
        return;
    }

    tableBody.innerHTML = '';

    bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        if (booking.status === 'confirmed') {
            row.classList.add('booking-row-confirmed');
        }
        row.innerHTML = `
            <td>#${String(index + 1).padStart(4, '0')}</td>
            <td>${booking.name || ''}</td>
            <td>${booking.hotelName || ''}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>${booking.roomType || ''}</td>
            <td>${(booking.totalPrice || 0).toLocaleString()} ريال</td>
            <td>
                <span class="status-badge status-${booking.status || 'pending'}">
                    ${getStatusText(booking.status || 'pending')}
                </span>
            </td>
            <td class="action-buttons">
                ${booking.status === 'pending' ? `
                    <button class="action-btn" onclick="approveBooking(${index})">
                        <i class="fas fa-check"></i>
                        موافقة
                    </button>
                ` : ''}
                <button class="delete-btn" onclick="deleteBooking(${index})">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
                <button class="action-btn" onclick="viewBooking(${index})">
                    <i class="fas fa-eye"></i>
                    عرض
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// حذف جميع الحجوزات
function deleteAllBookings() {
    if (confirm('هل أنت متأكد من حذف جميع الحجوزات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        localStorage.removeItem('bookings');
        showNotification('تم حذف جميع الحجوزات بنجاح', 'success');
        loadBookings(); // إعادة تحميل الجدول
    }
}

// حذف حجز محدد
function deleteBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        showNotification('تم حذف الحجز بنجاح', 'success');
        loadBookings(); // إعادة تحميل الجدول
    }
}

// الموافقة على الحجز
function approveBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if (bookings[index]) {
        if (confirm('هل أنت متأكد من الموافقة على هذا الحجز؟')) {
            bookings[index].status = 'confirmed';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            showNotification('تم تأكيد الحجز بنجاح', 'success');
            loadBookings(); // إعادة تحميل الحجوزات لتحديث الجدول
        }
    }
}

// رفض الحجز
function rejectBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if (bookings[index]) {
        if (confirm('هل أنت متأكد من رفض هذا الحجز؟')) {
            bookings[index].status = 'cancelled';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            showNotification('تم رفض الحجز', 'error');
            loadBookings();
        }
    }
}

// عرض تفاصيل الحجز
function viewBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings[index];
    
    if (booking) {
        alert(`
            تفاصيل الحجز:
            الاسم: ${booking.name || ''}
            البريد الإلكتروني: ${booking.email || ''}
            رقم الهاتف: ${booking.phone || ''}
            تاريخ الوصول: ${formatDate(booking.checkIn)}
            تاريخ المغادرة: ${formatDate(booking.checkOut)}
            نوع الغرفة: ${booking.roomType || ''}
            عدد النزلاء: ${booking.guests || ''}
            السعر: ${(booking.totalPrice || 0).toLocaleString()} ريال
            الحالة: ${getStatusText(booking.status || 'pending')}
        `);
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

// الحصول على نص الحالة
function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

// عرض الإشعارات
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تحميل الحجوزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, loading bookings...'); // للتأكد من تنفيذ الكود
    loadBookings();
    
    // تحديث الحجوزات كل دقيقة
    setInterval(loadBookings, 60000);
});

// تصدير البيانات إلى ملف CSV
function exportToCSV() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let csv = 'رقم الحجز,الاسم,البريد الإلكتروني,رقم الهاتف,تاريخ الوصول,تاريخ المغادرة,نوع الغرفة,عدد النزلاء,السعر,الحالة\n';
    
    bookings.forEach((booking, index) => {
        csv += `${index + 1},${booking.name || ''},${booking.email || ''},${booking.phone || ''},${booking.checkIn || ''},${booking.checkOut || ''},${booking.roomType || ''},${booking.guests || ''},${booking.totalPrice || 0},${getStatusText(booking.status || 'pending')}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bookings.csv';
    link.click();
}
