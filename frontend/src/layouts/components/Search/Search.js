import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchProducts } from '@/actions/productActions';
import { handleCalulatePrice } from '@/calculate/price';
import { Link } from 'react-router-dom';
import routes from '@/config/routes';

const cx = classNames.bind(styles);

function Search() {
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');

    const searchData = useSelector((state) => state.product.searchs);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchValue);
        }, 1000);
        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    useEffect(() => {
        if (debouncedValue.trim()) {
            dispatch(fetchSearchProducts(debouncedValue.trim()));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const handleSearch = (e) => {
        setSearchValue(e.target.value.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ' && searchValue.length === 0) {
            e.preventDefault();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <input
                    type="text"
                    placeholder="Từ khóa tìm kiếm ..."
                    className={cx('input-search')}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
            </div>
            <div className={cx('result', { visible: debouncedValue.trim() })}>
                {debouncedValue.trim() && searchData.length > 0 && (
                    <div className={cx('result-container')}>
                        {searchData.map((product, index) => (
                            <Link to={`${routes.product}/${product.maSP}`} className={cx('result-product')} key={index}>
                                <div
                                    className={cx('result-img')}
                                    style={{
                                        backgroundImage: `url(${product.imgSrc})`,
                                    }}
                                ></div>
                                <div className={cx('result-inf')}>
                                    <div className={cx('result-name')}> {product.name}</div>
                                    <div className={cx('result-price')}>
                                        {handleCalulatePrice(product.price, product.percentDiscount, 1)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
