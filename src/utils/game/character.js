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
    return character;
};

export const updateLocation = (data, character, socketId) => {
    if(character.id === socketId || !data){
        return;
    }
    // console.log(data);
    character.nextDirection.push(...data);
    // character.x = data.x;
    // character.y = data.y;
};