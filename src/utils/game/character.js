import { Person } from "../../game/Person";

export const joinUser = (id, x, y, nickname, src) => {
    let character = new Person({
        x: 0,
        y: 0,
        id: id,
    });
    character.id = id;
    character.x = x;
    character.y = y;
    character.nickname = nickname;
    character.sprite.image.src = src;
    // character.sprite.xaxios = adjustValue.xaxios;
    // character.sprite.yaxios = adjustValue.yaxios;
    // character.sprite.yratio = adjustValue.yratio;
    return character;
};

export const leaveUser = (data, charMap, characters) => {
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].id === data.id) {
            characters.splice(i, 1);
            break;
        }
    }
    delete charMap[data.id];
    // const userNicknameContainer = document.querySelector(`.${data.id}`);
    // const parentDiv = userNicknameContainer.parentNode;
    // parentDiv.removeChild(userNicknameContainer);
};

export const updateLocation = (data, charMap, characters, socketId) => {
    let char;
    for (let i = 0; i < characters.length; i++) {
        char = charMap[data[i].id];
        if(char.id === socketId){
            continue;
        }
        char.nextDirection.unshift(data[i].direction);
        char.x = data[i].x;
        char.y = data[i].y;
    }
};