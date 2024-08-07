import classNames from 'classnames/bind';
import styles from './DetailCart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { formattedPrice, handleCalculatePrice, totalMoney } from '@/calculate/calculate';
import { updateCartQuantity, getCartData, deleteCart } from '@/actions/cartActions';
import { useState } from 'react';
import Confirm from '@/components/Confirm';

const cx = classNames.bind(styles);

function DetailCart() {
    const data = useSelector((state) => state.cart.carts);
    const dispatch = useDispatch();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [productDelete, setProductDelete] = useState({});
    const [status, setStatus] = useState(false);
    const [statusDeleteSelecteds, setStatusDeleteSelecteds] = useState(false);

    const handleUpdateQuantity = (id, quantity) => {
        if (quantity !== 0) {
            dispatch(updateCartQuantity(id, quantity))
                .then(() => {
                    return dispatch(getCartData());
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prevSelected) => {
            const isSelected = prevSelected.some((item) => item.id === product.id);
            const updatedSelected = isSelected
                ? prevSelected.filter((item) => item.id !== product.id)
                : [...prevSelected, product];

            setSelectAll(updatedSelected.length === data.length);
            return updatedSelected;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(data);
        }
        setSelectAll(!selectAll);
    };

    const totalMoneySelected = () => {
        const total = selectedProducts.reduce((acc, product) => {
            const money = totalMoney(product.price, product.percentDiscount, product.quantity);
            return acc + money;
        }, 0);
        return total;
    };

    const onClose = () => {
        setStatus(false);
        setProductDelete({});
    };

    const onCloseAll = () => {
        setStatusDeleteSelecteds(false);
    };

    const handleDelete = (product) => {
        setStatus(true);
        setProductDelete(product);
    };

    const handleDeleteCart = (id) => {
        dispatch(deleteCart(id))
            .then(() => {
                return dispatch(getCartData());
            })
            .catch((err) => {
                console.error(err);
            });
        onClose();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('product-card')}>
                    <input
                        type="checkbox"
                        className={cx('tick-product')}
                        readOnly
                        id="all"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                    <label htmlFor="all"></label>
                    <div className={cx('product-summary')}>Sản phẩm</div>
                </div>
                <div className={cx('product-detail')}>
                    <div className={cx('unit-price')}>Đơn giá</div>
                    <div className={cx('quantity')}>Số lượng</div>
                    <div className={cx('price')}>Số tiền</div>
                    <div className={cx('operation')}>Thao tác</div>
                </div>
            </div>
            {data.length > 0 &&
                data.map((product, index) => {
                    return (
                        <div key={index} className={cx('row')}>
                            <div className={cx('product-card')}>
                                <input
                                    id={index}
                                    type="checkbox"
                                    className={cx('tick-product')}
                                    checked={selectedProducts.some((item) => item.id === product.id)}
                                    onChange={() => handleCheckboxChange(product)}
                                />
                                <label htmlFor={index}></label>
                                <div className={cx('product-summary')}>
                                    <div
                                        className={cx('product-img')}
                                        style={{
                                            backgroundImage: `url(${product.imgSrc})`,
                                        }}
                                    ></div>
                                    <div className={cx('product-name')}>{product.name}</div>
                                </div>
                            </div>
                            <div className={cx('product-detail')}>
                                <div className={cx('unit-price')}>
                                    <span className={cx('cost')}>{formattedPrice(product.price)}</span>
                                    <span className={cx('promotional-price')}>
                                        {formattedPrice(
                                            handleCalculatePrice(product.price, product.percentDiscount, 1),
                                        )}
                                    </span>
                                </div>
                                <div className={cx('quantity')}>
                                    <FontAwesomeIcon
                                        icon={faMinus}
                                        className={cx('icon', { 'icon-ban': product.quantity === 1 })}
                                        onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                                    />
                                    <span>{product.quantity}</span>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className={cx('icon')}
                                        onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                                    />
                                </div>
                                <div className={cx('price')}>
                                    <span>
                                        {formattedPrice(
                                            handleCalculatePrice(
                                                product.price,
                                                product.percentDiscount,
                                                product.quantity,
                                            ),
                                        )}
                                    </span>
                                </div>
                                <div className={cx('operation')}>
                                    <span onClick={() => handleDelete(product)}>Xóa</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            {status && (
                <Confirm
                    title={`Bạn có muốn xóa sản phẩm "${productDelete.name}" không ?`}
                    data={productDelete}
                    onClose={onClose}
                    onAction={handleDeleteCart}
                />
            )}
            <div className={cx('payment')}>
                <div className={cx('payment-select')}>
                    <input
                        type="checkbox"
                        className={cx('tick-product')}
                        readOnly
                        id="select-all"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all"></label>
                    <div className={cx('payment-summary')}>Chọn tất cả ({selectedProducts.length})</div>
                    <div className={cx('delete')} onClick={() => setStatusDeleteSelecteds(true)}>
                        Xóa
                    </div>
                    {data.length > 0 && statusDeleteSelecteds && (
                        <Confirm
                            title={`Bạn có muốn xóa ${selectedProducts.length} sản phẩm không ?`}
                            data={selectedProducts}
                            onClose={onCloseAll}
                            onAction={handleDeleteCart}
                        />
                    )}
                </div>
                <div className={cx('payment-total')}>
                    <div className={cx('total')}>
                        Tổng: <span>{formattedPrice(totalMoneySelected())}</span>
                    </div>
                    <div className={cx('buy-btn')}>Mua hàng</div>
                </div>
            </div>
        </div>
    );
}

export default DetailCart;
