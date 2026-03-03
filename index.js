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
        const lines = file.content.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.includes('// TODO ')) {
                const text = line.slice(line.indexOf('// TODO ') + 8).trim();
                const meta = parseTodoText(text);

                todos.push({
                    file: file.path,
                    line: i + 1,
                    text,
                    ...meta,
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

            case 'sort':
                const arg = args[0];
                const todos = getAllTodos(getFiles());

                if (arg === 'importance') {
                    printTodos(sortByImportance(todos));
                } else if (arg === 'user') {
                    printTodos(sortByUser(todos));
                } else if (arg === 'date') {
                    printTodos(sortByDate(todos));
                } else {
                    console.log('wrong command');
                }
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
                const todos = getAllTodos(getFiles());

                if (todos.length === 0) {
                    console.log('No TODO found');
                    break;
                }

                for (const t of todos) {
                    console.log(t.text);
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

function sortByImportance(todos) {
    return [...todos].sort((a, b) => {
        if (b.importance !== a.importance)
            return b.importance - a.importance;
        return a.text.localeCompare(b.text);
    });
}

function sortByUser(todos) {
    return [...todos].sort((a, b) => {
        const au = a.user;
        const bu = b.user;

        if (au && bu) {
            const cmp = au.localeCompare(bu);
            if (cmp !== 0) return cmp;
            return a.text.localeCompare(b.text);
        }
        if (au && !bu) return -1;
        if (!au && bu) return 1;
        return a.text.localeCompare(b.text);
    });
}

function sortByDate(todos) {
    return [...todos].sort((a, b) => {
        const ad = a.date;
        const bd = b.date;

        if (ad && bd) {
            if (bd !== ad) return bd.localeCompare(ad);
            return a.text.localeCompare(b.text);
        }
        if (ad && !bd) return -1;
        if (!ad && bd) return 1;
        return a.text.localeCompare(b.text);
    });
}

function printTodos(todos) {
    if (!todos.length) {
        console.log('No TODO found');
        return;
    }
    for (const t of todos) {
        console.log(`${t.file}:${t.line} — ${t.text}`);
    }
}

function parseTodoText(text) {
    let importance = 0;
    for (const ch of text) {
        if (ch === '!') importance++;
    }

    let user = null;
    const words = text.split(' ');
    for (const w of words) {
        if (w.startsWith('@') && w.length > 1) {
            user = w.slice(1);
            break;
        }
    }

    let date = null;
    for (const w of words) {
        if (
            w.length === 10 &&
            w[4] === '-' &&
            w[7] === '-'
        ) {
            const y = w.slice(0, 4);
            const m = w.slice(5, 7);
            const d = w.slice(8, 10);

            if (!isNaN(Number(y)) && !isNaN(Number(m)) && !isNaN(Number(d))) {
                date = w;
                break;
            }
        }
    }

    return {importance, user, date};
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
    const userName = args[0].join(" ").toLowerCase();
    for (const todo of getAllTodos(files)) {
        const [name, date, text] = todo.text
            .split(";")
            .map(s => s.trim());

        if (name.toLowerCase() === userName) {
            console.log(todo.text);
        }
    }
}