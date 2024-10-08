export const formattedPrice = (price) => {
    if (price == null || isNaN(price)) {
        return 'Không xác định'; // Hoặc một giá trị mặc định nào đó
    }

    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};

export const totalMoney = (price, percentDiscount, quantity) => {
    const salePrice = price - (price * percentDiscount) / 100;
    return quantity === 0 ? salePrice : salePrice * quantity;
};

export const handleCalculatePrice = (price, percentDiscount, quantity) => {
    return formattedPrice(totalMoney(price, percentDiscount, quantity));
};

export const formatDateString = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
};

export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidDate = (dateString) => {
    const regex =
        /^(?:(?:(?:0?[1-9]|1\d|2\d|3[01])\/(?:0?[1-9]|1[0-2])\/(?:19|20)\d{2})|(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2\d|3[01])))$/;

    return regex.test(dateString);
};

export const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^(0[35789][0-9]{8})$/;
    return regex.test(phoneNumber);
};

export const convertToISODate = (dateString) => {
    // Kiểm tra xem dateString có hợp lệ không
    if (!dateString || typeof dateString !== 'string') {
        return null;
    }

    // Tách ngày, tháng, năm từ chuỗi đầu vào
    const parts = dateString.split('/');
    if (parts.length !== 3) {
        return null; // Nếu không có đủ 3 phần tử (ngày, tháng, năm), trả về null
    }

    // Lấy ra các thành phần ngày, tháng, năm
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    // Xây dựng lại định dạng ISO 8601
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    return isoDate;
};
