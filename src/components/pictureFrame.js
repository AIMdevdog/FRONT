import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DrawCursor from "./Cursor";

const PictureContainer = styled.div`
  display: flex;
  position: absolute;
  z-index: 15;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 20px;
  background-color: rgb(0, 0, 0, 0.6);
  .layout {
    height: 100%;
    margin-left: 64px;
    min-width: 1440px;
    max-width: 100vw;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;
const Frame = styled.div`
  margin-right: 20px;
  padding: 20px;
  height: 100vh;
  // background-color: rgb(255, 235, 205, 1);
  border-radius: 5px;
  overflow-y: scroll;

  .picture {
    position: relative;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    outline: 5px solid black;
  }
`;
const PictureInfoContainer = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 30px;
  width: 500px;
  min-width: 300px;
  // height: 45vh;
  // background-color: #ffebcd;
  border-radius: 5px;
  padding: 20px;
`;
const InfoInnerContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  height: 100%;
  background-color: white;
  outline: 5px solid black;
  div {
    margin: 20px;
  }
  span {
    font-size: 20px;
    font-weight: 800; 
  }
  .bigger{
    font-size: 20px;
  }
`;


const PictureFrame = ({ socket, drawNum }) => {
  const ref = useRef();
  const [drawUser, setDrawUser] = useState([]);
  const color = ["red", "green", "blue", "orange", "yellow", "purple"];
  const image = [
    {
      src: "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic1.jpeg",
      title: "인상, 해돋이",
      painter: "클로드 모네",
      discription: `클로드 모네의 1872년작 ‘인상, 해돋이’(영-Impression, Sunrise, 프-Impression, soleil levant)는 모네가 르아브르 항구의 아침 풍경을 그린 유화이다. ‘인상주의’라는 용어의 유래로 알려져 있다. 현재 파리 마르모탕 미술관에서 소장되어 있다.
      모네의 ‘인상, 해돋이’는 미술사에서 특별히 중요한 의미를 갖는다. 대중들이 폭넓게 선호하고, 미술 애호가들이 그림을 가장 소장하고 싶어 한다는 19세기 ‘인상파’. 앞에서 언급했듯이 ‘인상, 해돋이’는 19세기 후반을 퐁미한 인상파의 서막을 알리는 그림으로, 인상파란 유파의 이름도 이것에서 유래됐다. 마네, 드가, 세잔느, 고갱, 고호 등은 모두 이 인상파에 속한다.
      인상파는 사진을 그리듯 사실적 묘사에 치중했던 중세 화풍에서 근대의 추상적 화풍으로 넘어가는 길을 열었고, 이후 입체파, 야수파 등을 거쳐 현대 미술로 발전하게 된다.
      ‘인상, 해돋이’가 1872년 그려지고, 1874년 최초의 인상파전에 처음 등장했을 때는 비평가들로부터 혹독한 평가를 받았다. 뚜렷하지 않은 그림의 윤곽과 흐릿흐릿한 색채 등은 사진처럼 있는 그대로 그리던 당시 미술계에 가히 충격적이었다. 비평가들은 작품 같지 않은 그림을 작품으로 우긴다고 비아냥거렸고, ‘인상파’란 명칭에도 이 비아냥이 깔려있다.
      모네를 비롯한 당시 인상파 화가들은 머리 속에 있는 관념적 그림이 아닌 현장에서 눈에 보이는 그 순간을 화폭에 담으려 했고, 특히 빛에 주목했다. 같은 장소도 그 시점이 오전과 오후, 밤이냐에 따라 빛이 다르고 따라서 언제 그림을 그리느냐에 의해 그림 속 색채도 달라진다는 점에 주목했다.
      ‘인상, 해돋이’는 태양이 가장 붉을 때인 해돋이 순간에 일렁이는 바닷물에 반사되는 빛의 가장 역동적인 순간을 화폭에 담았다.`,
    },
    {
      src: "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic2.jpeg",
      title: "양산을 든 여인 - 모네 부인과 그녀의 아들",
      painter: "클로드 모네",
      discription: `모네의 가볍고 자연스러운 붓놀림은 다양한 색상을 만들어냅니다. 모네 부인의 베일은 바람에 날리며 그녀의 펄럭이는 하얀 드레스도 마찬가지입니다. 초원의 물결치는 풀은 그녀의 파라솔의 녹색 밑면에 울려 퍼집니다. 그녀는 푸른 하늘에 푹신한 흰 구름에 대해 강한 상향 관점으로 아래에서 보는 것처럼 보입니다. 모네의 7세 아들인 소년은 더 멀리 떨어져 있으며, 땅의 융기 뒤에 숨겨져 있고 허리에서만 볼 수 있어 깊이감을 줍니다.`,
    },
    {
      src: "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic3.jpeg",
      title: "지베르니의 예술가 정원",
      painter: "클로드 모네",
      discription: "지베르니의 예술가 정원 (프랑스어: Le Jardin de l'artiste à Giverny )은1900년에 그린 클로드 모네가 현재파리 오르세 미술관 에서 그린 유화 입니다. 이것은 지베르니 정원의 예술가가 생애 의 마지막 30년 동안 수행한 많은 작품 중 하나입니다. 이 그림은 화면을 가로질러 대각선으로 설정된 보라색과 분홍색의 다양한 색조 의 붓꽃 행을 보여줍니다 . 꽃은 나무 아래에 있어 색상의 색조를 변경하여 얼룩덜룩한 빛을 허용합니다. 나무 너머로 모네의 집이 살짝 보입니다.",
    },
    {
      src: "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic4.jpeg",
      title: "The port at Argenteuil",
      painter: "클로드 모네",
      discription: "Argenteuil은 7 세기에 수녀원 으로 설립되었습니다 (피에르 Abélard and the Convent of Argenteuil). 수녀원에서 생겨난 수도원 은 프랑스 혁명 .파리 사람들의 시골 탈출구로 파괴되어 이제는 파리 교외가되었습니다.",
    },
    {
      src: "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic5.jpeg",
      title: "고디베르 부인의 초상",
      painter: "클로드 모네",
      discription: "모네의 일반적인 작품 계열과 작품에서 벗어난 특이한 그림이다. 식사를 하고 있는 사람들보다 램프와 램프빛의 효과가 이 그림의 모티브이며, 일정한 장소에 일정하게 주어진 빛, 그것도 대자연의 빛이 아닌 인공(人工)의 빛을 집요하게 묘사하려는 모네의 의식과 또 하나의 시각을 읽을 수 있다. 하얀 식탁 위의 검소한 차림, 희미한 그림자와 다갈색의 벽면 등이 서로 조화되어 차분하고 온화한 뉘앙스를 표출시켰고, 또한 화가의 생활 수준과 청교도적인 가풍을 간접적으로 시사했다. 제 1회 인상파전이 열리기 4년 전의 그림이라는데 주목해야 한다",
    },
    // "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic2.jpeg",
    // "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic3.jpeg",
    // "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic4.jpeg",
    // "https://aim-front.s3.ap-northeast-2.amazonaws.com/basic5.jpeg",
  ]

  function updateDisplay(event) {
    const xRatio =
      (event.pageX - ref.current.offsetLeft) / ref.current.clientWidth;
    const yRatio =
      (event.pageY - ref.current.offsetTop) / ref.current.clientHeight;
    socket.emit("cursorPosition", xRatio, yRatio, socket.id);
  }
  const throttleUpdateDisplay = throttle(updateDisplay, 48);

  const socketDrawUser = (nickname, num) => {
    if (num === drawNum) {
      setDrawUser((prev) => {
        if (prev.findIndex((e) => e === nickname) === -1) {
          return [...prev, nickname];
        } else {
          return prev;
        }
      });
    }
  }
  const socketCloseUser = (nickname) => {
    setDrawUser((prev) => prev.filter((e) => e !== nickname));
  }


  useEffect(() => {
    socket.on("drawUser", socketDrawUser);
    socket.on("closeUser", socketCloseUser);
    return () => {
      socket.off("drawUser", socketDrawUser);
      socket.off("closeUser", socketCloseUser);
    }
  }, [])

  return (
    <PictureContainer
      onMouseEnter={throttleUpdateDisplay}
      onMouseLeave={throttleUpdateDisplay}
      onMouseMove={throttleUpdateDisplay}
      className="share-arts-container"
    >
      <div className="layout">
        <Frame className="frame" ref={ref}>
          {drawUser.map((data, i) => (
            <DrawCursor
              socket={socket}
              key={data + i}
              color={color[i] || "black"}
              nickname={data}
            />
          ))}
          <img
            className="picture"
            src={image[`${drawNum - 1}`].src}
            alt="image1"
          />
        </Frame>
        <PictureInfoContainer>
          <InfoInnerContainer>
            <div className="bigger"><span>제목:</span> {image[`${drawNum - 1}`].title}</div>
            <div className="bigger"><span>작가:</span> {image[`${drawNum - 1}`].painter}</div>
            <div>
              <span>작품 설명</span> <br /><br /> {image[`${drawNum - 1}`].discription}
            </div>
          </InfoInnerContainer>
        </PictureInfoContainer>
      </div>
    </PictureContainer>
  );
};

export default PictureFrame;
