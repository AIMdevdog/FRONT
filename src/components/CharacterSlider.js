import React, { useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

const ArrowWrap = styled.div`
  .slick-prev {
    left: 3% !important;
    z-index: 1;
  }
  .slick-next {
    right: 3% !important;
    z-index: 1;
  }
  .slick-slide > div > div {
    display: flex !important;
    justify-content: center;
    width: 180px;
    height: 180px;
  }
`;

const SimpleSlider = () => {
  const charImgs = [
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-sb7g6nQb3ZYxzNHryIbM.png	",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-vjTD4tj1AdR3182C7mHH.png",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-uBxqrmbWQ15ykHxtWAi5-VztAi3oJnxQHhHU1sWpH-WW1GTt4cFIfI7aG4zd1o.png",
    "https://dynamic-assets.gather.town/sprite/avatar-pYI5t3fZnQhRlQnCPEE1-C0ykfrlDx7AkQsLyLcNS-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-SC1roOyG6AGYCzcBSZam-VV89xZCDRo6OfVKMiHDL.png",
    "https://dynamic-assets.gather.town/sprite/avatar-pP91s8KE7enD7HAXD27i-dQCYs4n7O99ksXuBIe33-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-sVKwufLMwK1Arxlf97pz-lnwpCVixsUIqSixRPC8T.png",
    "https://dynamic-assets.gather.town/sprite/avatar-C0ykfrlDx7AkQsLyLcNS-O4fcHqx7z1JBI5wTYaS6-yFpcQh7UcvdChVN8WvIW-Hj5gUXZlV0buPDZNyVjq-ajuL49i7C1GPb3SSzdGE-JB1jFMCsTzYIs8ZXSewh.png",
    "https://dynamic-assets.gather.town/sprite/avatar-aeJhE2yHSYx7EfnQKpTW-ZMvgHzgMYMTUHLHlSmLS-8hCSfYIK6RvpToNgMJNB-xayLOInw3HISMHHNcXwg-yFpcQh7UcvdChVN8WvIW-SC1roOyG6AGYCzcBSZam-QD1dfiGx3GhblDjHCj3T-eeWeU121K33Guk3ms1Kn-5rg2xBZpHHxlFKNCLJvZ.png",
  ];
  // axios.get("url",{

  // })
  const [isCurrent, setCurrent] = useState(null);

  const settings = {
    dots: true,
    // lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    beforeChange: (current, next) => {
      setCurrent(charImgs[current]);
    },

    // this.setState({ oldSlide: current, activeSlide: next }),
    //  afterChange: current => this.setState({ activeSlide2: current })
  };
  return (
    <ArrowWrap>
      <Slider {...settings}>
        {charImgs.map((charSrc) => {
          return (
            <div key={charSrc}>
              <img src={charSrc} alt="user-character" />
            </div>
          );
        })}
      </Slider>
    </ArrowWrap>
  );
};

export default SimpleSlider;
