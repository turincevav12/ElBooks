import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css"

class NameNewBook extends Component {
    render() {
        return(
            <div className="formNameNewBook">
                <div id="top-line-creat-book-name">
                    <span>Название книги</span> 
                </div>
                <input id="newNameBook" placeholder="Наименование"></input>

                <div id="buttons">
                    <div onClick={Creat} className="buttons-creat-new-book">Создать</div>
                    <div onClick={Cancel} className="buttons-creat-new-book">Отмена</div>
                </div>
            </div>
        )
    }    
}

class NewBook extends Component {
    
    render(){
        const NameBook = document.getElementById('newNameBook').value

        return(
            <div className="NewBook">
                <div id="book">
                    <div id="nameBook">
                        <span>{NameBook}</span>
                    </div>
                </div>
                <div id="newBookButtons">
                    <div className="newBookButton" onClick={alert('1')}>
                        <span>Создать обзац...</span>
                    </div>
                    <div className="newBookButton" onClick={alert('1')}>
                        <span>Создать текс абзаца...</span>
                    </div>
                    <div className="newBookButton" onClick={alert('1')}>
                        <span>Сохранить</span>
                    </div>
                </div>
            </div>
        )
    }
}

function Creat () {
    render(<NewBook />,document.getElementById("form"))
}

function Cancel () {
    render("",document.getElementById("form"))
}
export default NameNewBook