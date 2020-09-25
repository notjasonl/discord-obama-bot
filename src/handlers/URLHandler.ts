import Handler from "./Handler";
import Discord from "discord.js";
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import winston from "winston";
import url from 'url';

export default class URLHandler implements Handler {
    async handleMessage(msg: Discord.Message, client?: Discord.Client): Promise<void> {
        const content = msg.content.toLowerCase()
        const author = msg.author.id
        let tokUrl;
        try {
            tokUrl = new url.URL(msg.content)
            if (tokUrl.host.includes("tiktok")) {
                fetch(msg.content, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Upgrade-Insecure-Requests": "1",
                        "Connection": "keep-alive",
                        "Cache-Control": "max-age=0"
                    }
                })
                .then(res => res.text())
                .then(html => {
                    const cheerioPage = cheerio.load(html);
                    const htmlCheerio = cheerioPage('#__NEXT_DATA__').html()!
                    const jsonData = JSON.parse(htmlCheerio)
                    const videoUrl = jsonData.props.pageProps.videoData.itemInfos.video.urls[0]
                    const referer = jsonData.props.initialProps["$host"] + jsonData.props.initialProps["$pageUrl"]
                    winston.info(referer)
                    const videoObj = new url.URL(videoUrl)
                    const videoHost = videoObj.host
                    fetch(videoUrl, {
                        headers: {
                            "User-Agent": "PostmanRuntime/7.26.5",
                            "Host": videoHost,
                            "Referer": referer
                        }
                    })
                        .then(res => res.buffer())
                        .then(video => {
                            const attachment = new Discord.MessageAttachment(video, 'tok.mp4')
                            msg.channel.send(attachment)
                        })
                })
                .catch(err => {
                    winston.error(err)
                })
            }
        } catch(err) {
            if (err.code != "ERR_INVALID_URL") {
                winston.error(err)
            }
            
            // msg.channel.send("fuck you")
        }
    }

    async getVideo(url: string, referUrl: string, host: string): Promise<void> {
        fetch(url, {
            headers: {
                "User-Agent": "PostmanRuntime/7.26.5",
                "Host": host,
                "Referer": referUrl
            }
        })
            .then(res => res.buffer())
            .then(video => {
                return video
            })
    }
}
