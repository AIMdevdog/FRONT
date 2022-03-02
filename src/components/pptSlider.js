import React, { useRef, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

const PptContainer = styled.div`
    background-color: black;
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100vh;
`;

const ArrowWrap = styled.div`
    .slick-prev {
        display:none;
        left: 3% !important;
        z-index: 1;
    }
    .slick-next {
        display:none;
        right: 3% !important;
        z-index: 1;
    }
    // .slick-slide{
    //     width: 100%;
    //     height: 100%;
    // }
    .slick-slide > div > div {
        display: flex !important;
        justify-content: center;
        // width: 500px;
        // height: 100%;
    }

    .slick-slide > div > div>img{
        height:100vh;
        width:100vw;
    }
    .slick-dots > ul > li {
        width: 30px;
        height: 30px;
    }   
`
const PptSlider = ({pptImgs}) => {
    const [isCurrent, setCurrent] = useState(null);
    const slider1 = useRef();

    const next = () => {
        slider1.current.slickNext();
    }

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        beforeChange: (current, next) => {
            setCurrent((before) => (before = pptImgs[next]));
        },
        customPaging: (i) => {
            return (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "rgb(34, 34, 34)",
                    }}
                >
                    <img
                        src={`${pptImgs[i]}`}
                        style={{
                            right: "-1px",
                            objectFit: "cover",
                            objectPosition: "-1px 9px",
                            width: "100%",
                            height: "200%",
                            imageRendering: "pixelated",
                            transform: "scale(1.25)",
                        }}
                        alt="ppt list"
                    />
                </div>
            );
        },
    };
    return (
        <PptContainer onClick={next}>
            <ArrowWrap>
                <Slider {...settings} ref={slider => (slider1.current = slider)}>
                    {pptImgs.map((pptSrc, index) => {
                        return (
                            <div key={index}>
                                <img src={pptSrc} alt="ppt" />
                            </div>
                        );
                    })}
                </Slider>
            </ArrowWrap>
        </PptContainer>
    );
}

export default PptSlider;