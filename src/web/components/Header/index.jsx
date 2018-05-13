import React, { Component } from 'react';
import Modal from 'react-modal';
import { render } from "react-dom"
import styles from "./index.css"

import SelectBook from "../SelectBook/index.jsx"
import NewBook from "../NewBook/index.jsx"


export class Header extends Component{
    render(){
        return(
            <div className={styles.header}>
                <div className={styles.buttons}>
                    <i className="fas fa-check-circle fa-2x" id={styles.icon}></i>
                    <div className={styles.button} onClick={OpenBook}>Открыть книгу</div>
                    <div className={styles.button} onClick={CreatBook}>Создать книгу</div>
                </div>
            </div>
        )
    }
}
    
function OpenBook () {
    render(<SelectBook />, document.getElementById('form'))
};

function CreatBook () {
    render(<NewBook />, document.getElementById('form'))
};