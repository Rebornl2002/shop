import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slide from './Slide';
import Sell from './Sell';
import Blog from './Blog';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '@/actions/blogActions';
import { fetchProducts } from '@/actions/productActions';
const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blog.blogs);
    const loadingBlog = useSelector((state) => state.blog.loading);
    const errorBlog = useSelector((state) => state.blog.error);

    const products = useSelector((state) => state.product.products);
    const loadingProduct = useSelector((state) => state.product.loading);
    const errorProduct = useSelector((state) => state.product.error);

    useEffect(() => {
        dispatch(fetchBlogs());
        dispatch(fetchProducts());
    }, [dispatch]);

    console.log(products);

    return (
        <div className={cx('wrapper')}>
            <Slide />
            {!loadingProduct && !errorProduct && products.length > 0 && (
                <Sell props={products} title="Đang khuyến mãi" sale={true} type={false} />
            )}
            {!loadingProduct && !errorProduct && products.length > 0 && (
                <Sell props={products} title="Hàng mới về " type={true} sale={false} />
            )}
            {!loadingBlog && !errorBlog && blogs.length > 0 && <Blog props={blogs} />}
        </div>
    );
}

export default Home;
