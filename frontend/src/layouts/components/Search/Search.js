import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    return (
        <div className={cx('wrapper')}>
            <input type="text" placeholder="Từ khóa tìm kiếm ..." className={cx('input-search')} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
        </div>
    );
}

export default Search;
