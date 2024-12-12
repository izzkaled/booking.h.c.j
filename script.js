// بيانات الفنادق
const hotels = {
    hotel1: {
        name: "فندق القصر",
        description: "فندق فاخر يقع في قلب المدينة مع إطلالات خلابة",
        rating: 5,
        price: 500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
        amenities: ["مسبح", "سبا", "مطعم", "خدمة الغرف", "موقف سيارات", "واي فاي"],
        rooms: {
            standard: {
                name: "غرفة قياسية",
                price: 500,
                description: "غرفة مريحة مع سرير مزدوج"
            },
            deluxe: {
                name: "غرفة ديلوكس",
                price: 750,
                description: "غرفة فاخرة مع إطلالة على المدينة"
            },
            suite: {
                name: "جناح",
                price: 1200,
                description: "جناح فاخر مع غرفة معيشة منفصلة"
            }
        }
    },
    hotel2: {
        name: "فندق البحر",
        description: "فندق على الشاطئ مباشرة مع مناظر خلابة للبحر",
        rating: 4,
        price: 350,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
        amenities: ["شاطئ خاص", "مسبح", "مطعم", "خدمة الغرف", "واي فاي"],
        rooms: {
            standard: {
                name: "غرفة قياسية",
                price: 350,
                description: "غرفة مريحة مع شرفة"
            },
            deluxe: {
                name: "غرفة ديلوكس",
                price: 550,
                description: "غرفة فاخرة مع إطلالة على البحر"
            },
            suite: {
                name: "جناح",
                price: 900,
                description: "جناح فاخر مع شرفة كبيرة"
            }
        }
    },
    hotel3: {
        name: "فندق الواحة",
        description: "منتجع صحراوي فاخر مع تجربة عربية أصيلة",
        rating: 5,
        price: 450,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
        amenities: ["مسبح خاص", "سبا", "مطعم عربي", "رحلات صحراوية", "واي فاي"],
        rooms: {
            standard: {
                name: "غرفة قياسية",
                price: 450,
                description: "غرفة تقليدية مع ديكور عربي"
            },
            deluxe: {
                name: "غرفة ديلوكس",
                price: 650,
                description: "غرفة فاخرة مع جلسة عربية"
            },
            suite: {
                name: "جناح",
                price: 1000,
                description: "جناح ملكي مع مسبح خاص"
            }
        }
    }
};

// المتغيرات العامة
let currentHotel = null;

// متغيرات عامة للتقويم
let currentDate = new Date();
let selectedCheckIn = null;
let selectedCheckOut = null;

// دالة إغلاق نافذة الترحيب
function closeWelcome() {
    const welcomePopup = document.getElementById('welcomePopup');
    welcomePopup.classList.add('fade-out');
    setTimeout(() => {
        welcomePopup.style.display = 'none';
    }, 300);
}

// عرض تفاصيل الفندق
function showHotelDetails(hotelId) {
    currentHotel = hotelId;
    const hotel = hotels[hotelId];
    const modal = document.getElementById('hotelModal');
    const detailsDiv = document.getElementById('hotelDetails');
    
    const starsHTML = '⭐'.repeat(hotel.rating);
    const amenitiesHTML = hotel.amenities.map(amenity => 
        `<div class="amenity-item"><span><i class="fas fa-check"></i></span><span>${amenity}</span></div>`
    ).join('');

    const roomsHTML = Object.entries(hotel.rooms).map(([type, room]) => 
        `<p>${room.name}: ${room.price} درهم / ليلة - ${room.description}</p>`
    ).join('');

    detailsDiv.innerHTML = `
        <div class="hotel-details">
            <img src="${hotel.image}" alt="${hotel.name}">
            <h2>${hotel.name}</h2>
            <div class="rating">${starsHTML}</div>
            <p class="hotel-description">${hotel.description}</p>
            
            <h3>المميزات</h3>
            <div class="amenities">
                ${amenitiesHTML}
            </div>

            <div class="room-prices">
                <h3>الغرف والأسعار</h3>
                ${roomsHTML}
            </div>

            <button class="submit-btn" onclick="showBookingForm()">احجز الآن</button>
        </div>
    `;

    document.getElementById('bookingForm').style.display = 'none';
    modal.style.display = 'block';
}

// إظهار نموذج الحجز
function showBookingForm() {
    document.getElementById('bookingForm').style.display = 'block';
    
    // تحديث قائمة أنواع الغرف
    const roomTypeSelect = document.getElementById('roomType');
    roomTypeSelect.innerHTML = '<option value="">اختر نوع الغرفة</option>';
    
    const hotel = hotels[currentHotel];
    Object.entries(hotel.rooms).forEach(([type, room]) => {
        roomTypeSelect.innerHTML += `<option value="${type}">${room.name} - ${room.price} درهم / ليلة</option>`;
    });
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('hotelModal').style.display = 'none';
}

// تقديم نموذج الحجز
function submitBooking(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const roomType = document.getElementById('roomType').value;
    
    if (!selectedCheckIn || !selectedCheckOut) {
        showNotification('الرجاء اختيار تواريخ الحجز', 'error');
        return;
    }

    if (!isRoomAvailable(selectedCheckIn, selectedCheckOut)) {
        showNotification('عذراً، هذه الفترة محجوزة بالفعل', 'error');
        return;
    }

    const hotel = hotels[currentHotel];
    const room = hotel.rooms[roomType];
    const nights = Math.ceil((new Date(selectedCheckOut) - new Date(selectedCheckIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    const booking = {
        hotelId: currentHotel,
        hotelName: hotel.name,
        name,
        email,
        phone,
        checkIn: selectedCheckIn,
        checkOut: selectedCheckOut,
        roomType: room.name,
        totalPrice,
        status: 'pending',
        bookingDate: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    showNotification('تم الحجز بنجاح! في انتظار الموافقة', 'success');
    closeModal();
    displayBookings();
    updateBookedDates();
}

// عرض الحجوزات في الجدول
function displayBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

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
        `;
        tableBody.appendChild(row);
    });
}

// التحقق من توفر الغرفة في التاريخ المحدد
function isRoomAvailable(checkIn, checkOut) {
    if (!currentHotel) return true;
    
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // فلترة الحجوزات للفندق الحالي فقط
    const hotelBookings = bookings.filter(booking => booking.hotelId === currentHotel);
    
    return !hotelBookings.some(booking => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        
        return (
            (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
            (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
            (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
        );
    });
}

// عرض الإشعارات
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// عرض نافذة الترحيب
function showWelcomePopup() {
    const welcomePopup = document.getElementById('welcomePopup');
    welcomePopup.style.display = 'block';
}

// عرض الحجوزات في الجدول
function displayBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

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
        `;
        tableBody.appendChild(row);
    });
}

// الحصول على نص الحالة
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'قيد المراجعة';
        case 'confirmed':
            return 'تم التأكيد';
        case 'cancelled':
            return 'ملغي';
        default:
            return 'قيد المراجعة';
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

// تحديث التواريخ المحجوزة في التقويم
function updateBookedDates() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const calendarBody = document.getElementById('calendarBody');
    if (!calendarBody || !currentHotel) return;

    // إعادة تعيين جميع الخلايا
    const allCells = calendarBody.getElementsByTagName('td');
    Array.from(allCells).forEach(cell => {
        cell.classList.remove('booked-date', 'confirmed-date');
    });

    // تحديث الخلايا بناءً على الحجوزات للفندق الحالي فقط
    bookings.forEach(booking => {
        // تحقق من أن الحجز يخص الفندق الحالي
        if (booking.hotelId === currentHotel) {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            const currentDate = new Date(checkIn);

            while (currentDate <= checkOut) {
                const cells = calendarBody.getElementsByTagName('td');
                Array.from(cells).forEach(cell => {
                    const cellDate = new Date(cell.dataset.date);
                    if (cellDate && cellDate.toDateString() === currentDate.toDateString()) {
                        if (booking.status === 'confirmed') {
                            cell.classList.add('confirmed-date');
                        } else {
                            cell.classList.add('booked-date');
                        }
                    }
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    });

    // تحديث حالة حقول التاريخ
    updateDateInputsStatus();
}

// تحديث عند اختيار التاريخ
function selectDate(date) {
    if (!selectedCheckIn) {
        selectedCheckIn = new Date(date);
        document.getElementById('checkIn').value = date;
        document.getElementById('selectedCheckIn').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckIn);
    } else if (!selectedCheckOut && new Date(date) > selectedCheckIn) {
        selectedCheckOut = new Date(date);
        document.getElementById('checkOut').value = date;
        document.getElementById('selectedCheckOut').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckOut);
        
        // تحديث المظهر المرئي للنطاق المحدد
        updateDateRangeDisplay();
        // تحديث حالة حقول التاريخ
        updateDateInputsStatus();
    } else {
        // إعادة تعيين الاختيار
        selectedCheckIn = new Date(date);
        selectedCheckOut = null;
        document.getElementById('checkIn').value = date;
        document.getElementById('checkOut').value = '';
        document.getElementById('selectedCheckIn').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckIn);
        document.getElementById('selectedCheckOut').textContent = 'غير محدد';
        
        // تحديث حالة حقول التاريخ
        updateDateInputsStatus();
    }
    
    updateCalendarSelection();
}

// تحديث حالة حقول التاريخ
function updateDateInputsStatus() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    if (!checkInInput || !checkOutInput || !currentHotel) return;

    // إزالة الأصناف السابقة
    checkInInput.classList.remove('booked-date', 'confirmed-date');
    checkOutInput.classList.remove('booked-date', 'confirmed-date');

    // البحث عن الحجز الحالي
    const currentBooking = bookings.find(booking => 
        booking.hotelId === currentHotel && 
        booking.checkIn === checkInInput.value && 
        booking.checkOut === checkOutInput.value
    );

    if (currentBooking) {
        const statusClass = currentBooking.status === 'confirmed' ? 'confirmed-date' : 'booked-date';
        checkInInput.classList.add(statusClass);
        checkOutInput.classList.add(statusClass);
    }
}

// تحديث مظهر التواريخ المحددة في التقويم
function updateCalendarSelection() {
    const cells = document.querySelectorAll('.calendar-table td');
    
    cells.forEach(cell => {
        if (cell.textContent) {
            const cellDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                parseInt(cell.textContent)
            );
            
            cell.classList.remove('selected', 'in-range');
            
            if (selectedCheckIn && 
                cellDate.toDateString() === selectedCheckIn.toDateString()) {
                cell.classList.add('selected');
            }
            
            if (selectedCheckOut && 
                cellDate.toDateString() === selectedCheckOut.toDateString()) {
                cell.classList.add('selected');
            }
            
            if (selectedCheckIn && selectedCheckOut &&
                cellDate > selectedCheckIn && cellDate < selectedCheckOut) {
                cell.classList.add('in-range');
            }
        }
    });
}

// الشهر السابق
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// الشهر التالي
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// اختيار التاريخ
function selectDate(date) {
    if (!selectedCheckIn) {
        selectedCheckIn = new Date(date);
        document.getElementById('checkIn').value = date;
        document.getElementById('selectedCheckIn').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckIn);
    } else if (!selectedCheckOut && new Date(date) > selectedCheckIn) {
        selectedCheckOut = new Date(date);
        document.getElementById('checkOut').value = date;
        document.getElementById('selectedCheckOut').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckOut);
        
        // تحديث المظهر المرئي للنطاق المحدد
        updateDateRangeDisplay();
        // تحديث حالة حقول التاريخ
        updateDateInputsStatus();
    } else {
        // إعادة تعيين الاختيار
        selectedCheckIn = new Date(date);
        selectedCheckOut = null;
        document.getElementById('checkIn').value = date;
        document.getElementById('checkOut').value = '';
        document.getElementById('selectedCheckIn').textContent = 
            new Intl.DateTimeFormat('ar-SA').format(selectedCheckIn);
        document.getElementById('selectedCheckOut').textContent = 'غير محدد';
        
        // تحديث حالة حقول التاريخ
        updateDateInputsStatus();
    }
    
    updateCalendarSelection();
}

// تحديث مظهر التواريخ المحددة في التقويم
function updateDateRangeDisplay() {
    const cells = document.querySelectorAll('.calendar-table td');
    
    cells.forEach(cell => {
        if (cell.textContent) {
            const cellDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                parseInt(cell.textContent)
            );
            
            cell.classList.remove('selected', 'in-range');
            
            if (selectedCheckIn && 
                cellDate.toDateString() === selectedCheckIn.toDateString()) {
                cell.classList.add('selected');
            }
            
            if (selectedCheckOut && 
                cellDate.toDateString() === selectedCheckOut.toDateString()) {
                cell.classList.add('selected');
            }
            
            if (selectedCheckIn && selectedCheckOut &&
                cellDate > selectedCheckIn && cellDate < selectedCheckOut) {
                cell.classList.add('in-range');
            }
        }
    });
}

// عرض التقويم
function renderCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    if (!calendarBody) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    // تحديث عنوان الشهر
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    let date = 1;
    let html = '';

    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                html += '<td></td>';
            } else if (date > monthLength) {
                html += '<td></td>';
            } else {
                const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                html += `<td data-date="${currentDateStr}" onclick="selectDate('${currentDateStr}')">${date}</td>`;
                date++;
            }
        }
        html += '</tr>';
        if (date > monthLength) {
            break;
        }
    }

    calendarBody.innerHTML = html;
    updateBookedDates();
    updateCalendarSelection();
}

// تحميل بطاقات الفنادق عند تحميل الصفحة
window.onload = function() {
    const hotelsGrid = document.getElementById('hotelsGrid');
    if (hotelsGrid) {
        hotelsGrid.innerHTML = ''; // Clear any existing content
        Object.entries(hotels).forEach(([id, hotel]) => {
            const starsHTML = '⭐'.repeat(hotel.rating);
            const card = `
                <div class="hotel-card" onclick="showHotelDetails('${id}')">
                    <img src="${hotel.image}" alt="${hotel.name}">
                    <div class="hotel-info">
                        <h3>${hotel.name}</h3>
                        <div class="rating">${starsHTML}</div>
                        <p class="price">من ${hotel.price} درهم / ليلة</p>
                        <button class="details-btn">عرض التفاصيل</button>
                    </div>
                </div>
            `;
            hotelsGrid.innerHTML += card;
        });
    }
    
    // عرض نافذة الترحيب
    showWelcomePopup();
};

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.onclick = function(event) {
        const modal = document.getElementById('hotelModal');
        if (event.target == modal) {
            closeModal();
        }
    };

    // تعيين الحد الأدنى لتاريخ الوصول إلى اليوم
    const today = new Date().toISOString().split('T')[0];
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    
    if (checkIn && checkOut) {
        checkIn.min = today;
        checkIn.addEventListener('change', function() {
            checkOut.min = this.value;
        });
    }
    
    // تهيئة التقويم عند تحميل الصفحة
    renderCalendar();
    updateBookedDates();
    
    // تحميل الحجوزات
    displayBookings();
});
