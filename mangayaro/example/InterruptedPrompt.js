import inquirer from 'inquirer';
import InterruptedPrompt from 'inquirer-interrupted-prompt';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

InterruptedPrompt.fromAll(inquirer);

const log = console.log.bind(console);

main();

async function main() {
    let answer = null
    while (answer !== 'exit') {
        console.clear();
        try {
            const menuResponse = await renderMainMenu()
            answer = menuResponse.mainMenu
            switch (answer) {
                case 'scraping':
                    
                    await inquirer.prompt([{
                        type: 'input',
                        name: 'searchFileName',
                        message: 'Input file name',
                        interruptedKeyName: 'ctrl+q'
                    }])

                


                    break
                case 'formatter':
                    await inquirer.prompt([{
                        type: 'input',
                        name: 'createFileName',
                        message: 'Input new file name',
                        interruptedKeyName: 'ctrl+q'

                    }])
                    break
                case 'replacer':
                    await inquirer.prompt([{
                        type: 'input',
                        name: 'editFileName',
                        message: 'Input edit file name',
                        interruptedKeyName: 'ctrl+q'
                    }])
                    break
            }

        } catch (e) {

        }
    }
}


function renderMainMenu() {
    console.log('=== SCT ===');

    return inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Choose menu',
            choices: [{
                value: 'scraping',
                name: 'Scraping Komik',
                short: 'Scraping - Press <Ctrl + Q> to back to main menu!'
            },
                {
                    value: 'formatter',
                    name: 'Formatter file',
                    short: 'Formatter - Press <Ctrl + Q> to back to main menu!'
                },
                {
                    value: 'replacer',
                    name: 'Replacer file',
                    short: 'Replacer - Press <Ctrl + Q> to back to main menu!'
                },
                {
                    value: 'exit',
                    name: 'Exit',
                }
            ]
        }
    ])
}
