export const formattedPrice = (price) => {
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};
export const totalMoney = (price, percentDiscount, quantity) => {
    const salePrice = price - (price * percentDiscount) / 100;
    return quantity === 0 ? salePrice : salePrice * quantity;
};

export const handleCalulatePrice = (price, percentDiscount, quantity) => {
    return formattedPrice(totalMoney(price, percentDiscount, quantity));
};
