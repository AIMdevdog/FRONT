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

export const updateLocation = (data, character, socketId) => {
    if(character.id === socketId){
        return;
    }
    character.nextDirection.unshift(data.direction);
    character.x = data.x;
    character.y = data.y;
};