var isOnApp = false
if (__dirname.includes('snapshot'))
    isOnApp = true

// const {
//     log,
//     logError
// } = require('./lib/Logger')
const log = console.log
const logError = log

const req = require
const path = req('path')
const fs = req('fs')
const {
    exec,
    spawn
} = req('child_process')

// var newProcess = true

// Keep app running forever
const itv = setInterval(() => {

}, 100)

main()

function main() {
    try {
        let scriptFile = path.join(__dirname, './hiveos-aleo-miner-child.js')
        let args = [scriptFile]

        let argv = process.argv.slice(2)
        if (argv.length) {
            // --SERVER_ID PC01 --SERVER_IP PC01 -g 0 -g 1 -g 2

            const temp = argv.map((v) => {
                return v.split(' ')
            })

            argv = []
            for (const x of temp) {
                argv = [...argv, ...x]
            }

            // console.log(argv.join(' '))
            scriptFile = path.join(__dirname, './hiveos-aleo-miner-child.js')
            args = [scriptFile, ...argv]
        }

        // args = ['n', '|', 'node', ...args]
        // log(args)

        const child = spawn('node', args, {
            cwd: path.resolve('./')
        })

        // newProcess = false

        child.stdout.setEncoding('utf8')
        child.stdout.on('data', async function (data) {
            log(data)
            // log(data.trim()) // data.toString()
            // if (data.trim().includes(' Update? [y/n]')) {
            //     child.stdin.write('n\n')
            // }
            if (!isOnApp)
                fs.appendFileSync('./z_logs.txt', `\n${data.trim()}`, 'utf8', () => {})
        })

        child.stderr.setEncoding('utf8')
        child.stderr.on('data', async function (data) {
            log('stderr: ' + data.trim())
            if (!isOnApp)
                fs.appendFileSync('./z_logs.txt', `\n${data.trim()}`, 'utf8', () => {})
        })

        child.on('close', async function (code) {
            log(`Tool Exit ${code}`)
            // fs.appendFileSync('./z_logs.txt', `\nchild process exited with code ${code}`, 'utf8', () => {})

            child.stdin.pause()
            child.kill()

            if (code == 100) {
                log('Retry after 4 mins') // !important reset modem
                setTimeout(() => {
                    main()
                }, 4 * 60 * 1000)
            } else {
                main()
            }

            // process.exit()

            // if (!newProcess)
            //     process.exit()
            // else {
            //     main()
            // }
        })
    } catch (err) {
        logError(err.message)
    }
}