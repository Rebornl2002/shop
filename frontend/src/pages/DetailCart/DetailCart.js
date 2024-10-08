import classNames from 'classnames/bind';
import styles from './DetailCart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { formattedPrice, handleCalculatePrice, totalMoney } from '@/calculate/calculate';
import { updateCartQuantity, getCartData, deleteCart } from '@/actions/cartActions';
import { useState } from 'react';
import Confirm from '@/components/Confirm';
import { useNavigate } from 'react-router-dom';
import { getProductToPurchase } from '@/actions/productActions';
import { Toast } from '@/components/Toast/Toast';

const cx = classNames.bind(styles);

function DetailCart() {
    const data = useSelector((state) => state.cart.carts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [productDelete, setProductDelete] = useState({});
    const [status, setStatus] = useState(false);
    const [statusDeleteSelecteds, setStatusDeleteSelecteds] = useState(false);

    const handleUpdateQuantity = (productId, variationId, quantity) => {
        if (quantity > 0) {
            dispatch(updateCartQuantity(productId, variationId, quantity))
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
            const isSelected = prevSelected.some(
                (item) => item.productId === product.productId && item.variationId === product.variationId,
            );
            const updatedSelected = isSelected
                ? prevSelected.filter(
                      (item) => item.productId !== product.productId || item.variationId !== product.variationId,
                  )
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
        console.log(id);
        dispatch(deleteCart(id))
            .then(() => {
                return dispatch(getCartData());
            })
            .catch((err) => {
                console.error(err);
            });
        onClose();
    };

    const handleBuy = () => {
        if (selectedProducts.length > 0) {
            dispatch(getProductToPurchase(selectedProducts));
            navigate('/buy');
        } else {
            Toast.error('Bạn chưa chọn sản phẩm để mua');
        }
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
                                    checked={selectedProducts.some(
                                        (item) =>
                                            item.productId === product.productId &&
                                            item.variationId === product.variationId,
                                    )}
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
                                        {handleCalculatePrice(product.price, product.percentDiscount, 1)}
                                    </span>
                                </div>
                                <div className={cx('quantity')}>
                                    <FontAwesomeIcon
                                        icon={faMinus}
                                        className={cx('icon', { 'icon-ban': product.quantity === 1 })}
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                product.productId,
                                                product.variationId,
                                                product.quantity - 1,
                                            )
                                        }
                                    />
                                    <span>{product.quantity}</span>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className={cx('icon')}
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                product.productId,
                                                product.variationId,
                                                product.quantity + 1,
                                            )
                                        }
                                    />
                                </div>
                                <div className={cx('price')}>
                                    <span>
                                        {handleCalculatePrice(product.price, product.percentDiscount, product.quantity)}
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
                    <div className={cx('buy-btn')} onClick={() => handleBuy()}>
                        Mua hàng
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailCart;
