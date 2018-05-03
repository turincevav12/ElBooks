import React, { Component } from 'react';
import Modal from 'react-modal';
import { render } from "react-dom";
import "./index.css"

import NameNewBook from "../newBook/index"
import FormOpenBook from "../readBook/index"


class Head extends Component {
    render() {
        return(
            <div className="header">
                <div className="buttons">
                    <i class="fas fa-check-circle fa-2x" id="icon" onClick={IconClick}></i>
                    <div className="button" onClick={OpenBook}>Открыть книгу</div>
                    <div className="button" onClick={NewBook}>Создать книгу</div>
                    <div className="button" onClick={Setting}>Настройки</div>
                </div>
            </div>
        )
    }    
}

class Accept extends Component{
    render(){
        return(
            <div className="aceptForm">
                <div id="aceptFormName">
                    <span>{}</span>
                </div>
                <div id="aceptFormButtons">
                    <div className="aceptFormButton">Да</div>
                    <div className="aceptFormButton">Нет</div>
                </div>
            </div>
        )
    }
}

function IconClick(){
    document.body.scrollIntoView()
    render("", document.getElementById('form'))
}


function OpenBook(){
    render(<FormOpenBook />, document.getElementById('form'))
}
function NewBook(){
    render(<NameNewBook />, document.getElementById('form'))
}
function Setting(){

}

export default Head