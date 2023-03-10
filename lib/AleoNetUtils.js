// const {
//     log,
//     logError
//   } = require('./Logger')
const fs = require('fs')
const axios = require('axios')
//   const CookieUtils = require('./CookieUtils')
//   const cheerio = require('cheerio')

const log = console.log
const logErr = log

class AleoNetUtils {

    static async getReward(address) {
        try {
            let data = (await axios({
                method: 'get',
                url: `https://client.damominer.hk/api/v1/miner/${address}/rewards`,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'cache-control': 'no-cache',
                    'dnt': '1',
                    'origin': 'https://www.damominer.hk',
                    'pragma': 'no-cache',
                    'referer': 'https://www.damominer.hk/',
                    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
            })).data

            if (data.code != 0) {
                throw new Error(data.msg)
            }

            return Promise.resolve(Number(data.result.total_reward))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async getStatistic(address) {
        try {
            let data = (await axios({
                method: 'get',
                url: `https://client.damominer.hk/api/v1/miner/${address}/statistic`,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'cache-control': 'no-cache',
                    'dnt': '1',
                    'origin': 'https://www.damominer.hk',
                    'pragma': 'no-cache',
                    'referer': 'https://www.damominer.hk/',
                    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
            })).data


            // {"msg":"","code":0,"result":{"hash":"39668.65","local_hash":"24338.55","online":"4","online_rate":"25"}}

            if (data.code != 0) {
                throw new Error(data.msg)
            }

            return Promise.resolve(data.result.online + ' | ' + data.result.local_hash)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async getAddress() {
        try {
            let data = (await axios({
                method: 'get',
                url: `https://iamzic.com/aleo-miners/address`,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'cache-control': 'no-cache',
                    'dnt': '1',
                    'origin': 'https://www.damominer.hk',
                    'pragma': 'no-cache',
                    'referer': 'https://www.damominer.hk/',
                    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
            })).data

            if (data.status != 1) {
                throw new Error(data.message)
            }

            return Promise.resolve(data.result._id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async getCurrentIp() {
        try {
            let data = (await axios({
                method: 'get',
                url: `https://api.ipify.org/?format=json`,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'cache-control': 'no-cache',
                    'dnt': '1',
                    'origin': 'https://www.damominer.hk',
                    'pragma': 'no-cache',
                    'referer': 'https://www.damominer.hk/',
                    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
            })).data

            if (!data.ip) {
                throw new Error(JSON.stringify(data))
            }

            return Promise.resolve(data.ip)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async updateIp(address, ip) {
        try {
            let data = (await axios({
                method: 'post',
                url: `https://iamzic.com/aleo-miners/address/ip/` + address,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                    'accept-language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'cache-control': 'no-cache',
                    'dnt': '1',
                    'origin': 'https://www.damominer.hk',
                    'pragma': 'no-cache',
                    'referer': 'https://www.damominer.hk/',
                    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
                data: JSON.stringify({
                    ip: ip
                }),
            })).data

            if (data.status != 1) {
                throw new Error(data.message)
            }

            return Promise.resolve(data.result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async resetModem() {
        try {
            let data = ''

            // data = (await axios({
            //     method: 'post',
            //     url: 'http://192.168.1.1/GponForm/reboot_XForm',
            //     headers: {
            //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            //         'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
            //         'Cache-Control': 'no-cache',
            //         'Connection': 'keep-alive',
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'DNT': '1',
            //         //   'Origin': 'http://192.168.1.1', 
            //         'Pragma': 'no-cache',
            //         'Referer': 'http://192.168.1.1/reboot.html',
            //         'Upgrade-Insecure-Requests': '1',
            //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            //     },
            //     data: qs.stringify({
            //         'XWebPageName': 'reboot'
            //     }),
            // })).data
            
            data = (await axios({
                method: 'post',
                url: 'http://192.168.1.1/GponForm/reboot_XForm',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8,und;q=0.7,ca;q=0.6',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'DNT': '1',
                    //   'Origin': 'http://192.168.1.1', 
                    'Pragma': 'no-cache',
                    'Referer': 'http://192.168.1.1/reboot.html',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                },
                data: 'XWebPageName=reboot',
            })).data

            //             <!DOCTYPE html PUBLIC "-//W3C//Dtd XHTML 1.0 Strict//EN" "http://www.w3.org/tr/xhtml1/Dtd/xhtml1-Transitional.dtd">
            // <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" lang="utf-8" dir="ltr">
            // <head>
            // <title>GPON Home Gateway</title>
            // <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            // <meta http-equiv="refresh" content="0; url=/reboot.html" />
            // </head>
            // <body>
            // </body>
            // </html>

            if (data.includes('url=/reboot.html"')) {
                return Promise.resolve(true)
            } else {
                fs.writeFileSync('./reset-modem.html', data, 'utf8')
                throw new Error('Cannot Reset Modem')
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

module.exports = AleoNetUtils