const inquirer = require('inquirer');
const fs = require('fs');

let tasks = JSON.parse(fs.readFileSync('./tasks.json', 'utf-8'));
console.log(tasks);

function run () {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "what do you want to do?",
            choices: ['show tasks', 'add task', 'remove task', 'mark as completed']
        },
        {
            name: "new",
            type: "input",
            message: "what is your new task?",
            when: (answers) => {return answers.action === 'add task'}
        },
        {
            name: "dedicated",
            type: "list",
            message: "which task?",
            when: (answers) => {return answers.action === 'remove task' || answers.action === 'mark as completed'},
            choices: function () {
                let i, ids =[];
                for (i=0; i < tasks.length; i++) {
                    ids.push(i);
                }
                return ids;
            }
        }
    ]).then(answers => {
        switch (answers.action) {
            case "show tasks":
                console.table(tasks);
                run();
                break;
            case "add task":
                tasks.push({
                    title: answers.new,
                    done: false
                });
                fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
                run();
                break;
            case "remove task":
                tasks.splice(answers.dedicated, 1);
                fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
                run();
                break;
            case "mark as completed":
                tasks[answers.dedicated].done = true;
                fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
                run();
                break;
        }
    });
}

run();
