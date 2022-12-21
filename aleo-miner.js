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
        let scriptFile = path.join(__dirname, './aleo-miner-child.js')
        let args = [scriptFile]
        if (process.argv[2]) {
            scriptFile = path.join(__dirname, './aleo-miner-child.js')
            args = [scriptFile, process.argv[2], '--unhandled-rejections=none', '--tls-min-v1.0']
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
                fs.appendFileSync('./data/z_logs.txt', `\n${data.trim()}`, 'utf8', () => {})
        })

        child.stderr.setEncoding('utf8')
        child.stderr.on('data', async function (data) {
            log('stderr: ' + data.trim())
            if (!isOnApp)
                fs.appendFileSync('./data/z_logs.txt', `\n${data.trim()}`, 'utf8', () => {})
        })

        child.on('close', async function (code) {
            log(`Tool Exit ${code}`)
            // fs.appendFileSync('./data/z_logs.txt', `\nchild process exited with code ${code}`, 'utf8', () => {})

            child.stdin.pause()
            child.kill()

            if (code != 100) {
                main()
            } else {
                log('Retry after 1 hour')
                setTimeout(() => {
                    main()
                }, 60 * 60 * 1000)
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