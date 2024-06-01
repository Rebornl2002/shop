import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import Title from '../Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useState} from 'react';

const cx = classNames.bind(styles);

function Blog({ props }) {
    console.log(props);
    const [current, setCurrent] = useState(0);
   
    return (
        <div className={cx('wrapper')}>
            <Title title="Blog làm đẹp" type={true} />
            <div className={cx('blog-content')}>
                <img src={props[current].imgSrc} alt="anh-blog" className={cx('blog-img')} />
                <div className={cx('blog-description')}>
                    <div className={cx('blog-title')}>{props[current].title}</div>
                    <div className={cx('blog-summary')}>{props[current].description}</div>
                    <div className={cx('blog-date')}>{props[current].date}</div>
                    <div className={cx('blog-btn')}>
                        <span className={cx('blog-btn-text')}>
                            Xem chi tiết <FontAwesomeIcon icon={faArrowRight} className={cx('blog-btn-icon')} />
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('bookmark')}>
                {props.map((prop, index) => {
                    return (
                        <FontAwesomeIcon
                            key={index}
                            icon={faCircle}
                            className={cx('bookmark-icon', { active: index === current })}
                            onClick={() => setCurrent(index)}
                        />
                    );
                })}
            </div>
          
        </div>
    );
}

export default Blog;
