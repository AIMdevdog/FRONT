import { useState } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
const RoomItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(312px, 1fr));
  gap: 32px;
  -webkit-box-align: start;
  align-items: start;
  margin: 20px;
`;

const RoomItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;

  div {
    border: 3px solid transparent;
    cursor: pointer;
    margin-top: 10px;
    border-radius: 16px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;

    span {
      font-family: "DM Sans", sans-serif;
      color: white;
    }
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    aspect-ratio: 16 / 9;
    box-shadow: rgb(0 0 0 / 10%) 0px 12px 12px;
    background-color: rgb(0, 0, 0);
  }
`;

const UserInfoModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 7;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`;

const UserInfoModal = styled.div`
  display: flex;
  background-color: rgb(32, 37, 64);
  flex-direction: column;
  padding: 32px;
  border-radius: 32px;
  z-index: 7;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserInfoTopSection = styled.div`
  border-radius: 32px 32px 0px 0px;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgb(51, 58, 100);
  display: flex;
  height: 30vh;
  position: relative;
  min-height: 200px;
  max-height: 240px;
  margin: -32px -32px 0px;

  img {
    width: 118px;
    height: 236px;
    object-fit: cover;
    object-position: 0px 0px;
    image-rendering: pixelated;
    position: absolute;
    bottom: 17px;
    z-index: 1;
    transform: translate3d(0px, 0px, 0px);
  }
`;

const UserNickname = styled.div`
  display: flex;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;

  span {
    color: white;
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
  }
`;

const UserInfoBottomSection = styled.div`
  display: flex;
  padding-top: 20px;
  width: 372px;
  flex-direction: column;
`;

const UserInfoBottomInputSection = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;

  &:nth-child(1) {
    display: flex;
    /* margin-bottom: 10px; */

    span {
      color: rgb(255, 255, 255);
      font-family: "DM Sans", sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
    }
  }

  &:nth-child(2) {
    display: flex;
    /* margin-bottom: 10px; */

    span {
      color: rgb(202, 216, 255);
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
    }
  }

  &:nth-child(3) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    div {
      display: flex;
      flex-direction: column;
      width: 100%;

      div {
        width: 100%;
        border: 2px solid rgb(144, 156, 226);
        border-radius: 16px;
        display: flex;
        flex-direction: row;
        -webkit-box-align: center;
        align-items: center;
        transition: border 200ms ease 0s;
        box-sizing: border-box;
        height: 40px;
        padding: 0px 8px 0px 16px;

        input {
          border: none;
          box-shadow: none;
          background: transparent;
          -webkit-box-flex: 1;
          flex-grow: 1;
          font-weight: 500;
          font-size: 15px;
          font-family: inherit;
          line-height: 20px;
          color: rgb(255, 255, 255);
          width: 100%;
          height: 100%;
        }
      }
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  div {
    display: flex;
    margin: 8px;
  }
`;

const BackButton = styled.button`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: rgb(84, 92, 143);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;
`;

const FinishButton = styled.button`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: rgb(6, 214, 160);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;
`;

const RoomItemComponent = (props) => {
  const { data } = props;
  const [isOpen, setIsOpen] = useState(false);

  const enterRoom = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <RoomItems>
        {data?.map((item) => {
          return (
            <RoomItem
              onClick={enterRoom}
              key={item.id}
              background={item?.image}
            >
              <img src={item.image} alt="background image" />
              <div>
                <span>{item?.title}</span>
              </div>
              <div style={{ marginTop: 4 }}>
                <span>{item?.desc}</span>
              </div>
            </RoomItem>
          );
        })}
      </RoomItems>
      {isOpen && (
        <UserInfoModalContainer>
          <UserInfoModal>
            <UserInfo>
              <UserInfoTopSection>
                <img
                  src="https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png"
                  alt="user-character"
                />
              </UserInfoTopSection>
              <UserNickname>
                <span>fred</span>
              </UserNickname>
              <UserInfoBottomSection>
                <UserInfoBottomInputSection>
                  <div>
                    <span>Name your character</span>
                  </div>
                </UserInfoBottomInputSection>
                <UserInfoBottomInputSection>
                  <div>
                    <span>
                      Pick a name for your character – don’t worry, you’ll be
                      able to customize it after!
                    </span>
                  </div>
                </UserInfoBottomInputSection>
                <UserInfoBottomInputSection>
                  <div>
                    <div>
                      <input type="text" maxLength="50" />
                    </div>
                  </div>
                </UserInfoBottomInputSection>
                <ButtonContainer>
                  <div>
                    <BackButton onClick={enterRoom}>Back</BackButton>
                  </div>
                  <div>
                    <FinishButton>Finish</FinishButton>
                  </div>
                </ButtonContainer>
              </UserInfoBottomSection>
            </UserInfo>
          </UserInfoModal>
        </UserInfoModalContainer>
      )}
    </>
  );
};

export default RoomItemComponent;
