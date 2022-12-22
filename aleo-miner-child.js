require('dotenv').config({
    path: './.env'
})
console.log(process.env.SERVER_IP, process.env.SERVER_ID, process.env.COMMAND_METHOD)
const {
    exec,
    spawn
} = require('child_process')
const axios = require('axios')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const AleoNetUtils = require('./lib/AleoNetUtils')
const ShellUtils = require('./lib/ShellUtils')
const CronJob = require('cron').CronJob

// https://api.telegram.org/bot853693738:AAFD6AA9-qGog1lA1YCOE_QeVnW99pXITHk/sendMessage?chat_id=-1001746527066&text=hello

const log = console.log
const logErr = log
var firstTimeCheck = true

var address = ''

var isRunning = false
var child = ''

new CronJob('0 * * * * *', async function () {
    try {
        // let result = await checkMinerStatus()

        if (address) {
            const newAddress = await AleoNetUtils.getAddress()

            if (newAddress != address) {
                log('***** RESTART Bot - New Adress', newAddress, address)

                await sendMessageToChannel('⛔️ ⛔️ RESTART Bot - New Adress: ' + newAddress)

                if (child) {
                    child.stdin.pause()
                    child.kill()
                }

                await ShellUtils.rebootModem2()

                // try {
                //     await AleoNetUtils.resetModem()
                // } catch (err) {
                //     logErr(err.message)
                // }

                process.exit(100) // !important
                return
            }
        }

        if (!isRunning) { // (!result)
            log('This is from cron job')

            await startMiner()
        }
    } catch (err) {
        log(err.message)
        sendMessageToChannel('🤬 🤬 ' + err.message)
        logErr(err)
    }
}, null, true)

new CronJob('0 */30 * * * *', async function () {
    try {
        firstTimeCheck = true
    } catch (err) {
        log(err.message)
        sendMessageToChannel('🤬 🤬 ' + err.message)
        logErr(err)
    }
}, null, true)

// main()

async function main() {
    try {
        // let result = await checkMinerStatus()

        if (!isRunning) {
            await startMiner()
        }

        // await startMiner()
    } catch (err) {
        log(err.message)
        sendMessageToChannel('🤬 🤬 ' + err.message)
        logErr(err)
    }
}


async function startMiner() {
    return new Promise(async (resolve, reject) => {
        try {
            let ALEO_COMMAND = process.env.ALEO_COMMAND

            address = await AleoNetUtils.getAddress()
            log('***** ALEO ADDRESS', address)

            if (ALEO_COMMAND.includes('[address]')) {
                ALEO_COMMAND = ALEO_COMMAND.split('[address]').join(address)
            } else {
                logErr('Invalid .env Command')
            }

            // ./damominer --address aleo15qkttw3r25jh3hqkahfm769sxxrcq0d9tn4fnxwmff4hcxr055xqfhv7qz --proxy asiahk.damominer.hk:9090 -g 0 -g 1 -g 2 -g 3

            // const options = `--address aleo15qkttw3r25jh3hqkahfm769sxxrcq0d9tn4fnxwmff4hcxr055xqfhv7qz --proxy asiahk.damominer.hk:9090 -g 0 -g 1 -g 2 -g 3`

            // const param1 = ALEO_COMMAND == 'yarn start' ? 'yarn' : ALEO_COMMAND
            // const param2 = ALEO_COMMAND == 'yarn start' ? ['start', 'start'] : ['start']
            child = spawn(ALEO_COMMAND.split(' ')[0], ALEO_COMMAND.split(' ').slice(1), {
                cwd: path.resolve(__dirname, './')
            })

            // address = ALEO_COMMAND.split('--address ')[1].split(' ')[0]

            let scriptOutput = ''

            child.stdout.setEncoding('utf8')
            child.stdout.on('data', async function (data) {
                data = data.toString()
                // data = Buffer.from(data, 'utf-8').toString()

                log('stdout: ' + data)

                fs.appendFileSync('./aleo-logs.txt', data, 'utf-8')
                if (data.includes('Found a solution')) {
                    try {
                        // child.stdin.pause()
                        // child.kill()

                        if (firstTimeCheck) {
                            const currentIp = await AleoNetUtils.getCurrentIp()
                            log('***** CURRENT IP', currentIp)
                            await AleoNetUtils.updateIp(address, currentIp)

                            firstTimeCheck = false
                        }

                        isRunning = true
                        pingMiner(1)

                        // sendMessageToChannel('INFO Found a solution')
                        // resolve(true)
                    } catch (err) {
                        logErr(err.message)
                        // reject(err)
                    }
                } else if (data.includes('Start working')) {
                    try {
                        // child.stdin.pause()
                        // child.kill()

                        isRunning = true
                        log('***** STARTED', isRunning)
                        pingMiner(1)

                        sendMessageToChannel('✅ ✅ INFO Start working')
                        // resolve(true)
                    } catch (err) {
                        // reject(err)
                    }
                } else if (data.includes('Summary')) {
                    try {
                        // child.stdin.pause()
                        // child.kill()

                        isRunning = true

                        let summary = data.split('ToTal:')[1].split('|')[0].trim()
                        pingMiner(1, summary, summary)

                        sendMessageToChannel('✅ ✅ ' + 'ToTal Hashrate: ' + summary)
                        // resolve(true)
                    } catch (err) {
                        // reject(err)
                    }
                } else if (data.includes('Not connected to the Iron Fish network')) {
                    try {
                        sendMessageToChannel('⛔️ ⛔️ Not connected to the Iron Fish network')

                        isRunning = false

                        // resolve(false)
                        // reject(new Error(data))
                        child.stdin.pause()
                        // child.kill()
                    } catch (err) {
                        // reject(err)
                    }
                }

                scriptOutput += data
            })

            // ERROR Wrong GPU index, GPU index starts from 0. Example: 0 for the first GPU, 1 for the second

            child.stderr.setEncoding('utf8')
            child.stderr.on('data', async function (data) {
                log('stderr: ' + data.toString())

                data = data.toString()
                if (data.includes('Some Error Occured')) {
                    try {
                        // reject(new Error(data))
                        sendMessageToChannel('🤬 🤬 Some Error Occured')

                        // isRunning = false

                        // resolve(false)
                        child.stdin.pause()
                        child.kill()
                    } catch (err) {
                        // reject(err)
                    }
                }

                scriptOutput += data
            })

            child.on('close', async function (code) {
                // scriptOutput += `child process exited with code ${code}`
                scriptOutput = scriptOutput.split('\n').slice(-14).join('\n') + `\nchild process exited with code ${code}`
                log(`child process exited with code ${code}`)
                // reject(new Error(scriptOutput))
                sendMessageToChannel('🤬 🤬 ' + scriptOutput)

                isRunning = false

                resolve(false)
                child.stdin.pause()
                child.kill()

                // resolve(startMiner())

                // await execCommand('pkill certbot')
                // if (scriptOutput.includes('error occurred:')) {
                //     reject(new Error(scriptOutput))
                // } else {
                //     resolve(true)
                // }
            })
        } catch (err) {
            logErr(err.message)
            sendMessageToChannel('🤬 🤬 ' + err.message)
            logErr(err)
        }
    })
}

async function pingMiner(minerStatus, lastestSummary = '', machineHashrate = null) {
    setImmediate(async () => {
        try {
            let data = (await axios.post('https://iamzic.com/aleo-miners/pingMiner', {
                minerName: `${process.env.SERVER_ID} - ${process.env.SERVER_IP}`,
                address,
                minerStatus: minerStatus,
                lastestSummary,
                machineHashrate,
                updatedAt: Date.now() / 1000 | 0
            }, {
                timeout: 5 * 60000,
                headers: {
                    'Content-Type': 'application/json'
                }
            })).data

            log('pingMiner', data)
        } catch (err) {
            logErr(err.message)
            logErr(err)
        }
    })
}

async function sendMessageToChannel(message, chatId = '1001746527066') {
    try {
        fs.appendFileSync('./zic-logs.txt', `${moment().utcOffset('+0700').format('DD/MM/YYYY HH:mm:ss')} | ${message}` + '\n')

        let text = `${moment().utcOffset('+0700').format('DD/MM/YYYY HH:mm:ss')} | ${process.env.SERVER_ID} - ${process.env.SERVER_IP} | ${message}`
        let response = await axios.get(`https://api.telegram.org/bot853693738:AAFD6AA9-qGog1lA1YCOE_QeVnW99pXITHk/sendMessage?chat_id=-${chatId}&text=${encodeURIComponent(text)}`)

        // log(response.data)
        log('Tele Response')

        return Promise.resolve(true)
    } catch (err) {
        logErr('Tele Error', err.message)

        return Promise.resolve(false)
        // return Promise.reject(err)
    }
}