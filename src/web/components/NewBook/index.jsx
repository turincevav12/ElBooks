import React,{ Component } from "react";
import { render } from "react-dom";
import styles from "./index.css"


var fs = require("fs");


class NameNewBook extends Component {
    render() {
        return(
            <div className= {styles.formNameNewBook}>
                <div id={styles.toplinecreatbookname}>
                    <span>Наименование</span> 
                </div>
                <input id={styles.newNameBook} placeholder='Наименование'></input>

                <div id={styles.buttons}>
                    <div onClick={Creat} className={styles.buttonscreatnewbook}>Создать</div>
                    <div onClick={Cancel} className={styles.buttonscreatnewbook}>Отмена</div>
                </div>
            </div>
        )
    }    
}

class NewBook extends Component {
    
    render(){

        return(
            <div className={styles.NewBook}>
                <div id={styles.book}>
                    <div id={styles.nameBook}>
                        <span>{window.bookMass.name}</span>
                    </div>
                    <div id={styles.textBook}>

                    </div>
                </div>
                <div id={styles.newBookButtons}>
                    <div className={styles.newBookButton} onClick={NewBookButton_1}>
                        <span>Добавить абзац</span>
                    </div>
                    <div className={styles.newBookButton} onClick={NewBookButton_2}>
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
            <div className={styles.formAbzacNewBook}>
                <div id={styles.toplinecreatbookname}>
                    <span>Добавление абзаца</span> 
                </div>
                <input id={styles.newAbzac} placeholder="Название абзаца..."></input>
                <textarea name="textOfBook" id={styles.textareaTextAbzac} wrap="virtual" placeholder="Текст..."></textarea> 
                
                <div id={styles.addImage} className={styles.styleAdd}>
                    <span>Добавить картинку: </span>
                    <input type="file" id="buttonAddImage"></input>
                </div>

                <div id={styles.addVideo} className={styles.styleAdd}>
                    <span>Добавить видео: </span>
                    <input type="file" id="buttonAddVideo"></input>
                </div>
                
                <div id={styles.addTest} className={styles.styleAdd}>
                    <span>Добавить тест: </span>
                    <div id={styles.buttonAddTest} onClick = {AddTest}>Добавить</div>
                </div>

                <div id="buttonsAbzac">
                    <div onClick={addAbzac} className={styles.buttonscreatnewbook}>Добавит</div>
                    <div onClick={CancelAbzac} className={styles.buttonscreatnewbook}>Закончить</div>
                </div>
            </div>
        )
    }
}

class AddTestForm extends Component{
    render(){
        return(
            <div id={styles.formAddTest}>
                <div id={styles.nameFormAddTest}>
                    <span>Добавление тестов</span>
                </div>

                <div id={styles.addNewTest}>
                    <div id={styles.testVopros}>
                        <span>Введите вопрос: </span>
                        <input id='vopros'></input>
                    </div>

                    <div id={styles.testOtvet}>
                        <span>Введите ответ 1: </span>
                        <input id='otvet1'></input>

                        <span>Введите ответ 2: </span>
                        <input id='otvet2'></input>

                        <span>Введите ответ 3: </span>
                        <input id='otvet3'></input>

                        <span>Введите ответ 4: </span>
                        <input id='otvet4'></input>

                        <span>Правильный ответ: </span>
                        <input id='otvetTrue'></input>
                    </div>
                </div>
 
                <div id={styles.addTestInBaza} onClick={addTestInBaza}>Добавить</div>
                <div id={styles.addTestInBaza} onClick={addTestCancel}>Закончить</div>
            </div>
        )
    }
}
function Creat () {
    window.bookMass = {
        "name": document.getElementById(styles.newNameBook).value,
        "textBook": [

        ]
    }
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
    fs.appendFile('./books/'+window.bookMass.name+'.json', JSON.stringify(window.bookMass, null, '\t'), function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    
    document.getElementById(styles.book).innerHTML = ""
}

function addAbzac (){
    var im = document.getElementById('buttonAddImage').files[0]
    var vi = document.getElementById('buttonAddVideo').files[0]
    
    if (!im){
        im = ""
    }
    if (!vi){
        vi = ""
    }

    window.bookMass.textBook.push({
        "abzac": document.getElementById(styles.newAbzac).value,
        "textAbzac": document.getElementById(styles.textareaTextAbzac).value,
        "image" : im.name,
        "video" : vi.name,
        "test" : window.test
    })
    
    document.getElementById(styles.newAbzac).value = ""
    document.getElementById(styles.textareaTextAbzac).value = ""
    console.log(document.getElementById(styles.nameImagesFile).files.name)
}
function CancelAbzac () {
    render(<NewBook />,document.getElementById("form"))
    var thusBook = document.getElementById(styles.textBook)
    thusBook.innerHTML = ""

    for(var i = 0; i != window.bookMass.length; i++){
        var abzac = document.createElement('div')
        abzac.className = styles.divAbzacName

        var abzacName = document.createElement('span')
        abzacName.innerText = window.bookMass.textBook[i].abzac
        abzacName.className = styles.abzacBook

        var textBook = document.createElement('span')
        textBook.innerText = window.bookMass.textBook[i].textAbzac
        textBook.className = styles.textAbzac

        abzac.appendChild(abzacName)
        abzac.appendChild(textBook)
        thusBook.appendChild(abzac)
    }
    
}
 

function AddTest () {

    render([<NewBook />, <NewAbzac /> , <AddTestForm />],document.getElementById("form"))
    window.test = []
}

function addTestInBaza () {
    var vopros = document.getElementById('vopros').value

    var otvet1 = document.getElementById('otvet1').value
    var otvet2 = document.getElementById('otvet2').value
    var otvet3 = document.getElementById('otvet3').value
    var otvet4 = document.getElementById('otvet4').value
    var otvetTrue = document.getElementById("otvetTrue").value

    window.test.push({
        "vopros": vopros,
        "otvet1": otvet1,
        "otvet2": otvet2,
        "otvet3": otvet3,
        "otvet4": otvet4,
        "otvetTrue": otvetTrue,
    })


    document.getElementById('vopros').value = ""
    document.getElementById('otvet1').value = ""
    document.getElementById('otvet2').value = ""
    document.getElementById('otvet3').value = ""
    document.getElementById('otvet4').value = ""
    document.getElementById("otvetTrue").value = ""

    console.log(window.test)
}

function addTestCancel () {
    render([<NewBook />, <NewAbzac />],document.getElementById("form"))
}
export default NameNewBook