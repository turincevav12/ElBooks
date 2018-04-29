import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css"

class NameNewBook extends Component {
    render() {
        var nameForNewBook = "Наименование"
        return(
            <div className="formNameNewBook">
                <div id="top-line-creat-book-name">
                    <span>{nameForNewBook}</span> 
                </div>
                <input id="newNameBook" placeholder={nameForNewBook}></input>

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
        var NameBook = document.getElementById('newNameBook').value

        return(
            <div className="NewBook">
                <div id="book">
                    <div id="nameBook">
                        <span>{NameBook}</span>
                    </div>
                </div>
                <div id="newBookButtons">
                    <div className="newBookButton" onClick={NewBookButton_1}>
                        <span>Создать обзац...</span>
                    </div>
                    <div className="newBookButton" onClick={NewBookButton_2}>
                        <span>Создать текс абзаца...</span>
                    </div>
                    <div className="newBookButton" onClick={NewBookButton_3}>
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
var i = 0
function NewBookButton_1 () {
    var inputAbzac = document.createElement('input')
    inputAbzac.id = "inputAbzac"+i
    inputAbzac.className = "inputAbzac"
    inputAbzac.placeholder = "Название абзаца"
    document.getElementById('book').appendChild(inputAbzac)
    i++
}
function NewBookButton_2 () {
    
}
function NewBookButton_3 () {

}
export default NameNewBook