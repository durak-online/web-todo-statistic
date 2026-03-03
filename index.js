const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map((path) => ({path, content: readFile(path)}));
}

function getAllTodos(files) {
    const todos = [];

    for (const file of files) {
        const lines = file.content.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.includes('// TODO ')) {
                todos.push({
                    file: file.path,
                    line: i + 1,
                    text: line.slice(line.indexOf('// TODO ') + 8).trim(),
                });
            }
        }
    }

    return todos;
}

function processCommand(command) {
    const input = command.split(' ');
    if (input.length > 1) {
        const [cmd, ...args] = input;
        switch (cmd) {
            case "user":
                showUser(args);
                break;

            default:
                console.log('wrong command');
                break;
        }
    } else {
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'show': {
                const todos = getAllTodos(files);

                if (todos.length === 0) {
                    console.log('No TODO found');
                    break;
                }

                for (const t of todos) {
                    console.log(`${t.file}:${t.line} — ${t.text}`);
                }
                break;
            }

            case "important":
                showImportant();
                break;

            default:
                console.log('wrong command');
                break;
        }
    }
}

// TODO you can do it!
function findTODOInFile(file) {
    const lines = file.split('/n');
    const result = [];


    for (const line of lines) {
        if (line.include("// TODO")) {
            result.push(line.trim());
        }
    }
    // lines.forEach((line, index) => {
    //     if (line.include("// TODO")) {
    //         result.push(line.trim());
    //     }
    // });
    return result;
}

function showImportant() {
    for (const file of files) {
        const lines = file.split("\n");
        for (const line of lines) {
            if (line.includes("// TODO")
                && line.includes("!")) {
                console.log(line);
            }
        }
    }
}

function showUser(...args) {
    const userName = args[0].join(" ");
    for (const todo of getAllTodos(files)) {
        const [name, date, text] = todo.text
            .split(";")
            .map(s => s.trim());

        if (name === userName) {
            console.log(todo.text);
        }
    }
}