import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css"

class NameNewBook extends Component {
    render() {
        return(
            <div className="formNameNewBook">
                <span>Наименование: </span>
                <input id="newNameBook" placeholder="Наименование"></input>

                <div id="buttons">
                    <div onClick={Creat}>Создать</div>
                    <div onClick={Cancel}>Отмена</div>
                </div>
            </div>
        )
    }    
}

function Creat () {
    alert('1')
}

function Cancel () {
    alert('2')
}
export default NameNewBook