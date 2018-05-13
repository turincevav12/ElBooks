const { promisify } = require('bluebird');
const fs = require('fs');
const { get, set } = require('lodash');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export class Storage {

    constructor(path, isJson) {
        this.path = path;
        this.contents = {};
        this.isJson = isJson;
    }

    load () {
        return readFileAsync(this.path)
            .then(contents => {
                if (isJson) this.contents = JSON.parse(contents);
                else this.contents = contents;
            });
    }

    save () {
        return writeFileAsync(this.path, this.isJson ? JSON.stringify(this.contents) : this.contents);
    }

    get (path = '.') {
        if (path === '.') return this.contents;
        return get(this.contents, path);
    }

    set (path = '.', value) {
        if (path === '.') return this.contents = value;
        return set(this.contents, path, value);
    }
}