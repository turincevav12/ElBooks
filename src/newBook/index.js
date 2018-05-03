import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css";

var fs = require("fs");

window.bookMass = [
    
]


try {
    
    var fs = require("fs");
    fs.appendFile('message.txt', 'data to append', function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    
    } catch (err) {
    
        
}

class NameNewBook extends Component {
    render() {
            
        return(
            <div className="formNameNewBook">
                <div id="top-line-creat-book-name">
                    <span>Наименование</span> 
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
        return(
            <div className="NewBook">
                <div id="book">
                    <div id="nameBook">
                        <span>{window.bookMass[0].name}</span>
                    </div>
                    <div id="textBook">

                    </div>
                </div>
                <div id="newBookButtons">
                    <div className="newBookButton" onClick={NewBookButton_1}>
                        <span>Добавить абзац</span>
                    </div>
                    <div className="newBookButton" onClick={NewBookButton_2}>
                        <span>Сохранить</span>
                    </div>
                </div>
            </div>
        )
    }
}

class NewAbzac extends Component {
    render(){
        return(
            <div className="formAbzacNewBook">
                <div id="top-line-creat-book-name">
                    <span>Добавление абзаца</span> 
                </div>
                <input id="newAbzac" placeholder="Название абзаца..."></input>
                <textarea name="textOfBook" id="textareaTextAbzac" wrap="virtual" placeholder="Текст..."></textarea> 

                <div id="buttonsAbzac">
                    <div onClick={addAbzac} className="buttons-creat-new-book">Добавит</div>
                    <div onClick={CancelAbzac} className="buttons-creat-new-book">Закончить</div>
                </div>
            </div>
        )
    }
}

function Creat () {
    window.bookMass.push({"name": document.getElementById('newNameBook').value})
    render(<NewBook />,document.getElementById("form"))
    window.i = true
}

function Cancel () {
    render("",document.getElementById("form"))
}
function NewBookButton_1 () {
    render([<NewBook />, <NewAbzac />],document.getElementById("form"))
}
function NewBookButton_2 () {
    window.dataNewBook = {
        "name": window.bookMass[0].name,
        "razdel":[

        ]
    }    
    for (var i = 1; i != window.bookMass.length - 1; i++){
        alert(i)
        window.dataNewBook.razdel.push({
            "name":window.bookMass[i].abzac,
            "text":window.bookMass[i].textAbzac
        })
    }
    var fs = require("fs");
    fs.appendFile('test.json', JSON.stringify(window.dataNewBook), function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    console.log(window.dataNewBook)
}

function addAbzac (){
    window.bookMass.push({
        "abzac": document.getElementById('newAbzac').value,
        "textAbzac": document.getElementById('textareaTextAbzac').value
    })
    document.getElementById('newAbzac').value = ""
    document.getElementById('textareaTextAbzac').value = ""
    console.log(window.bookMass)
}
function CancelAbzac () {
    render(<NewBook />,document.getElementById("form"))
    var thusBook = document.getElementById('textBook')
    thusBook.innerHTML = ""

    for(var i = 1; i != window.bookMass.length; i++){
        var abzac = document.createElement('div')
        abzac.className = "divAbzacName"

        var abzacName = document.createElement('span')
        abzac.innerText = window.bookMass[i].abzac
        abzac.className = "abzacBook"

        var textBook = document.createElement('span')
        textBook.innerText = window.bookMass[i].textAbzac
        textBook.className = "textAbzac"

        abzac.appendChild(abzacName)
        abzac.appendChild(textBook)
        thusBook.appendChild(abzac)
    }
    
}
export default NameNewBook