import React from "react";
import Slider from "react-slick";
import styled from "styled-components";

const roomImage =
  "https://aim-front.s3.ap-northeast-2.amazonaws.com/room_images.png";

const RoomImageSliderContainer = styled.div`
  display: flex;
  flex-direction: column;

  .slick-slider {
    width: 300px;
    /* height: 500px; */

    img {
      width: 100%;
      padding: 40px;
    }
  }

  .slick-initialized .slick-slide {
    display: flex !important;
    justify-content: center;
    align-items: center;
  }
`;

const RoomImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <RoomImageSliderContainer>
      <Slider {...settings}>
        <div>
          <img src={roomImage} alt="images" />
        </div>
        <div>
          <img src={roomImage} alt="images" />
        </div>
      </Slider>
    </RoomImageSliderContainer>
  );
};

export default RoomImageSlider;
