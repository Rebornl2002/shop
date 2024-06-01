import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slide from './Slide';
import Sell from './Sell';
import Blog from './Blog';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '@/actions/blogActions';

const cx = classNames.bind(styles);

function Home() {
    // const [products, setProducts] = useState([]);
    // const [productsLoaded, setProductsLoaded] = useState(false);

    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blog.blogs);
    const loading = useSelector(state => state.blog.loading);
    const error = useSelector(state => state.blog.error);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    console.log(loading);
    
    return (
        <div className={cx('wrapper')}>
            <Slide />
            {/* {productsLoaded && <Sell props={products} title="Đang khuyến mãi" sale={true} type={false} />}
            {productsLoaded && <Sell props={products} title="Hàng mới về " type={true} sale={false} />} */}
            {!loading && !error && blogs.length > 0&& <Blog props={blogs} />} 
        </div>
    );
}

export default Home;
