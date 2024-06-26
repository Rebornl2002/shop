import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import Title from '../Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Blog({ props }) {
    const [current, setCurrent] = useState(0);

    const extractDate = (timestamp) => {
        const date = new Date(timestamp);

        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

        return formattedDate;
    };

    return (
        <div className={cx('wrapper')}>
            <Title title="Blog làm đẹp" type={true} />
            <div className={cx('blog-content')}>
                <img src={props[current].imgSrc} alt="anh-blog" className={cx('blog-img')} />
                <div className={cx('blog-description')}>
                    <div className={cx('blog-title')}>{props[current].title}</div>
                    <div className={cx('blog-summary')}>{props[current].description}</div>
                    <div className={cx('blog-date')}>{extractDate(props[current].date)}</div>
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
