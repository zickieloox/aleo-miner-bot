const path = require('path')
const fs = require('fs')
const {
    exec,
    spawn
} = require('child_process')

const log = console.log
const logError = log

class ShellUtils {
    static async rebootModem() {
        return new Promise((resolve, reject) => {
            try {
                let isLoggedIn = false
                let child = spawn('ssh', ['root@192.168.1.1', '-T', '-o', 'ConnectTimeout=1'], {
                    cwd: path.resolve('./')
                })

                child.stdout.setEncoding('utf8')
                child.stdout.on('data', async function (data) {
                    log('stdout: ' + data)
                    // log(data.trim()) // data.toString()
                    if (data.includes(`'s password:`)) {
                        log('SSH password')
                        child.stdin.write('VBMkaeqwzvpi7HV\n')
                    } else if (!isLoggedIn && data.includes('#ONT>')) {
                        log('Shell')
                        isLoggedIn = true
                        child.stdin.write('system/shell\n')
                    } else if (isLoggedIn && data.includes('#ONT/system/shell>')) {
                        log('Reboot')
                        child.stdin.write('/sbin/reboot\n')

                        resolve(true)
                    }
                })

                child.stderr.setEncoding('utf8')
                child.stderr.on('data', async function (data) {
                    log('stderr: ' + data)

                    if (data.includes('Operation timed out') && data.includes('connect to host')) {
                        log('SSH Timeout')
                        resolve(false)
                    } else if (data.includes('Permission denied, please try again.')) {
                        log('Wrong SSH Password')

                        child.stdin.pause()
                        child.kill()

                        reject(new Error('Wrong SSH Password'))
                    }

                    // resolve(false)
                })

                child.on('close', async function (code) {
                    log(`Shell Exit ${code}`)
                    // fs.appendFileSync('./z_logs.txt', `\nchild process exited with code ${code}`, 'utf8', () => {})

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