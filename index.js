const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map((path) => ({ path, content: readFile(path) }));
}

function getAllTodos(files) {
  const todos = [];

  for (const file of files) {
    const lines = file.content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('// TODO ')) {
        todos.push({
          file: file.path,
          line: i + 1,
          text: line.slice('// TODO '.length),
        });
      }
    }
  }

  return todos;
}

function processCommand(command) {
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

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function findTODOInFile(file) {
    const lines = file.split('/n');
    const result = [];


    for (const line of lines) {
        if (line.include("// TODO")) {
            result.push(line.trim())
        }
    }
    // lines.forEach((line, index) => {
    //     if (line.include("// TODO")) {
    //         result.push(line.trim())
    //     }
    // });
    return result;
}
