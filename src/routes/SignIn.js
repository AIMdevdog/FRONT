import axios from "axios";
import React, {useState} from "react";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const onChange = (event) =>{
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }else if(name === "nickname"){
            setNickname(value);
        }else if(name === "phoneNum"){
            setPhoneNum(value);
        }
    }


    const onSubmit = async (event) => {
        event.preventDefault();

        await axios.post("http://localhost:3000/sign",{
            email: email,
            password: password,
            nickname: nickname,
            phone_num: phoneNum
        }).then((res) => console.log(res))
    }
    return(
        <form onSubmit={onSubmit}>
        <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
        />
        <input
            name="password"
            type="password"
            placeholder="Password"
            required 
            value={password}
            onChange={onChange}
        />
        <input
            name="nickname"
            type="text"
            placeholder="nickname"
            required 
            value={nickname}
            onChange={onChange}
        />
        <input
            name="phoneNum"
            type="number"
            placeholder="phone number"
            required 
            value={phoneNum}
            onChange={onChange}
        />
        <button 
        >sign in</button>
    </form>
    )
}

export default SignIn;