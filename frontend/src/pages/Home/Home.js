import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slide from './Slide';
import Sell from './Sell';
import Blog from './Blog';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '@/actions/blogActions';
import { fetchDiscountProducts, fetchProducts } from '@/actions/productActions';
import ProductPopup from './ProductPopup';

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blog.blogs);
    const loadingBlog = useSelector((state) => state.blog.loading);
    const errorBlog = useSelector((state) => state.blog.error);

    const { products, currentPage, hasMore } = useSelector((state) => state.product);
    const loadingProduct = useSelector((state) => state.product.loading);
    const errorProduct = useSelector((state) => state.product.error);
    const discountProducts = useSelector((state) => state.product.discountProducts);

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            dispatch(fetchBlogs());
            dispatch(fetchProducts(1));
            dispatch(fetchDiscountProducts());
            hasFetchedRef.current = true;
        }
    }, [dispatch]);

    const handleMore = () => {
        dispatch(fetchProducts(currentPage));
    };

    return (
        <div className={cx('wrapper')}>
            <Slide />
            {/* {discountProducts.length > 0 && (
                <Sell props={discountProducts} title="Đang khuyến mãi" sale={true} type={false} />
            )} */}
            {!loadingProduct && !errorProduct && products.length > 0 && (
                <Sell
                    props={products}
                    title="Hàng mới về "
                    type={true}
                    sale={false}
                    more={true}
                    onMore={handleMore}
                    hasMore={hasMore}
                />
            )}
            {!loadingBlog && !errorBlog && blogs.length > 0 && <Blog props={blogs} />}
            <ProductPopup />
        </div>
    );
}

export default Home;
