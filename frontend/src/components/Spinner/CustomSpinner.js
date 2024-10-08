import Spinner from 'react-bootstrap/Spinner';

function CustomSpinner() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
            <Spinner animation="border" role="status"></Spinner>
        </div>
    );
}

export default CustomSpinner;
