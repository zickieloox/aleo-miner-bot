const path = require('path')
const fs = require('fs')
const {
    exec,
    spawn
} = require('child_process')

var SSH = require('simple-ssh')

const log = console.log
const logError = log

class ShellUtils {
    static async rebootModem() {
        return new Promise((resolve, reject) => {
            try {
                let ssh = new SSH({
                    host: '192.168.1.1',
                    user: 'root',
                    pass: 'VBMkaeqwzvpi7HV'
                })

                log('SSH')

                ssh
                    .exec('system/shell', {
                        out: async function(data) {
                            log('Modem Shell', data)
                        }
                    })
                    .exec('/sbin/reboot', {
                        out: async function(data) {
                            log('Modem Reboot', data)
                            resolve(true)
                        }
                    })
                    .start()
            } catch (err) {
                reject(err)
            }
        })
    }

    static async rebootModem2() {
        return new Promise((resolve, reject) => {
            try {
                let isLoggedIn = false
                // let child = spawn('ssh', ['root@192.168.1.1', '-T', '-o', 'ConnectTimeout=1'], {
                //     cwd: path.resolve('./')
                // })

                let child = spawn('expect', ['reboot-modem.exp'], {
                    cwd: path.resolve('./')
                })

                child.stdout.setEncoding('utf8')
                child.stdout.on('data', async function (data) {
                    log('stdout: ' + data)
                    // log(data.trim()) // data.toString()

                    if (data.includes('Operation timed out') && data.includes('connect to host')) {
                        log('SSH Timeout')
                        resolve(false)
                    } else if (data.includes('No route to host') && data.includes('connect to host')) {
                        log('SSH Wrong IP')
                        resolve(false)
                    } else if (data.includes('Permission denied, please try again.')) {
                        child.stdin.pause()
                        child.kill()

                        reject(new Error('Wrong SSH Password'))
                    }

                    // Not working
                    // if (data.includes(`'s password:`)) {
                    //     log('SSH password')
                    //     child.stdin.write('VBMkaeqwzvpi7HV')
                    // } else if (!isLoggedIn && data.includes('#ONT>')) {
                    //     log('Modem Shell')
                    //     isLoggedIn = true
                    //     child.stdin.write('system/shell\n')
                    // } else if (isLoggedIn && data.includes('#ONT/system/shell>')) {
                    //     log('Modem Reboot')
                    //     child.stdin.write('/sbin/reboot\n')

                    //     resolve(true)
                    // }
                })

                child.stderr.setEncoding('utf8')
                child.stderr.on('data', async function (data) {
                    log('stderr: ' + data)

                    if (data.includes('Operation timed out') && data.includes('connect to host')) {
                        log('SSH Timeout')
                        resolve(false)
                    } else if (data.includes('No route to host') && data.includes('connect to host')) {
                        log('SSH Wrong IP')
                        resolve(false)
                    } else if (data.includes('Permission denied, please try again.')) {
                        child.stdin.pause()
                        child.kill()

                        reject(new Error('Wrong SSH Password'))
                    }

                    // resolve(false)
                })

                child.on('close', async function (code) {
                    log(`Shell Exit ${code}`)
                    // fs.appendFileSync('./z_logs.txt', `\nchild process exited with code ${code}`, 'utf8', () => {})

                    resolve(true)
                    
                    child.stdin.pause()
                    child.kill()
                })
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = ShellUtils