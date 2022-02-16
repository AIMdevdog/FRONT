import React, { useState } from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter
} from "react-pro-sidebar";
import { FaGem, FaList, FaGithub, FaLinux, FaSteam } from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import styled from "styled-components";

const SidebarStyle = styled.div`
    .sidebar-wrap{
        position: fixed;
        // left: ${props => props.left ? '100px' : '0px'};
    }
    .sidebar-btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px;
  }
  
  .sidebar-btn {
    padding: 1px 15px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.05);
    color: #adadad;
    text-decoration: none;
    margin: 0 auto;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .sidebar-btn span {
    margin-left: 10px;
    font-size: 13px;
  }
`


export default function Aside() {
    const [linuxCollapsed, SetLinuxCollapsed] = useState(true);
    const [linuxPosition, setLinuxPosition] = useState("0px");
    const headerStyle = {
        padding: "24px",
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: "1px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "noWrap"
    };

    const changeLinuxCollapsed = () => {
        SetLinuxCollapsed((linuxCollapsed) => linuxCollapsed ? false : true)
        setLinuxPosition((linuxPosition) => linuxPosition === "0px" ? "80px" : "0px")
        console.log(linuxPosition)
    }

    return (
        <>
            {/* 리눅스 사이드바 */}
            <SidebarStyle>
                <ProSidebar
                    className="sidebar-wrap"
                    width="180px"
                    collapsed={linuxCollapsed}
                    style={{ left: linuxPosition }}
                >
                    {/* <SidebarHeader style={headerStyle} onClick={changeCollapsed}>   <FaList /></SidebarHeader> */}
                    <SidebarContent>
                        <div style={{marginTop:"30px"}}>
                            here is for linux
                        </div>
                    </SidebarContent>
                    <SidebarFooter style={{ textAlign: "center" }}>
                    </SidebarFooter>
                </ProSidebar>
            </SidebarStyle>
            <SidebarStyle>
                <ProSidebar className="sidebar-wrap" collapsed="true" >
                    {/* <SidebarHeader style={headerStyle} onClick={changeCollapsed}>   <FaList /></SidebarHeader> */}
                    <SidebarContent>
                        <Menu iconShape="circle">
                            <MenuItem icon={<FaLinux />} onClick={changeLinuxCollapsed}></MenuItem>
                            <MenuItem icon={<FaGem />}></MenuItem>
                            <MenuItem icon={<FaSteam />}></MenuItem>
                        </Menu>


                        {/* <Menu iconShape="circle">
                        <SubMenu
                            suffix={<span className="badge yellow">3</span>}
                            title="With Suffix"
                        >
                            <MenuItem> 1 </MenuItem>
                            <MenuItem> 2 </MenuItem>
                            <MenuItem> 3 </MenuItem>
                        </SubMenu>
                    </Menu> */}
                    </SidebarContent>
                    <SidebarFooter style={{ textAlign: "center" }}>
                    </SidebarFooter>
                </ProSidebar>
            </SidebarStyle>
        </>
    );
}