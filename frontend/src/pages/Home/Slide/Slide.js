import image1 from '@/assets/images/slide1.jpg';
import image2 from '@/assets/images/slide2.jpg';
import image3 from '@/assets/images/slide3.jpg';
import image4 from '@/assets/images/slide4.jpg';
import { useState } from 'react';

import Carousel from 'react-bootstrap/Carousel';
import Image from '@/components/Image/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Slide() {
    const [listSlide] = useState([image1, image2, image3, image4]);

    return (
        <Carousel
            style={{ width: '100%' }}
            interval={3000}
            prevIcon={<FontAwesomeIcon icon={faArrowLeft} style={{ color: 'var(--default-bold)', fontSize: '20px' }} />}
            nextIcon={
                <FontAwesomeIcon icon={faArrowRight} style={{ color: 'var(--default-bold)', fontSize: '20px' }} />
            }
        >
            {listSlide.map((slide, index) => {
                return (
                    <Carousel.Item key={index}>
                        <div
                            style={{
                                width: '100%',
                                height: '400px',
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={slide}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                );
            })}
        </Carousel>
    );
}

export default Slide;
