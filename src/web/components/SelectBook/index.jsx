import React, { Component } from 'react';
import Modal from 'react-modal';
import { ipcRenderer } from 'electron';
import { readFileSync, writeFile } from 'fs';
import { render } from "react-dom"
import styles from "./index.css"

import { Header } from "../../components/Header"


class SelectBook extends Component{
    state = {
        bookNames: [],
        books: {},
        selectedBook: null
    };

    componentDidMount () {
        ipcRenderer.on('book-list', (e, files) => this.setState({ bookNames: files.map(e => e.replace(/\.json/, '')) }));
        ipcRenderer.send('front-ready');
    }
    
    render(){ 
        console.log(this.state.bookNames)
        
        var thisBook = ""

        return(
            <div className={styles.formShowNameBook}>
                <span className={styles.bookTitle}>Выберите учебник: </span>

                <div className={styles.section}>
                    { this.state.bookNames.map(e => <div className={styles.nameBook} onClick={function (){window.thisBook = e; OpenBook()}}>{e}</div>) }
                </div>
            </div>
            
        )
    }
}

class ShowBook extends Component {
    render() {
        setTimeout(function() {
            dataZapoln()
        }, 1);
        
        return(
            <div className={styles.showBook}>
                <div id={styles.nameShowBook}>
                    
                </div>
                <div id={styles.formtextshowbook}>
                </div>
            </div>
        )
        
    }
}

function OpenBook ( ) {
    ipcRenderer.send('thisBook', (window.thisBook)); 
    
    ipcRenderer.on('books', (event, arg) => {});
    ipcRenderer.send("books");
    window.books = (JSON.parse(readFileSync('./books/'+window.thisBook+".json")));
    console.log(books)

    render([<ShowBook />], document.getElementById('form'))
    
}

function dataZapoln () {
    var span = document.createElement('span')
    span.innerText = (window.books.name)
    span.id = styles.nameShowBooks
    span.className = styles.showBookspannamebook
    document.getElementById(styles.nameShowBook).appendChild(span)

    var menu = document.createElement('div')
    menu.id = styles.menuBook
    for (var j = 0; j != (window.books.textBook.length)-1; j++) {
        var divSel = document.createElement('div')
        divSel.className = styles.idSelect
        divSel.id = j
        divSel.innerHTML = window.books.textBook[j].abzac

        divSel.onclick = function(e){
            window.i = e.target.id
            selDivSpanId()
        }
        menu.appendChild(divSel)
    }
    document.getElementById(styles.formtextshowbook).appendChild(menu)

    for (var i = 0; i != window.books.textBook.length; i++){
        var spanA = document.createElement('span')
        var spanT = document.createElement('span')

        var image = document.createElement('img')
        image.src = "../images/"+window.books.textBook[i].image

        
        var video = document.createElement('video')
        video.src = "../video/"+window.books.textBook[i].video


        spanA.innerText = (window.books.textBook[i].abzac)
        spanT.innerText = (window.books.textBook[i].textAbzac)

        spanA.id = 'id'+i        

        spanA.className = styles.showBookspanAbzac
        spanT.className = styles.showBookspanText

        document.getElementById(styles.formtextshowbook).appendChild(spanA)
        document.getElementById(styles.formtextshowbook).appendChild(spanT)
        document.getElementById(styles.formtextshowbook).appendChild(image)
        document.getElementById(styles.formtextshowbook).appendChild(video)
    }
        
}

function selDivSpanId () {

    location.hash = "id"+window.i
}

export default SelectBook