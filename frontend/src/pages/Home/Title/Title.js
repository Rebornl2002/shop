import classNames from 'classnames/bind';
import styles from './Title.module.scss';

const cx = classNames.bind(styles);

function Title({ title, type }) {
    return (
        <div className={cx('wrapper-title')}>
            <div className={cx('title', { 'change-background': type })}>
                <div className={cx('container-title', { 'change-outline': type })}>
                    <div className={cx('content-title')}>{title}</div>
                </div>
            </div>
        </div>
    );
}

export default Title;
