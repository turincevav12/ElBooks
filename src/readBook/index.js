import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css";


class FormOpenBook extends Component {
    render() {
        
        return(
            <div className="formNameOpenBook">
                <div id="top-line-open-book-name">
                    <span id="fsdjlkjflksd">Откройте файл</span> 
                </div>
                <input id="newNameBook" type="file" accept=".json" placeholder="Наименование" ></input>

                <div id="buttons">
                    <div onClick={open} className="buttons-creat-new-book">Открыть</div>
                    <div onClick={cancel} className="buttons-creat-new-book">Отмена</div>
                </div>
            </div>
        )
    }    
}

class ShowBook extends Component {
    render() {
        setTimeout(function() {
            dataZapoln()
        }, 1000);
        
        return(
            <div className="showBook">
                <div id="nameShowBook">
                    
                </div>
                <div id="formtextshowbook">
                </div>
            </div>
        )
        
    }
}

function dataZapoln () {
    window.book = import ("./book/"+window.nameBook)
    .then(response => {
        var span = document.createElement('span')
        span.innerText = (response.name)
        span.id = "nameShowBook"
        span.className = "showBookspannamebook"
        document.getElementById('nameShowBook').appendChild(span)
    })
    window.book = import ("./book/"+window.nameBook)
    .then(response => {
        console.log(response)
        for (var i = 0; i != response.razdel.length; i++){
            var spanA = document.createElement('span')
            var spanT = document.createElement('span')
            spanA.innerText = (response.razdel[i].name)
            spanT.innerText = (response.razdel[i].text)
            spanA.className = "showBookspanAbzac"
            spanT.className = "showBookspanText"
            spanA.id="abzac"+i
            spanT.id="text"+i
            document.getElementById('formtextshowbook').appendChild(spanA)
            document.getElementById('formtextshowbook').appendChild(spanT)
        }
        
    })
}

function open () {
    window.nameBook = document.getElementById('newNameBook').files[0].name;
    render (<ShowBook />, document.getElementById('form'))

}
function cancel () {
    
}
function obzor () {
    
}

export default FormOpenBook